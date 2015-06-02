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
<fmt:setBundle basename="com.ibm.rpe.web.template.ui.messages.commonMessages" />

<link rel="stylesheet" href="${contextPath}/css/generate-template.css">

<div class="row-offcanvas row-offcanvas-left">
	<div id="sidebar" class="sidebar-offcanvas">
		<div class="col-md-12">
			<h5><b><fmt:message key="sidebar.left.heading" /></b></h5>
	        <div class="well custom">
	            <ul class="nav ">
	            	<li><a href="#">Default</a></li>
	            	<li class="nav-divider"></li>
	                <li>
	                    <label class="tree-toggler nav-header">Engineering Documents</label>
	                    <ul class="nav  tree active-trial">
	                        <li><a href="#">Requirements Specifications</a></li>
	                        <li><a href="#">Work Items</a></li>
	                        <li><a href="#">Test Planning</a></li>
	                    </ul>
	                </li>
	                <li class="nav-divider"></li>
	                <li>
	                    <label class="tree-toggler nav-header">Presentations</label>
	                    <ul class="nav  tree active-trial">
	                        <li><a href="#">pr 1</a></li>
	                        <li><a href="#">pr 2</a></li>
	                        <li><a href="#">pr 3</a></li>
	                    </ul>
	                </li>
	                <li class="nav-divider"></li>
	                <li>
	                    <label class="tree-toggler nav-header">Legal</label>
	                    <ul class="nav  tree active-trial">
	                        <li><a href="#">L 1</a></li>
	                        <li><a href="#">L 2Items</a></li>
	                        <li><a href="#">Test Planning</a></li>
	                    </ul>
	                </li>
	                <li class="nav-divider"></li>
	                <li>
	                    <label class="tree-toggler nav-header">HR</label>
	                    <ul class="nav  tree active-trial">
	                        <li><a href="#">Address proof</a></li>
	                    </ul>
	                </li>
	                <li class="nav-divider"></li>
	            </ul>
	        </div>
	    </div>
	</div>
  <div id="main">
      <div class="col-md-12">
			<div class="row">
				<div class="col-md-10">
					<div class="well">
						<div class="col-md-2">
							<span>Document Name: </span>
						</div>
						<div class="col-md-8">
							<input name="template-name" type="text" class="input-template-name" />
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-10">
					<div class="well">
						<div class="col-xs-2">
							<span>URL: </span>
						</div>
						<div class="col-xs-6">
							<input name="xmlUrl" type="text" class="input-xml-url" />
							<button>GO</button>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
          	<div class="col-md-10"><div class="well">
				<div class="col-xs-3">
					<span>URL: </span>
				</div>
				<div class="col-xs-10">
					<input name="xmlUrl" type="text" class="form-control input-xml-url" />
				</div>
			</div></div>
          </div>
          <div class="row">
              <div class="col-lg-6 col-sm-6"><div class="well"><p>6 cols, 6 small cols</p></div></div>
              <div class="col-lg-6 col-sm-6"><div class="well"><p>6 cols, 6 small cols</p></div></div>
          </div>
          <div class="row">
              <div class="col-lg-4 col-sm-6"><div class="well">4 cols, 6 small cols</div></div>
              <div class="col-lg-4 col-sm-6"><div class="well">4 cols, 6 small cols</div></div>
              <div class="col-lg-4 col-sm-12"><div class="well">4 cols, 12 small cols</div></div>
          </div>
      </div>
  </div>
 
</div><!--/row-offcanvas -->

<script>

$('.tree-toggler').click(function () {
	$(this).parent().children('ul.tree').toggle(200);
});

</script>
