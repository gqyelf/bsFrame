function gridCombo(_obj ,_sql ,_id ,_size ,_store ,_recIndex ,_column ,_setOpt ,_pos ,_point ,_offset){
    this.parentObj = _obj;
    this.objId = _obj.objId;
    this.objColumns = _obj.colMArray;
    this.objType = _obj.type;
    this.pos = _pos;
    this.sql = _sql;
    this.parentStore = _store;
    this.parentRecIndex = _recIndex;
    this.parentColumn = _column;
    this.setOpt = _setOpt;
    var me = this;
    this.scrPoint = _point;
    this.offset = ( _offset === undefined ? [0,0] : _offset );
    this.getResult = function(_record){
        var me = this;
        var setOptArray = me.setOpt.split(',');
        var arrayCount = setOptArray.length;
        for(var i = 0 ; i < arrayCount ; ++i ){
            var index1 = parseInt( setOptArray[i].split('-')[0] );
            var index2 = parseInt( setOptArray[i].split('-')[1] );
            var result = _record.get(_record.fields.get(index1).name);
            if(me.objType == 'grid'){
                me.parentStore.getAt(me.parentRecIndex).set(me.parentColumn[index2].dataIndex ,result);
                Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getAt(me.pos.row));
                Ext.getCmp(me.objId).getPlugin().startEditByPosition(me.pos);
                me.parentObj.updateRecord(me.parentStore.getAt(me.parentRecIndex));
            }
            if(me.objType == 'form'){
                var rec = Ext.getCmp(me.objId).getForm().getRecord();
                var dataIndex = me.parentColumn[index2].dataIndex;
                rec.set(dataIndex ,result);
                Ext.getCmp(me.objId).getForm().loadRecord(rec);
                if(me.objColumns[me.pos.column].xtype=='textfield'||me.objColumns[me.pos.column].xtype=='numberfield'){
                    Ext.getCmp(me.objColumns[me.pos.column].id).focus(true);
                }else{
                    Ext.getCmp(me.objColumns[me.pos.column].id).focus();
                }
            }
        }
        if(me.wnd!==undefined){
            me.wnd.close();
        }
    };
    JbsManager.processComboSQL(me.sql,"",
        function(data){
            var fieldMArray = [];
            var columnMArray = [];
            var columns = data.split('|')[0].split(',');

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
                        if(ths.getCount()==1){
                            me.getResult(records[0]);
                            return;
                        }
                        if(ths.getCount()>0){

                        }
                    }
                }
            });
            if(gcstore.getCount()>1){
                me.gridList = Ext.create('Ext.grid.Panel', {
                    id : _id,
                    region 	: 'center',
                    //margins	: '2 2 2 2',
                    store : gcstore,
                    columns : columnMArray,
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

                me.wnd = Ext.create('Ext.Window', {
                    title: 'combobox grid',
                    width: _size.width,
                    height: _size.height,
                    x: 450,
                    y: 200,
                    layout: 'fit',
                    modal : true,
                    //closeAction : 'hide',
                    items:[me.gridList],
                    listeners:{
                        render : function(ths){

                        },
                        show : function( ths, eOpts ){
                            ths.anchorTo(me.scrPoint,'bl',me.offset);
                        }
                    }
                }).show();
            }
        });
}

gridCombo.prototype.reAct = function(_point){
    var me = this;

    var fieldMArray = [];
    var columnMArray = [];

    JbsManager.processComboSQL(me.sql,"",
        function(data){
            var columns = data.split('|')[0].split(',');
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
                fields:fieldMArray,
                data:eval('('+data.split('|')[1]+')'),
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        root: 'result'
                    }
                },
                listeners:{
                    load : function( ths, records, successful, eOpts ){
                        if(ths.getCount()==0){
                            me.getResult(records[0]);
                            return;
                        }
                        if(ths.getCount()>1){
                            me.gridList.getSelectionModel().select(records[0]);
                        }
                    }
                }
            });
            me.gridList.reconfigure( gcstore, columnMArray );
        });
    me.wnd.show();
    me.wnd.anchorTo(_point,'bl',me.offset);
};