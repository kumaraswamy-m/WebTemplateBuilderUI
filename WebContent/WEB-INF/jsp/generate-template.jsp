<%--
	Licensed Materials - Property of IBM
	(c) Copyright IBM Corporation 2015. All Rights Reserved.
	
	Note to U.S. Government Users Restricted Rights:
	Use, duplication or disclosure restricted by GSA ADP Schedule
	Contract with IBM Corp.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>


<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<c:set var="locale" value="${pageContext.request.locale}" />
<fmt:setBundle basename="com.ibm.rpe.web.template.ui.messages.UIMessages" />

<link rel="stylesheet" href="${contextPath}/css/generate-template.css">
<link rel="stylesheet" href="${contextPath}/css/style3.0.css" />

<script type="text/javascript">
	function show_bottomBar(containerNum) {
		$("." + containerNum).find("#display-on-hover").removeClass("hide");
	}

	function hide_bottomBar(containerNum) {
		$("." + containerNum).find("#display-on-hover").addClass("hide");
	}
</script>

<div class="dijitContentPane dijitContentPaneSingleChild"
	id="leftNavPane" role="navigation">
	<div class="sidePanelHeader">
		<span class="navLabelHeader"><fmt:message key="sidebar.left.heading.predefined_layouts" /></span>
	</div>
	<div class="mblView mblScrollableView" id="docUINav">
		<div id="div1" class="mblScrollableViewContainer">
			<ul class="nav nav-parent">
			</ul>
		</div>
	</div>
</div>

<div id="mainContentPane" role="main">
	<div id="mainStackContainer" class="dijitStackContainer">
		<div aria-label="contentPage" role="tabpanel" class="contentPage"
			id="contentPage">
			<div class="titleContent col-xs-12">
				<div class="row">
					<div class="col-xs-2">
						<span class="alignment"><fmt:message key="template.generator.label.document_name" /></span>
					</div>
					<div class="col-xs-10">
						<input name="title" type="text" class="form-control input-title" placeholder="<fmt:message key="template.generator.placeholder.document_name" />" />
					</div>
				</div>

				<div class="row">
					<div class="col-xs-2">
						<span><fmt:message key="template.generator.label.url" /></span>
					</div>
					<div class="col-xs-9  alignment-right">
						<input type="text" class="form-control input-url" placeholder="<fmt:message key="template.generator.placeholder.url" />" />
					</div>
					<div class="col-xs-1 alignment-left">
						<button class="input-xml-go btn btn-primary form-control goButton"><fmt:message key="template.generator.button.go" /></button>
					</div>
				</div>
			</div>

			<div role="tabpanel" class="design-tabs">

				<!-- Nav tabs -->
				<ul class="nav nav-tabs" role="tablist">
					<li role="presentation"><a href="#preview-design" role="tab"
						data-toggle="tab" data-type="templates"><fmt:message key="template.generator.tab.Preview" /></a></li>
					<li role="presentation" class="active"><a
						href="#data-selection" role="tab" data-toggle="tab"
						data-type="stylesheets"><fmt:message key="template.generator.tab.data_selection" /></a></li>
				</ul>
			</div>

			<!-- Tab panes -->
			<div class="tab-content col-xs-12">
				<div role="tabpanel" class="tab-pane" id="preview-design"
					data-type="preview">
					<div class="scroll-content">
						<div class="row">
							<div class="col-xs-2">
								<span><fmt:message key="template.generator.label.table_of_contents" /></span>
							</div>
							<div class="col-xs-9 alignment-right alignment">
								<input name="title" type="text"
									placeholder="Type the name of Table of Contents"
									class="form-control input-title" />
							</div>
							<!-- delete icon -->
							<div class="col-xs-1 align-right alignment-left ">
								<a href="#"><img alt="delete"
									src="${contextPath}/graphics/delete.png"></a>

							</div>

						</div>
						<div class="row section-container">
							<div class="row">
								<div class="col-xs-10  alignment-right">
									<input name="title" type="text"
										placeholder="Please add title here"
										class="form-control input-title" />
								</div>
								<div class="col-xs-2  alignment-left">
									<select name="type" class="upload-type form-control">
										<option value="scripts"><fmt:message key="template.generator.format.select" /></option>
										<option value="templates"><fmt:message key="template.generator.format.table" /></option>
										<option value="stylesheets"><fmt:message key="template.generator.format.paragraph" /></option>
									</select>
								</div>
							</div>
							<div class="row">
								<div class="1 col-xs-12">
									<div class="text-area form-control"
										onMouseOver="show_bottomBar(1)" onMouseOut="hide_bottomBar(1)">
										<div id="display-on-hover" class="hide">
											<button class="btn btn-primary"><fmt:message key="template.generator.tab.data_selection" /></button>
											<a href="#"><img alt="delete"
												src="${contextPath}/graphics/onHover/edit.png"></a> <a
												href="#"><img alt="delete"
												src="${contextPath}/graphics/onHover/Add-Container.png"></a>
											<a href="#"><img alt="delete"
												src="${contextPath}/graphics/onHover/delete.png"></a>
										</div>
									</div>
								</div>

							</div>
						</div>
						<div class="row section-container">
							<div class="row">
								<div class="col-xs-10">
									<input name="title" type="text"
										placeholder="Please add title here"
										class="form-control input-title" />
								</div>
								<div class="col-xs-2 alignment-left">
									<select name="type" class="upload-type form-control">
										<option value="scripts"><fmt:message key="template.generator.format.select" /></option>
										<option value="templates"><fmt:message key="template.generator.format.table" /></option>
										<option value="stylesheets"><fmt:message key="template.generator.format.paragraph" /></option>
									</select>
								</div>
							</div>
							<div class="row">
								<div class="2 col-xs-12">
									<div class="text-area form-control"
										onMouseOver="show_bottomBar(2)" onMouseOut="hide_bottomBar(2)">
										<div id="display-on-hover" class="hide">
											<button class="btn btn-primary"><fmt:message key="template.generator.hover.select_data" /></button>
											<a href="#"><img alt="delete"
												src="${contextPath}/graphics/onHover/edit.png"></a> <a
												href="#"><img alt="delete"
												src="${contextPath}/graphics/onHover/Add-Container.png"></a>
											<a href="#"><img alt="delete"
												src="${contextPath}/graphics/onHover/delete.png"></a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="footer-bar">
						<a href="#"><span><fmt:message key="template.generator.button.save_layout" /></span></a>
						<button class="btn btn-primary"><fmt:message key="template.generator.button.generate" /></button>
						<button class="btn btn-default"><fmt:message key="template.generator.button.cancel" /></button>
					</div>
				</div>
				<div role="tabpanel" class="tab-pane active" id="data-selection"
					data-type="dataSelection">
					<div class="col-xs-12 dataSelection-content">
						<div class="col-xs-9 selected-content">
							<div class="wrapper">
								<div class="data-formats">
									<button class=" highlight btn btn-primary"><fmt:message key="template.generator.format.table" /></button>
									<button class=" highlight btn btn-default"><fmt:message key="template.generator.format.paragraph" /></button>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-1">
									<span class="alignment"><fmt:message key="template.generator.label.title" /></span>
								</div>
								<div class="col-xs-11">
									<input name="title" type="text"
										class="drop form-control input-title" placeholder="<fmt:message key="template.generator.placeholder.drag.title" />" />
								</div>
							</div>
							<table id="dataSelected" class="all-reports">
								<thead>
									<%-- <tr>
										<th class="col-title table-header col-xs-3"><a
											class="no-edit-title" href="#"><img alt="edit"
												src="${contextPath}/graphics/edit.png"></a><span
											class="title">TOPIC</span></th>

										<th class="col-description table-header col-xs-3"><a
											class="no-edit-title" href="#"><img alt="edit"
												src="${contextPath}/graphics/edit.png"></a><span
											class="title">PUBLICATION DATE</span></th>

										<th class="col-last-modified table-header col-xs-3"><a
											class="no-edit-title" href="#"><img alt="edit"
												src="${contextPath}/graphics/edit.png"></a><span
											class="title">DESCRIPTION</span></th>
									</tr> --%>
								</thead>
								<tbody>
									<tr>
										<td class="table-data  col-xs-3"></td>
										<td class="table-data  col-xs-3"></td>
										<td class="table-data  col-xs-3"></td>
									</tr>
									<tr>
										<td class="table-data col-xs-3"></td>
										<td class="table-data col-xs-3"></td>
										<td class="table-data col-xs-3"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="col-xs-3 schema-tree">
							<!-- navigation tree -->
							<div class="navigation-tree">
								<div class="navigation-top-bar"><fmt:message key="template.generator.dataselection.label.navigator" /></div>
								<div class="data-selection-tree"></div>
							</div>
						</div>
					</div>
					<div class="data-select-buttons">
						<button class="get-data btn btn-primary"><fmt:message key="template.generator.button.select" /></button>
						<button class="remove-data btn btn-default"><fmt:message key="template.generator.button.cancel" /></button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/template" id="nav-divider-template">
	<li class="nav-divider"></li>
</script>

<script type="text/template" id="nav-tree-item-default-template">
	<li class="tree-item selected">
		<a href="#"><span class="navLabel default"><@= name @></span></a>
	</li>
</script>

<script type="text/template" id="nav-tree-item-template">
	<li class="tree-item">
		<a href="#"><span class="navLabel navSubLabel"><@= name @></span></a>
	</li>
</script>

<script type="text/template" id="nav-tree-category-template">
	<li>
		<div class="tree-toggler">
			<label class="nav-header"><span class="navLabel"><@= name @></span></label>
			<div class="mblListItemRightIcon">
				<div class="mblDomButtonArrow mblDomButton" title="">
					<div></div>
				</div>
			</div>
		</div>
		<ul class="nav tree active-trial">
			%NAV_TREE_ITEMS%
		</ul>
	</li>
</script>
<!-- Template to add columns to data selection -->
<script type="text/template" id="data-selection-tree-node-template">
<tr>
	<th class="col-title table-header col-xs-3">
		<a class="no-edit-title" href="#">
			<img alt="edit" src="${contextPath}/graphics/edit.png">
		</a>
		<span class="title"><@= name @></span>
	</th>
</tr>
</script>