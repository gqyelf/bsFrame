<%@ page language="java" contentType="text; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.bsManager" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Cache-Control", "no-cache");    //HTTP 1.0
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	int start = Integer.parseInt(request.getParameter("start"));
	int limit = Integer.parseInt(request.getParameter("limit"));
	bsManager bm = new bsManager();
	//out.print(bm.toJson2(0,start,limit,""));
%>