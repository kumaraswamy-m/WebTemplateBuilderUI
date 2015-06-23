/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.service.template.api.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(Include.NON_EMPTY)
public class Operation
{
	public Operation(String type, TemplateElement element)
	{
		this.type = type;
		this.element = element;
	}

	public Operation()
	{

	}

	@JsonProperty("type")
	private String type;

	@JsonProperty("element")
	private TemplateElement element;

	@JsonProperty("locationid")
	private String locationId;

	@JsonProperty("location")
	private String location;

	public String getType()
	{
		return type;
	}

	public void setType(String type)
	{
		this.type = type;
	}

	public TemplateElement getElement()
	{
		return element;
	}

	public void setElement(TemplateElement element)
	{
		this.element = element;
	}

	public String getLocationId()
	{
		return locationId;
	}

	public void setLocationId(String locationId)
	{
		this.locationId = locationId;
	}

	public String getLocation()
	{
		return location;
	}

	public void setLocation(String location)
	{
		this.location = location;
	}

}
