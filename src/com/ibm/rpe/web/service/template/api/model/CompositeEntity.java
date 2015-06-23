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
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(Include.NON_EMPTY)
public class CompositeEntity<T> extends TemplateEntity
{
	private List<T> children = new ArrayList<T>();

	@JsonProperty("children")
	public List<T> getChildren()
	{
		return children;
	}

	public void addChild(T child)
	{
		children.add(child);
	}

	public void addChild(int index, T child)
	{
		children.add(index, child);
	}

	public void setChildren(List<T> children)
	{
		this.children = children;
	}

	public CompositeEntity()
	{
	}

	public CompositeEntity(String name, String description)
	{
		super(name, description);
	}

	public CompositeEntity(String name, String type, String description)
	{
		super(name, type, description);
	}

	@Override
	@SuppressWarnings("nls")
	public void prettyPrint(Writer out) throws IOException
	{
		super.prettyPrint(out);
		out.write("Children\n");
		for (T entity : children)
		{
			super.prettyPrint(out, (TemplateEntity) entity);

			if (entity instanceof TemplateElement)
			{
				prettyPrintElement(out, ((TemplateElement) entity).getChildren());
			}
		}
	}

	@SuppressWarnings("nls")
	public void prettyPrintElement(Writer out, List<TemplateElement> childElement) throws IOException
	{
		out.write("Children\n");
		for (TemplateElement element : childElement)
		{
			super.prettyPrint(out, element);
			prettyPrintElement(out, element.getChildren());
		}
	}
}