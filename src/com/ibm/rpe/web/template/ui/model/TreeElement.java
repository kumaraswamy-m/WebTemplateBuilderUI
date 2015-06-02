package com.ibm.rpe.web.template.ui.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(Include.NON_EMPTY)
public class TreeElement {
	@JsonProperty("id")
	private String id;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@JsonProperty("state")
	private final boolean state = false;


	@JsonProperty("text")
	private String text;

	@JsonProperty("children")
	private List<TreeElement> children = null;

	public TreeElement(String text) {
		this.text = text;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@JsonIgnore
	public void addChildren(TreeElement element) {
		if (this.children == null) {
			this.children = new ArrayList<TreeElement>();
		}
		this.children.add(element);
	}
  }