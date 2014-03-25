function builderViewport (_leftObj ,_centerObj ,_hostId){
	this.module = Ext.create('Ext.Viewport', {
						id: _hostId,
					    layout: 'border',
				        renderTo: Ext.getBody(),
					    items:[ _leftObj,_centerObj ]
					 });
	return _hostId;
}

var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

var moduleDetailStatusBar = Ext.create('Ext.ux.StatusBar', {
    id:'mainstatusbar',
    defaultText: '测试状态',
    text: '正常状态',
    iconCls: 'x-status-valid'
});

var setCurrentStatus = function(statusCode ,statusMsg){
    Ext.getCmp("mainstatusbar").setStatus({
        text: statusMsg,
        iconCls: 'x-status-valid',
        clear: true
    });
};

var moduleBCfgPanle = new Ext.widget({
    id : 'moduleBCfgPanlex01',
    xtype : 'form',
    frame : false,
    border : false,
    region : 'north',
    bodyPadding: '10 10 10 10',
    //width: 600,
    fieldDefaults: {
        labelAlign: 'left'
        //msgTarget: 'side'
    },
    items: [
        {
            xtype : 'fieldset',
            title : '设置单据名称',
            layout : 'hbox',
            anchor : '100%',
            items : [
                {
                    xtype : 'container',
                    flex: 1,
                    layout: 'anchor',
                    items : [
                        {
                            xtype : 'textfield',
                            id : 'moduleBCfgPanlex01_01',
                            fieldLabel: '模块编号',
                            afterLabelTextTpl: required,
                            name: 'sys_id',
                            readOnly: false,
                            anchor:'98%',
                            listeners : {
                                change : function(ths ,newValue ,oldValue ,obj){
                                    var anotherValue = Ext.getCmp('moduleBCfgPanlex01_02').getValue();
                                    if(newValue!=oldValue && anotherValue != '' ){
                                        Ext.getCmp('confirmModuleCfgx01').enable();
                                    } else{
                                        Ext.getCmp('confirmModuleCfgx01').disable();
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype : 'container',
                    flex: 1,
                    layout: 'anchor',
                    items : [
                        {
                            xtype : 'textfield',
                            id : 'moduleBCfgPanlex01_02',
                            fieldLabel: '模块名称',
                            name: 'caption',
                            afterLabelTextTpl: required,
                            readOnly: false,
                            anchor:'98%',
                            listeners : {
                                change : function(ths ,newValue ,oldValue ,obj){
                                    var anotherValue = Ext.getCmp('moduleBCfgPanlex01_01').getValue();
                                    if(newValue != '' && newValue != oldValue && anotherValue != '' ){
                                        Ext.getCmp('confirmModuleCfgx01').enable();
                                    } else{
                                        Ext.getCmp('confirmModuleCfgx01').disable();
                                    }
                                }
                            }

                        }
                    ]
                },
                {
                    xtype : 'container',
                    flex: 1,
                    layout: 'anchor',
                    items : [
                        {
                            xtype : 'fieldcontainer',
                            anchor:'98%',
                            layout: 'hbox',
                            items : [
                                {xtype : 'tbspacer'},
                                {
                                    xtype : 'button',
                                    text : '新 建',
                                    id : 'newModuleCfgx01',
                                    //icon:'images/Image-Send.gif',
                                    //cls:'x-btn-icon',
                                    width:100,
                                    disabled : true,
                                    handler : function(){
                                        updatesModuleDetail(sys_detailFormStore ,0);
                                    }
                                },{xtype : 'tbspacer' ,width : '20'},
                                {
                                    xtype : 'button',
                                    text : '修 改',
                                    id : 'modifyModuleCfgx01',
                                    //icon:'images/Image-Send.gif',
                                    //cls:'x-btn-icon',
                                    width:100,
                                    disabled : true,
                                    handler : function(){

                                    }
                                },{xtype : 'tbspacer' ,width : '20'},
                                {
                                    xtype : 'button',
                                    text : '确 认',
                                    id : 'confirmModuleCfgx01',
                                    //icon:'images/Image-Send.gif',
                                    //cls:'x-btn-icon',
                                    width : 100,
                                    disabled : true,
                                    handler : function(){
                                        moduleBCfgPanle.getForm().updateRecord();
                                        JbsManager.SYS_UpdateBasicInfo(
                                            'demo',
                                            0,
                                            "sys_document",
                                            json2str(moduleBCfgPanle.getForm().getRecord().data),
                                            function(data){
                                                Ext.Msg.alert("ok","ok");
                                            }
                                        );
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype : 'fieldset',
            title : '设置单据表名与视图',
            layout : 'hbox',
            anchor : '100%',
            items : [
                {
                    xtype : 'container',
                    flex: 1,
                    layout: 'anchor',
                    items : [
                        {
                            xtype : 'textfield',
                            fieldLabel: '单据头表名',
                            afterLabelTextTpl: required,
                            name: 'mainTable',
                            readOnly: false,
                            anchor:'98%'
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel: '单据头附表',
                            afterLabelTextTpl: required,
                            name: 'mainTableTemp',
                            readOnly: false,
                            anchor:'98%'
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel: '计数器表名',
                            afterLabelTextTpl: required,
                            name: 'counterTable',
                            readOnly: false,
                            anchor:'98%'
                        }
                    ]
                },
                {
                    xtype : 'container',
                    flex: 1,
                    layout: 'anchor',
                    items : [
                        {
                            xtype : 'textfield',
                            fieldLabel: '单据身表名',
                            name: 'detailTable',
                            readOnly: false,
                            anchor:'98%'
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel: '单据身附表',
                            name: 'detailTableTemp',
                            readOnly: false,
                            anchor:'98%'
                        },
                        {
                            xtype : 'container',
                            anchor:'98%'
                        }
                    ]
                },
                {
                    xtype : 'container',
                    flex: 1,
                    layout: 'anchor',
                    items : [
                        {
                            xtype : 'textfield',
                            fieldLabel: '单据头视图',
                            afterLabelTextTpl: required,
                            name: 'mainTableView',
                            readOnly: false,
                            anchor:'98%'
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel: '单据身视图',
                            name: 'detailTableView',
                            readOnly: false,
                            anchor:'98%'
                        },
                        {
                            xtype : 'container',
                            anchor:'98%',
                            flex: 1,
                            layout: 'anchor',
                            items : [
                                {
                                    xtype : 'fieldcontainer',
                                    anchor:'98%',
                                    layout: 'hbox',
                                    items : [
                                        {xtype : 'tbspacer'},
                                        {
                                            xtype : 'container',
                                            width:100
                                        },{xtype : 'tbspacer' ,width : '20'},
                                        {
                                            xtype : 'container',
                                            width:100
                                        },{xtype : 'tbspacer' ,width : '20'},
                                        {
                                            xtype : 'button',
                                            text : '存盘确认',
                                            //icon:'images/Image-Send.gif',
                                            //cls:'x-btn-icon',
                                            disabled : false,
                                            width : 100,
                                            handler : function(){
                                                moduleBCfgPanle.getForm().updateRecord();
                                                var rec = moduleBCfgPanle.getForm().getRecord();
                                                var property = {mainTable:rec.get('mainTable') ,mainTableTemp:rec.get('mainTableTemp') ,mainTableView:rec.get('mainTableView') ,detailTable:rec.get('detailTable') ,detailTableTemp:rec.get('detailTableTemp') ,detailTableView:rec.get('detailTableView') ,counterTable:rec.get('counterTable')};
                                                rec.set('property',json2str(property));
                                                //SYS_UpdateTableInfo(String database ,int id ,String table ,String obj)
                                                JbsManager.SYS_UpdateTableInfo(
                                                    'demo' ,
                                                    rec.get('id') ,
                                                    'sys_document' ,
                                                    rec.get('property') ,
                                                    function(data){
                                                        Ext.Msg.alert("ok","ok");
                                                    }
                                                );
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

var leftGrid = Ext.create('Ext.grid.Panel', {
	region 	: 'center',
	margins	: '2 2 2 2',
    store : sys_LeftStore,
    columns : [
               {text: '位号' ,dataIndex : 'sys_id' ,menuDisabled : false ,hidden : false ,width :'30%' },
               {text: '组件名称' ,dataIndex : 'caption' ,menuDisabled : false ,hidden : false ,width :'70%' }],
    selModel: {
        selType: 'rowmodel',
        mode : 'SINGLE',
        pruneRemoved: false,
        listeners : {
            select:function( _ths, _rec, _idx ,_obj ){
                updatesModuleDetail(sys_detailFormStore ,_rec.get('id'));
            }
        }
    }
});

var leftPanel = {
	    layout: 'border',
	    id: 'sys_LeftPanel',
	    title: '项目模块列表',
	    region:'west',
	    border: true,
	    split:true,
	    collapsible : true,
	    margins: '2 2 2 2',
	    width: 350,
	    minSize: 150,
	    maxSize: 500,
	    items: [leftGrid],
	    tbar: ['-'
	    ]
};

var centerPanel = {
		id:'sys_centerPanel',
		title:'模块设置',
	    region:'center',
	    border: true,
	    margins: '2 2 2 2',
        layout : 'border',
	    items : [
            moduleBCfgPanle,
            {
                 xtype:'tabpanel',
                 id : 'sys_mainconfig',
                 region: 'center',
                 enableTabScroll : true,
                 activeTab:0,
                 activeItem:0
            }
        ],
    bbar: moduleDetailStatusBar
};

JbsManager.loadSysDocument(
    "demo",
    "sys_mainTable",
    "sys",
    "sys_mainTable",
    function(data){
        if(data){
            systemdocument = eval( '(' + data + ')' );
            m_editgrid = new builderGrid(systemdocument ,'sys_document_order_detail' ,'sys_mainTable' ,'sys_mainconfig' ,'tabpanel');
        }
    }
);
