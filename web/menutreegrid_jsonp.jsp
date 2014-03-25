<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8" %><%@ page import="bspackage.*" %><%@ page import="org.json.*" %><%@ page import="java.sql.Connection"%><%@ page import="java.sql.ResultSet"%><%@ page import="java.sql.PreparedStatement"%><%@ page import="java.sql.ResultSetMetaData"%><%
    response.setHeader("Pragma", "No-cache");           //HTTP 1.1
    response.setHeader("Expires", "0");                 //防止被proxy
%><%
    bsManager bm = new bsManager();
    Connection conn = null;
    ResultSet resultSet = null;
    String result = "";
    PreparedStatement pst = null;
    int numberOfColumns = 0;
    String sql = "select sys_id ,parentid ,caption ,xtype from sys_document where xtype = 'model' or xtype = 'menu' or xtype = 'inquiry'";
    //System.out.println(sql);
    String fields = "";
    try{
        conn = bsManager.getConnection_ms("demo");
        pst=conn.prepareStatement(sql);
        //System.out.println(sql);
        pst.execute();
        resultSet = pst.getResultSet();
        ResultSetMetaData metaData = resultSet.getMetaData();
        numberOfColumns = metaData.getColumnCount();
        int count = 0;
        int [] columnSize = new int[numberOfColumns];
        for (int i = 1; i <= numberOfColumns; ++i) {
            String columnName = metaData.getColumnLabel(i);
            fields = fields + columnName + ",";
        }
        JSONArray jArray = new JSONArray();
        while ( resultSet != null && resultSet.next() ) {
            JSONObject jObj = new JSONObject();
            for (int i = 1; i <= numberOfColumns; ++i) {
                String columnName = metaData.getColumnLabel(i);
                String columnValue = resultSet.getObject(i)==null ? "" : resultSet.getObject(i).toString();
                if(columnSize[i-1]<columnValue.length()) {
                    columnSize[i-1]=columnValue.length();
                }
                jObj.put( columnName,columnValue );
            }
            jArray.put(jObj);
        }
        //System.out.println(jArray.toString());
        JSONObject rJobj= new JSONObject();
        rJobj.put("children",bm.processTreeData( jArray ,fields.split(",")[0] ,fields.split(",")[1] ,null,0));
        result = rJobj.toString();//bm.processTreeData( jArray ,fields.split(",")[0] ,fields.split(",")[1] ,null).toString();
    }catch(Exception ex){
        System.err.println("Error: Unable to get a connection: " + ex);
        ex.printStackTrace();
    }finally{
        try {
            resultSet.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        try {
            pst.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        try {
            conn.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    //JSONObject obj = new JSONObject();
	//DbProcManager dpm = new DbProcManager(databaseName);
	//String result = dpm.DbProcessToJsonp(sql, "", "sys_document_order_detail" ,start ,limit ,callbackStr ,defaultRec);
	out.print( result );
%>