package com.ibm.rpe.web.template.ui.servlet;

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

import com.ibm.rpe.web.template.ui.utils.Utils;

@Path("/savejson")
public class SaveJsonLayout
{
	@GET
	@Produces(
	{ MediaType.APPLICATION_OCTET_STREAM })
	public Response saveJsonToLocal(@Context HttpServletRequest request, @QueryParam("layoutjson") String savedJson,
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
}
