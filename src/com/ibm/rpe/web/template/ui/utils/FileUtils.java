/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.template.ui.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class FileUtils
{

	public static void zipFiles(String filesPathToZip, String pathToSave) throws IOException
	{
		File filesToZip = new File(filesPathToZip);

		ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(new File(pathToSave)));
		try
		{
			archiveFile(null, zos, filesToZip);
		}
		finally
		{
			zos.close();
		}
	}

	public static void archiveFile(String relativePath, ZipOutputStream zos, File root) throws IOException
	{
		byte[] buffer = new byte[1024];

		File[] files = root.listFiles();
		for (int i = 0; i < files.length; i++)
		{
			File f = files[i];
			String path = null;
			if (relativePath == null)
			{
				path = f.getName();
			}
			else
			{
				path = relativePath + "/" + f.getName(); //$NON-NLS-1$
			}
			if (f.isDirectory())
			{
				archiveFile(path, zos, f);
			}
			else
			{
				ZipEntry entry = new ZipEntry(path);
				zos.putNextEntry(entry);
				FileInputStream in = null;

				try
				{
					in = new FileInputStream(f);
					int c = -1;
					while ((c = in.read(buffer)) != -1)
					{
						zos.write(buffer, 0, c);
					}
					zos.closeEntry();
				}
				finally
				{
					if (in != null)
					{
						in.close();
					}
				}
			}
		}
	}

	/**
	 * Creates the folder hierarchy for the given path. Example: for
	 * c:\dir1\dir2\readme.txt this function will create c:\dir1\dir2 if such a
	 * folder does not already exist
	 * 
	 * @param path
	 * @return
	 */
	public static boolean createFileParent(String path)
	{
		File f = new File(path);

		String parentPath = f.getParent();
		if (parentPath == null)
		{
			return false;
		}

		File parentFile = new File(parentPath);
		if (parentFile.isDirectory())
		{
			return true;
		}

		return parentFile.mkdirs();
	}

	public static void writeFile(String path, String contents) throws FileNotFoundException
	{
		PrintWriter writer = null;
		try
		{
			writer = new PrintWriter(path);
			writer.println(contents);
		}
		finally
		{
			if (writer != null)
			{
				writer.close();
			}
		}
	}
	
	public static String getStringFromInputStream(InputStream is) {

		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();

		String line;
		try {

			br = new BufferedReader(new InputStreamReader(is));
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return sb.toString();
	}

}
