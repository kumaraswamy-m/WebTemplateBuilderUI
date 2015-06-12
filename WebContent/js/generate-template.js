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
				$genTemplatePage.find(".tab").off('click').click(toggleUnderlineColor);
				$genTemplatePage.find(".highlight").off('click').click(toggleColor);

				$genTemplatePage.find(".input-xml-go").click(
						handleSelectionTree);
				$genTemplatePage.on('blur', 'input', changeTitle);
				$genTemplatePage.find(".add-container").off('click').click(addContainer);
				$genTemplatePage.find(".delete-container").off('click').click(deleteContainer);
				$genTemplatePage.find(".data-selection-btn").off('click').click(handleDataSelection);
				$genTemplatePage.find(".container-action").mouseenter(handleContainerFooterBarDisplay);
				$genTemplatePage.find(".container-action").mouseleave(toggleContainerFooterBar);
			}
			
			function toggleContainerFooterBar(e){
				$(e.target).find("#display-on-hover").addClass("hide");
			}
			
			function handleContainerFooterBarDisplay(e){
				$(e.target).find("#display-on-hover").removeClass("hide");
			}
			
			function handleDataSelection(e){
				var $container = $(e.target).closest('div.section-container');
				var url = $genTemplatePage.find(".input-url").val();
				if(url == '' || ($('.data-selection-tree').is(':empty'))){
					$genTemplatePage.find('.input-url').focus();
				} else {
					$genTemplatePage.find(".btn-select-data").off('click').click(populateDataPreview);
					clearDataSelectionPage();
					$genTemplatePage.find('.design-tabs a[href="#data-selection"]').tab('show');
				}
				
				function populateDataPreview(){
					// $(".table-data-selection").clone(true).prependTo($container.find(".text-area")); preview-data-selected
					
					var $previewContainerData = $container.find(".text-area .preview-data-selected");
					
					$previewContainerData.html(_.template($("#preview-container-empty-template").html()));
					
					
					$.each($genTemplatePage.find('.table-data-selection thead th'),
							function(index, value) {
								var json = {
										query: $(this).attr('data-query'),
										name: $(this).find('.title').text()
								};
								populateHeaderCell(json, '#preview-header-column-template', $previewContainerData.find('.preview-container-table'));
							});
					
					
					populateDataRows($previewContainerData.find('.preview-container-table'));
					
					$genTemplatePage.find('.design-tabs a[href="#preview-design"]').tab('show');
				}
			}
			
			function clearDataSelectionPage() {
				$(".table-data-selection thead").empty();
				$(".table-data-selection tbody").empty();
				
				$.each($genTemplatePage.find(".data-selection-tree .jstree-clicked"),
					function(index, value) {
						$(this).click();
					});
			}
			
			function changeTitle(e) {
				var $th = $(event.target).closest("th");
				var $val = $genTemplatePage.find(".editable").val();
				$th.find(".title").removeClass("hide").addClass("show");
				$th.find(".title").replaceWith($('<span />').addClass("title").html($val));
				$th.find(".editable").remove();
			}
			
			function handleEditTitle(e) {
				var $th = $(event.target).closest("th");
				var input = $('<input />', {
					'type' : 'text',
					'name' : 'unique',
					'class' : 'editable',
					'value' : $th.find(".title").html()
				});
				$th.find(".title").parent().append(input);
				$th.find(".title").addClass("hide").removeClass("show");
				input.focus();
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

						$.each($genTemplatePage .find(".table-data-selection thead th"),
							function(index, value) {
								existingContext = $(this).attr('data-query');
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

						populateHeaderCell(json, '#data-selection-header-column-template', $genTemplatePage.find('.table-data-selection'));
						$genTemplatePage.find(".no-edit-title").off('click').click(handleEditTitle);
						
						populateDataRows($genTemplatePage.find('.table-data-selection'));
						
					} else {
						$node.click();
						alert(messages.warning_parentNodeSelected);
					}
				} else {
					if ($node.closest('li').hasClass('jstree-leaf')) {
						var xPath = getSelectElementXPath($node.parent());
						
						var headerIndex = null;
						$.each($genTemplatePage.find(".table-data-selection thead th"),
								function(index, value) {
									if (xPath == $(this).attr('data-query')) {
										$(this).remove();
										headerIndex = index;
									}
								});
						
						$.each($genTemplatePage.find(".table-data-selection tbody tr"),
								function(index, value) {
									$.each($(this).find('td'), function(ind, val) {
										if(ind == headerIndex) {
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
							if(xpath == null) {
								xpath = tableHeader;
							}
							selectedTreeItems.push(tableHeader.substring(tableHeader.lastIndexOf('/')+1));
						});

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

				$containerTable.find("tbody").empty();
				
				var jsonData;
				var dataLength = jsonObj.length;
				if(dataLength > 10) {
					dataLength = 10;
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
				var columnHeaderTemplate = _.template($(
						templateName).html());
				$containerTable.find("thead").append(
						columnHeaderTemplate(data));
			}
			
			function addContainer(e){
				if(($genTemplatePage.find(".section-container")).length == 1){
					$genTemplatePage.find(".delete-container").addClass("hide");
				}
				$(e.target).closest('div').find(".delete-container").removeClass("hide");
				var containerTemplate = _.template($("#preview-design-format-container-template").html());
				$genTemplatePage.find(".scroll-content").append(containerTemplate());
				$genTemplatePage.find(".add-container").off('click').click(addContainer);
				$genTemplatePage.find(".delete-container").off('click').click(deleteContainer);
				$genTemplatePage.find(".data-selection-btn").off('click').click(handleDataSelection);
				$genTemplatePage.find(".container-action").mouseleave(toggleContainerFooterBar);
				$genTemplatePage.find(".container-action").mouseenter(handleContainerFooterBarDisplay);
				return;
			}
			
			function populateDefaultContainer() {
				$genTemplatePage.find('#preview-main-content').append(_.template($("#preview-design-format-container-template").html()));
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
				var columnDataTemplate = _.template($("#data-selection-data-column-template").html());
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
					url : baseUrl + "/api/xmltojson/schema",
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
					url : baseUrl + "/api/xmltojson",
					data : {
						url : urlInput
					},
					method : 'GET',
					success : function(result) {
						$(".xml-as-json").attr('data-xmlJson',
								JSON.stringify(result));
					}
				});

				$('.data-selection-tree').empty();
				$('.data-selection-tree')
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
						}).on(
						'dnd_stop.vakata',
						function(e, data) {
							var t = $(data.event.target);
							if (!t.closest('.jstree').length) {
								if (t.closest('.drop').length) {
									var path = getSelectElementXPath($(
											data.element).parent());

									path += '/' + $(data.element)[0].text;
									t.closest('.drop').val(path);
								}
							}
						});

				$genTemplatePage.off("click.jstree", ".jstree-anchor").on("click.jstree", ".jstree-anchor",
						handleDataSelectionCheck);

				$loadingText.trigger("show", {
					text : messages.navigatorTreeLoaded
				});
			}

			populateDefaultContainer();
			attachHandlers();
			getPredefinedTemplates();
			

			$genTemplatePage.find(".input-url").val('http://localhost:8080/rpet/template/data/requisitepro.xml');
			handleSelectionTree();
		});