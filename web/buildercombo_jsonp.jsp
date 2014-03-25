<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	//http://localhost:8080/bsTest/buildergrid_jsonp.jsp?_dc=1364736848961&page=1&start=0&limit=100&callback=Ext.data.JsonP.callback1
	String databaseName = request.getParameter("dbName");
	String sqlProcess = request.getParameter("sql");
	JSONObject obj = new JSONObject();
	DbProcManager dpm = new DbProcManager("demo");
	String result = dpm.DbProcessToJsonp("exec "+sqlProcess , "", "combo" ,0 ,-1 ,"" ,"");
	out.print( result );
%>