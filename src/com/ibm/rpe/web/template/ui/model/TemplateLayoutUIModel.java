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

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ibm.rpe.web.template.ui.builder.TemplateBuilderUIImpl;
import com.ibm.rpe.web.template.ui.utils.JSONUtils;

@JsonInclude(Include.NON_EMPTY)
public class TemplateLayoutUIModel
{
	@JsonProperty("title")
	private String documentTitle;

	@JsonProperty("xmlUrl")
	private String xmlUrl;

	@JsonProperty("hasToc")
	private boolean hasToc;

	@JsonProperty("tocLabel")
	private String tocTitle;

	@JsonProperty("sections")
	private List<TemplateUISection> sections = null;

	public String getDocumentTitle()
	{
		return documentTitle;
	}

	public void setDocumentTitle(String documentTitle)
	{
		this.documentTitle = documentTitle;
	}

	public String getXmlUrl()
	{
		return xmlUrl;
	}

	public void setXmlUrl(String xmlUrl)
	{
		this.xmlUrl = xmlUrl;
	}

	public boolean isHasToc()
	{
		return hasToc;
	}

	public void setHasToc(boolean hasToc)
	{
		this.hasToc = hasToc;
	}

	public String getTocTitle()
	{
		return tocTitle;
	}

	public void setTocTitle(String tocTitle)
	{
		this.tocTitle = tocTitle;
	}

	public List<TemplateUISection> getSections()
	{
		return sections;
	}

	public void setSections(List<TemplateUISection> sections)
	{
		this.sections = sections;
	}

	@SuppressWarnings("nls")
	public static void main(String[] args) throws Exception
	{
		String text = "{\"title\":\"Sample Requirements\",\"xmlUrl\":\"http://localhost:8080/rpet/template/data/requisitepro.xml\",\"sections\":[{\"title\":\"Project/Requirements/PRRequirement/GUID\",\"titleQuery\":\"\",\"dataAttributes\":[{\"label\":\"FullTag\",\"query\":\"Project/Requirements/PRRequirement/FullTag\"},{\"label\":\"Text\",\"query\":\"Project/Requirements/PRRequirement/Text\"},{\"label\":\"HasParent\",\"query\":\"Project/Requirements/PRRequirement/HasParent\"}],\"format\":\"paragraph\"},{\"title\":\"About myself\",\"staticContent\":\"all is well :)\",\"format\":\"static-text\"}]}";

		TemplateLayoutUIModel uiModel = (TemplateLayoutUIModel) JSONUtils.readValue(text, TemplateLayoutUIModel.class);
		
		uiModel.setHasToc(true);
		uiModel.setTocTitle("Table of Contents");

		System.out.println(JSONUtils.writeValue(uiModel));

		TemplateBuilderUIImpl tBuilder = new TemplateBuilderUIImpl(uiModel, "http://localhost:8080/tegas");
		String templateJson = tBuilder.buildTemplateJson();
		System.out.println(templateJson);
	}

}
