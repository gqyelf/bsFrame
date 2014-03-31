/**
 * Created by Gqy on 14-3-3.
 */

function builderSimpleQuery (_systemdocument ,_pid ,_pType ,parentObj){
    var sysdoc = _systemdocument.sys_document[0];
    var sysproperty = eval('('+sysdoc.property+')');
    this.sys_id = sysdoc.sys_id;
    this.caption_text =sysdoc.caption+"——查询";
    this.objId = sysdoc.sys_id+'Query';
    this.parentId = _pid;
    this.parentObj = parentObj;
    this.parentType = _pType;
    this.work_time = sysproperty.work_time == '0' ? '0000':m_worktime;
    this.seria_num_length = parseInt(sysproperty.seria_num_length);
    this.querySqlProc = sysproperty.querySqlProc;
    var sysdocDefaultRecordF = _systemdocument.defaultRecordF;
    this.formStatus = 0;
    this.databaseName = sysproperty.databaseName;
    this.formStore = null;
    this.colMArray = [];
    this.fieldMArray = [];
    this.colMArrayG = [];
    this.fieldMArrayG = [];
    var me = this;
    this.builderStore = Ext.create('Ext.data.Store', {
        fields: [
            {	name: 'id', type: 'int'	},
            {	name: 'category'},
            {	name: 'kind'},
            {   name: 'sys_id'},
            {	name: 'subtype'},
            {	name: 'field_showname'},
            {	name: 'field_rawname'},
            {	name: 'visible'},
            {	name: 'datatype'},
            {	name: 'width'},
            {   name: 'position'},
            {	name: 'editable' ,type:'int'},
            {   name: 'saveable' ,type:'int'},
            {   name: 'allowEmpty' ,type:'int'},
            {   name: 'result_assign' },
            {	name: 'default_value'},
            {	name: 'editorXType'},
            {	name: 'editorCfg'},
            {   name: 'summary'},
            {   name: 'beforeOpt' },
            {   name: 'afterOpt' },
            {   name: 'extOpt' }
        ],
        data:_systemdocument,
        proxy: {
            type: 'memory',
            reader: {
                type:'json',
                root: 'sys_document_order_detail'
            }
        },
        listeners:{
            load : function( ths, record, successful, eOpts ){
                //me.initDefaultRecord(ths,sysdocDefaultRecordF);
                me.createObject(ths);
            }
        },
        autoLoad: true
    });
    return this.objId;
}

builderSimpleQuery.prototype.createObject = function(ths){
    var me = this;
    var store = ths;
    me.fieldMArray = [];
    me.colMArray = [];
    me.fieldMArrayG = [];
    me.colMArrayG =[];
    me.colMArrayG.push({
        xtype: 'rownumberer',
        width: 40,
        sortable: false
    });
    for( var i = 0 ; i<store.getCount() ; ++i ){
        var cfg = store.getAt(i).get('editorCfg') == '' ? eval( '({})' ) : eval( '('+store.getAt(i).get('editorCfg')+')' );
        if(store.getAt(i).get('sys_id')==me.sys_id && cfg.isQuery == 1){
            me.colMArray.push( me.createColumnObj(store.getAt(i)) );
            me.fieldMArray.push({
                name : store.getAt(i).get('field_rawname'),
                type : store.getAt(i).get('datatype'),
                defaultValue : store.getAt(i).get('default_value')
            });
        }
        if( store.getAt(i).get('sys_id')==me.sys_id && cfg.queryVisible=='1' ){
            me.colMArrayG.push(me.createColumnGObj(store.getAt(i)));
            var fieldType = store.getAt(i).get('datatype');
            fieldType = (fieldType === undefined || fieldType == "")?'string':fieldType;
            me.fieldMArrayG.push({
                name : store.getAt(i).get('field_rawname'),
                type : fieldType,
                defaultValue : store.getAt(i).get('default_value')
            });
        }
    }
    me.fieldMArrayG.push({
        name : 'seria_num',
        type : 'int'
    });
    Ext.define('sys_document_order'+me.objId, {
        extend: 'Ext.data.Model',
        fields: me.fieldMArray
    });
    Ext.define('sys_document_order_detail'+me.objId, {
        extend: 'Ext.data.Model',
        fields: me.fieldMArrayG
    });
    me.gridStore = Ext.create('Ext.data.Store', {
        model: 'sys_document_order_detail'+me.objId,
        pageSize: 5000,
        proxy: {
            type: 'jsonp',
            url: 'builderSimpleQuery_jsonp.jsp',
            extraParams : {
                dbName	: me.databaseName,
                sqlProc : me.querySqlProc,
                sqlPram : "null"
            },
            reader: {
                root: 'sys_document_order_detail',
                totalProperty: 'totalCount'
            }
        },
        listeners:{
            load : function(ths ,records ,successful ,eOpts){

            },
            add : function( store, records, index, eOpts ){

            }
        },
        autoLoad: true
    });
    me.queryWndCfg={
        id            : me.objId,
        title        : me.caption_text,
        layout      : 'border',
        width       : Ext.getCmp(me.parentId).getSize().width,
        height      : Ext.getCmp(me.parentId).getSize().height,
        margins:'2 2 2 2',
        resizable     : true,
        draggable    : true,
        closable    : true,
        closeAction : 'destroy',
        plain       : true,
        items :[
            {
                xtype : 'form',
                bodyPadding: 10,
                margins:'0 2 0 0',
                width : 200,
                border : false,
                autoScroll : true,
                region : 'west',
                layout: 'anchor',
                frame : false,
                items : me.colMArray,
                defaults:{
                    anchor:'100%'
                },
                buttons: [
                    {
                        id : me.objId+"buttonQuery",
                        xtype : "button",
                        text : "按条件查询",
                        handler : function(){
                            me.gridStore.reload({
                                params : {
                                    dbName	: me.databaseName,
                                    sqlProc : me.querySqlProc,
                                    sqlPram : me.FormValuesToArray()
                                },
                                callback : function(r,opt,success){
                                }
                            });
                        }
                    }
                ]
            },
            {
                xtype : 'gridpanel',
                region 	: 'center',
                margins:'0 0 0 2',
                border : false,
                store : me.gridStore,
                columns	: me.colMArrayG,
                columnLines : true,
                selModel: {
                    selType: 'rowmodel',
                    mode : 'SINGLE',
                    pruneRemoved: false,
                    listeners : {
                        select : function( ths, record, index, eOpts ) {
                            var sn = record.get('seria_num');
                            me.parentObj.mainForm.locateForForm(sn);
                        }
                    }
                },
                viewConfig: {
                    stripeRows: true,
                    trackOver: true,
                    loadMask:true
                }
            }
        ]
    };
    new Ext.Window(me.queryWndCfg).show();
};

builderSimpleQuery.prototype.createColumnGObj = function(_columnOrig){
    var me = this;
    var columnRec = _columnOrig;
    var editorXType = columnRec.get('editorXType');
    var fieldShowName = columnRec.get('field_showname');
    var fieldRawName =  columnRec.get('field_rawname');
    var fieldVisible = !(columnRec.get('visible')=='1');
    var fieldWidth = parseInt(columnRec.get('width'));
    var columnCfg = {
        text : fieldShowName,
        dataIndex : fieldRawName,
        draggable : false,
        menuDisabled : true,
        hidden : fieldVisible,
        sortable: false,
        width : fieldWidth
    };
    if(editorXType == 'checkboxfield'){
        columnCfg.xtype = 'checkcolumn';
        columnCfg.align = 'center';
        columnCfg.disabled = true;
        columnCfg.disabledCls = '';
        return columnCfg;
    }
    columnCfg.align = columnRec.get('datatype')=='string'?'left':'right';
    return columnCfg;
};

builderSimpleQuery.prototype.createColumnObj = function(_columnOrig){
    var me = this;
    var columnRec = _columnOrig;
    var editorXType = columnRec.get('editorXType');
    var fieldShowName = columnRec.get('field_showname');
    var fieldRawName = columnRec.get('field_rawname');
    var columnCfg = {
        id : me.objId+fieldRawName,
        xtype : editorXType,
        labelAlign : 'top',
        fieldLabel : fieldShowName,
        name :  fieldRawName,
        text : fieldShowName,
        labelSeparator:'：',
        dataIndex : fieldRawName
    };
    return columnCfg;
};

builderSimpleQuery.prototype.FormValuesToArray = function( ){
    var me = this;
    var form = Ext.getCmp(me.objId).getComponent(0);
    var formValues = form.getValues();
    var result = [];
    for(var i = 0 ;i<me.fieldMArray.length;++i){
        if(me.fieldMArray[i].type=='string'){
            result.push(eval('formValues.'+me.fieldMArray[i].name));
        }else{
            var other = eval('formValues.'+me.fieldMArray[i].name);
            result.push(eval('"'+other+'"'));
        }
    }
    return result.toString();
};