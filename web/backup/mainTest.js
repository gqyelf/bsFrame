/**

 **/

Ext.require(['*']);
var systemdocument;
var m_builder;

var m_test;

Ext.onReady(function(){
	Ext.create('Ext.Viewport', {
    	id:'testdemo',
        layout:'border',
        title:'caption',
        items:[{
        	xtype:'panel',
			id:'testdemocenter',
			region:'center',
			layout:'border',
            margins:'2 2 2 2',
            tbar: [
                   { 
		            	xtype: 'button', 
		            	text: '切换(main_frame_editgrid)',
                        disabled : true,
		            	handler:function(){
		            		//var property = eval( '('+systemdocument.sys_document[0].property+')' );
		            		//m_editgrid.resetGrid('demo' ,'test' ,'main_frame_editgrid' ,'detail_table_tmp' ,'');
		            		m_editgrid.resetGrid('demo' ,'test' ,'main_frame_editgrid' ,'' ,'select top 10 * from detail_table_tmp');
		            	}
		           },
                   { 
		            	xtype: 'button', 
		            	text: '切换(main_frame_editgrid2)',
                        disabled : true,
		            	handler:function(){
		            		m_editgrid.resetGrid('demo' ,'test' ,'main_frame_editgrid2' ,'detail_table_tmp2' ,'');
		            	}
		           },{
		            	xtype: 'button', 
		            	text: '弹出窗口',
                        disabled : true,
		            	handler:function(){
		            		m_window.show();
		            	}
		           }	           
                 ]            
        }]
	 });

    var databaseName = "demo";
    var category = "test"               //项目标识名
    var kind = "demo"                   //模块标识名
    var sysId = "LC_JC_G_01"   //模块系统ID
	JbsManager.loadSysDocument(
            databaseName,
            category,
            kind,
            sysId,
			function(data){
				if(data){
					systemdocument = eval( '(' + data + ')' );
					//m_builder = new builder('demo',systemdocument);
					//m_builder = new builder ('demo' ,systemdocument);
/*					JbsManager.loadSysDocument(
							"demo",
							"test",
							"windowgrid",
							function(data){
								//"sys_document":[{"category":"test","events":"","xtype":"gridedit","sortid":"2","sys_id":"windowgrid","property":"{sql:"select * from detail_table_tmp where productName <> ''"}","parentid":"main_frame","caption":"","childrens":"","kind":"demo"}]}";
								//,"sys_document":[{"category":"test","events":"","xtype":"gridedit","sortid":"2","sys_id":"windowgrid","property":"{sql:"select * from detail_table_tmp where productName <> ''"}","parentid":"main_frame","caption":"","childrens":"","kind":"demo"}]
								//var datatmp = "{sys_document_order_detail:[{sys_id:'windowgrid',sort_id:1,field_rawname:'productName',field_showname:'产品名称',width:80},{sys_id:'windowgrid',sort_id:2,field_rawname:'quantity',field_showname:'数量',width:60}]}";
								//m_datatemp = data;
								//{"sys_document":[ {"property":"{sql:\\"select * from detail_table_tmp\\"}" }] }
								//var datatmp = '{"sys_document":[ {"property":"{sql:\\"select * from detail_table_tmp\\"}" }],"sys_document_order_detail":[{"sys_id":"windowgrid","sort_id":"1","visible":"1","field_rawname":"productName","field_showname":"产品名称1","width":"80"},{"sys_id":"windowgrid","sort_id":"2","visible":"1","field_rawname":"quantity","field_showname":"数量","width":"60"}]}';
								var wsystemdocument = eval( '(' + data + ')' );
								if(data){
									m_ingrid = new builderGrid (wsystemdocument ,'' ,'windowgrid' ,'windowgrid0001','panel');
								}
							});*/
					m_test = new builderForm (systemdocument ,'detail_table_tmp' ,sysId ,'testdemocenter','panel');
                    //m_editgrid = new builderForm(systemdocument ,'sys_document_order_detail' ,'sys_mainTable' ,'testdemocenter' ,'panel');
					
				}
	});
	//var m_builder = new builder('demo','001');
});


//----------------------------------------------------

