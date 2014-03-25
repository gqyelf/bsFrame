/**

 **/

Ext.require(['*']);
var systemdocument;
var m_builder;
var databaseName = "demo";
var category = "test"               //项目标识名
var kind = "demo"                   //模块标识名
var sysId = m_sysId;   //模块系统ID

Ext.onReady(function(){
	JbsManager.loadSysDocument(
        databaseName,
        category,
        kind,
        sysId,
        function(data){
            if(data){
                Ext.create('Ext.Viewport', {
                    id:sysId+'viewport',
                    layout:'border',
                    title:'caption',
                    items:[
                        {
                            xtype:'panel',
                            id:sysId+'viewportcenter',
                            region:'center',
                            layout:'border',
                            margins:'2 2 2 2',
                            border: true,
                            frame : false,
                            tbar: ['-',
                                {
                                    icon:'images/page-first.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        m_editForm.prevForForm(m_editForm.table.mainTable,-1,"");
                                    }
                                },
                                {
                                    icon:'images/page-prev.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        m_editForm.prevForForm(m_editForm.table.mainTable,undefined,"");
                                    }
                                },
                                {
                                    icon:'images/page-next.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        m_editForm.nextForForm(m_editForm.table.mainTable,undefined,"");
                                    }
                                },
                                {
                                    icon:'images/page-last.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        m_editForm.nextForForm(m_editForm.table.mainTable,-1,"");
                                    }
                                },'-',
                                {
                                    icon:'images/Document.png',
                                    cls:'x-btn-text-icon',
                                    text : '新  增',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        m_editForm.newRecord();
                                    }
                                },'-',
                                {
                                    icon:'images/Cut.png',
                                    cls:'x-btn-text-icon',
                                    text : '删  除',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        m_editForm.deleteRecord();
                                    }
                                },'-',
                                {
                                    icon:'images/Edit.png',
                                    cls:'x-btn-text-icon',
                                    text : '修  改',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        m_editForm.setFormStatus(1);
                                    }
                                },'-',
                                {
                                    icon:'images/Save.png',
                                    cls:'x-btn-text-icon',
                                    text : '存  盘',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        if(m_editForm.formStatus==1){
                                            m_editForm.saveRecord();
                                        }
                                    }
                                },'-'
                            ]
                        },
                        {
                            xtype:'panel',
                            id:sysId+'viewportwest',
                            region:'west',
                            layout:'border',
                            width:300,
                            margins:'2 2 2 2',
                            tbar :[
                                '-',{
                                    xtype:'textfield',
                                    listeners:{
                                        change :function(){

                                        }
                                    }
                                },{
                                    icon:'images/search.gif',
                                    cls:'x-btn-icon',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        m_editForm.newRecord();
                                    }
                                },'-',
                                {
                                    icon:'images/refresh.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        m_indexList.refresh();
                                    }
                                }

                            ]
                        }
                    ]
                });
                systemdocument = eval( '(' + data + ')' );
                m_editForm = new builderForm (systemdocument ,sysId+'viewportcenter','panel');
                m_indexList = new builderIndexList ("select * from main_table" ,sysId+'_list' ,sysId+'viewportwest',m_editForm);
            }
        }
    );
});