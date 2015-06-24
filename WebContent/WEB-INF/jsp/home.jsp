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
<fmt:setBundle basename="com.ibm.rpe.web.template.ui.messages.UIMessages" />

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="x-ua-compatible" content="IE=edge">
<!-- Will be populated during runtime -->
<title></title>
<meta name="viewport"
	content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

<link rel="shortcut icon" href="${contextPath}/graphics/RPE_24.png">
<link rel="stylesheet" href="${contextPath}/css/base.css">
<link rel="stylesheet" href="${contextPath}/css/home.css">
<link rel="stylesheet" href="${contextPath}/css/docUI.css">
<link rel="stylesheet" href="${contextPath}/css/header.css">

</head>
<body class="docUI mblBackground">
	<%@include file="includes/nav-bar-top.jsp"%>

	<div id="generate-template-page" class="container"></div>

	<script src="${contextPath}/js/base.min.js"></script>
	<script>
		requirejs.config({
			baseUrl : "${contextPath}/js",
			config : {
				_rpe : {
					contextRoot : "${contextPath}",
				},
				i18n : {
					locale : "${fn:replace(locale.toString(), '_', '-')}"
				}
			}
		});
	</script>

	<script>
		$(document).data("context_path", "${contextPath}");
		$(document).data("default_xml_url", "${XML_URL}");
	</script>

	<script type="text/javascript" src="${contextPath}/js/home.js"></script>
</body>
</html>
