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
import java.util.ListIterator;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(Include.NON_EMPTY)
public class Template extends CompositeEntity<TemplateElement>
{
	private final List<TemplateSchema> schemas = new ArrayList<TemplateSchema>();

	private final List<TemplateStyle> styles = new ArrayList<TemplateStyle>();

	private CompositeEntity<?> lastActedElement = null;

	public Template()
	{
		super("", TemplateConstants.TEMPLATE, ""); //$NON-NLS-1$ //$NON-NLS-2$
	}

	public Template(String name, String description)
	{
		super(name, TemplateConstants.TEMPLATE, description);
	}

	public List<TemplateSchema> getSchemas()
	{
		return schemas;
	}

	public void addSchema(TemplateSchema schema)
	{
		schemas.add(schema);
	}

	@Override
	@JsonProperty("contents")
	public List<TemplateElement> getChildren()
	{
		return super.getChildren();
	}

	public boolean removeSchema(String schemaId)
	{
		ListIterator<TemplateSchema> it = schemas.listIterator();
		while (it.hasNext())
		{
			if (it.next().getId().equals(schemaId))
			{
				it.remove();
				return true;
			}
		}
		return false;
	}

	public void addStyle(TemplateStyle style)
	{
		styles.add(style);
	}

	public List<TemplateStyle> getStyles()
	{
		return styles;
	}

	@SuppressWarnings("nls")
	@Override
	public void prettyPrint(Writer out) throws IOException
	{
		out.write("Template properties\n");
		super.prettyPrint(out, this);

		out.write("Schemas\n");
		for (TemplateSchema schema : schemas)
		{
			schema.prettyPrint(out);
		}

		out.write("Elements\n");
		for (TemplateElement element : this.getChildren())
		{
			element.prettyPrint(out);
		}
	}

	public CompositeEntity<?> getLastActedElement()
	{
		return lastActedElement;
	}

	public void setLastActedElement(CompositeEntity<?> lastActedElement)
	{
		this.lastActedElement = lastActedElement;
	}
}