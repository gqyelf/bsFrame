<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
	//http://localhost:8080/bsTest/buildergrid_jsonp.jsp?_dc=1364736848961&page=1&start=0&limit=100&callback=Ext.data.JsonP.callback1
	String callbackStr = request.getParameter("callback");
	String defaultRec = request.getParameter("defaultRec");
	String sessionId = request.getParameter("sessionId");
	String tableStr = request.getParameter("table");
	String databaseName = request.getParameter("dbName");
	String sqlParm = request.getParameter("sql");
	String document_num = request.getParameter("document_num");
	String seria_num = request.getParameter("seria_num");
	String sys_id = request.getParameter("sysid");
	String work_time = request.getParameter("worktime");
	String sql = "";
	String sql2 = "";
	String direction = request.getParameter("direction");
    if(!seria_num.isEmpty()){
        if(direction.equals("prev") && !seria_num.equals("0")){
            sql2 = "declare @min int ,@max int;select @min = min(seria_num) ,@max = max(seria_num) from "+tableStr+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' ;";
            sql = sql2+( sqlParm.isEmpty() ? "select top 1 * from "+tableStr+" where ( seria_num = @min or seria_num < "+seria_num+") and sys_id = '"+sys_id+"' and work_time = '"+work_time+"' order by seria_num desc" : sqlParm );
        }
        if(direction.equals("next") && !seria_num.equals("0")){
            sql2 = "declare @min int ,@max int;select @min = min(seria_num) ,@max = max(seria_num) from "+tableStr+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' ;";
            sql = sql2+( sqlParm.isEmpty() ? "select top 1 * from "+tableStr+" where ( seria_num = @max or seria_num > "+seria_num+") and sys_id = '"+sys_id+"' and work_time = '"+work_time+"' order by seria_num asc" : sqlParm );
        }
        if( seria_num.equals("0") && ( direction.equals("next") || direction.equals("prev") ) ){
            sql = ( sqlParm.isEmpty() ? "select top 1 * from "+tableStr+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' order by seria_num desc" : sqlParm );
        }
        if(direction.equals("locate")){
            if(document_num.isEmpty()){
                sql = ( sqlParm.isEmpty() ? "select top 1 * from "+tableStr + "  where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' and seria_num = "+seria_num+";" : sqlParm );
            }else{
                sql = ( sqlParm.isEmpty() ? "select top 1 * from "+tableStr + "  where sys_id = '"+sys_id+"' and document_num = '"+document_num+"';" : sqlParm );
            }
        }
        if(direction.equals("first")){
            sql = ( sqlParm.isEmpty() ? "select top 1 * from "+tableStr+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' order by seria_num asc" : sqlParm );
        }
        if(direction.equals("last")){
            sql = ( sqlParm.isEmpty() ? "select top 1 * from "+tableStr+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' order by seria_num desc" : sqlParm );
        }
    }else{
        if(direction.equals("new")){
            sql = ( sqlParm.isEmpty() ? "select top 1 * from "+tableStr+" where sys_id = '"+sys_id+"' and seria_num = -1 and work_time = '"+work_time+"' " : sqlParm );
        }else{
            sql = ( sqlParm.isEmpty() ? "select top 1 * from "+tableStr+" where sys_id = '"+sys_id+"' and work_time = '"+work_time+"' order by seria_num desc" : sqlParm ) ; //变量代替
        }
    }
	//JSONObject obj = new JSONObject();
	DbProcManager dpm = new DbProcManager(databaseName);
	//System.out.println(sql);
	String result = dpm.DbProcessToJsonp(sql, "", "sys_document_order" ,0 ,1 ,callbackStr ,defaultRec);
	out.print( result );
%>