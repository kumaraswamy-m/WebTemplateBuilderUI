package com.ibm.rpe.web.template.ui;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.ibm.rpe.web.utils.FileUtils;
import com.ibm.rpe.web.utils.JSONUtils;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

/**
 * Servlet implementation class ReturnJson
 */
@WebServlet("/ReturnJson")
public class ReturnJson extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static String ELEMENT = "element";
	public static String ATTRIBUTE = "attribute";
	public static final String NAME = "name";
	private static final int String = 0;
	public static int ELEMENT_ID = 1;
	public static int id = 10;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ReturnJson() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String url = request.getParameter("url");
		System.out.println(url);

		Client client = new Client();
		WebResource service = client.resource(UriBuilder.fromUri(
				"http://localhost:8080/rpet/api/xmltoxsd?url=" + url).build());

		// create the job
		ClientResponse clientResponse = service.accept(
				MediaType.APPLICATION_XML).get(ClientResponse.class);
		if (Response.Status.OK.getStatusCode() != clientResponse.getStatus()) {
			// return Response.serverError().status(Status.BAD_REQUEST)
			// .entity(clientResponse.getEntity(String.class)).build();
		}
		InputStream is = clientResponse.getEntityInputStream();
		String xsdString = FileUtils.getStringFromInputStream(is);

		String jsonData = buildJson(xsdString);
		response.getWriter().write(jsonData);
	}

	private String buildJson(String inputXSD) throws IOException {
		ELEMENT = "element";
		ATTRIBUTE = "attribute";
		ELEMENT_ID = 1;
		id++;
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = null;
		try {
			builder = factory.newDocumentBuilder();
		} catch (ParserConfigurationException e1) {
			e1.printStackTrace();
		}

		String tempPath = System.getProperty("java.io.tmpdir") + "xsd_" + UUID.randomUUID().toString() + File.separator; //$NON-NLS-1$
		String xsdFilePath = tempPath + "xsd_" + UUID.randomUUID().toString()
				+ ".xsd";
		FileUtils.createFileParent(xsdFilePath);
		FileUtils.writeFile(xsdFilePath, inputXSD);

		Document document = null;
		try {
			document = builder.parse(new File(xsdFilePath));
		} catch (SAXException e1) {
			e1.printStackTrace();
		}
		List<TreeElement> parentList = new ArrayList<TreeElement>();
		List<Node> parentNodeList = new ArrayList<Node>();
		Node firstChild = document.getFirstChild().getFirstChild();
		if (document.getFirstChild().getNodeType() == Node.ELEMENT_NODE) {
			Element firstElement = (Element) document.getFirstChild();
			String prefix = firstElement.getTagName();

			if (prefix.indexOf(":") != -1) {
				prefix = prefix.substring(0, prefix.indexOf(":") + 1);
				ELEMENT = prefix + ELEMENT;
				ATTRIBUTE = prefix + ATTRIBUTE;
			}
		}

		Map<Node, TreeElement> mapNode = new HashMap<Node, TreeElement>();

		while (firstChild.getNextSibling() != null) {
			Node parentNode = firstChild.getNextSibling();
			if (parentNode.getNodeType() == Node.ELEMENT_NODE) {
				Element ele = (Element) parentNode;
				if (ELEMENT.equals(ele.getTagName())) {
					parentNodeList.add(parentNode);
				}
			}
			firstChild = firstChild.getNextSibling();
		}

		for (Node parentNode : parentNodeList) {
			Element e = (Element) parentNode;
			TreeElement parentResultElement = new TreeElement(
					e.getAttribute(NAME));
			parentResultElement.setId(Integer.toString(ELEMENT_ID++));
			mapNode.put(parentNode, parentResultElement);

			traversal(parentResultElement, e.getElementsByTagName(ELEMENT),
					mapNode);
			attributeTraversal(parentResultElement,
					e.getElementsByTagName(ATTRIBUTE), mapNode);

			parentList.add(parentResultElement);

		}
		return JSONUtils.writeValue(parentList);
	}

	private static void traversal(TreeElement parentEleTag, NodeList nodeList,
			Map<Node, TreeElement> nodeMap) {
		for (int i = 0; i < nodeList.getLength(); i++) {

			Node node = nodeList.item(i);

			if (node.getNodeType() == Node.ELEMENT_NODE) {
				Element ele = (Element) node;
				if (ELEMENT.equals(ele.getTagName())) {
					Element e = (Element) node;
					Node parentNode = node.getParentNode();
					while (parentNode != null) {
						if (parentNode.getNodeType() == Node.ELEMENT_NODE) {
							Element parentEle = (Element) parentNode;
							if (ELEMENT.equals(parentEle.getTagName())) {
								if (nodeMap.containsKey(parentNode)) {
									TreeElement parent = nodeMap
											.get(parentNode);

									TreeElement childNode = new TreeElement(
											e.getAttribute("name"));
									childNode.setId(Integer
											.toString(ELEMENT_ID++));
									parent.addChildren(childNode);
									nodeMap.put(node, childNode);
									break;
								}
							}
						}
						parentNode = parentNode.getParentNode();
					}
				}
			}
		}
	}

	private static void attributeTraversal(TreeElement parentEleTag,
			NodeList nodeList, Map<Node, TreeElement> nodeMap) {
		for (int i = 0; i < nodeList.getLength(); i++) {

			Node node = nodeList.item(i);

			if (node.getNodeType() == Node.ELEMENT_NODE) {
				Element ele = (Element) node;
				if (ATTRIBUTE.equals(ele.getTagName())) {
					Element e = (Element) node;
					Node parentNode = node.getParentNode();
					while (parentNode != null) {
						if (parentNode.getNodeType() == Node.ELEMENT_NODE) {
							Element parentEle = (Element) parentNode;
							if (ELEMENT.equals(parentEle.getTagName())) {
								if (nodeMap.containsKey(parentNode)) {
									TreeElement parent = nodeMap
											.get(parentNode);

									TreeElement childNode = new TreeElement(
											e.getAttribute("name"));
									childNode.setId(Integer
											.toString(ELEMENT_ID++));
									parent.addChildren(childNode);
									break;
								}
							}
						}
						parentNode = parentNode.getParentNode();
					}
				}
			}
		}
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
