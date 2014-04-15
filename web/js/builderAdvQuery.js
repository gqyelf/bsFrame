/**
 * Created by Gqy on 2014-03-26.
 */
function builderAdvQueryFrame (_databaseName ,_category ,_kind ,_sysId ,_pId ,_pType){
    this.databaseName = _databaseName;
    this.category = _category;
    this.kind = _kind;
    this.sysId = _sysId;
    this.objId = this.sysId+'AdvQuery';
    this.pId = _pId;
    this.pType = _pType;
    this.indexList = null;
    this.mainForm = null;
    this.mainGrid = null;
    this.hasGrid = false;
    var me = this;
    this.systemdocument=null;
    this.querySqlProc=null;
    JbsManager.loadSysDocument(
        me.databaseName,
        me.category,
        me.kind,
        me.sysId,
        function(data){
            if(data){
                me.systemdocument = eval( '(' + data + ')' );
                var listIndexProperty;
                if(me.systemdocument.sys_document[0].property!==undefined){
                    var property = me.systemdocument.sys_document[0].property;
                    property = (property == '' ? '{}' :property);
                    property = eval('('+property+')');
                    listIndexProperty = property.listIndex;
                    if(property.querySqlProc!==undefined&&property.querySqlProc!=""){
                        me.querySqlProc = property.querySqlProc;
                    }
                    me.hasGrid = !( property.detailTable == "" || property.detailTable === undefined || property.detailTableTemp === undefined || property.detailTableView === undefined )
                }
                Ext.create('Ext.container.Container', {
                    id:me.sysId+'AdvQuery',
                    region:'center',
                    layout:'border',
                    title:'caption',
                    items:[
                        {
                            xtype:'panel',
                            id:me.sysId+'AdvQueryCenter',
                            region:'center',
                            layout:'border',
                            margins:'2 2 2 2',
                            border: true,
                            frame : false,
                            tbar: [
                                '-',
                                {
                                    icon:'images/print.gif',
                                    cls:'x-btn-text-icon',
                                    text : '打  印',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        if(m_set_permission===undefined) {
                                            return;
                                        }
                                        var permissionTag = permissionCheck(m_set_permission,me.sysId,'print_permission');
                                        if(permissionTag!=1){
                                            Ext.Msg.alert("提示信息 :","无此权限!");
                                            return;
                                        }
                                        showMessageBox(msgTitleWarning,"打印模块未设置！",Ext.Msg.OK,Ext.MessageBox.CANCEL);
                                    }
                                },'-',
                                {
                                    icon:'images/excel.gif',
                                    cls:'x-btn-text-icon',
                                    text : '导出Excel',
                                    listeners:{
                                        render:function(ths){

                                        }
                                    },
                                    handler : function() {
                                        me.initAdvQueryGrid();
                                    }
                                },'-','->','-','当前记录：',
                                {
                                    id : me.sysId+'location',
                                    xtype   : 'numberfield',
                                    readOnly : true,
                                    width   : 50
                                },' ','记录总数：',
                                {
                                    id : me.sysId+'total',
                                    xtype   : 'numberfield',
                                    readOnly : true,
                                    width   : 50
                                },'-'
                            ]
                        }
                    ]
                });
                me.initListForm(listIndexProperty);
                me.builderGrid();
                if(me.pType == 'tabpanel'){
                    Ext.getCmp(me.pId).add({
                        title: me.systemdocument.sys_document[0].caption ,
                        layout : 'border' ,
                        items:[me.objId]
                    });
                }

            }
        }
    );
    return this.objId;
}

builderAdvQueryFrame.prototype.builderGrid = function(  ){
    var me = this;
    me.gridList = Ext.create('Ext.grid.Panel', {
        border : false,
        columnLines : true,
        region 	: 'center',
        columns : [{
            xtype: 'rownumberer',
            width: 40,
            sortable: false
        }],
        viewConfig: {
            stripeRows: true
        },
        selModel: {
            selType: 'rowmodel',
            mode : 'SINGLE',
            pruneRemoved: false,
            listeners : {
                select:function( _ths, _rec, _idx ,_obj ){

                },
                render:function( _ths ,_obj){

                }
            }
        },
        listeners : {
            viewready : function( ths, eOpts ){

            },
            selectionchange : function( ths, selected, eOpts ){

            },
            cellkeydown : function( ths, td, cellIndex, record, tr, rowIndex, e, eOpts ){

            },
            render : function( ths, eOpts ){

            }
        }
    });
    Ext.getCmp(me.sysId+'AdvQueryCenter').add(me.gridList);
};


builderAdvQueryFrame.prototype.initAdvQueryGrid = function(){
    var me = this;
    JbsManager.processAdvQueryFields(
        me.querySqlProc,
        RecordToString(me.mainForm.getRecord()),
        me.databaseName,
        function(data){
            var fieldMArray = [];
            var columnMArray = [];
            var columns; //= data.split('|')[0].split(',');
            if(data[0]=='success'){
                columns = data[1].split(',');
                for(var i = 0 ; i < columns.length -1 ; ++i ){
                    fieldMArray.push(columns[i]);
                    columnMArray.push({
                        text : columns[i],
                        dataIndex : columns[i],
                        menuDisabled : false,
                        hidden : false,
                        align: 'left'
                    });
                }
                me.comboModel = Ext.define('comboModel',{
                    extend: 'Ext.data.Model',
                    fields:fieldMArray
                });
                var gcstore = Ext.create('Ext.data.Store', {
                    storeId:'gridcomboStore',
                    model : 'comboModel',
                    pageSize: 5000,
                    autoLoad : true,
                    proxy: {
                        type: 'jsonp',
                        url: 'exComboGrid_jsonp.jsp',
                        extraParams : {
                            dbName	    :	"demo",
                            sql			:   me.sql
                        },
                        reader: {
                            root: 'exComboGrid',
                            totalProperty: 'totalCount'
                        }
                    },
                    listeners:{
                        load : function( ths, records, successful, eOpts ){
                            if(ths.getCount()==1){
                                me.getResult(records[0]);
                            }else{
                                if(ths.getCount()>1){
                                    me.gridList.getSelectionModel().select( me.gridList.getStore().getAt(0) );
                                }
                            }
                        }
                    }
                });
                me.gridList = Ext.create('Ext.grid.Panel', {
                    id : _id,
                    region 	: 'center',
                    store : gcstore,
                    columns : columnMArray,
                    plugins	: [ { ptype: 'bufferedrenderer',numFromEdge : 50 ,trailingBufferZone: 1000, leadingBufferZone: 50 }],
                    viewConfig: {
                        stripeRows: true,
                        listeners:{
                            cellkeydown : function( ths, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                                var key = e.getKey();
                                if(key == e.ENTER || key == e.SPACE ){
                                    me.getResult(record);
                                }
                            },
                            celldblclick : function( ths, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                                //Ext.Msg.alert('ddclick','.....');
                                me.getResult(record);
                            },
                            select : function( ths, record, eOpts ){
                                //ths.focusRow(1);
                            },
                            viewready : function( ths, eOpts ){
                                me.gridList.getSelectionModel().select( me.gridList.getStore().getAt(0) );
                                var d = new Ext.util.DelayedTask(function(){
                                    ths.focusRow(0);
                                });
                                d.delay(100);
                            }
                        }
                    },
                    selModel: {
                        selType: 'rowmodel',
                        mode : 'SINGLE',
                        pruneRemoved: false,
                        listeners : {
                            select:function( _ths, _rec, _idx ,_obj ){

                            },
                            render:function( _ths ,_obj){

                            }
                        }
                    },
                    listeners : {
                        viewready : function( ths, eOpts ){

                        },
                        selectionchange : function( ths, selected, eOpts ){

                        },
                        cellkeydown : function( ths, td, cellIndex, record, tr, rowIndex, e, eOpts ){

                        },
                        render : function( ths, eOpts ){

                        }
                    }
                });

            }else{
                if(data[0]=='error'){

                }
            }
        }
    );
};


builderAdvQueryFrame.prototype.initListForm = function(listIndexProperty){
    //if(listIndexProperty===undefined) return;
    var me = this;
    var listIndexWidth = 200;
    me.listIndexCfg = {
        xtype:'panel',
        id:me.sysId+'viewportwest',
        region:'west',
        title : '查询条件',
        layout:'border',
        resizable : true,
        resizeHandles : 'e',
        collapsible : true,
        collapseMode : 'mini',
        width:listIndexWidth,
        margins:'2 2 2 2',
        tbar :[
            '-',{
                xtype:'textfield',
                flex : 1,
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
                }
            },'-',
            {
                icon:'images/refresh.gif',
                cls:'x-btn-icon',
                handler:function() {
                }
            }
        ]
    };
    Ext.getCmp(me.sysId+'AdvQuery').add(me.listIndexCfg);
    me.mainForm = new builderForm (me.systemdocument ,me.sysId+'viewportwest','panel','west');
};

