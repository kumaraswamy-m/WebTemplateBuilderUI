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

require([ "i18n!nls/messages","jstree" ], function(messages,jstree) {

	_.templateSettings = {
		interpolate : /<@=([\s\S]+?)@>/g,
		evaluate : /<@([\s\S]+?)@>/g,
		escape : /<@-([\s\S]+?)@>/g
	};

	var baseUrl = window.location.protocol + '//' + window.location.host
			+ $(document).data("context_path");

	var $genTemplatePage = $("#generate-template-page");
	
	function getPredefinedTemplates(json) {
		if(!json) {
			json = 
				[{
					"id" : "default",
					"name" : "Default"
				},{
					"id" : null,
					"name" : "Engineering Documents",
					"items" : [{
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
						}
					]
				},{
					"id" : null,
					"name" : "Presentations",
					"items" : [{
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
						}
					]
				},{
					"id" : null,
					"name" : "Legal",
					"items" : [{
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
						}
					]
				}
			];
		}
		
		populatePredefinedTemplates(json);
	}
	
	function populatePredefinedTemplates(json) {
		$genTemplatePage.find("#docUINav .nav-parent").empty();
		if(json.length > 0)
		{
			var treeItemTemplate = _.template($("#nav-tree-item-template").html());
			var navDividerTemplate = _.template($("#nav-divider-template").html());
			var navTreeCategoryTemplate = _.template($("#nav-tree-category-template").html());
			
			$genTemplatePage.find("#docUINav .nav-parent").append(navDividerTemplate());
			
			$.each(json, function (index, value) {
				var category = null;
				if(value.id == 'default') {
					var defaultTreeItemTemplate = _.template($("#nav-tree-item-default-template").html());
					category = defaultTreeItemTemplate(value);
				} else {
					category = navTreeCategoryTemplate(value);
					var treeItems = '';
					$.each(value.items, function (itemIndex, itemValue) {
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
		$genTemplatePage.find(".tab").click(toggleUnderlineColor);
		$genTemplatePage.find(".highlight").click(toggleColor);
		
		$genTemplatePage.find(".input-xml-go").click(handleSelectionTree);
	}
	function toggleColor(e){
		e.preventDefault();
		$genTemplatePage.find(".highlight").removeClass("btn-primary btn-default").addClass("btn-default");
		$(e.target).removeClass("btn-default btn-primary").addClass("btn-primary");
	}
	function toggleUnderlineColor(e){
		e.preventDefault();
		$genTemplatePage.find(".label").removeClass("selected unselected").addClass("unselected");
		$(e.target).removeClass("unselected selected").addClass("selected");
	}
	function toggleBackground(e) {
		e.preventDefault();
		$genTemplatePage.find(".selectedItem").removeClass("mouseIn").addClass("mouseOut");
		$(e).removeClass("mouseOut mouseIn selectedItem").addClass("mouseIn selectedItem");
	}
	function togglePredefinedTemplateTree(e) {
		e.preventDefault();
		var $tree = $(e.target);

		while (!$tree.hasClass("tree-toggler")) {
			$tree = $tree.parent();
		}

		$tree.parent().children('ul.tree').toggle(200);
	}

	function hideAllPredefinedTemplates() {
		$.each($genTemplatePage.find('.tree-toggler'), function(ind, val) {
			this.click();
		});
	}
	
	function handleSelectionTree(e) {
		var urlInput = $genTemplatePage.find(".input-url").val();
		$.ajax({
			url : baseUrl + "/ReturnJson",
			data : {url: urlInput},
			method : 'GET',
			success : function(result) {
				alert(result);
				populateTree(result);
			}
		});
	}
	
	function populateTree(jsonTreeData) {
		$('.data-selection-tree')
		.jstree(
				{
					'plugins' : [ 'dnd' ],
					"dnd" : {
						drop_target : ".drop",
						drop_check : function(data) {
							return false;
						},
					},
					'core' : {
						'check_callback' : function(
								operation, node,
								node_parent,
								node_position, more) {
							if (operation === "move_node") {
								return node_parent.original.type === "Parent"; //only allow dropping inside nodes of type 'Parent'
							}
							return true; //allow all other operations
						},
						'themes' : {
							'dots' : false,
							'icons' : false
						},
						'data' : jsonTreeData
						// 'data' : ['Simple root node']
					}
				});
	}

	attachHandlers();
	getPredefinedTemplates();
});