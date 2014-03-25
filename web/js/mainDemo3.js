/**

 **/

Ext.require(['*']);
var systemdocument;
var m_builder;
var databaseName = m_databaseName;
var category = ""               //项目标识名
var kind = ""                   //模块标识名
var sysId = "test";             //模块系统ID

Ext.onReady(function(){
    //var frame = new builderFrame(databaseName,category,kind,sysId);
    new builderTabPanel(databaseName,category,kind,sysId);

});