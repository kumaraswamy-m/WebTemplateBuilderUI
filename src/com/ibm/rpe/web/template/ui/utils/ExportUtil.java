/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.template.ui.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class ExportUtil
{

	public static String readFile(File file) throws FileNotFoundException
	{
		String result = ""; //$NON-NLS-1$
		if (file != null && file.exists())
		{
			return readFile(new FileInputStream(file));
		}

		return result;
	}

	public static String readFile(InputStream fileInputStream)
	{
		String result = ""; //$NON-NLS-1$
		StringBuilder buf = new StringBuilder();
		if (fileInputStream != null)
		{
			try
			{
				byte[] buffer = new byte[8192];
				int charsRead = fileInputStream.read(buffer);
				while (charsRead != -1)
				{
					buf.append(new String(buffer, 0, charsRead));
					charsRead = fileInputStream.read(buffer);
				}
				fileInputStream.close();
				result = buf.toString();
			}
			catch (Exception e)
			{
				result = ""; //$NON-NLS-1$
			}
			finally
			{
				if (fileInputStream != null)
				{
					try
					{
						fileInputStream.close();
					}
					catch (IOException e)
					{
					}
				}
			}
		}

		return result;
	}
}
