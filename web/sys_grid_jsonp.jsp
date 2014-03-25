<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	//http://localhost:8080/bsTest/buildergrid_jsonp.jsp?_dc=1364736848961&page=1&start=0&limit=100&callback=Ext.data.JsonP.callback1
	int start = Integer.parseInt(request.getParameter("start"));
	int limit = Integer.parseInt(request.getParameter("limit"));
	String callbackStr = request.getParameter("callback");
	String defaultRec = request.getParameter("defaultRec");
	String sessionId = request.getParameter("sessionId");
	String tableStr = request.getParameter("table");
	String sqlParm = request.getParameter("sql");
	int pages = Integer.parseInt(request.getParameter("page"));
	
	String sql = ( sqlParm.isEmpty() ? "select * from "+tableStr+" where workstation_id = '"+sessionId+"' order by entry_num" : sqlParm ) ; //变量代替
	String dbname = "demo";
	JSONObject obj = new JSONObject();
	DbProcManager dpm = new DbProcManager(dbname);
	out.print( dpm.DbProcessToJsonp(sql, "", "sys_document" ,start ,limit ,callbackStr ,defaultRec).toString() );
%>