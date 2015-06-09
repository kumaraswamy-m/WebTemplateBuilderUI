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
				$genTemplatePage.find(".tab").click(toggleUnderlineColor);
				$genTemplatePage.find(".highlight").click(toggleColor);

				$genTemplatePage.find(".input-xml-go").click(
						handleSelectionTree);
				$genTemplatePage.find(".get-data").click(handleGetData);
				$genTemplatePage.on('blur', 'input', changeTitle);

			}
			function changeTitle(e) {
				var $th = $(event.target).closest("th");
				var $val = $genTemplatePage.find(".editable").val();
				$th.find(".title").removeClass("hide").addClass("show");
				$th.find(".title").replaceWith(
						$('<span />').addClass("title").html($val));
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
			function handleGetData(e) {
				e.preventDefault();
				var $data = $genTemplatePage.find(".drop").val();
				alert($data);

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

						populateDataSelection(json);
						$genTemplatePage.find(".no-edit-title").off('click').click(handleEditTitle);
						
						var selectedTreeItems = [];
						$.each($genTemplatePage.find('.table-data-selection thead th'),
								function(index, value) {
									var tableHeader = $(this).attr('data-query');
									selectedTreeItems.push(tableHeader.substring(tableHeader.lastIndexOf('/')+1));
								});

						var xpath = getSelectElementXPath($node.parent());
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
						
						$genTemplatePage.find(".table-data-selection tbody").empty();
						var tr = '<tr></tr>';
						
						
						var jsonData;
						var dataLength = jsonObj.length;
						if(dataLength > 10) {
							dataLength = 10;
						}
						
						for ( var k = 0; k < dataLength; k++) {
							var $row = $genTemplatePage.find(".table-data-selection tbody").append(tr);
							var dataRow = jsonObj[k];
							$.each(selectedTreeItems, function(index, value) {
								jsonData = {
									data : dataRow[value]
								};
								populateData($row, jsonData);
							});
						}
						
						$.each(jsonObj, function(ind, val) {
							// alert(val[json.name]);
							jsonData = {
								data : val[json.name]
							};
							populateData(jsonData);
						});

					} else {
						$node.click();
						alert(messages.warning_parentNodeSelected);
					}
				} else {
					if ($node.closest('li').hasClass('jstree-leaf')) {
						var xPath = getSelectElementXPath($node.parent());
						$.each($genTemplatePage
								.find(".table-data-selection thead th"),
								function(index, value) {
									if (xPath == $(this).attr('data-query')) {
										$(this).remove();
										return;
									}
								});
					}
				}
			}
			function populateDataSelection(data) {
				var columnHeaderTemplate = _.template($(
						"#data-selection-header-column-template").html());
				$genTemplatePage.find(".table-data-selection thead").append(
						columnHeaderTemplate(data));
				return;
			}
			
			function populateData($tr, data) {
				var columnDataTemplate = _.template($("#data-selection-data-column-template").html());
				// $genTemplatePage.find(".table-data-selection tbody").append(columnDataTemplate(data));
				$tr.append(columnDataTemplate(data));
				return;
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

				$genTemplatePage.on("click.jstree", ".jstree-anchor",
						handleDataSelectionCheck);

				$loadingText.trigger("show", {
					text : messages.navigatorTreeLoaded
				});
			}
			attachHandlers();
			getPredefinedTemplates();

			$genTemplatePage
					.find(".input-url")
					.val(
							'http://localhost:8080/rpet/template/data/requisitepro.xml');
			handleSelectionTree();
		});