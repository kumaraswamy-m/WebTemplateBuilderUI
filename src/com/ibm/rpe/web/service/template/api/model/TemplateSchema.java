/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.service.template.api.model;

import java.io.IOException;
import java.io.Writer;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_EMPTY)
public class TemplateSchema extends TemplateEntity
{
	private String uri = null;
	
	public TemplateSchema(String name, String description)
	{
		super(name, description);
	}

	public TemplateSchema(String name, String type, String description)
	{
		super(name, type, description);
	}
	
	public TemplateSchema()
	{
	}

	public String getUri()
	{
		return uri;
	}

	public void setUri(String uri)
	{
		this.uri = uri;
	}
	
	@Override
	@SuppressWarnings("nls")
	public void prettyPrint(Writer out) throws IOException
	{
		out.write("\tURI: " + this.uri + "\n");
		super.prettyPrint(out);
	}
}
