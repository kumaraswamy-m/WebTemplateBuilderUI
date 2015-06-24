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
			var previewPageLimit = 5;

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
				// clearNavigationTree();
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
				
				$genTemplatePage.find(".section-container").remove();
				
				var layoutJson = $(e.target).closest("li").attr('data-json');
				if(layoutJson && layoutJson.length > 0) {
					var layoutJsonObj = jQuery.parseJSON(layoutJson);
					
					$genTemplatePage.find(".document-title").val(layoutJsonObj.title);
					$genTemplatePage.find(".input-url").val(layoutJsonObj.xmlUrl);
					
					if(layoutJsonObj.hasToc) {
						$genTemplatePage.find('#preview-main-content').prepend(_.template($("#table-of-contents-template").html()));
						$genTemplatePage.find(".input-toc-label").val(layoutJsonObj.tocLabel);
					}
					
					$genTemplatePage.find(".input-xml-go").click();
					
					$.each(layoutJsonObj.sections , function(index, value) {
						addContainer(true);
						$container = $genTemplatePage.find(".section-container").eq(($genTemplatePage.find(".section-container")).length - 1);
						$container.attr('selected-metadata',JSON.stringify(value));
						populateDataPreviewSection(value.format, value ,$container);
					});
					
					isLayoutDirty = false;
				} else {
					addContainer();
				}
				
				$loadingText.trigger("show", {
					text: 'opened layout'
				});
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
				var saveLayoutData = buildSaveLayout();
				var $saveLink = $genTemplatePage.find(".save-to-local")[0];
				$saveLink.href = baseUrl + "/api/template/generate?layoutjson="+JSON.stringify(saveLayoutData)+"&title="+saveLayoutData['docName'];
				$loadingText.trigger("show", {
					text: 'Generating template. This might take a while. Please wait...',
				});
				$saveLink.click();
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
				clearDataSelectionPage();
			}
			
			function handleChangingFormat(e) {
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
					$(e.target).closest('div.section-container').find(".data-selection-btn").addClass("hide");
					$(e.target).closest('div.section-container').find(".preview-data-selected").attr('placeholder', 'Please enter static text here');
					$(e.target).closest('div.section-container').find(".preview-data-selected").focus();
				} else if(oldFormat == 'static-text' && (newFormat == 'table' || newFormat == 'paragraph')){
					clearSectionContainer($(e.target).closest('div.section-container'));
					$(e.target).closest('div.section-container').find(".preview-data-selected").attr('contenteditable' , "false");
					$(e.target).closest('div.section-container').find(".data-selection-btn").removeClass("hide");
					$(e.target).closest('div.section-container').find(".preview-data-selected").attr('placeholder', '');
				} else {
					var dataSelectionJson = $container.attr('selected-metadata');
					if(dataSelectionJson) {
						populateDataPreviewSection(newFormat, jQuery.parseJSON(dataSelectionJson), $container);
					}
				}
				
				if(newFormat == 'table' || newFormat == 'paragraph') {
					$genTemplatePage.find('#' + newFormat + '-format').click();
				}
			}
			
			function clearSectionContainer($sectionContainer){
				$sectionContainer.find(".title").empty();
				$sectionContainer.find(".preview-data-selected").empty();
				$sectionContainer.attr('selected-metadata','');
			}

			function hideContainerActionIcons(e) {
				$(e.target).closest('.section-container').find("#display-on-hover").addClass("hide");
			}

			function displayContainerActionIcons(e) {
				$(e.target).closest('.section-container').find("#display-on-hover").removeClass("hide");
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

			function handleDataSelection(e) {
				var $container = $(e.target).closest('div.section-container');
				var format = $container.find('.selectFormat').val();
				$genTemplatePage.find('#' + format + '-format').click();
				var url = $genTemplatePage.find(".input-url").val();
				if (url == '' || ($('.navigation-tree .data-selection-tree').is(':empty'))) {
					$genTemplatePage.find('.input-url').focus();
				} else {
					$genTemplatePage.find(".btn-select-data").off('click').click(populateDataPreview);
					clearDataSelectionPage();
					removeCheckboxFromParentNode();
					enableDisableTab('#data-selection', 'tab');
					enableDisableTab('#preview-design', '');
					toggleTab('#data-selection', 'show');
				}
				
				function populateDataPreview() {
					if($genTemplatePage.find(".input-ds-title").val()!='' || ($genTemplatePage.find(".selected-content .header-label").length > 0)){
						var format = 'table'; // paragraph table
						if ($genTemplatePage.find("#paragraph-format").hasClass('btn-primary')) {
							format = 'paragraph';
						}
						
						var dataSelectionJson = getSelectedMetadata(format);
						populateDataPreviewSection(format, dataSelectionJson, $container);
						
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
				
				if (format == 'paragraph') {
					var selectedItems = data['dataAttributes'] = [];
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
					var selectedItems = data['dataAttributes'] = [];
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
			
			function populateDataPreviewSection(format, dataSelectionJson, $container) {
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
						var xmlDataJson = getJSONobjByPath(dataSelectionJson.dataAttributes[0].query);;
						// dataSelectionPageLimit
						var limit = xmlDataJson.length;
						if(limit > previewPageLimit){
							limit = previewPageLimit;
						}
						var json = null;
						for(var k = 0; k < limit; k++) {
							$paragraphContainerTemplate = $('<div class="paragraph-preview-selected-data"></div><br />');
							$previewContainerData.append($paragraphContainerTemplate);
							$paragraphContainerTemplate = $paragraphContainerTemplate.eq(0);
										
							$.each(dataSelectionJson.dataAttributes, function(index, value) {
								json = {
									query : value.dataQuery,
									name : value.label,
									data : xmlDataJson[k][value.query.substring(value.query.lastIndexOf('/') + 1)]
								};
	
								populateParagraphPreview(json, $paragraphContainerTemplate);
							});
						}
					}
				} else if(format == 'table') {
					var $previewContainerData = $container.find(".preview-data-selected");
					$previewContainerData.empty();
					containerDisplayOnHoverAction(".table-data-selection");
					$previewContainerData.html(_.template($("#preview-container-empty-template").html()));
					
					if(dataSelectionJson && dataSelectionJson.dataAttributes && dataSelectionJson.dataAttributes.length > 0) {
						var xmlDataJson = getJSONobjByPath(dataSelectionJson.dataAttributes[0].query);;
						var limit = xmlDataJson.length;
						if(limit > previewPageLimit){
							limit = previewPageLimit;
						}
						var json = null;
						$.each(dataSelectionJson.dataAttributes, function(index, value) {
							
							json = {
								query : value.dataQuery,
								name : value.label,
							};
							populateHeaderCell(json,'#preview-header-column-template',$previewContainerData.find('.preview-container-table'));
						});
						populateDataRowsPreview(dataSelectionJson , $previewContainerData.find('.preview-container-table'));
					}
				} else if(format == 'static-text'){
					var $previewContainerData = $container.find(".preview-data-selected");
					$previewContainerData.empty();
					containerDisplayOnHoverAction(".preview-data-selected");
					$previewContainerData.attr('contenteditable' , "true");
					$previewContainerData.text(dataSelectionJson['staticContent']);
				}
			}
			
			function populateDataRowsPreview(dataSelectionJson , $containerTable) {
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

				for ( var k = 0; k < dataLength; k++) {
					var $row = $('<tr></tr>');
					$containerTable.find("tbody").append($row);
					var dataRow = jsonObj[k];
					$.each(selectedTreeItems, function(index, value) {
						jsonData = {
							data : dataRow[value]
						};
						populateDataCell($row, jsonData);
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

			function populateParagraphPreview(data, $containerTable) {
				var rowTemplate = _.template($('#preview-paragraph-row-template').html());
				$containerTable.append(rowTemplate(data));
			}
			
			function clearDataSelectionPage() {
				$(".table-data-selection thead").empty();
				$(".table-data-selection tbody").empty();
				$(".input-ds-title").val('');
				$(".input-ds-title").attr('data-query','');
				$(".paragraph-data-selection").empty();
				
				$.each($genTemplatePage.find(".navigation-tree .data-selection-tree .jstree-clicked"),function(index, value) {
					$(this).click();
				});
				
				$.each($genTemplatePage.find(".navigation-tree .data-selection-tree .jstree-node.jstree-open"),function(index, value) {
					$(this).find('.jstree-icon.jstree-ocl')[0].click();
				});
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

						if($genTemplatePage.find(".table-data-selection thead th").length > 0) {
							existingContext = $genTemplatePage.find(".table-data-selection thead th").first().attr('data-query');
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

						populateHeaderCell(json, '#data-selection-header-column-template', $genTemplatePage.find('.table-data-selection'));
						$genTemplatePage.find(".no-edit-title").off('click') .click(handleEditTitle);

						populateDataRows($genTemplatePage.find('.table-data-selection'));
					} else {
						$node.click();
						alert(messages.warning_parentNodeSelected);
					}
				} else {
					if (selectedElement.closest('li').hasClass('jstree-leaf')) {
						var xPath = getSelectElementXPath(selectedElement);

						// remove all table headrs
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
					}
				}
			}

			function populateDataRows($containerTable) {
				var selectedTreeItems = [];
				var xpath = null;
				$.each($genTemplatePage.find('.table-data-selection thead th'),
					function(index, value) {
						var tableHeader = $(this).attr('data-query');
						if (xpath == null) {
							xpath = tableHeader;
						}
						selectedTreeItems.push(tableHeader.substring(tableHeader.lastIndexOf('/') + 1));
					});

				pathArray = xpath.split('/');
				var jsonObj = null;
				for ( var i = 0; i < pathArray.length - 1; i++) {
					if (jsonObj == null) {
						jsonObj = jQuery.parseJSON($genTemplatePage.find(
								'.xml-as-json').attr('data-xmljson'))[pathArray[i]];
					} else {
						jsonObj = jsonObj[pathArray[i]];
					}
				}

				$containerTable.find("tbody").empty();

				var jsonData;
				var dataLength = jsonObj.length;
				if (dataLength > dataSelectionPageLimit) {
					dataLength = dataSelectionPageLimit;
				}

				for ( var k = 0; k < dataLength; k++) {
					var $row = $('<tr></tr>');
					$containerTable.find("tbody").append($row);
					var dataRow = jsonObj[k];
					$.each(selectedTreeItems, function(index, value) {
						jsonData = {
							data : dataRow[value]
						};
						populateDataCell($row, jsonData);
					});
				}
			}

			function populateHeaderCell(data, templateName, $containerTable) {
				var columnHeaderTemplate = _.template($(templateName).html());
				$containerTable.find("thead")
						.append(columnHeaderTemplate(data));
			}

			function populateDataSelectionParagraph(e) {
				var $node = $(e.target);
				var selectedElement = $node;
				if($node.prop('tagName') != 'A') {
					selectedElement = $node.parent();
				}
				if (selectedElement.hasClass('jstree-clicked')) {
					if (selectedElement.closest('li').hasClass('jstree-leaf')) {
						var json = {
							name : selectedElement.closest('a').text(),
							query : getSelectElementXPath(selectedElement)
						};

						var xpath = null;
						var isNewParagraphContainer = true;
						if ($genTemplatePage
								.find("div.paragraph-data-selection .data-selection-paragraph").length > 0) {
							isNewParagraphContainer = false;
						}

						xpath = json.query;

						pathArray = xpath.split('/');
						var jsonObj = null;
						for ( var i = 0; i < pathArray.length - 1; i++) {
							if (jsonObj == null) {
								jsonObj = jQuery.parseJSON($genTemplatePage
										.find('.xml-as-json').attr(
												'data-xmljson'))[pathArray[i]];
							} else {
								jsonObj = jsonObj[pathArray[i]];
							}
						}

						var jsonData;
						var dataLength = jsonObj.length;
						if (dataLength > dataSelectionPageLimit) {
							dataLength = dataSelectionPageLimit;
						}

						for ( var k = 0; k < dataLength; k++) {
							var dataRow = jsonObj[k];
							jsonData = {
								name : json.name,
								query : json.query,
								data : dataRow[json.name]
							};

							var $paragraphConatinerTemplate = null;
							var addEdit = false;
							if (isNewParagraphContainer) {
								$paragraphConatinerTemplate = $('<div class="data-selection-paragraph-container"></div><br />');
								$genTemplatePage.find(".paragraph-data-selection").append($paragraphConatinerTemplate);
								$paragraphConatinerTemplate = $paragraphConatinerTemplate.eq(0);
							} else {
								$paragraphConatinerTemplate = $genTemplatePage.find(".data-selection-paragraph-container").eq(k);
							}

							if (k == 0) {
								addEdit = true;
							} else {
								addEdit = false;
							}

							populateParagraph(jsonData, $paragraphConatinerTemplate, addEdit);
						}

						var newContext = json.query;
						var existingContext = null;

						$.each($genTemplatePage.find(".data-selection-paragraph div"), function(index, value) {
							existingContext = $(this).attr('data-query');
						});

						if (existingContext != null) {
							if (existingContext.indexOf('/') != -1) {
								existingContext = existingContext.substring(0, existingContext.lastIndexOf('/'));
							}

							if (newContext.indexOf('/') != -1) {
								newContext = newContext.substring(0, newContext.lastIndexOf('/'));
							}

							if (existingContext != newContext) {
								$node.click();
								alert(messages.treeItem_differentContext);
								return;
							}
						}

						$genTemplatePage.find(".no-edit-title").off('click').click(handleEditTitle);
					} else {
						$node.click();
						alert(messages.warning_parentNodeSelected);
					}
				} else if (selectedElement.closest('li').hasClass('jstree-leaf')) {
					var xPath = getSelectElementXPath(selectedElement);
					$.each($genTemplatePage.find(".data-selection-paragraph"),
						function(index, value) {
							if (xPath == $(this).find(".header-label")
									.attr('data-query')) {
								$(this).remove();
							}
						});
				}

				if ($genTemplatePage.find(".paragraph-data-selection .data-selection-paragraph").length == 0) {
					$genTemplatePage.find(".paragraph-data-selection").empty();
				}
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
				$genTemplatePage.find(".scroll-content").append(containerTemplate());
				$genTemplatePage.find(".add-container").off('click').click(addContainer);
				$genTemplatePage.find(".delete-container").off('click').click(deleteContainer);
				$genTemplatePage.find(".data-selection-btn").off('click').click(handleDataSelection);
				$genTemplatePage.find(".clear-section").off('click').click(handleClearSection);

				containerDisplayOnHoverAction(".section-container");
				$genTemplatePage.find(".selectFormat").off('change').change(handleChangingFormat);
				
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

			function populateDataCell($tr, data) {
				var columnDataTemplate = _.template($(
						"#data-selection-data-column-template").html());
				$tr.append(columnDataTemplate(data));
			}

			function hideAllPredefinedTemplates() {
				$.each($genTemplatePage.find('.tree-toggler'), function(ind,
						val) {
					this.click();
				});
			}

			function handleSelectionTree(e) {
				var urlInput = $genTemplatePage.find(".input-url").val();
				if(urlInput == '') {
					alert('URL is mandatory');
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

			function populateTree(jsonTreeData) {
				clearNavigationTree();

				// ajax call to xmltojson
				var urlInput = $genTemplatePage.find(".input-url").val();
				$.ajax({
					url : baseUrl + "/api/utils/xmltojson",
					data : {
						url : urlInput
					},
					method : 'GET',
					success : function(result) {
						$(".xml-as-json").attr('data-xmlJson',
								JSON.stringify(result));
					},
					error: function(xhr, error) {
						$loadingText.trigger("show", {
							text : xhr.responseText
						});
					}
				});

				$genTemplatePage
						.find('.navigation-tree .data-selection-tree')
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
										"keep_selected_style" : false
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
				$genTemplatePage.off("click.jstree", "i.jstree-icon.jstree-ocl").on("click.jstree", "i.jstree-icon.jstree-ocl", removeCheckboxFromParentNode);
				
				$loadingText.trigger("show", {
					text: messages.navigatorTreeLoaded
				});
			}
			
			function handleFormatDataSelection(e){
				if($(e.target).attr('id') == 'table-format') {
					$genTemplatePage.find("#paragraph-format").removeClass("btn-primary").addClass("btn-default");
					$(e.target).addClass("btn-primary").removeClass("btn-default");
					$genTemplatePage.off("click.jstree", ".jstree-anchor").on("click.jstree", ".jstree-anchor", handleTreeNodeCheck);
				} else if($(e.target).attr('id') == 'paragraph-format') {
					$genTemplatePage.find("#table-format").removeClass("btn-primary").addClass("btn-default");
					$(e.target).addClass("btn-primary").removeClass("btn-default");
					$genTemplatePage.off("click.jstree", ".jstree-anchor").on("click.jstree", ".jstree-anchor", populateDataSelectionParagraph);
				}
				clearDataSelectionPage();
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
			
			function removeCheckboxFromParentNode(e) {
				$.each($genTemplatePage.find('.navigation-tree .jstree li[aria-expanded]').not('.jstree-leaf'), function(ind, val) {
					$(this).children().first().next().find('.jstree-icon.jstree-checkbox').addClass('hide');
				});
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

			addContainer();
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
