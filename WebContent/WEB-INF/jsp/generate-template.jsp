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
<fmt:setLocale value="${locale}" />
<fmt:setBundle
	basename="com.ibm.rpe.web.template.ui.messages.commonMessages" />
<link rel="stylesheet" href="${contextPath}/css/generate-template.css">
<link rel="stylesheet" href="${contextPath}/css/style3.0.css" />

<%-- <script src="${contextPath}/js/jstree.js"></script>
<script src="${contextPath}/js/jstree.dnd.js"></script>
 --%>
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
		<span class="navLabelHeader">Predefined Templates</span>
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
						<span class="alignment">Document Name: </span>
					</div>
					<div class="col-xs-10">
						<input name="title" type="text" class="form-control input-title" />
					</div>
				</div>

				<div class="row">
					<div class="col-xs-2">
						<span>URL: &nbsp;</span>
					</div>
					<div class="col-xs-9  alignment-right">
						<input type="text" class="form-control input-url drop" />
					</div>
					<div class="col-xs-1 alignment-left">
						<button class="input-xml-go btn btn-primary form-control goButton">&nbsp;&nbsp;&nbsp;GO&nbsp;&nbsp;&nbsp;</button>
					</div>
				</div>
			</div>

			<div role="tabpanel" class="design-tabs">

				<!-- Nav tabs -->
				<ul class="nav nav-tabs" role="tablist">
					<li role="presentation"><a href="#preview-design" role="tab"
						data-toggle="tab" data-type="templates">Preview</a></li>
					<li role="presentation" class="active"><a
						href="#data-selection" role="tab" data-toggle="tab"
						data-type="stylesheets">Data Selection</a></li>
				</ul>
			</div>

			<!-- Tab panes -->
			<div class="tab-content col-xs-12">
				<div role="tabpanel" class="tab-pane" id="preview-design"
					data-type="preview">
					<div class="insert-menu alignment-right">
						<select name="type" class="upload-type form-control">
							<option value="scripts">--Insert--</option>
							<option value="templates">Table of contents</option>
							<option value="stylesheets">Index</option>
							<option value="templates">Cover page</option>
							<option value="stylesheets">Header</option>
							<option value="templates">Footer</option>
						</select>
					</div>
					<div class="scroll-content">
						<div class="row">
							<div class="col-xs-2">
								<span>Table of Contents: </span>
							</div>
							<div class="col-xs-9 alignment-right alignment">
								<input name="title" type="text"
									placeholder="Type the name of Table of Contents"
									class="form-control input-title" />
							</div>
							<!-- delete icon -->
							<div class="col-xs-1 align-right alignment-left ">
								<a href="#"><img alt="delete"
									src="${contextPath}/graphics/delete-icon.png"></a>

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
										<option value="scripts">--Select--</option>
										<option value="templates">Table</option>
										<option value="stylesheets">Paragraph</option>
									</select>
								</div>
							</div>
							<div class="row">
								<div class="1 col-xs-12">
									<div class="text-area form-control"
										onMouseOver="show_bottomBar(1)" onMouseOut="hide_bottomBar(1)">
										<div id="display-on-hover" class="hide">
											<button class="btn btn-primary">Select Data</button>
											<a href="#"><img alt="edit"
												src="${contextPath}/graphics/edit.png"></a> <a href="#"><img
												alt="delete" src="${contextPath}/graphics/delete-icon.png"></a>
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
								<div class="col-xs-2">
									<select name="type" class="upload-type form-control">
										<option value="scripts">--Select--</option>
										<option value="templates">Table</option>
										<option value="stylesheets">Paragraph</option>
									</select>
								</div>
							</div>
							<div class="row">
								<div class="2 col-xs-12">
									<div class="text-area form-control"
										onMouseOver="show_bottomBar(2)" onMouseOut="hide_bottomBar(2)">
										<div id="display-on-hover" class="hide">
											<button class="btn btn-primary">Select Data</button>
											<a href="#"><img alt="delete"
												src="${contextPath}/graphics/edit.png"></a> <a href="#"><img
												alt="delete" src="${contextPath}/graphics/delete-icon.png"></a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="footer-bar">
						<a href="#"><span>Save Layout</span></a>
						<button class="btn btn-primary">Generate</button>
						<button class="btn btn-default">Cancel</button>
					</div>
				</div>
				<div role="tabpanel" class="tab-pane active" id="data-selection"
					data-type="dataSelection">
					<div class="col-xs-12 dataSelection-content">
						<div class="col-xs-9 selected-content">
							<div class="wrapper">
								<div class="data-formats">
									<button class=" highlight btn btn-primary">Table</button>
									<button class=" highlight btn btn-default">Paragraph</button>
								</div>
							</div>
							<table id="dataSelected" class="all-reports">
								<thead>
									<tr>
										<th class="col-title table-header col-xs-3"><a href="#"><img
												alt="edit" src="${contextPath}/graphics/edit.png"></a>
											TOPIC</th>

										<th class="col-description table-header col-xs-3"><a
											href="#"><img alt="edit"
												src="${contextPath}/graphics/edit.png"></a> PUBLICATION
											DATE</th>
										<th class="col-last-modified table-header col-xs-3"><a
											href="#"><img alt="edit"
												src="${contextPath}/graphics/edit.png"></a> DESCRIPTION</span></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="table-data col-xs-3">Omar biography</td>
										<td class="table-data col-xs-3">Sun , 05 Apr 2015, 9:00
											GMT</td>
										<td class="table-data col-xs-3">Description</td>
									</tr>
									<tr>
										<td class="table-data col-xs-3">Omar biography</td>
										<td class="table-data col-xs-3">Sun , 05 Apr 2015, 9:00
											GMT</td>
										<td class="table-data col-xs-3">Description</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="col-xs-3">
							<!-- navigation tree -->
							<div class="navigation-tree">
								<div class="navigation-top-bar">Navigator</div>
								<div class="data-selection-tree"></div>
							</div>
						</div>
					</div>
					<button class="btn btn-primary">SELECT</button>
					<button class="btn btn-default">CANCEL</button>
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