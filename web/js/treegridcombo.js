function getWidth(_width ,_widthStr ,_index ,_startIndex){
    var base = 0;
    if(_index<_startIndex){
        return 0;
    }
    var widthArray = _widthStr.split(',');
    for(var i = _startIndex ; i<widthArray.length ; ++i){
        base += parseInt(widthArray[i]);
    }
    return _width*(parseInt(widthArray[_index])/base);
}

function treegridCombo(_obj ,_sql ,_id ,_size ,_store ,_recIndex ,_column ,_setOpt ,_pos ,_point ,_offset){
    this.objId = _obj.objId;
    this.objColumns = _obj.colMArray;
    this.objType = _obj.type;
    this.pos = _pos;
    this.sql = _sql;
    this.parentStore = _store;
    this.parentRecIndex = _recIndex;
    this.parentColumn = _column;
    this.setOpt = _setOpt;
    this.wndSize = _size;
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
            }
            if(me.objType == 'form'){
                var rec = Ext.getCmp(me.objId).getForm().getRecord();
                rec.set(me.parentColumn[index2].dataIndex ,result);
                Ext.getCmp(me.objId).getForm().loadRecord(rec);
                //Ext.getCmp(me.objId).getComponent(me.pos.column).focus(true);
                if(me.objColumns[me.pos.column].position==''){
                    Ext.getCmp(me.objId).getComponent().focus(true);
                }else{
                    Ext.getCmp(me.objId).getComponent(parseInt(me.objColumns[me.pos.column].position.split(',')[0])-1).getComponent(parseInt(me.objColumns[me.pos.column].position.split(',')[1])-1).getComponent(0).focus(true);
                }
            }
        }
        me.wnd.close();
    };
    this.getResults = function(_records){
        var me = this;
        var setOptArray = me.setOpt.split(',');
        var arrayCount = setOptArray.length;
        for(var i = 0 ; i < arrayCount ; ++i ){
            var index1 = parseInt( setOptArray[i].split('-')[0] );
            var index2 = parseInt( setOptArray[i].split('-')[1] );
            var result = "";//_record.get(_record.fields.get(index1).name);
            for(var j = 0 ; j<_records.length ; ++j){
                if(j+1 ==_records.length ){
                    result = result+_records[j].get(_records[j].fields.get(index1).name);
                }else{
                    result = result+_records[j].get(_records[j].fields.get(index1).name)+"|";
                }
            }
            if(me.objType == 'grid'){
                me.parentStore.getAt(me.parentRecIndex).set(me.parentColumn[index2].dataIndex ,result);
            }else{
                var rec = Ext.getCmp(me.objId).getForm().getRecord();
                rec.set(me.parentColumn[index2].dataIndex ,result);
                Ext.getCmp(me.objId).getForm().loadRecord(rec);
                //Ext.getCmp(me.objId).getComponent(me.pos.column).focus(true);
            }
        }
        if(me.objType == 'grid'){
            Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getAt(me.pos.row));
            Ext.getCmp(me.objId).getPlugin().startEditByPosition(me.pos);
        }else{
            if(me.objColumns[me.pos.column].position==''){
                //Ext.getCmp(me.objId).getComponent().focus(true);
            }else{
                //Ext.getCmp(me.objId).getComponent(parseInt(me.objColumns[me.pos.column].position.split(',')[0])-1).getComponent(parseInt(me.objColumns[me.pos.column].position.split(',')[1])-1).getComponent(0).focus(true);
            }
        }
        if(me.wnd!==undefined){
            me.wnd.close();
        }
        me.wnd.close();
    };
    JbsManager.processTreeComboSQL(me.sql,"",
        function(data){
            var fieldMArray = new Array();
            var columnMArray = new Array();
            var columns = data.split('|')[0].split(',');
            var columnWidth = data.split('|')[2];
            for(var i = 0 ; i < columns.length -1 ; ++i ){
                fieldMArray.push(columns[i]);
                columnMArray.push({
                    xtype: i==2 ? 'treecolumn' : '',
                    text : columns[i],
                    dataIndex : columns[i],
                    menuDisabled : false,
                    hidden : i<2 || (columns[i]=='checkbox'),
                    width:getWidth(me.wndSize.width ,columnWidth ,i ,2),
                    align: 'left'
                });
            }
            me.comboModel = Ext.define('comboModel',{
                extend: 'Ext.data.Model',
                fields:fieldMArray
            });

            var gcstore = Ext.create('Ext.data.TreeStore', {
                storeId:'treegridComboStore',
                fields:fieldMArray,
                root:eval('('+data.split('|')[1]+')'),
                listeners:{
                    load : function( ths, records, successful, eOpts ){
                    }
                }
            });

            me.gridList = Ext.create('Ext.tree.Panel', {
                id : _id,
                region 	: 'center',
                collapsible: false,
                useArrows: true,
                rootVisible: false,
                multiSelect: false,
                singleExpand : false,
                store : gcstore,
                border : false,
                columns : columnMArray,
                viewConfig: {
                    stripeRows: true,
                    listeners:{
                        show : function( ths, eOpts ){
                        },
                        cellkeydown : function( ths, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                            var key = e.getKey();
                            if(key == e.ENTER || key == e.SPACE ){
                                if(record.get("checkbox")===undefined){
                                    me.getResult(record);
                                }else{
                                    var records = Ext.getCmp(_id).getView().getChecked();
                                    if(records.length>0){
                                        me.getResults(records);
                                    }
                                }
                            }
                        },
                        celldblclick : function( ths, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                            //Ext.Msg.alert('ddclick','.....');
                            if(record.get("checkbox")===undefined){
                                me.getResult(record);
                            }else{
                                var records = Ext.getCmp(_id).getView().getChecked();
                                if(records.length>0){
                                    me.getResults(records);
                                }
                            }
                        },
                        select : function( ths, record, eOpts ){
                            //ths.focusRow(1);
                        },
                        viewready : function( ths, eOpts ){
                            //me.gridList.getSelectionModel().select( me.gridList.getStore().getAt(0) );
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
                    checkchange : function( node, checked, eOpts ){
                        if(node===undefined){

                        }
                    }
                }
            });

            me.wnd = Ext.create('Ext.Window', {
                title: 'combobox grid',
                width: me.wndSize.width,
                height: me.wndSize.height,
                //x: 450,
                //y: 200,
                layout: 'fit',
                modal : true,
                //closeAction : 'hide',
                items:[me.gridList],
                listeners:{
                    show : function( ths, eOpts ){
                        ths.anchorTo(me.scrPoint,'bl',me.offset);
                    }
                }
            }).show();
        });
}

treegridCombo.prototype.reAct = function(_point){
    var me = this;

    var fieldMArray = new Array();
    var columnMArray = new Array();

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
                storeId:'treegridComboStore',
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
                        if(ths.getCount()>0){
                            me.gridList.expandNode(records[ths.getCount()-1]);
                        }
                    }
                }
            });
            me.gridList.reconfigure( gcstore, columnMArray );
        });
    me.wnd.show();
    me.wnd.anchorTo(_point,'bl',me.offset);
};