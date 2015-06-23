/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.template.ui.servlet;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;

import com.ibm.rpe.web.template.ui.builder.TemplateBuilderUIImpl;
import com.ibm.rpe.web.template.ui.model.TemplateLayoutUIModel;
import com.ibm.rpe.web.template.ui.utils.JSONUtils;
import com.ibm.rpe.web.template.ui.utils.Utils;

@Path("/template")
public class SaveTemplateLayout
{
	@GET
	@Path("/savelayout")
	@Produces(
	{ MediaType.APPLICATION_OCTET_STREAM })
	public Response saveTemplateLayout(@Context HttpServletRequest request, @QueryParam("layoutjson") String savedJson,
			@QueryParam("title") String title)
	{
		try
		{
			if (title == null)
			{
				title = UUID.randomUUID().toString() + ".json";
			}
			else
			{
				title += ".json";
			}
			return Utils.downloadResponse(IOUtils.toInputStream(savedJson, "UTF-8"), title);
		}
		catch (IOException e)
		{
			e.printStackTrace();
			Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getLocalizedMessage()).build();
		}
		return null;
	}

	@GET
	@Path("/generate")
	@Produces(
	{ MediaType.APPLICATION_OCTET_STREAM })
	public Response generateTemplate(@Context HttpServletRequest request, @QueryParam("layoutjson") String layoutJson,
			@QueryParam("title") String title)
	{
		try
		{
			if (title == null)
			{
				title = UUID.randomUUID().toString() + ".dta";
			}
			else
			{
				title += ".dta";
			}

			TemplateLayoutUIModel uiModel = (TemplateLayoutUIModel) JSONUtils.readValue(layoutJson, TemplateLayoutUIModel.class);

			System.out.println(JSONUtils.writeValue(uiModel));
			String serviceUrl = getServiceUrl(request);

			TemplateBuilderUIImpl tBuilder = new TemplateBuilderUIImpl(uiModel, serviceUrl);
			String templateJson = tBuilder.buildTemplateJson();
			System.out.println(templateJson);

			String templatePath = tBuilder.buildTemplate(templateJson);

			return Utils.downloadResponse(new FileInputStream(templatePath), title);
		}
		catch (IOException e)
		{
			e.printStackTrace();
			Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getLocalizedMessage()).build();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getLocalizedMessage()).build();
		}
		return null;
	}

	private static String getServiceUrl(HttpServletRequest request)
	{
		return Utils.getTemplateServiceUrl(request, "TEGAS_URL", "tegas");
	}

}
