/*******************************************************************************
 * Licensed Materials - Property of IBM (c) Copyright IBM Corporation 2014. All
 * Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights: Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 ******************************************************************************/

/*
 * This script is not an AMD module, but is the main driver for this page.
 * However it has dependencies, so we use the require() function to load those,
 * then initialize the page.
 */

require(
		[ "i18n!nls/messages", "jstree" ],
		function(messages, jstree) {

			_.templateSettings = {
				interpolate : /<@=([\s\S]+?)@>/g,
				evaluate : /<@([\s\S]+?)@>/g,
				escape : /<@-([\s\S]+?)@>/g
			};
			
			var isLayoutDirty = false;

			var baseUrl = window.location.protocol + '//'
					+ window.location.host + $(document).data("context_path");
			var $genTemplatePage = $("#generate-template-page");
			var $loadingText = $(".docUI .loading-text");
			
			var defaultXmlUrl = $(document).data("default_xml_url");
			
			var dataSelectionPageLimit = 10;
			var previewPageLimit = 10;
			
			var jsonToXmlLoadingStatus = null;

			function getPredefinedTemplates(json) {
				if (!json) {
					json = [
							{
								"id" : "default",
								"name" : "Default"
							},
							{
								"id" : null,
								"name" : "Saved Layouts",
								"items" : [ {
									"id" : null,
									"description" : "",
									"name" : "Requisite Pro",
									"dataJson" : {
										"title" : "Sample Requirements",
										"xmlUrl" : "",
										"hasToc": true,
										"tocLabel": "Table of Contents",
										"sections" : [
												{
													"title" : "High Level Requirements",
													"titleQuery" : "",
													"dataAttributes" : [
															{
																"label" : "Req",
																"query" : "Project/Requirements/PRRequirement/FullTag"
															},
															{
																"label" : "Text",
																"query" : "Project/Requirements/PRRequirement/Text"
															},
															{
																"label" : "Priority",
																"query" : "Project/Requirements/PRRequirement/Priority"
															},
															{
																"label" : "Difficulty",
																"query" : "Project/Requirements/PRRequirement/Difficulty"
															},
															{
																"label" : "Stability",
																"query" : "Project/Requirements/PRRequirement/Stability"
															},
															{
																"label" : "Status",
																"query" : "Project/Requirements/PRRequirement/Status"
															} ],
															"format" : "table"
												},
												{
													"title" : "Project/Requirements/PRRequirement/FullTag",
													"titleQuery" : "Project/Requirements/PRRequirement/FullTag",
													"dataAttributes" : [
															{
																"label" : "GUID",
																"query" : "Project/Requirements/PRRequirement/GUID"
															},
															{
																"label" : "HREF",
																"query" : "Project/Requirements/PRRequirement/href"
															},
															{
																"label" : "Unique ID",
																"query" : "Project/Requirements/PRRequirement/UniqueID"
															},
															{
																"label" : "Bookmark",
																"query" : "Project/Requirements/PRRequirement/Bookmark"
															},
															{
																"label" : "Text",
																"query" : "Project/Requirements/PRRequirement/Text"
															} ],
													"format" : "paragraph"
												} ]
									}
								}
							  ]
							},
							{
								"id" : null,
								"name" : "Engineering Documents",
								"items" : [ {
									"id" : null,
									"description" : "For DNG",
									"name" : "Requirements Specification"
								}, {
									"id" : null,
									"description" : "A work items from RTC",
									"name" : "Work Items"
								}, {
									"id" : null,
									"description" : "Test planning from RQM",
									"name" : "Test Planning"
								} ]
							} ];
				}
				
				json[1].items[0].dataJson.xmlUrl = defaultXmlUrl;

				populatePredefinedTemplates(json);
				$genTemplatePage.find(".template-layout").off('click').click(handleOpenLayout);
			}
			
			function clearAllSections(){
				clearMainSection();
				$genTemplatePage.find(".section-container").remove();
				clearNavigationTree();
				$genTemplatePage.find(".input-toc-label").val('');
				addContainer();
				isLayoutDirty = false;
				$loadingText.trigger("hide");
			}
				
			function handleOpenLayout(e) {
				if(isLayoutDirty) {
					var clear = confirm("The current template layout changes would be lost. Do you want to continue?");
					if (!clear) {
						return;
					}
				}
				
				$loadingText.trigger("show", {
					text: 'opening layout...',
				});
				
				clearAllSections();
				
				var layoutJson = $(e.target).closest("li").attr('data-json');
				if(layoutJson && layoutJson != '') {
					var layoutJsonObj = jQuery.parseJSON(layoutJson);
					
					$genTemplatePage.find(".document-title").val(layoutJsonObj.title);
					$genTemplatePage.find(".input-url").val(layoutJsonObj.xmlUrl);
					
					jsonToXmlLoadingStatus = 'loading';
					if(layoutJsonObj.xmlUrl && layoutJsonObj.xmlUrl != '') {
						$genTemplatePage.find(".input-xml-go").click();
					} else {
						jsonToXmlLoadingStatus = 'loaded';
					}
					
					var tryLoadSection = 100; // milliseconds

					function loadSections() {
						if(jsonToXmlLoadingStatus == 'loaded') {
							$.each(layoutJsonObj.sections , function(index, value) {
								if(index == 0) {
									if($genTemplatePage.find(".section-container").length == 0) {
										addContainer(false);
									}
								} else {
									addContainer(true);
								}
								$container = $genTemplatePage.find(".section-container").eq(($genTemplatePage.find(".section-container")).length - 1);
								$container.attr('selected-metadata', JSON.stringify(value));
								populatePreviewSection(value.format, value, $container);
								
								$loadingText.trigger("show", {
									text: 'opened layout'
								});
							});
						} else if(jsonToXmlLoadingStatus == 'loading') {
							setTimeout(loadSections, tryLoadSection);
							/*$loadingText.trigger("show", {
								text: 'opening layout...',
							});*/
						}
					}
					
					setTimeout(loadSections, tryLoadSection);
					
					/*$(".data-selection-tree").on('_loaded.jstree',function (event, data) {
						alert("tree populated");
					});*/
//					$(".navigation-tree").bind("loaded.jstree", function (event, data) {
//						alert("tree populated");
//					});
					isLayoutDirty = false;
				} else {
					addContainer();
				}
				if(layoutJsonObj.hasToc) {
					$genTemplatePage.find('#preview-main-content').prepend(_.template($("#table-of-contents-template").html()));
					$genTemplatePage.find(".input-toc-label").val(layoutJsonObj.tocLabel);
				}
				$genTemplatePage.find(".delete-toc").off('click').click(deleteTableOfContents);
			}	

			function populatePredefinedTemplates(json) {
				$genTemplatePage.find("#docUINav .nav-parent").empty();
				if (json.length > 0) {
					var treeItemTemplate = _.template($(
							"#nav-tree-item-template").html());
					var navDividerTemplate = _.template($(
							"#nav-divider-template").html());
					var navTreeCategoryTemplate = _.template($(
							"#nav-tree-category-template").html());

					$genTemplatePage.find("#docUINav .nav-parent").append(
							navDividerTemplate());

					$.each(json, function(index, value) {
						var category = null;
						if(!value.dataJson) {
							value.dataJson = '';
						}else{
							value.dataJson = JSON.stringify(value.dataJson);
						}
						if (value.id == 'default') {
							var defaultTreeItemTemplate = _.template($(
									"#nav-tree-item-default-template").html());
							category = defaultTreeItemTemplate(value);
						} else {
							category = navTreeCategoryTemplate(value);
							var treeItems = '';
							$.each(value.items, function(itemIndex, itemValue) {
								if(!itemValue.dataJson) {
									itemValue.dataJson = '';
								}else{
									itemValue.dataJson = JSON.stringify(itemValue.dataJson);
								}
								treeItems += treeItemTemplate(itemValue);
							});

							category = category.replace("%NAV_TREE_ITEMS%", treeItems);
						}
						$genTemplatePage.find("#docUINav .nav-parent").append(category);
						$genTemplatePage.find("#docUINav .nav-parent").append(navDividerTemplate());
					});

					attachItemHandlers();
				} else {

				}
			}

			function attachItemHandlers() {
				$genTemplatePage.find(".tree-toggler").off('click').click(togglePredefinedTemplateTree);
				$genTemplatePage.find(".tree-item").off('click').click(toggleBackground);
				hideAllPredefinedTemplates();
			}

			function attachHandlers() {
				// $genTemplatePage.find(".tab").off('click').click(toggleUnderlineColor);
				// $genTemplatePage.find(".highlight").off('click').click(toggleColor);

				$genTemplatePage.find(".input-xml-go").click(handleSelectionTree);
				$genTemplatePage.on('blur', 'input.editable', updateHeaderLabel);
				$genTemplatePage.find(".select-global-menu").off('change').change(handleInsertGlobal);
				
				$genTemplatePage.find(".save-layout").off('click').click(handleSaveLayout);
				$genTemplatePage.find("#table-format").off('click').click(handleFormatDataSelection);
				$genTemplatePage.find("#paragraph-format").off('click').click(handleFormatDataSelection);
				
				$genTemplatePage.find(".footer-bar .generate-template-btn").off('click').click(handleGenerateTemplate);
				$genTemplatePage.find(".footer-bar .preview-cancel-btn").off('click').click(handleCancelPreview);
				$genTemplatePage.find(".data-select-buttons .ds-cancel-btn").off('click').click(handleCancelDataSelection);
				$genTemplatePage.find(".data-select-buttons .ds-clear-btn").off('click').click(handleClearDataSelection);
				$genTemplatePage.find(".clear-section").off('click').click(handleClearSection);
				
				initializeLoadingText();
			}
			
			function handleClearSection(e) {
				$(e.target).closest('.section-container').find('.preview-data-selected').empty();
				$(e.target).closest('.section-container').find('.input-preview-section-title').val('');
				$(e.target).closest('.section-container').find('.input-preview-section-title').attr('title-query','');
				$(e.target).closest('.section-container').attr('selected-metadata', '');
			}
			
			function handleGenerateTemplate(e) {
				var url = $genTemplatePage.find(".input-url").val();
				if (url == '' || ($('.navigation-tree .data-selection-tree').is(':empty'))) { 
					$genTemplatePage.find('.input-url').focus();
				}else if($genTemplatePage.find('.section-container').find('.preview-data-selected').children().length > 0 ){
					var saveLayoutData = buildSaveLayout();
					var $saveLink = $genTemplatePage.find(".save-to-local")[0];
					$saveLink.href = baseUrl + "/api/template/generate?layoutjson="+JSON.stringify(saveLayoutData)+"&title="+saveLayoutData['docName'];
					$loadingText.trigger("show", {
						text: 'Generating template. This might take a while. Please wait...',
					});
					$saveLink.click();
				}else { 
					$loadingText.trigger("show", {
						text : "select data to generate template"
					});
				}
				
			}
			
			function handleCancelPreview(e) {
				var clear = confirm("Are you sure to clear the template layout?");
				if (clear) {
					clearAllSections();
				}
			}
			
			function handleCancelDataSelection(e) {
				toggleTab('#preview-design', 'show');
				enableDisableTab('#data-selection', '');
			}
			
			function enableDisableTab(elementId, toggleValue) {
				$genTemplatePage.find('.design-tabs a[href="' + elementId + '"]').attr('data-toggle', toggleValue);
				if(toggleValue == 'tab') {
					$genTemplatePage.find('.design-tabs a[href=' + elementId + ']').parent().removeClass('disabled');
				} else {
					$genTemplatePage.find('.design-tabs a[href=' + elementId + ']').parent().addClass('disabled');
				}
			}
			
			function toggleTab(elementId, showHide) {
				$genTemplatePage.find('.design-tabs a[href="' + elementId + '"]').tab(showHide);
			}
			
			function handleClearDataSelection(e) {
				$.each($genTemplatePage.find(".navigation-tree .data-selection-tree .jstree-clicked"),function(index, value) {
					$(this).click();
				});
				
				$.each($genTemplatePage.find(".navigation-tree .data-selection-tree .jstree-node.jstree-open"),function(index, value) {
					$(this).find('.jstree-icon.jstree-ocl')[0].click();
				});
				clearDataSelectionPage(true);
			}
			
			function handleSectionFormatChange(e) {
				var oldFormat = $(e.target).closest('div.section-container').find('.selectFormat').attr('previous-format');
				var newFormat = $(e.target).val();
				
				if(oldFormat != '' && newFormat == '') {
					if(!$(e.target).closest('div.section-container').find(".preview-data-selected").is(':empty')) {
						$(e.target).val(oldFormat);
						alert('Cannot empty once populated.');
						return;
					}
				}
				
				$container  = $(e.target).closest('div.section-container');
				$(e.target).closest('div.section-container').find('.selectFormat').attr('previous-format', newFormat);
				
				if((oldFormat == 'table' || oldFormat == 'paragraph') && newFormat == 'static-text'){
					clearSectionContainer($(e.target).closest('div.section-container'));
					$(e.target).closest('div.section-container').find(".preview-data-selected").attr('contenteditable' , "true");
					$(e.target).closest('div.section-container').find(".section-select-data-btn").addClass("hide");
					$(e.target).closest('div.section-container').find(".preview-data-selected").attr('placeholder', 'Please enter static text here');
					$(e.target).closest('div.section-container').find(".preview-data-selected").focus();
				} else if(oldFormat == 'static-text' && (newFormat == 'table' || newFormat == 'paragraph')){
					clearSectionContainer($(e.target).closest('div.section-container'));
					$(e.target).closest('div.section-container').find(".preview-data-selected").attr('contenteditable' , "false");
					$(e.target).closest('div.section-container').find(".section-select-data-btn").removeClass("hide");
					$(e.target).closest('div.section-container').find(".preview-data-selected").attr('placeholder', '');
				} else {
					var dataSelectionJson = $container.attr('selected-metadata');
					if(dataSelectionJson) {
						populatePreviewSection(newFormat, jQuery.parseJSON(dataSelectionJson), $container);
					}
				}
			}
			
			function clearSectionContainer($sectionContainer){
				$sectionContainer.find(".title").empty();
				$sectionContainer.find(".preview-data-selected").empty();
				$sectionContainer.attr('selected-metadata','');
			}

			function hideContainerActionIcons(e) {
				//$(e.target).closest('.section-container').find("#display-on-hover").hide();
				$(e.target).closest('.section-container').find("#display-on-hover").removeClass("visibility-visible").addClass("visibility-hidden");
			}

			function displayContainerActionIcons(e) {
				//$(e.target).closest('.section-container').find("#display-on-hover").show();
				$(e.target).closest('.section-container').find("#display-on-hover").removeClass("visibility-hidden").addClass("visibility-visible");
			}
			
			function handleInsertGlobal(e) {
				if ($(e.target).val() == 'toc') {
					if ($genTemplatePage.find('#preview-main-content .toc').length > 0) {
						alert('Table of contents is already added.');
						$(e.target).val('');
						return;
					} else {
						$genTemplatePage.find('#preview-main-content').prepend(_.template($("#table-of-contents-template").html()));
						$(e.target).val('');
					}
				} else if ($(e.target).val() != '') {
					alert('Yet to be implemented');
				}
				$genTemplatePage.find(".delete-toc").off('click').click(deleteTableOfContents);
			}
			
			function deleteTableOfContents(e){
				if ($genTemplatePage.find('#preview-main-content .toc').length > 0) {
					$genTemplatePage.find('#preview-main-content .toc').remove();
				}
			}

			function handleSectionSelectData(e) {
				var $container = $(e.target).closest('div.section-container');
				var format = $container.find('.selectFormat').val();
				var url = $genTemplatePage.find(".input-url").val();
				if (url == '' || ($('.navigation-tree .data-selection-tree').is(':empty'))) {
					$genTemplatePage.find('.input-url').focus();
				} else {
					$genTemplatePage.find(".btn-select-data").off('click').click(populateDataPreview);
					clearDataSelectionPage(true);
					// $genTemplatePage.find('#' + format + '-format').click();
					switchFormatToPrimaryInDS(format);
					var jsonData = null;
					if($container.attr('selected-metadata') != null) {
						$genTemplatePage.find('.navigation-tree .data-selection-tree').jstree("open_all");
						jsonData = jQuery.parseJSON($container.attr('selected-metadata'));
						var query = jsonData.dataAttributes[0].query; // query of the first element in preview table
						var path = query.substring(0, query.lastIndexOf('/')); // path of one of the element in preview table
						$.each(jsonData.dataAttributes , function(ind , val) {
							previewQuery = val.query;
							$.each($genTemplatePage.find('.navigation-tree .data-selection-tree').find('ul.jstree-children .jstree-leaf a.jstree-anchor') ,function(index, value){
									var jstreeNodePath = $genTemplatePage.find('.navigation-tree .data-selection-tree').jstree().get_path(value.closest('li'));
									jstreeNodePath = jstreeNodePath.join('/');
									jstreeNodePath = jstreeNodePath.substring(0, jstreeNodePath.lastIndexOf('/'));
									console.debug(jstreeNodePath);
									previewQuery = previewQuery.substring(previewQuery.lastIndexOf('/') + 1);
									if(jstreeNodePath == path && value.text == previewQuery) {
										value.click();
									}
							//alert(jstree.get_path(value));
						});
						
						});
					}
					
					enableDisableTab('#data-selection', 'tab');
					enableDisableTab('#preview-design', '');
					toggleTab('#data-selection', 'show');
					// $genTemplatePage.find('.navigation-tree .data-selection-tree').find(".jstree-icon .jstree-ocl").click();
					// $genTemplatePage.find('.navigation-tree .data-selection-tree').find(".jstree-icon .jstree-ocl").click();
				}
				
				function populateDataPreview() {
					if($genTemplatePage.find(".input-ds-title").val()!='' || ($genTemplatePage.find(".selected-content .header-label").length > 0)){
						var format = 'table'; // paragraph table
						if ($genTemplatePage.find("#paragraph-format").hasClass('btn-primary')) {
							format = 'paragraph';
						}
						
						var dataSelectionJson = getSelectedMetadata(format);
						populatePreviewSection(format, dataSelectionJson, $container);
						
						$container.attr('selected-metadata', JSON.stringify(dataSelectionJson));
						
						enableDisableTab('#data-selection', '');
						enableDisableTab('#preview-design', 'tab');
						toggleTab('#preview-design', 'show');
					} else {
						alert("No data to select");
					}
				}
			}
			
			function getSelectedMetadata(format) {
				var data = {};
				data['title'] = $genTemplatePage.find('.selected-content .input-ds-title').val();
				data['titleQuery'] = $genTemplatePage.find('.selected-content .input-ds-title').attr('data-query');
				
				var selectedItems = data['dataAttributes'] = [];
				
				if (format == 'paragraph') {
					if($genTemplatePage.find('.data-selection-paragraph-container').length > 0) {
						var $oneParaContainer = $genTemplatePage.find('.data-selection-paragraph-container').first();
						$.each($oneParaContainer.find('.data-selection-paragraph .header-label'), function(index, value) {
							var selectedItem = {};
							selectedItem['label'] = $(this).find('.title').text();
							selectedItem['query'] = $(this).attr('data-query');
							selectedItems.push(selectedItem);
						});
					}
					
				} else if (format == 'table') {
					if($genTemplatePage.find('.table-data-selection thead th').length > 0) {
						$.each($genTemplatePage.find('.table-data-selection thead th.header-label'), function(index, value) {
							var selectedItem = {};
							selectedItem['label'] = $(this).find('.title').text();
							selectedItem['query'] = $(this).attr('data-query');
							selectedItems.push(selectedItem);
						});
					}
				} 
				return data;
			}
			
			function populatePreviewSection(format, dataSelectionJson, $container) {
				if(!dataSelectionJson) {
					return;
				}
				$container.find('.input-preview-section-title').val(dataSelectionJson['title']); 
				$container.find('.input-preview-section-title').attr('title-query', dataSelectionJson['titleQuery']);
				$container.find(".selectFormat").val(format);
				$container.find('.selectFormat').attr('previous-format', format);
				
				if (format == 'paragraph') {
					var $previewContainerData = $container.find(".preview-data-selected");
					$previewContainerData.empty();
					containerDisplayOnHoverAction(".paragraph-data-selection");
					if(dataSelectionJson && dataSelectionJson.dataAttributes && dataSelectionJson.dataAttributes.length > 0) {
						populateParagraphSection(dataSelectionJson, 'paragraph-preview-selected-data', $previewContainerData, 'preview-paragraph-row-template');
					}
				} else if(format == 'table') {
					var $previewContainerData = $container.find(".preview-data-selected");
					$previewContainerData.empty();
					containerDisplayOnHoverAction(".table-data-selection");
					$previewContainerData.html(_.template($("#preview-container-empty-template").html()));
					
					if(dataSelectionJson && dataSelectionJson.dataAttributes && dataSelectionJson.dataAttributes.length > 0) {
						populateTableHeaderRow(dataSelectionJson.dataAttributes, '#preview-header-column-template', $previewContainerData.find('.preview-container-table'));
						populateTableDataRows(dataSelectionJson , $previewContainerData.find('.preview-container-table'));
					}
				} else if(format == 'static-text'){
					var $previewContainerData = $container.find(".preview-data-selected");
					$previewContainerData.empty();
					containerDisplayOnHoverAction(".preview-data-selected");
					$previewContainerData.attr('contenteditable' , "true");
					$previewContainerData.text(dataSelectionJson['staticContent']);
				}
			}
			
			function populateTableDataRows(dataSelectionJson , $containerTable) {
				var selectedTreeItems = [];
				var xpath = null;
				$.each(dataSelectionJson.dataAttributes, function(index, value) {
					var tableHeader = value.query;
					if (xpath == null) {
						xpath = tableHeader;
					}
					selectedTreeItems.push(tableHeader.substring(tableHeader
									.lastIndexOf('/') + 1));
				});

				var jsonObj = getJSONobjByPath(xpath);
				
				$containerTable.find("tbody").empty();

				var jsonData;
				var dataLength = jsonObj.length;
				if (dataLength > dataSelectionPageLimit) {
					dataLength = dataSelectionPageLimit;
				}
				
				var columnDataTemplate = _.template($("#data-selection-data-column-template").html());

				for ( var k = 0; k < dataLength; k++) {
					var $row = $('<tr></tr>');
					$containerTable.find("tbody").append($row);
					var dataRow = jsonObj[k];
					
					$.each(selectedTreeItems, function(index, value) {
						jsonData = {
							data : dataRow[value]
						};
						$row.append(columnDataTemplate(jsonData));
					});
				}
			}
			
			function getJSONobjByPath(xpath) {
				var pathArray = xpath.split('/');
				var jsonObj = null;
				for ( var i = 0; i < pathArray.length - 1; i++) {
					if (jsonObj == null) {
						jsonObj = jQuery.parseJSON($genTemplatePage.find('.xml-as-json').attr('data-xmljson'))[pathArray[i]];
					} else {
						jsonObj = jsonObj[pathArray[i]];
					}
				}
				return jsonObj;
			}

			function populateParagraphPreview(data, $containerTable, templateName) {
				var rowTemplate = _.template($('#' + templateName).html());
				$containerTable.append(rowTemplate(data));
			}
			
			function clearDataSelectionPage(clearTree) {
				$(".table-data-selection thead").empty();
				$(".table-data-selection tbody").empty();
				$(".paragraph-data-selection").empty();
				
				if(clearTree) {
					$(".input-ds-title").val('');
					$(".input-ds-title").attr('data-query','');
					$genTemplatePage.find('.navigation-tree .data-selection-tree').jstree(true).deselect_all();
				}
			}

			function updateHeaderLabel(e) {
				var $th = null;
				var label = $genTemplatePage.find("input.editable").val();
				if ($(e.target).closest(".header-label").closest(
						".paragraph-data-selection")) {
					$th = $genTemplatePage.find(".header-label");
				} else {
					$th = $(e.target).closest(".header-label");
				}

				var dataQuery = $(e.target).closest(".header-label").attr('data-query');

				$.each($th, function(ind, val) {
					if (dataQuery == $(this).attr('data-query')) {
						$(this).find(".title").removeClass('hide').html(label);
						$(this).find("input.editable").remove();
					}
				});
			}

			function handleEditTitle(e) {
				var $th = $(e.target).closest(".header-label");
				var input = $('<input />', {
					'type' : 'text',
					'name' : 'unique',
					'class' : 'editable form-control',
					'value' : $th.find(".title").html()
				});
				$th.find(".title").parent().append(input);
				$th.find(".title").addClass("hide").removeClass("show");
				input.focus();
			}

			function toggleColor(e) {
				e.preventDefault();
				$genTemplatePage.find(".highlight").removeClass("btn-primary btn-default").addClass("btn-default");
				$(e.target).removeClass("btn-default btn-primary").addClass("btn-primary");
			}
			function toggleUnderlineColor(e) {
				e.preventDefault();
				$genTemplatePage.find(".label").removeClass("selected unselected").addClass("unselected");
				$(e.target).removeClass("unselected selected").addClass("selected");
			}
			
			function toggleBackground(e) {
				e.preventDefault();
				$genTemplatePage.find("li.tree-item.selected .navLabel").removeClass('selected-item');
				$genTemplatePage.find("li.tree-item").removeClass('selected');
				$(e.target).closest('li.tree-item').addClass('selected');
				$(e.target).closest('li.tree-item').find('.navLabel').addClass('selected-item');
				
			}
			
			function togglePredefinedTemplateTree(e) {
				e.preventDefault();
				var $tree = $(e.target);

				while (!$tree.hasClass("tree-toggler")) {
					$tree = $tree.parent();
				}

				$tree.parent().children('ul.tree').toggle(200);
			}
			
			function handleTreeNodeCheck(e) {
				var $node = $(e.target);
				var selectedElement = $node;
				
				var format = 'table'; // paragraph table
				if ($genTemplatePage.find("#paragraph-format").hasClass('btn-primary')) {
					format = 'paragraph';
				}
				
				if($node.prop('tagName') != 'A') {
					selectedElement = $node.parent();
				}
				if (selectedElement.hasClass('jstree-clicked')) {
					if (selectedElement.closest('li').hasClass('jstree-leaf')) {
						var json = {
							name : selectedElement.closest('a').text(),
							query : getSelectElementXPath(selectedElement)
						};
						var newContext = json.query;
						var existingContext = null;
						
						var dataSelectionJson = getSelectedMetadata(format);
						
						if(dataSelectionJson && dataSelectionJson.dataAttributes && dataSelectionJson.dataAttributes.length > 0) {
							existingContext = dataSelectionJson.dataAttributes[0].query;
						}

						if (newContext.indexOf('/') != -1) {
							newContext = newContext.substring(0, newContext.lastIndexOf('/'));
						}
						
						// check for same parent while selecting data
						if (existingContext != null) {
							if (existingContext.indexOf('/') != -1) {
								existingContext = existingContext.substring(0, existingContext.lastIndexOf('/'));
							}
							
							if (existingContext != newContext) {
								$node.click();
								alert(messages.treeItem_differentContext);
								return;
							}
						}
						
						// check for same parent between title and table data
						if($genTemplatePage.find(".input-ds-title").val() != ''){
							var titleContext = $genTemplatePage.find(".input-ds-title").attr('data-query');
							if(titleContext) {
								if (titleContext.indexOf('/') != -1) {
									titleContext = titleContext.substring(0, titleContext.lastIndexOf('/'));
								}
								if(newContext != titleContext){
									$genTemplatePage.find(".input-ds-title").val('');
									$genTemplatePage.find(".input-ds-title").attr('data-query','');
									$node.click();
									alert(messages.treeItem_differentContext);
									return;
								}
							}
						}
						
						var newDataAttribute = {
							label: json.name,
							query: json.query
						};
						dataSelectionJson.dataAttributes.push(newDataAttribute);
						populateDataSelectionSection(format, dataSelectionJson);
					} else {
						$node.click();
						alert(messages.warning_parentNodeSelected);
					}
				} else {
					if (selectedElement.closest('li').hasClass('jstree-leaf')) {
						var xPath = getSelectElementXPath(selectedElement);

						if(format == 'table') {
							// remove all table headers
							var headerIndex = null;
							$.each($genTemplatePage.find(".table-data-selection thead th"),
								function(index, value) {
									if (xPath == $(this).attr('data-query')) {
										$(this).remove();
										headerIndex = index;
									}
								});
	
							// remove all table body rows
							$.each($genTemplatePage.find(".table-data-selection tbody tr"), function(index, value) {
									$.each($(this).find('td'), function(ind, val) {
										if (ind == headerIndex) {
											$(this).remove();
										}
									});
							});
						} else if(format == 'paragraph') {
							$.each($genTemplatePage.find(".data-selection-paragraph"),
								function(index, value) {
									if (xPath == $(this).find(".header-label")
											.attr('data-query')) {
										$(this).remove();
									}
								});
						}
					}
				}
				
				/*if ($genTemplatePage.find(".paragraph-data-selection .data-selection-paragraph").length == 0) {
					$genTemplatePage.find(".paragraph-data-selection").empty();
				}*/
			}
			
			function populateDataSelectionSection(format, dataSelectionJson) {
				if(format == 'table') {
					if(dataSelectionJson && dataSelectionJson.dataAttributes && dataSelectionJson.dataAttributes.length > 0) {
						populateTableHeaderRow(dataSelectionJson.dataAttributes, '#data-selection-header-column-template', $genTemplatePage.find('.table-data-selection'));
						populateTableDataRows(dataSelectionJson , $genTemplatePage.find('.table-data-selection'));
					}
				} else if(format = 'paragraph') {
					var $paraSectionContiner = $genTemplatePage.find(".paragraph-data-selection");
					$paraSectionContiner.empty();
					if(dataSelectionJson && dataSelectionJson.dataAttributes && dataSelectionJson.dataAttributes.length > 0) {
						populateParagraphSection(dataSelectionJson, 'data-selection-paragraph-container', $paraSectionContiner, 'data-selection-paragraph-edit-div-template');
						
						// remove edit icon from all expect for first
						$.each($paraSectionContiner.find('.data-selection-paragraph-container'), function(ind, val) {
							if(ind > 0) {
								$(this).find('.no-edit-title').remove();
							}
						});
					}
				}
				
				$genTemplatePage.find(".no-edit-title").off('click').click(handleEditTitle);
			}
			
			function populateParagraphSection(dataSelectionJson, paraContainerClassName, $container, rowTemplateName) {
				if(dataSelectionJson && dataSelectionJson.dataAttributes && dataSelectionJson.dataAttributes.length > 0) {
					var xmlDataJson = getJSONobjByPath(dataSelectionJson.dataAttributes[0].query);;
					// dataSelectionPageLimit
					var limit = xmlDataJson.length;
					if(limit > previewPageLimit){
						limit = previewPageLimit;
					}
					
					var json = null;
					for(var k = 0; k < limit; k++) {
						$paragraphContainerTemplate = $('<div class="' + paraContainerClassName + '"></div><br />');
						$container.append($paragraphContainerTemplate);
						$paragraphContainerTemplate = $paragraphContainerTemplate.eq(0);
									
						$.each(dataSelectionJson.dataAttributes, function(index, value) {
							json = {
								query : value.query,
								name : value.label,
								data : xmlDataJson[k][value.query.substring(value.query.lastIndexOf('/') + 1)]
							};

							populateParagraphPreview(json, $paragraphContainerTemplate, rowTemplateName);
						});
					}
				}
			}

			function populateTableHeaderRow(attributes, templateName, $table) {
				$table.find('thead').empty();
				var columnHeaderTemplate = _.template($(templateName).html());
				$.each(attributes, function(index, value) {
					var json = {
						query : value.query,
						name : value.label,
					};
					
					$table.find("thead").append(columnHeaderTemplate(json));
				});
			}

			function populateParagraph(data, $paraContainer, addEdit) {
				var paragraphTemplate = null;
				
				if (addEdit) {
					paragraphTemplate = _.template($("#data-selection-paragraph-edit-div-template").html());
				} else {
					paragraphTemplate = _.template($("#data-selection-paragraph-div-template").html());
				}
				
				$paraContainer.append(paragraphTemplate(data));
			}

			function addContainer(e) {
				var containerTemplate = _.template($("#preview-design-format-container-template").html());

				if (e && e.target !== undefined) {
					if ($genTemplatePage.find(".section-container").length > 0) {
						$(e.target).closest(".section-container").after(
								containerTemplate());
					}
				} else {
					$genTemplatePage.find(".scroll-content").append(containerTemplate());
				}
				$genTemplatePage.find(".add-container").off('click').click(addContainer);
				$genTemplatePage.find(".delete-container").off('click').click(deleteContainer);
				$genTemplatePage.find(".section-select-data-btn").off('click').click(handleSectionSelectData);
				$genTemplatePage.find(".clear-section").off('click').click(handleClearSection);

				containerDisplayOnHoverAction(".section-container");
				$genTemplatePage.find(".selectFormat").off('change').change(handleSectionFormatChange);
				
				$genTemplatePage.find(".input-preview-section-title").off('keyup kewdown cut paste').on('keyup kewdown cut paste', handleEditSectionTitle);
				if(e) {
					$genTemplatePage.find(".delete-container").removeClass("hide");
				} else {
					$genTemplatePage.find(".delete-container").addClass("hide");
				}
			}
			
			function handleEditSectionTitle(e) {
				var $metadata = $(e.target).closest('div.section-container');
				
				if($metadata.attr('selected-metadata')) {
					var metadataJson = jQuery.parseJSON($metadata.attr('selected-metadata'));
					var title = metadataJson.title;
					var newTitle = $(e.target).val();
					
					if(title != newTitle) {
						metadataJson.title = newTitle;
						metadataJson.titleQuery = '';
						
						$metadata.attr('selected-metadata', JSON.stringify(metadataJson));
					}
				}
			}

			function containerDisplayOnHoverAction(element) {
				$genTemplatePage.find(element).off('mouseenter').mouseenter(displayContainerActionIcons);
				$genTemplatePage.find(element).off('mouseleave').mouseleave(hideContainerActionIcons);
			}

			function deleteContainer(e) {
				var container = $(e.target);
				if ($(container).closest('div.section-container')) {
					container.closest('div.section-container').remove();
				}
				if (($genTemplatePage.find(".section-container")).length == 1) {
					$genTemplatePage.find(".delete-container").addClass("hide");
				}
			}

			function hideAllPredefinedTemplates() {
				$.each($genTemplatePage.find('.tree-toggler'), function(ind,
						val) {
					this.click();
				});
			}

			function handleSelectionTree(e) {
				if($genTemplatePage.find('#preview-main-content .toc').length > 0) {
					$genTemplatePage.find('#preview-main-content .toc').remove();
				} 
				$genTemplatePage.find(".section-container").remove();
				$genTemplatePage.find(".input-toc-label").val('');
				addContainer(false);
				isLayoutDirty = false;
				$loadingText.trigger("hide");
				
				var urlInput = $genTemplatePage.find(".input-url").val();
				if(urlInput == '') {
					alert('URL is mandatory');
					jsonToXmlLoadingStatus = 'failed';
					return;
				}
				isLayoutDirty = true;
				$.ajax({
					url : baseUrl + "/api/utils/xmltojsonschema",
					data : {
						url : urlInput
					},
					method : 'GET',
					success : function(result) {
						populateTree(result);
					},
					error: function(xhr, error) {
						jsonToXmlLoadingStatus = 'failed';
						$loadingText.trigger("show", {
							text : xhr.responseText
						});
					}
				});
			}

			function getSelectElementXPath(selectedElement) {
				var path = "";
				var temp;
				while (selectedElement.parent().prop('tagName') != 'DIV') {
					if (selectedElement.parent().prop('tagName') == 'LI') {
						temp = selectedElement.parent().find('a')[0].text;
						path = temp + '/' + path;
					}
					selectedElement = selectedElement.parent();
				}
				if (path.substring(path.length - 1) == '/') {
					path = path.substring(0, path.length - 1);
				}
				return path;
			}
			
			function convertXmlToJson(url) {
				$.ajax({
					url : baseUrl + "/api/utils/xmltojson",
					data : {
						url : url
					},
					method : 'GET',
					success : function(result) {
						$(".xml-as-json").attr('data-xmlJson', JSON.stringify(result));
						jsonToXmlLoadingStatus = 'loaded';
					},
					error: function(xhr, error) {
						jsonToXmlLoadingStatus = 'failed';
						$loadingText.trigger("show", {
							text : xhr.responseText
						});
					}
				});
			}

			function populateTree(jsonTreeData) {
				clearNavigationTree();

				// ajax call get json for the xml
				var urlInput = $genTemplatePage.find(".input-url").val();
				convertXmlToJson(urlInput);
				var node = null;
				$genTemplatePage.find('.navigation-tree .data-selection-tree')
				.on("select_node.jstree deselect_node.jstree", function (e, data) {
					    if(data.node.children.length) {
					            e.preventDefault(); // may not be necessary
					            e.stopImmediatePropagation();
					            // uncomment below if you wish to have the parent item open/close the tree when double clicked
					            //return data.instance.toggle_node(data.node);
					        }
					    })
					   /* .on('loaded.jstree', function (e, data) {
					        $(e).find('li.jstree-open > a.jstree-anchor > i.jstree-checkbox, li.jstree-closed > a.jstree-anchor > i.jstree-checkbox').hide();
					    })
					    */.on('open_node.jstree close_node.jstree', function (e, data) {
					        $(e).find('li.jstree-open > a.jstree-anchor > i.jstree-checkbox, li.jstree-closed > a.jstree-anchor > i.jstree-checkbox').hide();
					    })
						.jstree(
								{
									'plugins' : [ 'dnd', 'checkbox' ],
									"dnd" : {
										drop_target : ".drop",
										drop_check : function(data) {
											return false;
										},
									},
									"checkbox" : {
										"keep_selected_style" : false,
									},
									'core' : {
										'check_callback' : function(operation,
												node, node_parent,
												node_position, more) {
											if (operation === "move_node") {
												return node_parent.original.type === "Parent"; // only
												// allow
												// dropping
												// inside
												// nodes
												// of
												// type
												// 'Parent'
											}
											return true; // allow all other
											// operations
										},
										'themes' : {
											'dots' : false,
											'icons' : false
										},
										'data' : jsonTreeData
									// 'data' : ['Simple root node']
									}
								});
				$('.drag')
						.on(
								'mousedown',
								function(e) {
									return $.vakata.dnd
											.start(
													e,
													{
														'jstree' : false,
														'obj' : $(this),
														'nodes' : [ {
															id : true,
															text : $(this)
																	.text()
														} ]
													},
													'<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>'
															+ $(this).text()
															+ '</div>');
								});
				$(document).on(
						'dnd_move.vakata',
						function(e, data) {
							var t = $(data.event.target);
							if (!t.closest('.jstree').length) {
								if (t.closest('.drop').length) {
									data.helper.find('.jstree-icon')
											.removeClass('jstree-er').addClass(
													'jstree-ok');
								} else {
									data.helper.find('.jstree-icon')
											.removeClass('jstree-ok').addClass(
													'jstree-er');
								}
							}
						})
						.on(
								'dnd_stop.vakata',
								function(e, data) {
									var t = $(data.event.target);
									if (!t.closest('.jstree').length) {
										if (t.closest('.drop').length) {
											var path = getSelectElementXPath($(data.element).parent());
											var context = null;
											if($genTemplatePage.find('.table-data-selection thead th').length > 0) {
												context = $genTemplatePage.find('.table-data-selection thead th').first().attr('data-query');
												if (context.indexOf('/') != -1) {
													context = context.substring(0, context.lastIndexOf('/'));
												}
												
												if(path != context) {
													alert(messages.treeItem_differentContext);
													return;
												}
											}
											
											path += '/' + $(data.element)[0].text;
											t.closest('.drop').val(path);
											t.closest('.drop').attr('data-query', path);
										}
									}
								});
				
				$genTemplatePage.off("click.jstree", ".jstree-anchor").on("click.jstree", ".jstree-anchor", handleTreeNodeCheck);
				
				$loadingText.trigger("show", {
					text: messages.navigatorTreeLoaded
				});
			}
			
			function handleFormatDataSelection(e) {
				var format = null;
				var oldFormat = null;
				if($(e.target).attr('id') == 'table-format') {
					oldFormat = 'paragraph';
					format = 'table';
					$genTemplatePage.find("#paragraph-format").removeClass("btn-primary").addClass("btn-default");
					$(e.target).addClass("btn-primary").removeClass("btn-default");
				} else if($(e.target).attr('id') == 'paragraph-format') {
					oldFormat = 'table';
					format = 'paragraph';
					$genTemplatePage.find("#table-format").removeClass("btn-primary").addClass("btn-default");
					$(e.target).addClass("btn-primary").removeClass("btn-default");
				}
				
				$genTemplatePage.off("click.jstree", ".jstree-anchor").on("click.jstree", ".jstree-anchor", handleTreeNodeCheck);
				
				var dataSelectionJson = getSelectedMetadata(oldFormat);
				
				clearDataSelectionPage(false);
				
				populateDataSelectionSection(format, dataSelectionJson);
			}
			
			function switchFormatToPrimaryInDS(format) {
				if(format == 'table') {
					$genTemplatePage.find("#paragraph-format").removeClass("btn-primary").addClass("btn-default");
					$genTemplatePage.find("#table-format").addClass("btn-primary").removeClass("btn-default");
				} else if(format == 'paragraph') {
					$genTemplatePage.find("#table-format").removeClass("btn-primary").addClass("btn-default");
					$genTemplatePage.find("#paragraph-format").addClass("btn-primary").removeClass("btn-default");
				}
			}
			
			function handleSaveLayout(e){
				var saveLayoutData = buildSaveLayout();
				var $saveLink = $genTemplatePage.find(".save-to-local")[0];
				$saveLink.href = baseUrl + "/api/template/savelayout?layoutjson="+JSON.stringify(saveLayoutData)+"&title="+saveLayoutData['docName'];
				$saveLink.click();
			}
			
			function buildSaveLayout() {
				var saveLayoutData = {};
				saveLayoutData['title'] = $genTemplatePage.find(".document-title").val();
				saveLayoutData['xmlUrl'] = $genTemplatePage.find(".input-url").val();
				
				if($genTemplatePage.find("div.toc").length > 0) {
					saveLayoutData['tocLabel'] = $genTemplatePage.find("div.toc .input-toc-label").val();
					saveLayoutData['hasToc'] = true;
				}
				
				var sections = saveLayoutData['sections'] = [];
				$.each($genTemplatePage.find(".section-container"),function(index, value){
					if($(this).find('.selectFormat').val() != '') {
						var container = {};
						if($(this).find('.selectFormat').val() != 'static-text') {
							if($(this).attr('selected-metadata')) {
								container = $(this).attr('selected-metadata');
								container = jQuery.parseJSON(container);
							}
						} else {
							container['title'] = $(this).find('.input-preview-section-title').val();
							container['staticContent'] = $(this).find('.preview-data-selected').text();
						}
						container['format'] = $(this).find('.selectFormat').val();
						sections.push(container);
					}
				});
				
				return saveLayoutData;
			}
			
			function clearMainSection() {
				$genTemplatePage.find(".document-title").val('');
				$genTemplatePage.find(".input-url").val('');
				
				if($genTemplatePage.find('#preview-main-content .toc').length > 0) {
					$genTemplatePage.find('#preview-main-content .toc').remove();
				}
			}
			
			function clearNavigationTree() {
				$genTemplatePage.find('.navigation-tree .xml-as-json').attr('data-xmlJson', '');
				$genTemplatePage.find('.navigation-tree .data-selection-tree').remove();

				$genTemplatePage.find('.navigation-tree').append(_.template($("#navigator-tree-div-template").html()));
			}
			
			function initializeLoadingText() {

				// var $loadingText = $(".side-bar-content .loading-text");

				$loadingText.find(".close-loading-text").on("click",
						function(event) {
							$loadingText.trigger("hide");
						});

				$loadingText.on("show", function(event, options) {
					var text = "";
					if (options.persist) {
						$loadingText.find(".close-loading-text").addClass(
								"hide");
						text = "...";
					} else
						$loadingText.find(".close-loading-text").removeClass(
								"hide");

					if (options.text)
						text = options.text + text;
					else
						text = messages.loading + text;

					$loadingText.find(".text-content > span").text(text);

					$loadingText.removeClass("hide");
				});

				$loadingText.on("hide", function(event) {
					$loadingText.addClass("hide");
				});
			}
			
			function makeAjaxDeferredCall(ajaxOptions) {
				if(typeof ajaxOptions.cache == 'undefined') {
					ajaxOptions.cache = false;
				}
				if(typeof ajaxOptions.contentType == 'undefined') {
					ajaxOptions.contentType = false;
				}
				if(typeof ajaxOptions.processData == 'undefined') {
					ajaxOptions.processData = false;
				}
				if(typeof ajaxOptions.type == 'undefined') {
					ajaxOptions.type = 'GET';
				}
				if(typeof ajaxOptions.params == 'undefined') {
					ajaxOptions.params = {};
				}
				
				return $.ajax({
					url: ajaxOptions.url,
					data: ajaxOptions.params,
					type: ajaxOptions.type,
					async: ajaxOptions.async,
					cache: ajaxOptions.cache,
					contentType: ajaxOptions.contentType
				});
			}

			addContainer(false);
			getPredefinedTemplates();
			attachHandlers();
			$loadingText.trigger("show", {
				text: 'loading...'
			});
			
			$genTemplatePage.find(".input-url").val(defaultXmlUrl);
			// $genTemplatePage.find(".input-url").val('http://localhost:8080/tegas/data/rss.xml');
			
			$genTemplatePage.find(".document-title").val('Sample Requirements');
			$genTemplatePage.find(".document-title").focus();
			handleSelectionTree();
			
			enableDisableTab('#data-selection', '');
		});
