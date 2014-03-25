/**

 **/

Ext.require(['*']);
var systemdocument;
var m_builder;
var m_ingrid;


var m_datatemp;

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
		            	handler:function(){
		            		//var property = eval( '('+systemdocument.sys_document[0].property+')' );
		            		//m_editgrid.resetGrid('demo' ,'test' ,'main_frame_editgrid' ,'detail_table_tmp' ,'');
		            		m_editgrid.resetGrid('demo' ,'test' ,'main_frame_editgrid' ,'' ,'select top 10 * from detail_table_tmp');
		            	}
		           },
                   { 
		            	xtype: 'button', 
		            	text: '切换(main_frame_editgrid2)',
		            	handler:function(){
		            		m_editgrid.resetGrid('demo' ,'test' ,'main_frame_editgrid2' ,'detail_table_tmp2' ,'');
		            	}
		           },{
		            	xtype: 'button', 
		            	text: '弹出窗口',
		            	handler:function(){
		            		m_window.show();
		            	}
		           }	           
                 ]            
        }]
	 });
	JbsManager.loadSysDocument(
			"demo",
			"sys_mainTable",
            "sys",
			"sys_mainTable",
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
							});					
*/					//m_editgrid = new builderGrid (systemdocument ,'detail_table_tmp' ,'main_frame_editgrid' ,'testdemocenter','panel');//detail_table_tmp,main_frame_editgrid
                    m_editgrid = new builderGrid(systemdocument ,'sys_document_order_detail' ,'sys_mainTable' ,'testdemocenter' ,'panel');
					
				}
	});
	//var m_builder = new builder('demo','001');
});


//----------------------------------------------------

