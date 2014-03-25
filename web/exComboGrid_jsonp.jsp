<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	//int start = Integer.parseInt(request.getParameter("start"));
	//int limit = Integer.parseInt(request.getParameter("limit"));
	//sql = new String(sql.getBytes("ISO8859-1"), "UTF-8");
    String callbackStr = request.getParameter("callback");
	String sql = request.getParameter("sql");
	System.out.println(sql);
	sql = new String(sql.getBytes("ISO8859-1"), "UTF-8");
	String databaseName = request.getParameter("dbName");
	//int pages = Integer.parseInt(request.getParameter("page"));
	//String workstationId = request.getParameter("workstationId");
	//seria_num = seria_num.isEmpty()?"0":seria_num;

	JSONObject obj = new JSONObject();
	DbProcManager dpm = new DbProcManager(databaseName);
	System.out.println(sql);
	//              dpm.DbProcessToJsonp(sql, "", "sys_document_order" ,0 ,1 ,callbackStr ,defaultRec);
	String result = dpm.DbProcessToJsonp(sql, "", "exComboGrid" ,0 ,100 ,callbackStr ,"");
	out.print( result );
%>