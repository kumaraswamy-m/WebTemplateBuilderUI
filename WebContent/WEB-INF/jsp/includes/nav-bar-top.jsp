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
<fmt:setLocale value="${pageContext.request.locale}" />
<fmt:setBundle basename="com.ibm.rpe.web.template.ui.messages.commonMessages" />

<%-- Assign default title if none provided --%>
<c:if test="${empty title}">
	<fmt:message key="navbar.title" var="title" />
</c:if>
		<div class="dijitContentPane" id="topNavPane">
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
	