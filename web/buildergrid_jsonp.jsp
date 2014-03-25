<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	int start = Integer.parseInt(request.getParameter("start"));
	int limit = Integer.parseInt(request.getParameter("limit"));
	String callbackStr = request.getParameter("callback");
	String defaultRec = request.getParameter("defaultRec");
	String sessionId = request.getParameter("sessionId");
	String databaseName = request.getParameter("dbName");
	String seria_num = request.getParameter("seria_num");
	String tableStr = request.getParameter("table");
	String sqlParm = request.getParameter("sql");
	String sys_id = request.getParameter("sysid");
	String work_time = request.getParameter("worktime");
	int pages = Integer.parseInt(request.getParameter("page"));
	String workstationId = request.getParameter("workstationId");
	seria_num = seria_num.isEmpty()?"0":seria_num;
	String sql;
	if(workstationId==null){
	    sql = ( sqlParm.isEmpty() ? "select * from "+tableStr+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' and seria_num = "+seria_num+" order by entry_num" : sqlParm ) ; //变量代替
	}else{
	    sql = ( sqlParm.isEmpty() ? "select * from "+tableStr+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' and seria_num = "+seria_num+" and workstation_id = '"+workstationId+"' order by entry_num" : sqlParm ) ; //变量代替
	}
	JSONObject obj = new JSONObject();
	DbProcManager dpm = new DbProcManager(databaseName);
	String result = dpm.DbProcessToJsonp(sql, "", "sys_document_order_detail" ,start ,limit ,callbackStr ,defaultRec);
	out.print( result );
%>