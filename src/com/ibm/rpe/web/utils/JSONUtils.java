/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2014, 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.utils;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.SimpleTimeZone;

import com.fasterxml.jackson.databind.ObjectMapper;

public class JSONUtils {
	public static SimpleDateFormat getSDFISO8601() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
		sdf.setTimeZone(new SimpleTimeZone(SimpleTimeZone.UTC_TIME, "UTC")); //$NON-NLS-1$
		return sdf;
	}

	public static String writeValue(Object object) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		mapper.setDateFormat(getSDFISO8601());
		return mapper.writeValueAsString(object);
	}

	public static Object readValue(String value, Class<?> clazz)
			throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(value, clazz);
	}
}
