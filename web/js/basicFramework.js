var tabpanelArray = new Array();
var grid = Ext.create('BSFrame.builder.menuGrid');

function basicFramework (_databaseName ,_category ,_kind ,_sysId){
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
                var sysdocument = (eval('('+data+')')).sys_document;
                var bfwCfg;
                for(var i = 0 ; i < sysdocument.length ; ++i){
                    if(sysdocument[i].xtype=='framework'){
                        bfwCfg = sysdocument[i];
                        break;
                    }
                }
                if(bfwCfg === undefined){
                    return;
                }
                bfwCfg = eval('('+bfwCfg.property+')');
                Ext.create('Ext.Viewport', {
                    id : 'basicFramework_viewport',
                    layout:'border',
                    title:'caption',
                    items:[
                        {
                            region: 'north',
                            height : bfwCfg.N,
                            bodyCls : 'label_h2',
                            html:'<img src="'+bfwCfg.imgUrl+'"/>'
                        },
                        {
                            region: 'west',
                            width: bfwCfg.W
                        },
                        {
                            region: 'south',
                            height: bfwCfg.S
                        },
                        {
                            region: 'east',
                            width: bfwCfg.E
                        }
                    ],
                    listeners:{
                        render:function(){
                            tabpanelObj = new builderTabPanel(databaseName,category,kind,"undefined",'basicFramework_viewport');
                            grid.initMainTabpanelObj(tabpanelObj);
                        }
                    }
                });
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

/*
builderTabPanel.prototype.activeModle = function(_sys_id){
    var me = this;
    loadMark(true);
    for(var i = 0 ; i<me.modelArray.length ;++i){
        if(me.modelArray[i].sys_id == _sys_id ){
            Ext.getCmp(me.sysId+'tabpanel').removeAll(true);
            new builderFrame(me.databaseName,me.modelArray[i].category,me.modelArray[i].kind,me.modelArray[i].sys_id,me.sysId+'tabpanel','tabpanel');
            break;
        }
    }
    loadMark(false);
};*/
