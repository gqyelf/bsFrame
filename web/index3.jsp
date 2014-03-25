<%@ page import="bspackage.*,
				 java.io.*,
                 java.sql.*,
                 java.util.*"
    language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Builder Frame</title>
<%
/*	
	Connection conn = null;
	ResultSet resultSet = null;
	Statement statement = null;
	int numberOfColumns = 0;
	String sql = "select * from demoUser";
	String str = "";
	try{
	    conn = bsManager.getConnection_ms();
	    statement = conn.createStatement();
	    resultSet = statement.executeQuery(sql);
	    ResultSetMetaData metaData = resultSet.getMetaData();
	    numberOfColumns = metaData.getColumnCount();
	    // Get all rows.
	    while (resultSet != null && resultSet.next()) {
	    	str = resultSet.getString("userName");	    	
	    }

		
	}catch(Exception ex){
		System.out.println("数据库错误!");
	}
	<script type="text/javascript" src="js/gridEditDemo.js"></script>
*/
String sessionId = "";
%>
<link rel="stylesheet" type="text/css" href="ext4/resources/css/ext-all.css"/>
<script type='text/javascript' src='dwr/engine.js'></script>
<script type='text/javascript' src='dwr/interface/JbsManager.js'></script>
<script type="text/javascript" src="ext4/ext-all-debug.js"></script>
<script type="text/javascript" src="ext4/locale/ext-lang-zh_CN.js"></script>
<script type="text/javascript">
var sessionId = '<%=session.getId()%>';

</script>
<script type="text/javascript" src="js/builderGrid.js"></script>
<script type="text/javascript" src="js/builderFrame.js"></script>
<script type="text/javascript" src="js/builder.js"></script>
<script type="text/javascript" src="js/mainDemo.js"></script>
<style>
.label_h1 {
    font-size: 12px;
    padding: 10px 10px 10px 110px;
}

</style>
</head>
<body>

</body>
</html>