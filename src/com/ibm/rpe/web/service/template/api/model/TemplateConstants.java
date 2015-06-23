/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.service.template.api.model;

import java.util.ArrayList;
import java.util.List;

public class TemplateConstants
{

	public static final List<String> ALLOWED_ELEMENT_OPERATION = new ArrayList<String>();
	public static final String OPERATION_ADD = "add"; //$NON-NLS-1$
	public static final String OPERATION_MODIFY = "modify"; //$NON-NLS-1$
	public static final String OPERATION_DELETE = "delete"; //$NON-NLS-1$

	// Location
	public static final List<String> ALLOWED_LOCATION = new ArrayList<String>();
	public static final String LOCATION_ID = "location_id"; //$NON-NLS-1$
	public static final String LOCATION = "location"; //$NON-NLS-1$
	public static final String LOCATION_CHILD = "child"; //$NON-NLS-1$
	public static final String LOCATION_BEFORE = "before"; //$NON-NLS-1$
	public static final String LOCATION_AFTER = "after"; //$NON-NLS-1$
	
	static
	{
		ALLOWED_ELEMENT_OPERATION.add(OPERATION_ADD);
		ALLOWED_ELEMENT_OPERATION.add(OPERATION_MODIFY);
		ALLOWED_ELEMENT_OPERATION.add(OPERATION_DELETE);

		ALLOWED_LOCATION.add(LOCATION_CHILD);
		ALLOWED_LOCATION.add(LOCATION_BEFORE);
		ALLOWED_LOCATION.add(LOCATION_AFTER);
	}
	public static final String TEMPLATE = "template"; //$NON-NLS-1$
	public static final String ENCODING_UTF8 = "UTF-8"; //$NON-NLS-1$

	// Elements
	public static final String ELEMENT_CONTAINER = "container"; //$NON-NLS-1$
	public static final String ELEMENT_PARAGPRAPH = "paragraph"; //$NON-NLS-1$
	public static final String ELEMENT_TEXT = "text"; //$NON-NLS-1$
	public static final String ELEMENT_TABLE = "table"; //$NON-NLS-1$
	public static final String ELEMENT_ROW = "row"; //$NON-NLS-1$
	public static final String ELEMENT_CELL = "cell"; //$NON-NLS-1$
	public static final String ELEMENT_TABLE_OF_CONTENTS = "table of contents"; //$NON-NLS-1$
	public static final String ELEMENT_IMAGE = "image"; //$NON-NLS-1$
	public static final String ELEMENT_HYPERLINK = "hyperlink"; //$NON-NLS-1$
	public static final String ELEMENT_PAGE_BREAK = "page break"; //$NON-NLS-1$
	public static final String ELEMENT_SECTION_BREAK = "section break"; //$NON-NLS-1$

	// End Elements

	// Properties
	public static final String STYLE_NAME = "style name"; //$NON-NLS-1$
	public static final String HYPERLINK_DISPLAY = "display"; //$NON-NLS-1$

	// End Properties

	// expression type
	public static final String EXPRESSION_TEXT = "text"; //$NON-NLS-1$
	public static final String EXPRESSION_QUERY = "query"; //$NON-NLS-1$
	public static final String EXPRESSION_SCRIPT = "script"; //$NON-NLS-1$
	
	public static final String SCHEMA = "schema"; //$NON-NLS-1$
	public static final String ELEMENT = "element"; //$NON-NLS-1$
	public static final String PROPERTY = "property"; //$NON-NLS-1$
	public static final String NAME = "name"; //$NON-NLS-1$
	public static final String ID = "id"; //$NON-NLS-1$
}
