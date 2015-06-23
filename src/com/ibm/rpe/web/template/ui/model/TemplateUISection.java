/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.template.ui.model;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(Include.NON_EMPTY)
public class TemplateUISection
{

	@JsonProperty("title")
	private String title;

	@JsonProperty("titleQuery")
	private String titleQuery;

	@JsonProperty("dataQuery")
	private String dataQuery;

	@JsonProperty("format")
	private String format;

	@JsonProperty("staticContent")
	private String staticContent;

	@JsonProperty("dataAttributes")
	private List<Map<String, String>> dataAttributesList;

	public String getTitle()
	{
		return title;
	}

	public void setTitle(String title)
	{
		this.title = title;
	}

	public String getTitleQuery()
	{
		return titleQuery;
	}

	public void setTitleQuery(String titleQuery)
	{
		this.titleQuery = titleQuery;
	}

	public String getDataQuery()
	{
		return dataQuery;
	}

	public void setDataQuery(String dataQuery)
	{
		this.dataQuery = dataQuery;
	}

	public String getFormat()
	{
		return format;
	}

	public void setFormat(String format)
	{
		this.format = format;
	}

	public String getStaticContent()
	{
		return staticContent;
	}

	public void setStaticContent(String staticContent)
	{
		this.staticContent = staticContent;
	}

	public List<Map<String, String>> getDataAttributesList()
	{
		return dataAttributesList;
	}

	public void setDataAttributesList(List<Map<String, String>> dataAttributesList)
	{
		this.dataAttributesList = dataAttributesList;
	}

}
