<%@ page language="java" contentType="text; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="javax.sql.*" %><%@ page import="java.sql.*" %><%@ page import="com.sun.rowset.CachedRowSetImpl" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Cache-Control", "no-cache");    //HTTP 1.0
    response.setHeader("Expires", "0");                 //防止被proxy
%><%!
	DbProcManager dpm = new DbProcManager("demo");
%><%
	int start = Integer.parseInt(request.getParameter("start"));
	int limit = Integer.parseInt(request.getParameter("limit"));
	String callbackStr = request.getParameter("callback");
	String sql = request.getParameter("sql");
	int pages = Integer.parseInt(request.getParameter("page"));
	if(dpm.getArray()==null||dpm.getArray().length()<=0){
		dpm.DbProcess(sql, "", "test1");
	}
	JSONObject obj = new JSONObject();
	obj.put("gridDemoDataColumn", dpm.getArray2());
	obj.put("gridDemoData", dpm.getArray().getJSONArraySection(start, limit)).put("totalCount",dpm.getArray().length());
	out.print(callbackStr+"("+obj+");");
%>