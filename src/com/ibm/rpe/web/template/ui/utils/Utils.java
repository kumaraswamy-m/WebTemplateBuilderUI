/*******************************************************************************
 * Licensed Materials - Property of IBM
 * � Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.template.ui.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.io.IOUtils;

public class Utils
{
	private static final String CONTENT_DISPOSITION = "Content-Disposition"; //$NON-NLS-1$
	private static final String ATTACHMENT_FILENAME = "attachment; filename="; //$NON-NLS-1$ 

	public static String getTemplateServiceUrl(HttpServletRequest request, String systemProperty, String contextRoot)
	{
		String serviceURL = getSystemProperty(systemProperty, null);
		if (CommonUtils.isNullOrEmpty(serviceURL))
		{
			serviceURL = request.getRequestURL().toString();
			serviceURL = serviceURL.substring(0, serviceURL.indexOf(request.getRequestURI()));

			if (!CommonUtils.isNullOrEmpty(serviceURL))
			{
				if (serviceURL.endsWith("/")) //$NON-NLS-1$
				{
					serviceURL = serviceURL + contextRoot;
				}
				else
				{
					serviceURL = serviceURL + "/" + contextRoot; //$NON-NLS-1$
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

	public static Response downloadResponse(final InputStream is, String name)
	{
		if (is == null)
		{
			return Response.status(Response.Status.NOT_FOUND).entity("File not found").build();
		}

		// OR: use a custom StreamingOutput and set to Response
		StreamingOutput stream = new StreamingOutput()
		{
			@Override
			public void write(OutputStream output) throws IOException
			{
				IOUtils.copy(is, output);
			}
		};

		return Response.ok(stream, MediaType.APPLICATION_OCTET_STREAM).header(CONTENT_DISPOSITION, ATTACHMENT_FILENAME + name).build();
	}
}
