var tabpanelArray = new Array();
var grid = Ext.create('BSFrame.builder.menuGrid');

var bbar_clock = Ext.create('Ext.toolbar.TextItem', {text: Ext.Date.format(new Date(), 'g:i:s A')});
var moduleDetailStatusBar = Ext.create('Ext.ux.StatusBar', {
    id:'mainstatusbar',
    defaultText: '测试状态',
    text: '正常状态',
    iconCls: 'x-status-valid',
    items:[
        '->',
        bbar_clock
    ],
    listeners : {
        render: {
            fn: function(){
                Ext.TaskManager.start({
                    run: function(){
                        Ext.fly(bbar_clock.getEl()).update(Ext.Date.format(new Date(), 'g:i:s A'));
                    },
                    interval: 1000
                });
            },
            delay: 100
        }
    }
});

function builderTabPanel (_databaseName ,_category ,_kind ,_sysId ,_pId){
    this.databaseName = _databaseName;
    this.category = _category;
    this.kind = _kind;
    this.sysId = _sysId;
    this.indexList = null;
    this.mainForm = null;
    this.modelArray = null;
    var me = this;
    JbsManager.loadSysDocument(
        me.databaseName,
        me.category,
        me.kind,
        me.sysId,
        function(data){
            if(data){
                var mainViewPortCfg = {
                    id : 'main_viewport',
                    region : 'center',
                    layout:'border',
                    border : false,
                    bbar : moduleDetailStatusBar,
                    items:[
                        {
                            title: '功能菜单',
                            region: 'west',
                            //animCollapse: true,
                            width: 150,
                            minWidth: 150,
                            maxWidth: 200,
                            split: true,
                            layout: 'border',
                            items: [
                                grid
                            ]
                        },
                        {
                            xtype:'tabpanel',
                            id : me.sysId+'tabpanel',
                            region: 'center',
                            enableTabScroll : true,
                            activeTab:0,
                            autoDestroy : true,
                            activeItem:0
                        }
                    ]
                };
                Ext.getCmp(_pId).add(mainViewPortCfg);
                me.systemdocument = eval( '(' + data + ')' );
                var modelArray = me.systemdocument.sys_document;
                if(modelArray===undefined || modelArray.length==0){
                    return "";
                }else{
                    me.modelArray = modelArray;
                }
            }
        }
    );
}

builderTabPanel.prototype.activeModle = function(_sys_id ,_type){
    var me = this;
    loadMark(true);
    JbsManager.loadSysDocument(
        me.databaseName,
        me.category,
        me.kind,
        _sys_id,
        function(data){
            loadMark(false);
            var systemdoc = eval( '(' + data + ')' );
            var mArray = systemdoc.sys_document;
            for(var i = 0 ; i<mArray.length ;++i){
                if(mArray[i].sys_id == _sys_id ){
                    Ext.getCmp(me.sysId+'tabpanel').removeAll(true);
                    if(_type == "model"){
                        new builderFrame(me.databaseName,mArray[i].category,mArray[i].kind,mArray[i].sys_id,me.sysId+'tabpanel','tabpanel');
                    }
                    if(_type == "inquiry"){
                        new builderAdvQueryFrame(me.databaseName,mArray[i].category,mArray[i].kind,mArray[i].sys_id,me.sysId+'tabpanel','tabpanel');
                    }
                    break;
                }
            }
        }
    );
/*
    for(var i = 0 ; i<me.modelArray.length ;++i){
        if(me.modelArray[i].sys_id == _sys_id ){
            Ext.getCmp(me.sysId+'tabpanel').removeAll(true);
            new builderFrame(me.databaseName,me.modelArray[i].category,me.modelArray[i].kind,me.modelArray[i].sys_id,me.sysId+'tabpanel','tabpanel');
            break;
        }
    }
*/

};