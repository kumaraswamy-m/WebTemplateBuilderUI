/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.utils;

import java.util.List;

public class CommonUtils
{
	public static boolean isNullOrEmpty(String value)
	{
		return value == null || value.isEmpty();
	}

	public static boolean isNullOrEmpty(List<?> list)
	{
		return list == null || list.isEmpty();
	}

	public static String removeTrailingCharacter(String path, String trailingCharacter)
	{
		if (path != null)
		{
			while (path.lastIndexOf(trailingCharacter) == path.length() - 1)
			{
				path = path.substring(0, path.length() - 1);
			}
			return path;
		}
		return null;
	}
}
