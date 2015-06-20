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
<fmt:setBundle
	basename="com.ibm.rpe.web.template.ui.messages.UIMessages" />

<link rel="stylesheet" href="${contextPath}/css/generate-template.css">
<link rel="stylesheet" href="${contextPath}/css/style3.0.css" />

<div class="dijitContentPane dijitContentPaneSingleChild"
	id="leftNavPane" role="navigation">
	<div class="sidePanelHeader">
		<span class="navLabelHeader"><fmt:message
				key="sidebar.left.heading.predefined_layouts" /></span>
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
						<span class="alignment"><fmt:message
								key="template.generator.label.document_name" /></span>
					</div>
					<div class="col-xs-10">
						<input type="text" class="form-control document-title"
							placeholder="<fmt:message key="template.generator.placeholder.document_name" />" />
					</div>
				</div>

				<div class="row">
					<div class="col-xs-2">
						<span><fmt:message key="template.generator.label.url" /></span>
					</div>
					<div class="col-xs-9  alignment-right">
						<input type="text" class="form-control input-url"
							placeholder="<fmt:message key="template.generator.placeholder.url" />" />
					</div>
					<div class="col-xs-1 alignment-left">
						<button class="input-xml-go btn btn-primary form-control goButton">
							<fmt:message key="template.generator.button.go" />
						</button>
					</div>
				</div>
			</div>

			<div role="tabpanel" class="design-tabs">

				<!-- Nav tabs -->
				<ul class="nav nav-tabs" role="tablist">
					<li role="presentation" class="active"><a
						href="#preview-design" role="tab" data-toggle="tab"
						data-type="preview"><fmt:message
								key="template.generator.tab.Preview" /></a></li>
					<li role="presentation" class="disabled data-selection-tab"><a href="#data-selection" role="tab"
						data-toggle="tab" data-type="dataSelection"><fmt:message
								key="template.generator.tab.data_selection" /></a></li>
				</ul>
			</div>

			<!-- Tab panes -->
			<div class="tab-content col-xs-12">
				<div role="tabpanel" class="tab-pane active" id="preview-design"
					data-type="preview">
					<div class="row">
						<div class="col-xs-2 select-global-menu">
							<select name="type" class="upload-type form-control">
								<option value="">
									<fmt:message key="template.generator.global.insert.label" />
								</option>
								<option value="toc">
									<fmt:message key="template.generator.toc.label" />
								</option>
								<option value="header">
									<fmt:message key="template.generator.header.label" />
								</option>
								<option value="footer">
									<fmt:message key="template.generator.footer.label" />
								</option>
							</select>
						</div>
					</div>
					<div id="preview-main-content" class="scroll-content"></div>
					<div class="footer-bar">
						<a href="#" class="save-to-local hide"></a>
						<a href="#" class="save-layout"><span><fmt:message
									key="template.generator.button.save_layout" /></span></a>&nbsp;
						<button class="btn btn-primary generate-template-btn">
							<fmt:message key="template.generator.button.generate" />
						</button>
						<button class="btn btn-default preview-cancel-btn">
							<fmt:message key="template.generator.button.cancel" />
						</button>
					</div>
				</div>
				<div role="tabpanel" class="tab-pane" id="data-selection"
					data-type="dataSelection">
					<div class="col-xs-12 dataSelection-content">
						<div class="col-xs-9 selected-content">
							<div class="wrapper">
								<div class="data-formats">
									<button id="table-format" class="highlight btn btn-primary">
										<fmt:message key="template.generator.format.table" />
									</button>
									<button id="paragraph-format"
										class="btn btn-default">
										<fmt:message key="template.generator.format.paragraph" />
									</button>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-1">
									<span class="alignment"><fmt:message
											key="template.generator.label.title" /></span>
								</div>
								<div class="col-xs-11">
									<input name="title" type="text"
										class="drop form-control input-ds-title"
										placeholder="<fmt:message key="template.generator.placeholder.drag.title" />" />
								</div>
							</div>
							<div class="paragraph-data-selection"></div>
							<table class="table-data-selection">
								<thead>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
						<div class="col-xs-3 schema-tree">
							<!-- navigation tree -->
							<div class="navigation-tree">
								<div class="navigation-top-bar">
									<fmt:message
										key="template.generator.dataselection.label.navigator" />
								</div>
								<div class="xml-as-json hide" data-xmlJson=""></div>
								<div class="data-selection-tree"></div>
							</div>
						</div>
					</div>
					<div class="data-select-buttons">
						<button class="btn-select-data btn btn-primary">
							<fmt:message key="template.generator.button.select" />
						</button>
						<button class="btn btn-default ds-cancel-btn">
							<fmt:message key="template.generator.button.cancel" />
						</button>
						<button class="btn btn-default ds-clear-btn">
							<fmt:message key="template.generator.button.clear" />
						</button>
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
<script type="text/template" id="data-selection-header-column-template">
	<th class="col-title header-label col-xs-3" data-query="<@= query@>" data-isquery="true">
		<a class="no-edit-title" href="#">
			<img alt="edit" src="${contextPath}/graphics/edit.png">
		</a>
		<span class="title"><@= name @></span>
	</th>
</script>

<!-- header without edit -->
<script type="text/template" id="preview-header-column-template">
	<th class="col-title header-label col-xs-3" data-query="<@= query@>" data-isquery="true">
		<span class="title"><@= name @></span>
	</th>
</script>

<script type="text/template" id="data-selection-data-column-template">
	<td class="col-data col-xs-3">
		<span class="data"><@= data @></span>
	</td>
</script>

<script type="text/template"
	id="preview-design-format-container-template">
<div class="row section-container">
	<div class="row">
		<div class="col-xs-10 title-query">
		<input type="text"placeholder="Please add title here"
				class="form-control input-preview-section-title"/>
		</div>
		<div class="col-xs-2  alignment-left">
			<select name="type" class="upload-type form-control format-preview-section selectFormat" previous-format="table">
				<option value="">
					<fmt:message key="template.generator.format.select" />
				</option>
				<option value="table">
					<fmt:message key="template.generator.format.table" />
				</option>
				<option value="paragraph">
					<fmt:message key="template.generator.format.paragraph" />
				</option>
				<option value="static-text">
					<fmt:message key="template.generator.format.static-text" />
				</option>
			</select>
		</div>
		<div class="alignment-left">
			<div id="display-on-hover" class="hide">
				<button class="data-selection-btn btn btn-primary">
					<fmt:message key="template.generator.hover.select_data" />
				</button>
				<a href="#"><img alt="delete" src="${contextPath}/graphics/onHover/edit.png"></a>
				<a href="#" class="add-container"><img alt="delete" src="${contextPath}/graphics/onHover/Add-Container.png"></a>
				<a href="#" class="delete-container"><img alt="delete" src="${contextPath}/graphics/onHover/delete.png"></a>
			</div>
		</div>
	</div>
<div class="row">
	<div class="1 col-xs-12">
		<div class="preview-data-selected form-control container-action"></div>
	</div>
</div>
</div>
</script>

<script type="text/template" id="preview-container-empty-template">
	<table class="preview-container-table">
								<thead>
								</thead>
								<tbody>
								</tbody>
							</table>
</script>

<script type="text/template" id="table-of-contents-template">
	<div class="row toc">
		<div class="col-xs-2">
			<span>
				<fmt:message key="template.generator.label.table_of_contents" />
			</span>
		</div>
		<div class="col-xs-9 alignment-right alignment-left">
			<input name="title" type="text" placeholder="<fmt:message key="template.generator.placeholder.toc_label" />" class="form-control input-toc-label" />
		</div>
		<!-- delete icon -->
		<div class="col-xs-1 align-right alignment-left-icon alignment-right">
			<a href="#" class="delete-toc">
				<img alt="delete" src="${contextPath}/graphics/delete.png">
			</a>

		</div>
	</div>
</script>

<script type="text/template" id="navigator-tree-div-template">
	<div class="data-selection-tree"></div>
</script>
<script type="text/template" id="data-selection-paragraph-div-template">
				<div class="row data-selection-paragraph">
					<div class="col-xs-2 header-label" data-query="<@= query@>">
						<span class="alignment title"><@= name @></span>
					</div>
					<div class="col-xs-8">
						<span class="data"><@= data @></span>
					</div>
				</div>
</script>
<script type="text/template" id="data-selection-paragraph-edit-div-template">
<div class="row data-selection-paragraph">
					<div class="col-xs-2 header-label" data-query="<@= query@>">
						<a class="no-edit-title" href="#"><img alt="edit" src="${contextPath}/graphics/edit.png">
						</a><span class="alignment title"><@= name @></span>
					</div>
					<div class="col-xs-8">
						<span class="data"><@= data @></span>
					</div>
				</div>
</script>
<script type="text/template" id="preview-paragraph-row-template">
	<div class="row preview-paragraph">
					<div class="col-xs-2 header-label preview-header" data-query="<@= query@>">
						<span class="alignment title"><@= name @></span>
					</div>
					<div class="col-xs-8">
						<span class="data"><@= data @></span>
					</div>
	</div>
</script>
