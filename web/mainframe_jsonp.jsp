<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	String callbackStr = request.getParameter("callback");
	String databaseName = request.getParameter("dbName");
	String sql = "select sys_id ,category ,kind ,caption from sys_document where xtype = 'model'";
	DbProcManager dpm = new DbProcManager(databaseName);
	String result = dpm.DbProcessToJsonp(sql, "", "sys_document_menu" ,0 ,100 ,callbackStr ,"");
	out.print( result );
%>