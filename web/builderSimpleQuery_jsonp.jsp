<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
int start = Integer.parseInt(request.getParameter("start"));
int limit = Integer.parseInt(request.getParameter("limit"));
String callbackStr = request.getParameter("callback");
String databaseName = request.getParameter("dbName");
String sqlProc = request.getParameter("sqlProc");
String sqlPram = request.getParameter("sqlPram");
String [] pramArray = sqlPram.split(",");
sqlPram = "";
for(int i = 0 ; i<pramArray.length ; ++i){
    if((i+1)==pramArray.length){
        sqlPram+="'"+pramArray[i]+"'";
    }else{
        sqlPram+="'"+pramArray[i]+"',";
    }
}
String sql = "exec "+sqlProc+" "+sqlPram;
System.out.println(sql);
JSONObject obj = new JSONObject();
DbProcManager dpm = new DbProcManager(databaseName);
String result = dpm.DbProcessToJsonp(sql, "", "sys_document_order_detail" ,start ,limit ,callbackStr ,"");
out.print( result );
%>