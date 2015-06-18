/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.template.ui.utils;

import javax.servlet.http.HttpServletRequest;

public class Utils
{

	public static void main(String[] args)
	{
	}

	public static String getTemplateServiceUrl(HttpServletRequest request)
	{
		String serviceURL = getSystemProperty("TEGAS_URL", null); //$NON-NLS-1$
		if (CommonUtils.isNullOrEmpty(serviceURL))
		{
			serviceURL = request.getRequestURL().toString();
			serviceURL = serviceURL.substring(0, serviceURL.indexOf(request.getRequestURI()));

			if (!CommonUtils.isNullOrEmpty(serviceURL))
			{
				if (serviceURL.endsWith("/"))
				{
					serviceURL = serviceURL + "rpet";
				}
				else
				{
					serviceURL = serviceURL + "/rpet";
				}

				System.out.println("Template Service URL not set. Using " + serviceURL); //$NON-NLS-1$
			}
			else
			{
				System.out.println("Template Service URL is not set and it cannot be derived. Failure....."); //$NON-NLS-1$
			}
		}
		else
		{
			System.out.println("Template Service URL is " + serviceURL); //$NON-NLS-1$
		}

		return serviceURL;
	}

	public static String getSystemProperty(String property, String defaultValue)
	{
		String value = null;

		if (CommonUtils.isNullOrEmpty(value))
		{
			value = System.getenv(property);
		}

		return value != null ? value : defaultValue;
	}
}
