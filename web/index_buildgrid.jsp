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
<title>项目模块管理器</title>
<%
	String sessionId = "";
%>
<link rel="stylesheet" type="text/css" href="ext4/resources/css/ext-all.css"/>
<link rel="stylesheet" type="text/css" href="ext4/ux/statusbar/css/statusbar.css"/>

<script type='text/javascript' src='dwr/engine.js'></script>
<script type='text/javascript' src='dwr/interface/JbsManager.js'></script>
<script type="text/javascript" src="ext4/ext-all-debug.js"></script>
<script type="text/javascript" src="ext4/locale/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="ext4/ux/statusbar/StatusBar.js"></script>
<script type="text/javascript">
var sessionId = '<%=session.getId()%>';
</script>
<script type="text/javascript" src="js/commen.js"></script>
<script type="text/javascript" src="js/enterKeyEvents.js"></script>
<script type="text/javascript" src="js/builderGrid.js"></script>
<script type="text/javascript" src="js/datecombo.js"></script>
<script type="text/javascript" src="js/gridcombo.js"></script>
<script type="text/javascript" src="js/mainDemo2.js"></script>
<style>
.label_h1 {
    font-size: 12px;
    padding: 10px 10px 10px 110px;
}

</style>
</head>
<body>
	<div id="comboBoxTree"></div><br/>
</body>
</html>