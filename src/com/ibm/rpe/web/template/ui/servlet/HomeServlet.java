/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2014, 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.template.ui.servlet;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class HomeServlet extends HttpServlet
{

	private static final long serialVersionUID = 1L;

	private static final String JSP_ROOT = "/WEB-INF/jsp"; //$NON-NLS-1$
	
	private static final String GENERATE_PAGE_JSP = JSP_ROOT + "/generate-template.jsp"; //$NON-NLS-1$
	private static final String JSP_HOME = JSP_ROOT + "/home.jsp"; //$NON-NLS-1$
	private static final String HOME_PATH = "home"; //$NON-NLS-1$
	
	
	private static final String ACTION_GENERATE_DOCUMENTS = "action=generate"; //$NON-NLS-1$

	@Override
	public void init(ServletConfig config)
	{
//		config.getServletContext().setAttribute(SERVICE_URL_ATTRIBUTE, SERVICE_URL);
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
	{
		try
		{
			handleRequest(request, response);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		catch (ServletException s)
		{
			s.printStackTrace();
		}
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
	{
		try
		{
			handleRequest(request, response);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		catch (ServletException e)
		{
			e.printStackTrace();
		}
	}

	public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException
	{
		// If the requested URL is the context url
		String reqUrl = request.getRequestURL().toString();
		String contextUrl = reqUrl.substring(0, reqUrl.indexOf(request.getContextPath()) + request.getContextPath().length()) + "/"; //$NON-NLS-1$
		String redirectURL = ""; //$NON-NLS-1$

		if (reqUrl.equals(contextUrl))
		{
			redirectURL = reqUrl.substring(0, reqUrl.length() - 1);
			if (redirectURL.endsWith("/")) //$NON-NLS-1$ 
			{
				redirectURL += HOME_PATH;
			}
			else
			{
				redirectURL += "/" + HOME_PATH; //$NON-NLS-1$
			}
			response.sendRedirect(redirectURL);
			return;
		}

		String requestURI = request.getRequestURI();
		if (requestURI.endsWith("index.html")) //$NON-NLS-1$
		{

			String url = request.getRequestURL().toString();
			redirectURL = url.substring(0, url.length() - "index.html".length()); //$NON-NLS-1$
			if (redirectURL.endsWith("/")) //$NON-NLS-1$ 
			{
				redirectURL += HOME_PATH;
			}
			else
			{
				redirectURL += "/" + HOME_PATH; //$NON-NLS-1$
			}
			response.sendRedirect(redirectURL);
			return;
		}

		if (request.getQueryString() != null && request.getQueryString().contains(ACTION_GENERATE_DOCUMENTS))
		{
			request.getRequestDispatcher(GENERATE_PAGE_JSP).forward(request, response);
			return;
		}
		request.getRequestDispatcher(JSP_HOME).forward(request, response);
	}
}
