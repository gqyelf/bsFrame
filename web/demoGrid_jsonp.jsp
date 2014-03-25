<%@ page language="java" contentType="text; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Cache-Control", "no-cache");    //HTTP 1.0
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	int start = Integer.parseInt(request.getParameter("start"));
	int limit = Integer.parseInt(request.getParameter("limit"));
	String callbackStr = request.getParameter("callback");
	int pages = Integer.parseInt(request.getParameter("page"));
	String sql = "select * from detail_table_tmp order by id";
	String dbname = "demo";
	JSONObject obj = new JSONObject();
	DbProcManager dpm = new DbProcManager(dbname);
	//out.print( dpm.DbProcessToJsonp(sql, "", "Demo" ,start ,limit ,callbackStr).toString() );
	// JSONObject obj = new JSONObject();
/* 	obj.put("gridDemoDataColumn", dpm.getArray2());
	obj.put("gridDemoData", dpm.getArray().getJSONArraySection(start, limit)).put("totalCount",dpm.getArray().length());
	out.print(callbackStr+"("+obj+");");
 */
%>