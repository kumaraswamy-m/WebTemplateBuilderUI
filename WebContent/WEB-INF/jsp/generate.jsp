<%--
	Licensed Materials - Property of IBM
	(c) Copyright IBM Corporation 2014. All Rights Reserved.
	
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
<fmt:setBundle basename="com.ibm.rpe.web.common.messages.commonMessages" />

<link rel="stylesheet" href="${contextPath}/css/all-reports.css">

<div class="panel panel-default section-header">
	<div class="panel-heading">
		<div class="page-title"><fmt:message key="RPE_Generate_Title" /></div>
		<span class="page-desc"><fmt:message key="RPE_Generate_Desc" /></span>
	</div>
</div>

<%@include file="template-generator.jsp" %>
