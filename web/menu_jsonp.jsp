<%@ page language="java" contentType="text; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="javax.sql.*" %><%@ page import="java.sql.*" %><%@ page import="com.sun.rowset.CachedRowSetImpl" %><%@ page import="bspackage.bsManager" %><%@ page import="org.json.*" %><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Cache-Control", "no-cache");    //HTTP 1.0
    response.setHeader("Expires", "0");                 //防止被proxy
%><%!
	CachedRowSetImpl crs = null;
%><%
	int start = Integer.parseInt(request.getParameter("start"));
	int limit = Integer.parseInt(request.getParameter("limit"));
	String callbackStr = request.getParameter("callback");
	int pages = Integer.parseInt(request.getParameter("page"));
	bsManager bm = new bsManager();
	JSONStringer stringer = new JSONStringer();
    JSONObject obj = new JSONObject();
    JSONArray jArray = new JSONArray();
	if( crs == null){
		crs = bm.toJson3();
	}
	crs.next();
	System.out.println(crs.getObject(1).toString());
	try{
	    ResultSetMetaData metaData = crs.getMetaData();
	    int count = 0;
	    int numberOfColumns = metaData.getColumnCount();
	    if (crs.absolute(start+1)){
    	    while ( crs != null && crs.next() && count < limit ) {
    	    	JSONObject jObj = new JSONObject();
                for (int i = 1; i <= numberOfColumns; i++) {
                    String columnName = metaData.getColumnLabel(i);
                    Object value = crs.getObject(i);
                    jObj.put(columnName, value.toString());
                }
                jArray.put(jObj);
                count++;
    	    }
	    }
	    // Get page rows.
	    obj.put("gridDemoData", jArray).put("totalCount","40000");
	    //return callback+"("+obj.toString()+");";
	    crs.close(); 		
	}catch(Exception ex){
		System.out.println("数据库错误!");
	}
	
	//JSONObject obj = new JSONObject();
	//obj.put( "gridDemoData", bm.toJson2(start, limit) ).put("totalCount",String.valueOf(500000));
	out.print(callbackStr+"("+obj+");");
%>