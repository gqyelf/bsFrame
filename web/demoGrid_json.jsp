<%@ page language="java" contentType="text; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Cache-Control", "no-cache");    //HTTP 1.0
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	String sql = "select * from detail_table_tmp order by id";
	String dbname = "demo";
	JSONObject obj = new JSONObject();
	DbProcManager dpm = new DbProcManager(dbname);
	out.print(dpm.DbProcessToJson(sql, "", "Demo").toString());
%>