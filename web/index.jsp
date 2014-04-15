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
        String sysId = request.getParameter("id")==null?"":request.getParameter("id");
        String databaseName = request.getParameter("db")==null?"demo":request.getParameter("db");
    %>
    <link rel="stylesheet" type="text/css" href="ext4/resources/css/ext-all.css"/>
    <link rel="stylesheet" type="text/css" href="ext4/ux/statusbar/css/statusbar.css"/>

    <script type='text/javascript' src='dwr/engine.js'></script>
    <script type='text/javascript' src='dwr/interface/JbsManager.js'></script>
    <script type="text/javascript" src="ext4/ext-all.js"></script>
    <script type="text/javascript" src="ext4/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="ext4/ux/statusbar/StatusBar.js"></script>
    <script type="text/javascript">
        var sessionId = '<%=session.getId()%>';
        var m_sysId = "<%=sysId%>";
        var m_databaseName = '<%=databaseName%>';
    </script>
    <script type="text/javascript" src="js/commen.js"></script>
    <script type="text/javascript" src="js/customFunction.js"></script>
    <script type="text/javascript" src="js/builderIndexList.js"></script>
    <script type="text/javascript" src="js/builderForm.js"></script>
    <script type="text/javascript" src="js/builderGrid.js"></script>
    <script type="text/javascript" src="js/builderSimpleQuery.js"></script>
    <script type="text/javascript" src="js/builderAdvQuery.js"></script>
    <script type="text/javascript" src="js/builderFrame.js"></script>
    <script type="text/javascript" src="js/mainFrame.js"></script>
    <script type="text/javascript" src="js/builderTabPanel.js"></script>
    <script type="text/javascript" src="js/basicFramework.js"></script>

    <script type="text/javascript" src="js/datecombo.js"></script>
    <script type="text/javascript" src="js/exComboGrid.js"></script>
    <script type="text/javascript" src="js/treegridcombo.js"></script>

    <script type="text/javascript" src="ext4/MonthPicker.js"></script>
    <script type="text/javascript" src="js/login-wnd.js"></script>
    <script type="text/javascript" src="js/main-ui-enter.js"></script>

<style>
.x-mask {
    filter: alpha(opacity=50);
    opacity: .5;
    background: rgba(255, 255, 255, 0);
}
.label_h1 {
    font-size: 12px;
    padding: 10px 10px 10px 110px;
}
.label_h2 {
    background-image : url(images/title_BImg.gif);
}

</style>
</head>
<body>
	<div id="comboBoxTree"></div><br/>
</body>
</html>