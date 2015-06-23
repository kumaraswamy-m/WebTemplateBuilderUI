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
public class TemplateElement extends CompositeEntity<TemplateElement>
{
	private String query = null;
	private String schema = null;
	private String context = null;
	private String content = null;

	public TemplateElement(String name, String description)
	{
		super(name, description);
	}

	public TemplateElement(String name, String type, String description)
	{
		super(name, type, description);
	}

	public TemplateElement()
	{

	}

	public String getQuery()
	{
		return query;
	}

	public void setQuery(String query)
	{
		this.query = query;
	}

	public String getSchema()
	{
		return schema;
	}

	public void setSchema(String schema)
	{
		this.schema = schema;
	}

	public String getContext()
	{
		return context;
	}

	public void setContext(String context)
	{
		this.context = context;
	}

	public String getContent()
	{
		return content;
	}

	public void setContent(String content)
	{
		this.content = content;
	}

	@Override
	@SuppressWarnings("nls")
	public void prettyPrint(Writer out) throws IOException
	{
		super.prettyPrint(out);
		out.write("\tQuery - " + query + "\n");
		out.write("\tSchema - " + schema + "\n");
		out.write("\tContent - " + content + "\n");
		out.write("\tContext - " + context + "\n");
	}
}
