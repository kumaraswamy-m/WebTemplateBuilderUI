/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.template.ui.builder;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import org.apache.commons.io.IOUtils;

import com.ibm.rpe.web.service.template.api.model.Operation;
import com.ibm.rpe.web.service.template.api.model.Template;
import com.ibm.rpe.web.service.template.api.model.TemplateConstants;
import com.ibm.rpe.web.service.template.api.model.TemplateElement;
import com.ibm.rpe.web.service.template.api.model.TemplateSchema;
import com.ibm.rpe.web.template.ui.model.TemplateLayoutUIModel;
import com.ibm.rpe.web.template.ui.model.TemplateUISection;
import com.ibm.rpe.web.template.ui.utils.CommonUtils;
import com.ibm.rpe.web.template.ui.utils.JSONUtils;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.core.util.MultivaluedMapImpl;

public class TemplateBuilderUIImpl
{
	private final TemplateLayoutUIModel templateModel;

	private static final String DOCUMENT_TITLE_STYLE = "Title"; //$NON-NLS-1$
	private static final String TABLE_HEADER_CELL_STYLE = "Intense Emphasis"; //$NON-NLS-1$

	private static final String FORMAT_TABLE = "table"; //$NON-NLS-1$
	private static final String FORMAT_PARAGPRAH = "paragraph"; //$NON-NLS-1$
	private static final String FORMAT_STATIC_CONTENT = "static-text"; //$NON-NLS-1$

	private static final String QUERY_DELIMITER = "/"; //$NON-NLS-1$
	private static final String ATTRIBUTE_QUERY = "query"; //$NON-NLS-1$
	private static final String ATTRIBUTE_LABEL = "label"; //$NON-NLS-1$
	private static final String SCHEMA_TYPE_GENERIC_XML = "Generic XML"; //$NON-NLS-1$

	private String schemaName = null;

	public TemplateBuilderUIImpl(TemplateLayoutUIModel templateModel, String serviceUrl)
	{
		this.templateModel = templateModel;
		TEGAS_URL = serviceUrl;
	}

	public static String TEGAS_URL = null;

	public String buildTemplateJson() throws Exception
	{
		String templateJson = null;

		// add schema
		if (!CommonUtils.isNullOrEmpty(templateModel.getXmlUrl()))
		{
			schemaName = "test";
			templateJson = buildSchema(schemaName, SCHEMA_TYPE_GENERIC_XML, null, TEGAS_URL + "/api/utils/xmltoxsd?url=" + templateModel.getXmlUrl(), null, templateJson);
		}

		// add top container
		TemplateElement containerElement = buildElement("top container", TemplateConstants.ELEMENT_CONTAINER, null, null, null, null, null, null, true);
		templateJson = addElement(containerElement, TemplateConstants.OPERATION_ADD, null, null, templateJson);
		Template template = (Template) JSONUtils.readValue(templateJson, Template.class);
		String topContainerId = template.getLastActedElement().getId();

		// build title
		if (!CommonUtils.isNullOrEmpty(templateModel.getDocumentTitle()))
		{
			templateJson = buildDocumentTitle(topContainerId, templateModel.getDocumentTitle(), templateJson);
		}

		// add toc
		if (templateModel.isHasToc())
		{
			templateJson = buildTableOfContents(topContainerId, templateModel.getTocTitle(), templateJson);
		}

		// add sections
		if (templateModel.getSections() != null)
		{
			for (TemplateUISection section : templateModel.getSections())
			{
				templateJson = buildSection(topContainerId, section, templateJson);
			}
		}

		return templateJson;
	}

	public String buildTemplate(String templateJson) throws IOException
	{
		MultivaluedMap<String, String> formData = new MultivaluedMapImpl();
		formData.add("template", templateJson);

		ClientResponse response = makeServiceCall(TEGAS_URL + "/api", Arrays.asList("template", "createdta"), formData, null, "POST", MediaType.APPLICATION_OCTET_STREAM);
		InputStream inputStream = response.getEntity(InputStream.class);

		String templatePath = System.getProperty("java.io.tmpdir") + "template_" + UUID.randomUUID().toString() + ".dta";
		FileOutputStream fos = new FileOutputStream(templatePath);
		IOUtils.copy(inputStream, fos);
		fos.flush();
		fos.close();

		System.out.println("Template path: \n" + templatePath);

		return templatePath;
	}

	private String
			buildSchema(String name, String type, String description, String url, String id, String templateJson)
					throws Exception
	{
		TemplateSchema schema = new TemplateSchema(name, type, description);
		schema.setUri(url);
		if (id != null)
		{
			schema.setId(id);
		}
		else
		{
			schema.setId(null);
		}

		ClientResponse response = callTemplateServiceAPI(templateJson, JSONUtils.writeValue(schema), null);

		if (!checkResponse(response))
		{
			throw new Exception(response.getStatusInfo().getReasonPhrase());
		}

		return response.getEntity(String.class);
	}

	private String buildDocumentTitle(String parentId, String documentTitle, String templateJson) throws Exception
	{
		Map<String, String> properties = new HashMap<String, String>();
		properties.put(TemplateConstants.STYLE_NAME, DOCUMENT_TITLE_STYLE);
		TemplateElement paragraphElement = buildElement(null, TemplateConstants.ELEMENT_PARAGPRAPH, null, null, null, null, null, properties, true);
		templateJson = addElement(paragraphElement, TemplateConstants.OPERATION_ADD, parentId, TemplateConstants.LOCATION_CHILD, templateJson);
		Template template = (Template) JSONUtils.readValue(templateJson, Template.class);
		properties = new HashMap<String, String>();

		// add title
		TemplateElement titleElement = buildElement(null, TemplateConstants.ELEMENT_TEXT, null, null, null, documentTitle, null, null, true);
		templateJson = addElement(titleElement, TemplateConstants.OPERATION_ADD, template.getLastActedElement().getId(), TemplateConstants.LOCATION_CHILD, templateJson);

		return templateJson;
	}

	private String buildTableOfContents(String parentId, String tocLabel, String templateJson) throws Exception
	{
		Map<String, String> properties = new HashMap<String, String>(3);
		// add toc container
		TemplateElement containerElement = buildElement(null, TemplateConstants.ELEMENT_CONTAINER, null, null, null, null, null, null, true);
		templateJson = addElement(containerElement, TemplateConstants.OPERATION_ADD, parentId, TemplateConstants.LOCATION_CHILD, templateJson);
		Template template = (Template) JSONUtils.readValue(templateJson, Template.class);
		String tocContainerId = template.getLastActedElement().getId();

		if (!CommonUtils.isNullOrEmpty(tocLabel))
		{
			properties = new HashMap<String, String>(3);
			properties.put(TemplateConstants.STYLE_NAME, "");
			TemplateElement paragraphElement = buildElement(null, TemplateConstants.ELEMENT_PARAGPRAPH, null, null, null, null, null, properties, true);
			templateJson = addElement(paragraphElement, TemplateConstants.OPERATION_ADD, tocContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
			template = (Template) JSONUtils.readValue(templateJson, Template.class);

			// add toc label
			TemplateElement titleElement = buildElement(null, TemplateConstants.ELEMENT_TEXT, null, null, null, tocLabel, null, null, true);
			templateJson = addElement(titleElement, TemplateConstants.OPERATION_ADD, template.getLastActedElement().getId(), TemplateConstants.LOCATION_CHILD, templateJson);
		}

		// add toc
		TemplateElement tocElement = buildElement(null, TemplateConstants.ELEMENT_TABLE_OF_CONTENTS, null, null, null, null, null, null, true);
		templateJson = addElement(tocElement, TemplateConstants.OPERATION_ADD, tocContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
		template = (Template) JSONUtils.readValue(templateJson, Template.class);

		return templateJson;
	}

	private String buildSection(String topContainerId, TemplateUISection section, String templateJson) throws Exception
	{
		if (FORMAT_TABLE.equals(section.getFormat()))
		{
			return buildTableSection(topContainerId, section, templateJson);
		}
		else if (FORMAT_PARAGPRAH.equals(section.getFormat()))
		{
			return buildParagraphSection(topContainerId, section, templateJson);
		}
		else if (FORMAT_STATIC_CONTENT.equals(section.getFormat()))
		{
			return buildStaticContentSection(topContainerId, section, templateJson);
		}
		return templateJson;
	}

	private String buildTableSection(String topContainerId, TemplateUISection section, String templateJson)
			throws Exception
	{
		boolean isQueryAdded = false;
		String tableContainerId = null;
		String contextId = null;

		TemplateElement containerElement = buildElement(null, TemplateConstants.ELEMENT_CONTAINER, null, null, null, null, null, null, true);

		if (!CommonUtils.isNullOrEmpty(section.getTitleQuery()))
		{
			isQueryAdded = true;
			containerElement.setQuery(getExceptLastSegment(section.getTitle(), QUERY_DELIMITER));
			containerElement.setSchema(schemaName);
		}

		templateJson = addElement(containerElement, TemplateConstants.OPERATION_ADD, topContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
		Template template = (Template) JSONUtils.readValue(templateJson, Template.class);
		tableContainerId = template.getLastActedElement().getId();

		// add table title
		Map<String, String> properties = new HashMap<String, String>();
		if (!CommonUtils.isNullOrEmpty(section.getTitle()))
		{
			TemplateElement paragraphElement = buildElement(null, TemplateConstants.ELEMENT_PARAGPRAPH, null, null, null, null, null, properties, true);
			templateJson = addElement(paragraphElement, TemplateConstants.OPERATION_ADD, tableContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
			template = (Template) JSONUtils.readValue(templateJson, Template.class);

			// add table title
			TemplateElement titleElement = buildElement(null, TemplateConstants.ELEMENT_TEXT, null, null, null, section.getTitle(), null, null, true);

			if (isQueryAdded)
			{
				titleElement.setSchema(schemaName);
				titleElement.setContent(section.getTitle());
				titleElement.setContext(tableContainerId);
			}
			templateJson = addElement(titleElement, TemplateConstants.OPERATION_ADD, template.getLastActedElement().getId(), TemplateConstants.LOCATION_CHILD, templateJson);
		}

		// add table
		if (!CommonUtils.isNullOrEmpty(section.getDataAttributesList()))
		{
			TemplateElement tableElement = buildElement(null, TemplateConstants.ELEMENT_TABLE, null, null, null, null, null, null, true);
			templateJson = addElement(tableElement, TemplateConstants.OPERATION_ADD, tableContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
			template = (Template) JSONUtils.readValue(templateJson, Template.class);

			String tableId = template.getLastActedElement().getId();

			// add table header row
			TemplateElement rowElement = buildElement(null, TemplateConstants.ELEMENT_ROW, null, null, null, null, null, null, true);
			templateJson = addElement(rowElement, TemplateConstants.OPERATION_ADD, tableId, TemplateConstants.LOCATION_CHILD, templateJson);
			template = (Template) JSONUtils.readValue(templateJson, Template.class);

			String rowId = template.getLastActedElement().getId();
			String dataQuery = null;

			// add header cells
			properties = new HashMap<String, String>();
			properties.put(TemplateConstants.STYLE_NAME, TABLE_HEADER_CELL_STYLE);
			for (Map<String, String> dataAttributes : section.getDataAttributesList())
			{
				if (dataQuery == null)
				{
					dataQuery = getExceptLastSegment(dataAttributes.get(ATTRIBUTE_QUERY), QUERY_DELIMITER);
				}
				TemplateElement cellElement = buildElement(null, TemplateConstants.ELEMENT_CELL, null, null, null, null, null, properties, true);
				templateJson = addElement(cellElement, TemplateConstants.OPERATION_ADD, rowId, TemplateConstants.LOCATION_CHILD, templateJson);
				template = (Template) JSONUtils.readValue(templateJson, Template.class);

				TemplateElement textElement = buildElement(null, TemplateConstants.ELEMENT_TEXT, null, null, null, dataAttributes.get("label"), null, null, true);
				templateJson = addElement(textElement, TemplateConstants.OPERATION_ADD, template.getLastActedElement().getId(), TemplateConstants.LOCATION_CHILD, templateJson);
			}

			// add table data row
			rowElement = buildElement(null, TemplateConstants.ELEMENT_ROW, null, null, null, null, null, null, true);
			if (!isQueryAdded)
			{
				rowElement.setSchema(schemaName);
				rowElement.setQuery(dataQuery);
			}
			else
			{
				contextId = tableContainerId;
			}

			templateJson = addElement(rowElement, TemplateConstants.OPERATION_ADD, tableId, TemplateConstants.LOCATION_CHILD, templateJson);
			template = (Template) JSONUtils.readValue(templateJson, Template.class);

			rowId = template.getLastActedElement().getId();

			if (!isQueryAdded)
			{
				contextId = rowId;
			}

			// add data cells
			properties = new HashMap<String, String>();
			for (Map<String, String> dataAttributes : section.getDataAttributesList())
			{
				TemplateElement cellElement = buildElement(null, TemplateConstants.ELEMENT_CELL, null, null, null, null, null, properties, true);
				templateJson = addElement(cellElement, TemplateConstants.OPERATION_ADD, rowId, TemplateConstants.LOCATION_CHILD, templateJson);
				template = (Template) JSONUtils.readValue(templateJson, Template.class);

				TemplateElement textElement = buildElement(null, TemplateConstants.ELEMENT_TEXT, null, contextId, null, dataAttributes.get(ATTRIBUTE_QUERY), null, null, true);
				templateJson = addElement(textElement, TemplateConstants.OPERATION_ADD, template.getLastActedElement().getId(), TemplateConstants.LOCATION_CHILD, templateJson);
			}
		}

		return templateJson;
	}

	private String buildParagraphSection(String topContainerId, TemplateUISection section, String templateJson)
			throws Exception
	{

		boolean isQueryAdded = false;
		String paraContainerId = null;
		String contextId = null;

		TemplateElement containerElement = buildElement(null, TemplateConstants.ELEMENT_CONTAINER, null, null, null, null, null, null, true);

		if (!CommonUtils.isNullOrEmpty(section.getTitleQuery()))
		{
			isQueryAdded = true;
			containerElement.setQuery(getExceptLastSegment(section.getTitle(), QUERY_DELIMITER));
			containerElement.setSchema(schemaName);
		}

		templateJson = addElement(containerElement, TemplateConstants.OPERATION_ADD, topContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
		Template template = (Template) JSONUtils.readValue(templateJson, Template.class);
		paraContainerId = template.getLastActedElement().getId();

		if (isQueryAdded)
		{
			contextId = paraContainerId;
		}

		// add paragraph title
		Map<String, String> properties = new HashMap<String, String>();
		if (!CommonUtils.isNullOrEmpty(section.getTitle()))
		{
			TemplateElement paragraphElement = buildElement(null, TemplateConstants.ELEMENT_PARAGPRAPH, null, null, null, null, null, properties, true);
			templateJson = addElement(paragraphElement, TemplateConstants.OPERATION_ADD, paraContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
			template = (Template) JSONUtils.readValue(templateJson, Template.class);

			// add table title
			TemplateElement titleElement = buildElement(null, TemplateConstants.ELEMENT_TEXT, null, null, null, section.getTitle(), null, null, true);

			if (isQueryAdded)
			{
				titleElement.setSchema(schemaName);
				titleElement.setContent(section.getTitle());
				titleElement.setContext(paraContainerId);
			}
			templateJson = addElement(titleElement, TemplateConstants.OPERATION_ADD, template.getLastActedElement().getId(), TemplateConstants.LOCATION_CHILD, templateJson);
		}

		// add paragraph attributes
		if (!CommonUtils.isNullOrEmpty(section.getDataAttributesList()))
		{
			String paraAttrContainerId = paraContainerId;
			if (!isQueryAdded)
			{
				TemplateElement paraAttrContainerElement = buildElement(null, TemplateConstants.ELEMENT_PARAGPRAPH, null, null, getExceptLastSegment(section.getDataAttributesList().get(0).get(ATTRIBUTE_QUERY), QUERY_DELIMITER), null, schemaName, null, true);
				templateJson = addElement(paraAttrContainerElement, TemplateConstants.OPERATION_ADD, paraContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
				template = (Template) JSONUtils.readValue(templateJson, Template.class);
				paraAttrContainerId = template.getLastActedElement().getId();
				;
				contextId = paraAttrContainerId;
			}

			properties = new HashMap<String, String>();
			properties.put(TemplateConstants.STYLE_NAME, TABLE_HEADER_CELL_STYLE);
			for (Map<String, String> dataAttributes : section.getDataAttributesList())
			{
				TemplateElement paragraphElement = buildElement(null, TemplateConstants.ELEMENT_PARAGPRAPH, null, null, null, null, null, null, true);
				templateJson = addElement(paragraphElement, TemplateConstants.OPERATION_ADD, paraAttrContainerId, TemplateConstants.LOCATION_CHILD, templateJson);
				template = (Template) JSONUtils.readValue(templateJson, Template.class);

				String paraId = template.getLastActedElement().getId();

				TemplateElement textElement = buildElement(null, TemplateConstants.ELEMENT_TEXT, null, null, null, dataAttributes.get(ATTRIBUTE_LABEL) + " ", null, properties, true);
				templateJson = addElement(textElement, TemplateConstants.OPERATION_ADD, paraId, TemplateConstants.LOCATION_CHILD, templateJson);

				textElement = buildElement(null, TemplateConstants.ELEMENT_TEXT, null, contextId, null, dataAttributes.get(ATTRIBUTE_QUERY), null, null, true);
				templateJson = addElement(textElement, TemplateConstants.OPERATION_ADD, paraId, TemplateConstants.LOCATION_CHILD, templateJson);
			}

			// add empty paragraph
			TemplateElement paragraphElement = buildElement(null, TemplateConstants.ELEMENT_PARAGPRAPH, null, null, null, null, null, null, true);
			templateJson = addElement(paragraphElement, TemplateConstants.OPERATION_ADD, isQueryAdded ? paraContainerId : contextId, TemplateConstants.LOCATION_CHILD, templateJson);
		}
		return templateJson;
	}

	private String buildStaticContentSection(String topContainerId, TemplateUISection section, String templateJson)
	{

		return templateJson;
	}

	private String addElement(TemplateElement element, String operationType, String locationId, String location,
			String templateJson) throws Exception
	{
		ClientResponse response = callTemplateServiceAPI(templateJson, null, buildOperationJson(operationType, element, locationId, location));

		if (!checkResponse(response))
		{
			throw new Exception(response.getStatusInfo().getReasonPhrase());
		}

		return response.getEntity(String.class);
	}

	private TemplateElement buildElement(String name, String type, String id, String context, String query,
			String content, String schema, Map<String, String> properties, boolean setItToNull)
	{
		TemplateElement element = new TemplateElement(name, type, ""); //$NON-NLS-1$
		if (id != null)
		{
			element.setId(id);
		}

		if (setItToNull)
		{
			element.setId(null);
		}

		element.setContent(content);
		element.setContext(context);
		element.setQuery(query);
		element.setSchema(schema);

		if (properties != null)
		{
			for (Map.Entry<String, String> entry : properties.entrySet())
			{
				element.addProperty(entry.getKey(), entry.getValue());
			}
		}

		return element;
	}

	private Operation buildOperation(String opType, TemplateElement element, String locationId, String location)
	{
		Operation operation = new Operation(opType, element);
		operation.setLocation(location);
		operation.setLocationId(locationId);

		return operation;
	}

	private String buildOperationJson(String opType, TemplateElement element, String locationId, String location)
			throws IOException
	{
		return JSONUtils.writeValue(buildOperation(opType, element, locationId, location));
	}

	private ClientResponse callTemplateServiceAPI(String templateJson, String schemaJson, String templateElementJson)
			throws IOException
	{
		MultivaluedMap<String, String> formData = new MultivaluedMapImpl();

		formData.add("template", templateJson);
		formData.add("templateElementJson", templateElementJson);
		formData.add("schema", schemaJson);

		List<String> pathParams = Arrays.asList("template", "change");

		return makeServiceCall(TEGAS_URL + "/api", pathParams, formData, null, "POST", MediaType.APPLICATION_JSON);
	}

	private boolean checkResponse(ClientResponse response)
	{
		if (Response.Status.Family.SUCCESSFUL != response.getStatusInfo().getFamily())
		{
			System.out.println(">>> ERROR: " + response.getStatusInfo().getStatusCode());
			System.out.println(">>> Reason: " + response.getStatusInfo().getReasonPhrase());
			System.out.println(">>> Content: " + response.getEntity(String.class));
		}

		return Response.Status.Family.SUCCESSFUL == response.getStatusInfo().getFamily();
	}

	protected ClientResponse makeServiceCall(String baseUrl, List<String> pathParams,
			MultivaluedMap<String, String> formData, MultivaluedMap<String, String> queryData, String httpMethodType,
			String contentType) throws IOException
	{
		Client client = new Client();
		WebResource service = client.resource(UriBuilder.fromUri(baseUrl).build());

		if (pathParams != null)
		{
			for (String pathParam : pathParams)
			{
				service = service.path(pathParam);
			}
		}

		if (formData == null)
		{
			formData = new MultivaluedMapImpl();
		}

		if (queryData == null)
		{
			queryData = new MultivaluedMapImpl();
		}

		ClientResponse response = null;
		String accept = MediaType.APPLICATION_JSON;

		if (!CommonUtils.isNullOrEmpty(contentType))
		{
			accept = contentType;
		}

		if (!CommonUtils.isNullOrEmpty(httpMethodType))
		{
			if ("POST".equals(httpMethodType.toUpperCase()))
			{
				response = service.queryParams(queryData).accept(accept).post(ClientResponse.class, formData);
			}
			else if ("GET".equals(httpMethodType.toUpperCase()))
			{
				response = service.queryParams(queryData).accept(accept).get(ClientResponse.class);
			}
			else if ("DELETE".equals(httpMethodType.toUpperCase()))
			{
				response = service.queryParams(queryData).accept(accept).delete(ClientResponse.class, formData);
			}
		}
		return response;
	}

	private String getExceptLastSegment(String query, String delimiter)
	{
		if (query != null)
		{
			if (query.indexOf(delimiter) != -1)
			{
				return query.substring(0, query.lastIndexOf(delimiter));
			}
			else
			{
				return query;
			}
		}
		return null;
	}

	private String getLastSegment(String query, String delimiter)
	{
		if (query != null)
		{
			if (query.indexOf(delimiter) != -1)
			{
				String[] segments = query.split(delimiter);
				return segments[segments.length - 1];
			}
			else
			{
				return query;
			}
		}
		return null;
	}
}
