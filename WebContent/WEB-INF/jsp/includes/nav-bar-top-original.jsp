<%--
	Licensed Materials - Property of IBM
	(c) Copyright IBM Corporation 2014, 2015. All Rights Reserved.
	
	Note to U.S. Government Users Restricted Rights:
	Use, duplication or disclosure restricted by GSA ADP Schedule
	Contract with IBM Corp.
--%>
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
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<fmt:setLocale value="${pageContext.request.locale}" />
<fmt:setBundle basename="com.ibm.rpe.web.template.ui.messages.commonMessages" />

<%-- Assign default title if none provided --%>
<c:if test="${empty title}">
	<fmt:message key="navbar.title" var="title" />
</c:if>

<div class="navbar navbar-inverse navbar-fixed-top jp-navbar"
	role="navigation">
	<div class="navbar-header">
		<button type="button" class="navbar-toggle" data-toggle="collapse"
			data-target=".navbar-ex1-collapse">
			<span class="sr-only"><fmt:message key="navbar.toggle" /></span> <span
				class="icon-bar"></span> <span class="icon-bar"></span> <span
				class="icon-bar"></span>
		</button>
		<a class="navbar-brand" href="${contextPath}/"><c:out
				value="${title}" /><span class="jp-jazz-logo"></span></a>
	</div>
</div>

<div class="jp-bluebar"></div>
