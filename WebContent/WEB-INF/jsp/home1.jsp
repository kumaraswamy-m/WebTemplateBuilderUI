<%--
	Licensed Materials - Property of IBM
	(c) Copyright IBM Corporation 2014, 2015. All Rights Reserved.
	
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

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="x-ua-compatible" content="IE=edge">
<!-- Will be populated during runtime -->
<title></title>
<meta name="viewport"
	content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

<link rel="shortcut icon" href="${contextPath}/graphics/32px.png">
<link rel="stylesheet" href="${contextPath}/css/base.css">
<link rel="stylesheet" href="${contextPath}/css/home.css">
<link rel="stylesheet" href="${contextPath}/css/docUI.new.css">
<link rel="stylesheet" href="${contextPath}/css/header.new.css">
<link rel="stylesheet" href="${contextPath}/css/home.new.css">
<link rel="stylesheet" href="${contextPath}/css/generate-template.css">

<script src="${contextPath}/js/base.min.js"></script>
</head>
<body class="docUI mblBackground idx_dojo_1_9">

	<div
		class="dijitBorderContainerNoGutter dijitContainer dijitLayoutContainer"
		id="docUIContainer">

		<div class="dijitContentPane dijitBorderContainerNoGutterPane"
			id="topNavPane">
			<div id="docUIBanner" class="docUIBannerDiv">
				<header class="bluemix-global-header" id="header1">
					<div class="bluemix-masthead">
						<a href="https://console.stage1.ng.bluemix.net/home/"
							class="bluemix-home-link bluemix-logo icon-logo-grey"></a>
						<div class="bluemix-nav-menu-button icon-bluemix-nav-menu"
							tabindex="1" id="header-menu"></div>
						<a href="https://console.stage1.ng.bluemix.net/home/"
							class="bluemix-branding">IBM DTA <span
							class="bluemix-product-title">Generator</span></a>
					</div>
				</header>
			</div>
		</div>

		<div
			class="dijitContentPane  dijitBorderContainerNoGutterPane dijitContentPaneSingleChild"
			id="leftNavPane" role="navigation">
			<div class="mblView mblScrollableView" id="docUINav">
				<div id="div1" class="mblScrollableViewContainer">
					<ul id="dojox_mobile_RoundRectList_0" class="mblRoundRectList">
						<li id="dojox_mobile_ListItem_0" tabindex="0"
							class="mblListItem navItemIsDocHome"><div
								class="mblListItemLabel">
								<span class="navImgEmpty"></span><span class="navLabel">Pre-defined
									Templates</span>
							</div></li>
						<li role="button" id="dojox_mobile_ListItem_1" tabindex="0"
							class="mblListItem listItemSelected"><div
								class="mblListItemRightIcon">
								<div class="mblDomButtonArrow mblDomButton" title="">
									<div>
										<div>
											<div>
												<div></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="div2" class="mblListItemLabel">
								<img src="#Image for default" class="navImg"><span
									class="navLabel">Default</span>
							</div></li>
						<li role="button" id="dojox_mobile_ListItem_2" tabindex="0"
							class="mblListItem"><div class="mblListItemRightIcon">
								<div class="mblDomButtonArrow mblDomButton" title="">
									<div>
										<div>
											<div>
												<div></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="mblListItemLabel">
								<img src="#image for saved layouts" class="navImg"><span
									class="navLabel">Saved Layouts</span>
							</div></li>
					</ul>
				</div>
			</div>
		</div>
		
		<div id="leftNavPane_splitter"
			class="dijitSplitter dijitSplitterV idxSplitterV idxSplitter idxSplitterLeftNormal dijitLeftNormal dijitAlignLeft">
		</div>




		<div
			class="dijitContentPane dijitBorderContainerNoGutterPane dijitContentPaneSingleChild"
			id="mainContentPane" role="main">


			<div id="mainStackContainer"
				class="dijitStackContainer dijitContainer dijitLayoutContainer mainStackContainer">
				<div aria-label="mainPage" role="tabpanel"
					class="dijitStackContainerChildWrapper dijitVisible">
					<div title=""
						class="dijitContentPane dijitContentPaneSingleChild"
						id="mainPage">
						<div id="docUIMainDiv" class="bluemixHome docUIMainDiv">
							<section data-dojo-attach-point="serviceDiv" class="serviceDiv">
								<div class="sectionHeader">
									<h2 class="sectionName"></h2>
								</div>
								<div class="serviceContentDiv subContent"
									data-dojo-attach-point="serviceContentDiv">
									<form id="docInput" action="">
										<table>
											<tr>
												<th class="sectionName">Document Name :</th>
												<td><input id="docName" type="text" /></td>
											</tr>
											<tr>
												<th class="sectionName">URL :</th>
												<td><input id="url1" type="text" />
													<button class="btn btn-primary">Go</button></td>
											</tr>
										</table>
									</form>
								</div>
							</section>
						</div>
					</div>
				</div>
				<div aria-label="detailPage" role="tabpanel"
					class="dijitStackContainerChildWrapper dijitHidden">
					<div title=""
						class="dijitContentPane"
						id="detailPage">
						<div id="docUIDetailDiv"></div>
					</div>
				</div>
				<div aria-label="searchPage" role="tabpanel"
					class="dijitStackContainerChildWrapper dijitHidden">
					<div title=""
						class="dijitContentPane"
						id="searchPage">
						<div id="docUISearchDiv"></div>
					</div>
				</div>
				<div aria-label="errorPage" role="tabpanel"
					class="dijitStackContainerChildWrapper dijitHidden">
					<div title=""
						class="dijitContentPane"
						id="errorPage">
						<div id="docUIErrorDiv"></div>
					</div>
				</div>
			</div>
		</div>

	</div>

	<span class="topIcon docUIHide" id="topIcon">
		<div class="topIconImg">&nbsp;</div>
	</span>
	<script>

$('.tree-toggler').click(function () {
	$(this).parent().children('ul.tree').toggle(200);
});

</script>
</body>
</html>
