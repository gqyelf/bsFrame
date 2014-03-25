/**
 * Created with IntelliJ IDEA.
 * User: Gqy
 * Date: 13-8-20
 * Time: 下午12:44
 * To change this template use File | Settings | File Templates.
 */
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', 'ext4/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.ux.grid.FiltersFeature',
    'Ext.toolbar.Paging',
    'Ext.ux.ajax.JsonSimlet',
    'Ext.ux.ajax.SimManager'
]);
function builderIndexList( _sql ,_id ,_pId ,_opObj ){
    this.objId = _id;
    this.sql = _sql;
    this.parentId = _pId;
    this.opObj = _opObj;
    this.currentDocumentNum = "";
    var me = this;

    JbsManager.processIndexListSQL(me.sql,"",
        function(data){
            var fieldMArray = [];
            var columnMArray = [];
            var columns = data.split('|')[0].split(',');

            for(var i = 0 ; i < columns.length -1 ; ++i ){
                fieldMArray.push(columns[i]);
                columnMArray.push({
                    text         : columns[i],
                    dataIndex    : columns[i],
                    menuDisabled : false,
                    hidden       : (columns[i] == 'seria_num' || columns[i] == 'document_num') ,
                    align        : 'left' ,
                    filterable: true
                });
            }
            me.comboModel = Ext.define('comboModel',{
                extend: 'Ext.data.Model',
                fields:fieldMArray
            });
            me.indexlistStore = Ext.create('Ext.data.Store', {
                fields:fieldMArray,
                data:eval('('+data.split('|')[1]+')'),
                autoLoad : true,
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        root: 'result'
                    }
                },
                listeners:{
                    add : function( store, records, index, eOpts ){
                        var rec = store.findRecord('document_num',me.currentDocumentNum);
                        me.gridList.getSelectionModel().deselectAll();
                        if(rec!=null){
                            me.gridList.getSelectionModel().select(rec);
                        }else{
                            if(store.getCount()>0){
                                me.gridList.getSelectionModel().select(store.getAt(store.getCount()-1));
                            }
                        }
                    },
                    load : function( ths, records, successful, eOpts ){
                        if(ths.getCount()>0){

                        }
                    }
                }
            });

            me.gridList = Ext.create('Ext.grid.Panel', {
                id : me.objId,
                region 	: 'center',
                //margins	: '2 2 2 2',
                store : me.indexlistStore,
                columns : columnMArray,
                plugins : 'bufferedrenderer',
                border : false,
                features: [
                    {
                        ftype: 'filters',
                        autoReload: false,
                        local: true,
                        menuFilterText : "筛选",
                        filters: [
                            {
                                type: 'string',
                                dataIndex: 'document_num'
                            },
                            {
                                type: 'numeric',
                                dataIndex: 'seria_num'
                            }
                        ]
                    }
                ],
                viewConfig: {
                    stripeRows: true,
                    listeners:{
                        cellkeydown : function( ths, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                        },
                        celldblclick : function( ths, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                        },
                        select : function( ths, record, eOpts ){

                        },
                        viewready : function( ths, eOpts ){
                        },
                        render : function(ths){

                        }
                    }
                },
                selModel: {
                    selType: 'rowmodel',
                    mode : 'SINGLE',
                    pruneRemoved: false,
                    listeners : {
                        selectionchange : function( ths, selected, eOpts ){
                            if(selected.length>0){
                                var seria_num = selected[0].get('seria_num');
                                me.opObj.locateForForm(seria_num);
                            }
                        },
                        render:function( _ths ,_obj){

                        }
                    }
                },
                listeners : {
                    reconfigure : function(  ths, store, columns, oldStore, The, eOpts  ){
                    },
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
            //me.gridList.filters;
            Ext.getCmp(me.parentId).add(me.objId);
        }
    );
}

builderIndexList.prototype.find = function( value ){
    var me = this;
    var grid = Ext.getCmp(me.objId);
    var rowIndex = grid.getSelectionModel().getCurrentPosition()===undefined ? -1 : grid.getSelectionModel().getCurrentPosition().row;
    grid.getSelectionModel().deselectAll();
    for(var i = 0 ; i < grid.columns.length ; ++i){
        if(grid.columns[i].hidden)continue;
        if(grid.getStore().findRecord(grid.columns[i].dataIndex,value,rowIndex+1,true) === null){
            continue;
        }else{
            grid.getSelectionModel().select( grid.getStore().findRecord(grid.columns[i].dataIndex,value,rowIndex+1,true) );
            return;
        }
    }
    grid.getSelectionModel().deselectAll();
};

builderIndexList.prototype.refresh = function(_documentnum ,_sql){
    var me = this;
    me.sql = (_sql === undefined ? me.sql : _sql);
    JbsManager.processIndexListSQL(me.sql,"",
        function(data){
            me.currentDocumentNum = _documentnum;
            var fieldMArray = [];
            var columnMArray = [];
            var columns = data.split('|')[0].split(',');

            for(var i = 0 ; i < columns.length -1 ; ++i ){
                fieldMArray.push(columns[i]);
                columnMArray.push({
                    text : columns[i],
                    dataIndex : columns[i],
                    menuDisabled : false,
                    hidden : (columns[i] == 'seria_num' || columns[i] == 'document_num') ,
                    width :100,
                    align: 'left'
                });
            }
            me.comboModel = Ext.define('comboModel',{
                extend: 'Ext.data.Model',
                fields:fieldMArray
            });
            me.indexlistStore.removeAll();
            me.indexlistStore.add(eval('('+data.split('|')[1]+')').result);
            /*
            me.indexlistStore = Ext.create('Ext.data.Store', {
                fields:fieldMArray,
                data:eval('('+data.split('|')[1]+')'),
                autoLoad : true,
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        root: 'result'
                    }
                },
                listeners:{
                    load : function( ths, records, successful, eOpts ){
                        if(ths.getCount()>0){
                        }
                    }
                }
            });
            me.gridList.reconfigure(me.indexlistStore ,columnMArray);*/

        }
    );
};
