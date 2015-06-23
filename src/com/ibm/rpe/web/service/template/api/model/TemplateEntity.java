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
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import javax.xml.bind.annotation.XmlElementWrapper;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_EMPTY)
public class TemplateEntity
{
	private String id = UUID.randomUUID().toString();

	private String name = null;
	private String type = null;
	private String description = null;

	@XmlElementWrapper(name = "properties")
	protected Map<String, String> properties = new LinkedHashMap<String, String>();

	public TemplateEntity()
	{

	}

	public TemplateEntity(String name, String description)
	{
		this.name = name;
		this.description = description;
	}

	public TemplateEntity(String name, String type, String description)
	{
		this.name = name;
		this.type = type;
		this.description = description;
	}

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getType()
	{
		return type;
	}

	public void setType(String type)
	{
		this.type = type;
	}

	public String getDescription()
	{
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public Map<String, String> getProperties()
	{
		return Collections.unmodifiableMap(properties);
	}

	public String getProperty(String propertyName)
	{
		return this.properties.get(propertyName);
	}

	public void addProperty(String name, String value)
	{
		this.properties.put(name, value);
	}

	public void removeProperty(String propertyName)
	{
		this.properties.remove(propertyName);
	}

	@SuppressWarnings("nls")
	public void prettyPrint(Writer out) throws IOException
	{
		out.write("\tName - " + getName() + "\n");
		out.write("\tType - " + getType() + "\n");
		out.write("\tDescription - " + getDescription() + "\n");
		out.write("\tID - " + getId() + "\n");

		if (properties.size() > 0)
		{
			out.write("\tProperties\n");
			for (Entry<String, String> entry : properties.entrySet())
			{
				out.write("\t\t" + entry.getKey() + " - " + entry.getValue() + "\n");
			}
		}
	}

	@SuppressWarnings("nls")
	public void prettyPrint(Writer out, TemplateEntity entity) throws IOException
	{
		out.write("\tName - " + entity.getName() + "\n");
		out.write("\tType - " + entity.getType() + "\n");
		out.write("\tDescription - " + entity.getDescription() + "\n");
		out.write("\tID - " + entity.getId() + "\n");

		if (entity.getProperties().size() > 0)
		{
			out.write("\tProperties\n");
			for (Entry<String, String> entry : entity.getProperties().entrySet())
			{
				out.write("\t\t" + entry.getKey() + " - " + entry.getValue() + "\n");
			}
		}
	}

}
