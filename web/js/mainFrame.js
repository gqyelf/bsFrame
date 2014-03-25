/**
 * Created with IntelliJ IDEA.
 * User: Gqy
 * Date: 13-10-8
 * Time: 上午10:34
 * To change this template use File | Settings | File Templates.
 */

Ext.define('sys_document_menu', {
    extend: 'Ext.data.Model',
    fields: [
        { name : "caption" ,type : "string"},
        { name : "sys_id" ,type : "string"},
        { name : "parentsId" ,type : "string"},
        { name : "xtype" ,type : "string"}
    ]
});

Ext.define("BSFrame.builder.menuGrid",{
    extend:'Ext.tree.Panel',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*'
    ],
    mainTabpanelObj : null,
    region : 'center',
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    singleExpand: true,
    selType : 'rowmodel',
    enableColumnResize : false,
    hideHeaders: true,
    border: false,
    initComponent:function(){
        var me = this;
        Ext.apply(this,{
            store : new Ext.data.TreeStore({
                model: sys_document_menu,
                proxy: {
                    type: 'ajax',
                    url: 'menutreegrid_jsonp.jsp'
                },
                folderSort: true,
                autoLoad : true
            }),
            columns : [
                {
                    xtype: 'treecolumn',
                    text: 'caption',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'caption'
                },{
                    text: 'sys_id',
                    flex: 1,
                    dataIndex: 'sys_id',
                    hidden : true
                }, {
                    text: 'parentsId',
                    dataIndex: 'parentsId',
                    width: 55,
                    hidden : true
                }
            ],
            listeners : {
                selectionchange :function( ths, selected ){
                    if(me.mainTabpanelObj!=null && selected.length==1){
                        if(selected[0].get('xtype')=="model" || selected[0].get('xtype')=="inquiry"){
                            if(m_set_permission!==undefined){
                                var permissionTag = permissionCheck(m_set_permission,selected[0].get('sys_id'),'model_permission');
                                if(permissionTag==1){
                                    me.mainTabpanelObj.activeModle(selected[0].get('sys_id'));
                                }else{
                                    Ext.Msg.alert("提示信息 :","无此权限!");
                                }
                            }
                        }
                    }
                }
            }
        });
        this.callParent();
    },
    initMainTabpanelObj : function(obj){
        var me = this;
        me.mainTabpanelObj = obj;
    }
});


