
function builderForm ( _systemdocument ,_pid ,_pType ){
	var me = this;
    var sysdoc = _systemdocument.sys_document[0];
    var sysproperty = eval('('+sysdoc.property+')');
    this.sys_id = sysdoc.sys_id;
	this.objId = sysdoc.sys_id+'Form';
    this.work_time = sysproperty.work_time == '0' ? '0000':'0000';
    this.seria_num_length = parseInt(sysproperty.seria_num_length);
    this.saveAgoProc = sysproperty.saveAgoProc;
    this.saveAfterProc = sysproperty.saveAfterProc;
	this.defaultRecord;
    this.currentRecord;
    this.formStatus = 0;
    this.databaseName = sysproperty.databaseName;
    this.formStore = null;
    this.colMArray = new Array();
    this.fieldMArray = new Array();
    this.detailObj = null;
    this.table ={mainTable : sysproperty.mainTable ,mainTableTemp : sysproperty.mainTableTemp ,mainTableView : sysproperty.mainTableView==''||sysproperty.mainTableView === undefined ? sysproperty.mainTable : sysproperty.mainTableView };
    this.type = 'form';
	this.pType = _pType;
    this.formPanel = null;
	this.builderStore = Ext.create('Ext.data.Store', {
	     fields: [{	name: 'id', type: 'int'	},
	              {	name: 'category'},
	              {	name: 'kind'},
	              { name: 'sys_id'},
	              {	name: 'subtype'},
	              {	name: 'field_showname'},
	              {	name: 'field_rawname'},
	              {	name: 'visible'},
	              {	name: 'datatype'},
	              {	name: 'width'},
                  { name: 'position'},
	              {	name: 'editable' ,type:'int'},
                  { name: 'saveable' ,type:'int'},
                  { name: 'allowEmpty' ,type:'int'},
                  { name: 'result_assign' },
	              {	name: 'default_value'},
	              {	name: 'editorXType'},
	              {	name: 'editorCfg'},
	              { name: 'summary'},
	              { name: 'beforeOpt' },
	              { name: 'afterOpt' },
	              { name: 'extOpt' }],
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
	    		 if(_systemdocument.sys_document === undefined){
		    		 me.createFormPanel( ths,'select * from detail_table_tmp' );
	    		 }else{
	    			 var property = eval( '(' + _systemdocument.sys_document[0].property + ')' );
		    		 me.createFormPanel( ths,property.sql );
	    		 }
	    		 if(_pType == 'panel'){
	    			 Ext.getCmp(_pid).add( me.objId );
	    		 }
                 if(_pType == 'tabpanel'){
                     Ext.getCmp(_pid).add({
                         title: _systemdocument.sys_document[0].caption ,
                         layout : 'border' ,
                         items:[me.objId]
                     });
                 }
	    	 }
	     },
	     autoLoad: true
	});
}

builderForm.prototype.getGridTable = function(){
	return this.table;
};

builderForm.prototype.setComboValue = function(fieldObj){
    this.FieldValue = fieldObj;
};

builderForm.prototype.initDetailObject = function(_detailObj){
    var me = this;
    if(_detailObj!==undefined && _detailObj != null){
        me.detailObj = _detailObj;
        me.detailObj.initMainObject(me);
    }
};

builderForm.prototype.setFormStatus = function(statusCode){
    var me = this;
    var fieldCount = me.colMArray.length;
    if(me.statusCode == statusCode) return;

    for(var i = 0 ; i<fieldCount ; ++i){
        if(me.colMArray[i].hidden){
            continue;
        }
        switch(statusCode){
            case 0 :
                if(!me.colMArray[i].readOnly&&me.colMArray[i].xtype!='numberfield'){
                    if(me.colMArray[i].xtype == 'button'){
                        Ext.getCmp(me.colMArray[i].id).disable();
                    }else{
                        try{
                            Ext.getCmp(me.colMArray[i].id).setReadOnly(true);
                        }catch(e){
                            console.log(me.sys_id+':'+me.colMArray[i].id);
                            console.log(e);
                        }
                    }
                }
                break;
            case 1 :
                if(!me.colMArray[i].readOnly&&me.colMArray[i].xtype!='numberfield'){
                    if(me.colMArray[i].xtype == 'button'){
                        Ext.getCmp(me.colMArray[i].id).enable();
                    }else{
                        try{
                            Ext.getCmp(me.colMArray[i].id).setReadOnly(me.colMArray[i].readOnly);
                        }catch(e){
                            console.log(me.sys_id+':'+me.colMArray[i].id);
                            console.log(e);
                        }
                    }
                }
                break;
        }
    }
    if(!(me.detailObj == null || me.detailObj === undefined)){
        me.detailObj.setGridStatus(statusCode);
    }
    me.formStatus = statusCode;
};

builderForm.prototype.checkFormData = function( ){

};

builderForm.prototype.getLastEditorColumn = function(grid){
	var lastEditorColumn = 0;
	for( var i = 0 ; i<grid.columns.length ; ++i ){
		{
			if( grid.columns[i].hidden || grid.columns[i].editor===null ){
				continue;		
			}else{
				lastEditorColumn = i;
			}
		}
	}
	return lastEditorColumn;
};

builderForm.prototype.getSeriaNum = function(){
    var me = this;
    return Ext.getCmp(me.objId).getForm().getRecord().get('seria_num');
};

builderForm.prototype.getDocumentNum = function(){
    var me = this;
    return Ext.getCmp(me.objId).getForm().getRecord().get('document_num');
};

builderForm.prototype.getWorkTime = function(){
    var me = this;
    return Ext.getCmp(me.objId).getForm().getRecord().get('work_time');
};

builderForm.prototype.getSysId = function(){
    var me = this;
    return Ext.getCmp(me.objId).getForm().getRecord().get('sys_id');
};

builderForm.prototype.getNextEditCellPosition = function(grid ,obj ,field){
    var me = this;
    var currentObj = obj;
	if(field != null){
	}
	for( var i = obj.column+1 ; i< me.colMArray.length ; ++i ){
		if( i == (me.colMArray.length) ){
            break;
		}else{
			if( me.colMArray[i].readOnly ){
				continue;		
			}else{
				obj.column = i;
				return obj;
			}
		}
	}
    return currentObj;
};

builderForm.prototype.reloadReconfigGrid = function(_id,_table,_sql,_systemdocumentdetail){

};

builderForm.prototype.getGridColumns = function(){
	
	return Ext.getCmp(this.objId).column;
	
};

builderForm.prototype.setGridColumns = function( _columns ){
	
};

builderForm.prototype.reconfigForm = function( _id,_table,_sql ){

};

builderForm.prototype.resetForm = function(_datebase ,_categroy ,_kind ,_sys_id ,_table ,_sql){

};

builderForm.prototype.update = function(_direction){
    if(_direction){

    }else{

    }
};

builderForm.prototype.getRecord = function(){
    var me = this;
    Ext.getCmp(me.objId).getForm().updateRecord();
    return Ext.getCmp(me.objId).getForm().getRecord( );
};

builderForm.prototype.destroy = function(){
    var me = this;
    Ext.getCmp(me.objId).close();
};

builderForm.prototype.newRecord = function(){
    var me = this;
    //me.formStore.removeAll();
    me.initDefaultRecord();
    //me.formStore.add(me.defaultRecord);
    me.formPanel.getForm().loadRecord(me.defaultRecord);
    me.formPanel.getForm().updateRecord();
    me.setFormStatus(1);
};


builderForm.prototype.locateForForm = function(_seria_num ,_sql){
    var me = this;
    var seria_num = _seria_num;
    me.formStore.reload({
        params : {
            dbName	    :	me.databaseName,
            sessionId	:	sessionId,
            table		:	me.table.mainTableView,
            sql			:   _sql,
            sysid       :   me.sys_id,
            worktime    :   me.work_time,
            seria_num   :   seria_num,
            direction   :   "locate"
        },
        callback : function(r,opt,success){
            if(me.detailObj!=null){
                if(r.length>0)
                {
                    var seria_num = r[0].get('seria_num');
                    me.detailObj.locateForGrid(seria_num);
                }
            }
        }
    });
};

builderForm.prototype.prevForForm = function(_table ,_seria_num ,_sql){
    var me = this;
    var sql = ( _sql === undefined ? '' : _sql );
    var seria_num = ( _seria_num === undefined ? me.formPanel.getForm().getRecord().get('seria_num') : _seria_num );
    me.formStore.reload({
        params : {
            dbName	    :	me.databaseName,
            sessionId	:	sessionId,
            table		:	me.table.mainTableView,
            sql			:   sql,
            sysid       :   me.sys_id,
            worktime    :   me.work_time,
            seria_num   :   seria_num,
            direction   :   seria_num == -1 ? "first" : "prev"
        },
        callback : function(r,opt,success){
            if(me.detailObj!=null){
                if(r.length>0)
                {
                    var seria_num = r[0].get('seria_num');
                    me.detailObj.locateForGrid(seria_num);
                }
            }
        }
    });
};

builderForm.prototype.nextForForm = function(_table ,_seria_num ,_sql){
    var me = this;
    var seria_num = ( _seria_num === undefined ? me.formPanel.getForm().getRecord().get('seria_num') : _seria_num );
    var sql = ( _sql === undefined ? '' : _sql );
    me.formStore.reload({
        params : {
            dbName	    :	me.databaseName,
            sessionId	:	sessionId,
            table		:	me.table.mainTableView,
            sql			:   sql,
            sysid       :   me.sys_id,
            worktime    :   me.work_time,
            seria_num   :   seria_num,
            direction   :   seria_num == -1 ? "last" : "next"
        },
        callback : function(r,opt,success){
            if(me.detailObj!=null){
                if(r.length>0)
                {
                    var seria_num = r[0].get('seria_num');
                    me.detailObj.locateForGrid(seria_num);
                }
            }
        }
    });
};

builderForm.prototype.initDefaultRecord = function(){
    var me = this;
    me.defaultRecord = Ext.create('sys_document_order'+me.objId, {});
    me.defaultRecord.set("sys_id",me.sys_id);
    me.defaultRecord.set("work_time",me.work_time);
    me.defaultRecord.set("workstation_id",sessionId);
};

builderForm.prototype.initStore = function( _table,_sql ){
    var me = this;
    me.formStore = 	Ext.create('Ext.data.Store', {
        model: 'sys_document_order'+me.objId,
        proxy: {
            type: 'jsonp',
            url: 'builderform_jsonp.jsp',
            extraParams : {
                dbName	    :	me.databaseName,
                sessionId	:	sessionId,
                table		:	_table,
                sql			:   _sql,
                sysid       :   me.sys_id,
                worktime    :   me.work_time,
                seria_num   :   "",
                direction   :   "new" //original : direction : "next"
            },
            reader: {
                root: 'sys_document_order'
            }
        },
        listeners:{
            load : function(ths ,records ,successful ,eOpts){
                if(successful){
                    var _seria_num;
                    if(ths.getCount()==0){
                        Ext.getCmp(me.objId).getForm().loadRecord( me.defaultRecord );
                        me.setFormStatus(0);//original: me.setFormStatus(1);
                        _seria_num = -1;
                    }else{
                        _seria_num = records[0].get('seria_num');
                        records[0].set('workstation_id',m_workstation);
                        try{
                            Ext.getCmp(me.objId).getForm().loadRecord( records[0] );
                        }catch(e){
                            console.log('ex:'+e);
                            console.log('buildForm s id @loadRecord :'+me.objId);
                        }
                        me.setFormStatus(0);
                    }
                    JbsManager.getLocationForModel(
                        me.databaseName ,
                        me.table.mainTable ,
                        me.sys_id ,
                        me.work_time ,//original : records[0].get('work_time')
                        _seria_num ,//records[0].get('seria_num')
                        function(data){
                            var resultTag = data.split('|')[0];
                            if(resultTag=='success'){
                                if(Ext.getCmp(me.sys_id+'location')!==undefined){
                                    Ext.getCmp(me.sys_id+'location').setValue(data.split('|')[1].split(',')[0]);
                                }
                                if(Ext.getCmp(me.sys_id+'total')!==undefined){
                                    Ext.getCmp(me.sys_id+'total').setValue(data.split('|')[1].split(',')[1]);
                                }
                            }
                        }
                    );
                    try{
                        Ext.getCmp(me.objId).getForm().updateRecord();
                    }catch(e){
                        console.log('ex:'+e);
                        console.log('buildForm s id @updateRecord :'+me.objId);
                    }

                }
            },
            add : function( store, records, index, eOpts ){
                Ext.getCmp(me.objId).getForm().loadRecord( records[0] );
            }
        },
        autoLoad: true
    });
};


builderForm.prototype.setGroupColumns = function( _group ){
    var columnCount = 0;
    var rowCount = 0
    var arrayLength = _group.length;
    for(var i = 0 ; i< arrayLength ; ++i){
        if( _group[i].position.split(',')[1]!==undefined ){
            var cc = parseInt(_group[i].position.split(',')[1]);
            var rc = parseInt(_group[i].position.split(',')[0]);
            columnCount = columnCount < cc ? cc : columnCount;
            rowCount = rowCount < rc ? rc : rowCount;
        }
    }
    var group = new Array();
    for(i = 0 ; i < rowCount ;++i){
        var fieldCell = new Array();
        for(var j = 0 ; j < columnCount ;++j){
            fieldCell.push({ flex : 1 ,xtype :'container' ,layout :'anchor' });
        }
        fieldCell = { xtype: 'fieldcontainer' ,layout: 'hbox' ,items: fieldCell };
        group.push(fieldCell);
    }
    for(i = 0 ; i<_group.length ; ++i){
        if( _group[i].position == '' ){
            group.push(_group[i]);
        }else{
            var rowIndex = parseInt(_group[i].position.split(',')[0]);
            var columnIndex = parseInt(_group[i].position.split(',')[1]);
            group[rowIndex-1].items[columnIndex-1].items=new Array(_group[i]);
        }
    }
    return group;
};

builderForm.prototype.createFormPanel = function(_store,_sql){
    var me = this;
    //me.table = _table;
    me.fieldMArray = new Array();
    me.colMArray = new Array();
	for( var i = 0 ; i<_store.getCount() ; ++i ){
		if(_store.getAt(i).get('sys_id')!=me.sys_id || _store.getAt(i).get('subtype')!='form'){
			continue;
		}
        var listenersObj = {
            change : function( ths, newValue, oldValue, eOpts ){
                if(ths.xtype == 'checkboxfield'){
                    var rec = Ext.getCmp(me.objId).getForm().getRecord();
                    rec.set(ths.dataIndex ,newValue);
                    Ext.getCmp(me.objId).getForm().updateRecord(rec);
                }
            },
            specialkey : function( field, e ){
                if(me.formStatus==0)return;
                var rec;
                if( e.getKey() == e.ENTER ){
                    var row = 0;
                    var column = 0;
                    for( var i = 0 ; i < me.colMArray.length ; ++i ){
                        if(me.colMArray[i].dataIndex == field.name){
                            column = i;
                        }
                    }
                    var editorCfg = me.colMArray[column].editorCfg;
                    var extendParamCfg = editorCfg.extParam;
                    rec = Ext.getCmp(me.objId).getForm().getRecord();
                    var extendParam1 = arrayToString( recordForColumnToArray(rec ,me.colMArray ,extendParamCfg) );
                    var value = field.getValue();
                    var sqlProc = me.colMArray[column].extOpt.sqlProc === undefined ? '' : me.colMArray[column].extOpt.sqlProc;
                    enterKeyEventsF ( me ,field ,sqlProc ,new baseParam(m_worktime,m_workstation,m_operator) ,value ,extendParam1 ,'' ,row ,column );
                }
                if(e.getKey() == e.TAB){
                    rec = Ext.getCmp(me.objId).getForm().getRecord();
                    Ext.getCmp(me.objId).getForm().loadRecord(rec);
                }
            },
            blur : function( ths, The, eOpts ){
                var rec = Ext.getCmp(me.objId).getForm().getRecord();
                Ext.getCmp(me.objId).getForm().loadRecord(rec);
            }
        };
        if( _store.getAt(i).get('editorXType') == 'button' ){
            listenersObj.click = function( ths, e, eOpts ){
                if(ths.xtype=='button'){
                    //{sqlProc : "Example_enterKeyEvents" ,parameters : "" ,clickMsg : "" , resultAssign : ""}
                    var sqlProc = ths.extOpt.sqlProc;
                    var urlProc = ths.extOpt.urlProc;
                    var rec = Ext.getCmp(me.objId).getForm().getRecord();
                    var baseParameters = rec.get('sys_id')+','+rec.get('work_time')+','+rec.get('workstation_id');
                    var editorCfg = ths.editorCfg;
                    var extendParamCfg = editorCfg.extParam;

                    var extParameters = me.getParameters(extendParamCfg,rec);
                    var parameters = extParameters.length > 0 ? (baseParameters + ',' + extParameters) : baseParameters;
                    if( sqlProc!="" && sqlProc!==undefined ){
                        JbsManager.commonEventProc(
                            sqlProc,
                            parameters,
                            function(data){
                                var resultTag = data[0];
                                if(resultTag=='success'){
                                    if(me.detailObj!=null){
                                        me.detailObj.updateGridViewer(sessionId,me.getSeriaNum());
                                    }
                                }else{
                                    loadMark(false);
                                    if(resultTag == 'error'){
                                    }else{
                                    }
                                }
                            }
                        )
                    }
                    if(urlProc!="" && urlProc!==undefined){
                        gotoUrl(urlProc ,me.getParameters(extendParamCfg,rec));
                    }
                }
            };
        }
        me.colMArray.push({
            id : me.objId+_store.getAt(i).get('field_rawname'),
            xtype : _store.getAt(i).get('editorXType'),
            //labelAlign : 'right',
            fieldLabel : _store.getAt(i).get('allowEmpty') == '0' ? _store.getAt(i).get('field_showname')+'<span style="color:red ;font-weight:bold" data-qtip="Required">*</span>' : _store.getAt(i).get('field_showname'),
            name :  _store.getAt(i).get('field_rawname'),
            text : _store.getAt(i).get('field_showname'),
            labelSeparator:'：',
            hidden : (_store.getAt(i).get('visible')!='1'),
            readOnly : _store.getAt(i).get('editable')!='1',
            editorCfg : _store.getAt(i).get('editorCfg') == '' ? eval( '({})' ) : eval( '('+_store.getAt(i).get('editorCfg')+')' ),
            dataIndex : _store.getAt(i).get('field_rawname'),
            extOpt : eval( '(' + ( _store.getAt(i).get('extOpt') == '' ? '{}' : _store.getAt(i).get('extOpt') ) + ')' ),
            value : _store.getAt(i).get('default_value'),
            labelWidth: _store.getAt(i).get('width').split(',').length == 2 ? parseInt(_store.getAt(i).get('width').split(',')[0]) : 80 ,
            anchor : _store.getAt(i).get('width').split(',').length == 2 ? _store.getAt(i).get('width').split(',')[1]+'%' : _store.getAt(i).get('width')+'%',
            position: _store.getAt(i).get('position'),
            resultAssign : _store.getAt(i).get('result_assign'),
            margin : _store.getAt(i).get('editorXType')=='button'?'0 0 0 '+ (5 + (_store.getAt(i).get('width').split(',').length == 2 ? parseInt(_store.getAt(i).get('width').split(',')[0]) : 80) ):undefined ,
            listeners : listenersObj
        });
        var dv = me.defaultValueProc( _store.getAt(i).get('default_value') );
		me.fieldMArray.push({
			name : _store.getAt(i).get('field_rawname'),
			type : _store.getAt(i).get('datatype'),
            defaultValue : ( _store.getAt(i).get('field_rawname')=='workstation_id' ) ? sessionId : ( _store.getAt(i).get('datatype')=='int' ? parseInt(dv) : dv ),
            saveable : _store.getAt(i).get('saveable')===undefined ? 1 : _store.getAt(i).get('saveable')
		}) ;
	}
	Ext.define('sys_document_order'+me.objId, {
		extend: 'Ext.data.Model',
        fields: me.fieldMArray
	});

    me.initDefaultRecord();

    me.formPanel = new Ext.widget({
        id : me.objId,
        xtype : 'form',
        bodyPadding: 10,
        border : false,
        autoScroll : true,
        region : 'center',
        layout: 'anchor',
        frame : false,
        defaults:{
            anchor:'100%'
        },
        items : me.setGroupColumns(me.colMArray),//me.colMArray,//
        listeners : {
            render : function( ths ,eOpts ){
                me.newRecord();
                me.initStore(me.table.mainTableView ,_sql);
            }
        }
    });
	return me.objId;
};

builderForm.prototype.getRecDefine = function(){
    var me = this;
    var rec = Ext.getCmp(me.objId).getForm().getRecord();
    var result = GetRecDefine(rec);
    return result;
};

builderForm.prototype.defaultValueProc = function(default_value){
    var result = default_value;
    if( typeof(default_value)=='string' && default_value.indexOf('=')==0){
        try{
            result = eval(default_value.substr(1));
        }catch(e){
            console.log(e);
        }
    }
    return result;
};
builderForm.prototype.getParameters = function(parametersIndexStr ,rec){
    var result = "";
    if(parametersIndexStr==''||parametersIndexStr===undefined){
        return result;
    }
    var index;
    var parametersIndexArray = parametersIndexStr.split(',');
    var arrayCount = parametersIndexArray.length;
    for(var i = 0 ; i < arrayCount ; ++i ){
        try{
            index = parseInt( parametersIndexArray[i] );
        }catch(e){
            console.log(e);
        }
        if( isNaN(index) ){
            console.log("参数配置不正确...");
            continue;
        }
        if((i+1)==arrayCount){
            result = result + rec.get(rec.fields.get( index ).name);
        }else{
            result = result + rec.get(rec.fields.get( index ).name) + ",";
        }
    }
    return result;
};