<?xml version="1.0" encoding="UTF-8"?>
<%@ page language="java" contentType="text/xml; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="bspackage.bsManager" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="java.sql.ResultSetMetaData" %>
<%@ page import="java.sql.Statement" %>
<%
    response.setHeader("Pragma", "No-cache");               //HTTP 1.1
    response.setHeader("Cache-Control", "no-cache");    //HTTP 1.0
    response.setHeader("Expires", "0");                             //防止被proxy
%>
<menuLists>
<%
    Connection conn = null;
    ResultSet resultSet = null;
    Statement statement = null;
    int numberOfColumns;
    try {
        String sql = "select menuName ,menuType from T_menu";
        conn = bsManager.getConnection_ms("demo");
        statement = conn.createStatement();
        resultSet = statement.executeQuery(sql);
        ResultSetMetaData metaData = resultSet.getMetaData();
        numberOfColumns = metaData.getColumnCount();
        while (resultSet != null && resultSet.next()) {
            out.println("<menuListRecord>");
            for (int i = 1; i <= numberOfColumns; i++) {
                String columnName = metaData.getColumnLabel(i);
                Object value = resultSet.getObject(i);
                out.print("<" + columnName + ">");
                if (value == null) {
                    if(columnName.equals("status")){
                        value = -1;
                    }else{
                        value = "";
                    }
                }
                out.print(value);
                out.print("</" + columnName + ">");
            }
            out.println("</menuListRecord>");
        }
    } catch (Exception ex) {
        out.println("error:" + ex.getMessage());
    } finally {
        try {
            resultSet.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        try {
            statement.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        try {
            conn.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
%>
</menuLists>