/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2015. All Rights Reserved.
 * 
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp. 
 *******************************************************************************/
package com.ibm.rpe.web.service.template.api.model;

public class TeGaSException extends Exception
{

	private static final long serialVersionUID = 1L;

	public TeGaSException(Throwable e)
	{
		super(e.getMessage(), e);
	}

	public TeGaSException(String reason, Throwable e)
	{
		super(reason, e);
	}

	public TeGaSException(String s)
	{
		super(s);
	}

}
