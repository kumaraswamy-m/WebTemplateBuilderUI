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

			var baseUrl = window.location.protocol + '//'
					+ window.location.host + $(document).data("context_path");
			var $genTemplatePage = $("#generate-template-page");
			var $loadingText = $(".docUI .loading-text");
			
			var dataSelectionPageLimit = 10;
			var previewPageLimit = 5;

			function getPredefinedTemplates(json) {
				if (!json) {
					json = [ {
						"id" : "default",
						"name" : "Default"
					}, {
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
					}, {
						"id" : null,
						"name" : "Presentations",
						"items" : [ {
							"id" : null,
							"name" : "PR 1"
						}, {
							"id" : null,
							"description" : "",
							"name" : "PR 2"
						}, {
							"id" : null,
							"description" : "Presentation category",
							"name" : "PR 3"
						} ]
					}, {
						"id" : null,
						"name" : "Legal",
						"items" : [ {
							"id" : null,
							"name" : "Finance"
						}, {
							"id" : null,
							"description" : "",
							"name" : "HR"
						}, {
							"id" : null,
							"description" : "Presentation category",
							"name" : "Google"
						} ]
					} ];
				}

				populatePredefinedTemplates(json);
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
						if (value.id == 'default') {
							var defaultTreeItemTemplate = _.template($(
									"#nav-tree-item-default-template").html());
							category = defaultTreeItemTemplate(value);
						} else {
							category = navTreeCategoryTemplate(value);
							var treeItems = '';
							$.each(value.items, function(itemIndex, itemValue) {
								treeItems += treeItemTemplate(itemValue);
							});

							category = category.replace("%NAV_TREE_ITEMS%",
									treeItems);
						}
						$genTemplatePage.find("#docUINav .nav-parent").append(
								category);
					});

					attachItemHandlers();
				} else {

				}
			}

			function attachItemHandlers() {
				$genTemplatePage.find(".tree-toggler").off('click').click(
						togglePredefinedTemplateTree);
				$genTemplatePage.find(".tree-item").off('click').click(
						toggleBackground);
				hideAllPredefinedTemplates();
			}

			function attachHandlers() {
				$genTemplatePage.find(".tab").off('click').click(
						toggleUnderlineColor);
				$genTemplatePage.find(".highlight").off('click').click(
						toggleColor);

				$genTemplatePage.find(".input-xml-go").click(
						handleSelectionTree);
				$genTemplatePage.on('blur', 'input', updateHeaderLabel);
				$genTemplatePage.find(".add-container").off('click').click(
						addContainer);
				$genTemplatePage.find(".delete-container").off('click').click(
						deleteContainer);
				$genTemplatePage.find(".data-selection-btn").off('click')
						.click(handleDataSelection);
				$genTemplatePage.find(".select-global-menu").off('change')
						.change(handleInsertGlobal);
				$genTemplatePage.find(".selectFormat").off('change').change(handleChangingFormat);
			}
			
			function handleChangingFormat(e) {
				$container  = $(e.target).closest('div.section-container');
				var format = $(e.target).val();
				var dataSelectionJson = $container.attr('selected-metadata');
				populateDataPreviewSection(format, jQuery.parseJSON(dataSelectionJson), $container);
			}

			function toggleContainerFooterBar(e) {
				$(e.target).find("#display-on-hover").addClass("hide");
			}

			function handleContainerFooterBarDisplay(e) {
				$(e.target).find("#display-on-hover").removeClass("hide");
			}

			function handleInsertGlobal(e) {
				if ($(e.target).val() == 'toc') {
					if ($genTemplatePage.find('#preview-main-content .toc').length > 0) {
						alert('Table of contents is already added.');
						$(e.target).val('');
						return;
					} else {
						$genTemplatePage.find('#preview-main-content').prepend(
								_.template($("#table-of-contents-template")
										.html()));
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
				var url = $genTemplatePage.find(".input-url").val();
				if (url == ''
						|| ($('.navigation-tree .data-selection-tree')
								.is(':empty'))) {
					$genTemplatePage.find('.input-url').focus();
				} else {
					$genTemplatePage.find(".btn-select-data").off('click').click(populateDataPreview);
					clearDataSelectionPage();
					$genTemplatePage.find('.design-tabs a[href="#data-selection"]').tab('show');
				}
				
				// metadata function
				
				function populateDataPreview() {
					var format = null; // paragraph table
					if ($genTemplatePage.find(".data-selection-paragraph-container").length > 0) {
						format = 'paragraph';
					} else if($genTemplatePage.find('.table-data-selection thead th').length > 0) {
						format = 'table';
					}
					var dataSelectionJson = getSelectedMetadata(format);
					populateDataPreviewSection(format, dataSelectionJson, $container);
					
					$container.attr('selected-metadata', JSON.stringify(dataSelectionJson));
					
					$genTemplatePage.find('.design-tabs a[href="#preview-design"]').tab('show');
				}
			}
			
			function getSelectedMetadata(format) {
				var data = {};
				data['title'] = $genTemplatePage.find('.selected-content .input-ds-title').val();
				data['titleQuery'] = $genTemplatePage.find('.selected-content .input-ds-title').attr('data-query');
				
				if (format == 'paragraph') {
					var selectedItems = data['selectedItems'] = [];
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
					var selectedItems = data['selectedItems'] = [];
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
				$container.find('.input-preview-section-title').val(dataSelectionJson['title']); 
				$container.find('.input-preview-section-title').attr('title-query', dataSelectionJson['titleQuery']);
				if (format == 'paragraph') {
					var $previewContainerData = $container.find(".text-area .preview-data-selected");
					$previewContainerData.empty();
					containerDisplayOnHoverAction(".paragraph-data-selection");
					
					var xmlDataJson = getJSONobjByPath(dataSelectionJson.selectedItems[0].query);;
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
									
						$.each(dataSelectionJson.selectedItems, function(index, value) {
									
									json = {
										query : value.dataQuery,
										name : value.label,
										data : xmlDataJson[k][value.query.substring(value.query.lastIndexOf('/') + 1)]
									};
	
									populateParagraphPreview(json, $paragraphContainerTemplate);
								});
					}
				} else if(format == 'table') {
					var $previewContainerData = $container.find(".text-area .preview-data-selected");
					$previewContainerData.empty();
					containerDisplayOnHoverAction(".table-data-selection");
					$previewContainerData.html(_.template($("#preview-container-empty-template").html()));
					
					var xmlDataJson = getJSONobjByPath(dataSelectionJson.selectedItems[0].query);;
					var limit = xmlDataJson.length;
					if(limit > previewPageLimit){
						limit = previewPageLimit;
					}
					var json = null;
						$.each(dataSelectionJson.selectedItems, function(index, value) {
							
							json = {
								query : value.dataQuery,
								name : value.label,
							};
							populateHeaderCell(json,'#preview-header-column-template',$previewContainerData.find('.preview-container-table'));
						});
						populateDataRowsPreview(dataSelectionJson , $previewContainerData.find('.preview-container-table'));
				}
			}
			
			function populateDataRowsPreview(dataSelectionJson , $containerTable) {
				var selectedTreeItems = [];
				var xpath = null;
				$.each(dataSelectionJson.selectedItems,
						function(index, value) {
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
				$(".data-selection-paragraph-container").empty();
				$.each(
								$genTemplatePage
										.find(".navigation-tree .data-selection-tree .jstree-clicked"),
								function(index, value) {
									$(this).click();
								});
			}

			function updateHeaderLabel(e) {
				var $th = null;
				var label = $genTemplatePage.find("input.editable").val();
				if ($(event.target).closest(".header-label").closest(
						".paragraph-data-selection")) {
					$th = $genTemplatePage.find(".header-label");
				} else {
					var $th = $(event.target).closest(".header-label");
				}

				var dataQuery = $(event.target).closest(".header-label").attr(
						'data-query');

				$.each($th, function(ind, val) {
					if (dataQuery == $(this).attr('data-query')) {
						$(this).find(".title").removeClass('hide').html(label);
						$(this).find("input.editable").remove();
					}
				});
			}

			function handleEditTitle(e) {
				var $th = $(event.target).closest(".header-label");
				var input = $('<input />', {
					'type' : 'text',
					'name' : 'unique',
					'class' : 'editable form-control',
					'value' : $th.find(".title").html()
				});
				$th.find(".title").parent().append(input);
				$th.find(".title").addClass("hide").removeClass("show");
				input.focus();

				/*
				 * var updateHeaders = false; var $headers = null; var label =
				 * null;
				 * if($(event.target).closest(".header-label").closest(".paragraph-data-selection")){
				 * $headers = $genTemplatePage.find(".header-label"); label =
				 * $headers.first().text(); updateHeaders = true; }
				 * 
				 * $.each($headers , function(ind, val){
				 * if($(event.target).closest(".header-label").attr('data-query')==$(this).attr('data-query')) {
				 * var input = $('<input />', { 'type' : 'text', 'name' :
				 * 'unique', 'class' : 'editable', 'value' :
				 * $(this).find(".title").html() });
				 * $(this).find(".title").parent().append(input);
				 * $(this).find(".title").addClass("hide").removeClass("show");
				 * input.focus(); } });
				 */
			}

			function toggleColor(e) {
				e.preventDefault();
				$genTemplatePage.find(".highlight").removeClass(
						"btn-primary btn-default").addClass("btn-default");
				$(e.target).removeClass("btn-default btn-primary").addClass(
						"btn-primary");
			}
			function toggleUnderlineColor(e) {
				e.preventDefault();
				$genTemplatePage.find(".label").removeClass(
						"selected unselected").addClass("unselected");
				$(e.target).removeClass("unselected selected").addClass(
						"selected");
			}
			function toggleBackground(e) {
				e.preventDefault();
				$genTemplatePage.find(".selectedItem").removeClass("mouseIn")
						.addClass("mouseOut");
				$(e).removeClass("mouseOut mouseIn selectedItem").addClass(
						"mouseIn selectedItem");
			}
			
			function togglePredefinedTemplateTree(e) {
				e.preventDefault();
				var $tree = $(e.target);

				while (!$tree.hasClass("tree-toggler")) {
					$tree = $tree.parent();
				}

				$tree.parent().children('ul.tree').toggle(200);
			}
			
			function handleDataSelectionCheck(e) {
				var $node = $(e.target);
				if ($node.parent().hasClass('jstree-clicked')) {
					if ($node.closest('li').hasClass('jstree-leaf')) {
						var json = {
							name : $node.closest('a').text(),
							query : getSelectElementXPath($node.parent())
						};
						var newContext = json.query;
						var existingContext = null;

						$.each($genTemplatePage
								.find(".table-data-selection thead th"),
								function(index, value) {
									existingContext = $(this)
											.attr('data-query');
								});

						if (existingContext != null) {
							if (existingContext.indexOf('/') != -1) {
								existingContext = existingContext.substring(0,
										existingContext.lastIndexOf('/'));
							}

							if (newContext.indexOf('/') != -1) {
								newContext = newContext.substring(0, newContext
										.lastIndexOf('/'));
							}

							if (existingContext != newContext) {
								$node.click();
								alert('Different context');
								return;
							}
						}

						populateHeaderCell(json,
								'#data-selection-header-column-template',
								$genTemplatePage.find('.table-data-selection'));
						$genTemplatePage.find(".no-edit-title").off('click')
								.click(handleEditTitle);

						populateDataRows($genTemplatePage.find('.table-data-selection'));

					} else {
						$node.click();
						alert(messages.warning_parentNodeSelected);
					}
				} else {
					if ($node.closest('li').hasClass('jstree-leaf')) {
						var xPath = getSelectElementXPath($node.parent());

						var headerIndex = null;
						$.each($genTemplatePage
								.find(".table-data-selection thead th"),
								function(index, value) {
									if (xPath == $(this).attr('data-query')) {
										$(this).remove();
										headerIndex = index;
									}
								});

						$.each($genTemplatePage
								.find(".table-data-selection tbody tr"),
								function(index, value) {
									$.each($(this).find('td'), function(ind,
											val) {
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
							selectedTreeItems
									.push(tableHeader.substring(tableHeader
											.lastIndexOf('/') + 1));
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
				if ($node.parent().hasClass('jstree-clicked')) {
					if ($node.closest('li').hasClass('jstree-leaf')) {
						var json = {
							name : $node.closest('a').text(),
							query : getSelectElementXPath($node.parent())
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

						$.each($genTemplatePage
								.find(".data-selection-paragraph div"),
								function(index, value) {
									existingContext = $(this)
											.attr('data-query');
								});

						if (existingContext != null) {
							if (existingContext.indexOf('/') != -1) {
								existingContext = existingContext.substring(0,
										existingContext.lastIndexOf('/'));
							}

							if (newContext.indexOf('/') != -1) {
								newContext = newContext.substring(0, newContext
										.lastIndexOf('/'));
							}

							if (existingContext != newContext) {
								$node.click();
								alert('Different context');
								return;
							}
						}

						$genTemplatePage.find(".no-edit-title").off('click')
								.click(handleEditTitle);

					} else {
						$node.click();
						alert(messages.warning_parentNodeSelected);
					}
				}

				else if ($node.closest('li').hasClass('jstree-leaf')) {
					var xPath = getSelectElementXPath($node.parent());
					$.each($genTemplatePage.find(".data-selection-paragraph"),
							function(index, value) {
								if (xPath == $(this).find(".header-label")
										.attr('data-query')) {
									$(this).remove();
								}
							});
				}

				if ($genTemplatePage
						.find(".paragraph-data-selection .data-selection-paragraph").length == 0) {
					$genTemplatePage.find(".paragraph-data-selection").empty();
				}
			}
			function populateParagraph(data, $paraContainer, addEdit) {
				var paragraphTemplate = null;
				if (addEdit) {
					paragraphTemplate = _.template($(
							"#data-selection-paragraph-edit-div-template")
							.html());
				} else {
					paragraphTemplate = _.template($(
							"#data-selection-paragraph-div-template").html());
				}
				$paraContainer.append(paragraphTemplate(data));
			}

			function addContainer(e) {
				if (($genTemplatePage.find(".section-container")).length == 1) {
					$genTemplatePage.find(".delete-container").addClass("hide");
				}
				$(e.target).closest('div').find(".delete-container")
						.removeClass("hide");
				var containerTemplate = _.template($(
						"#preview-design-format-container-template").html());
				$genTemplatePage.find(".scroll-content").append(
						containerTemplate());
				$genTemplatePage.find(".add-container").off('click').click(
						addContainer);
				$genTemplatePage.find(".delete-container").off('click').click(
						deleteContainer);
				$genTemplatePage.find(".data-selection-btn").off('click')
						.click(handleDataSelection);

				containerDisplayOnHoverAction(".container-action");
				$genTemplatePage.find(".selectFormat").off('change').change(handleChangingFormat);
			}

			function populateDefaultContainer() {
				$genTemplatePage.find('#preview-main-content').append(
						_.template($(
								"#preview-design-format-container-template")
								.html()));
				$genTemplatePage.find(".delete-container").addClass("hide");
				containerDisplayOnHoverAction(".container-action");
			}

			function containerDisplayOnHoverAction(element) {
				$genTemplatePage.find(element).off('mouseenter').mouseenter(
						handleContainerFooterBarDisplay);
				$genTemplatePage.find(element).off('mouseleave').mouseleave(
						toggleContainerFooterBar);
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
				$.ajax({
					url : baseUrl + "/api/utils/xmltojsonschema",
					data : {
						url : urlInput
					},
					method : 'GET',
					success : function(result) {
						populateTree(result);
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
				$(".xml-as-json").attr('data-xmlJson', '');

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
					}
				});

				$genTemplatePage.find('.navigation-tree .data-selection-tree')
						.remove();

				$genTemplatePage.find('.navigation-tree').append(
						_.template($("#navigator-tree-div-template").html()));

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
											var path = getSelectElementXPath($(
													data.element).parent());

											path += '/'
													+ $(data.element)[0].text;
											t.closest('.drop').val(path);
											t.closest('.drop').attr(
													'data-query', path);
										}
									}
								});
				
				
				$genTemplatePage.find(".highlight").off('click').click(handleFormatDataSelection);
				

				 function handleFormatDataSelection(e){
					
					 
					 if($(e.target).attr('id') == 'table-format'){
						 clearDataSelectionPage();
						 
						 if( $genTemplatePage.find(".highlight.btn-primary").attr('id') == 'paragraph-format'){
							 $genTemplatePage.find(".highlight").removeClass("btn-primary").addClass("btn-default");
						 }
						 $(e.target).addClass("btn-primary").removeClass("btn-default");
						 $genTemplatePage.off("click.jstree", ".jstree-anchor").on("click.jstree", ".jstree-anchor", handleDataSelectionCheck);
						 
					 }
					 else if($(e.target).attr('id') == 'paragraph-format' && (!($(e.target).hasClass("active-btn")))){
						 clearDataSelectionPage();
						 if( $genTemplatePage.find(".highlight.btn-primary").attr('id') == 'table-format'){
							 $genTemplatePage.find(".highlight").removeClass("btn-primary").addClass("btn-default");
						 }
						 $(e.target).addClass("btn-primary").removeClass("btn-default");
						 $genTemplatePage.off("click.jstree", ".jstree-anchor").on("click.jstree", ".jstree-anchor", populateDataSelectionParagraph);
					 }
				 }
				 
				 
					 $genTemplatePage.off("click.jstree", ".jstree-anchor").on("click.jstree", ".jstree-anchor", handleDataSelectionCheck);
				 
					 $genTemplatePage.find(".save-layout").off('click').click(handleSaveLayout);
					 
					 function handleSaveLayout(e){
						var saveLayoutData = {};
						saveLayoutData['docName'] = $genTemplatePage.find(".document-title").val();
						saveLayoutData['xmlUrl'] = $genTemplatePage.find(".input-url").val();
						 var containerData = saveLayoutData['containerData'] = [];
						 $.each($genTemplatePage.find(".section-container"),function(index, value){
							 var container = {};
								container['container-selected-metadata'] = $(this).attr('selected-metadata');
								containerData.push(container);
						 });
						 alert(JSON.stringify(saveLayoutData));
					 }
				
				$loadingText.trigger("show", {
					text : messages.navigatorTreeLoaded
				});
			}

			populateDefaultContainer();
			attachHandlers();
			getPredefinedTemplates();

			$genTemplatePage.find(".input-url").val(
					'http://localhost:8080/rpet/template/data/requisitepro.xml');
			// $genTemplatePage.find(".input-url").val('http://localhost:8080/rpet/template/data/rss.xml');
			handleSelectionTree();
		});