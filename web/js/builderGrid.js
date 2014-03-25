

function builderGrid ( _systemdocument ,_pid ,_pType ){
	var me = this;
    var sysdoc = _systemdocument.sys_document[0];
    var sysproperty = eval('('+sysdoc.property+')');
    var sysdocDefaultRecordG = _systemdocument.defaultRecordG;
    this.work_time = sysproperty.work_time == '0' ? '0000':m_worktime;
	this.objId = sysdoc.sys_id+'Grid';
    this.sys_id = sysdoc.sys_id;
    this.mainObj = null;
    this.defaultRecord;
    this.emptyRecord;
    this.type = 'grid';
    this.gridStatus = 0;
    this.colMArray = [];
    this.colMArrayR= [];
    this.fieldMArray = [];
    this.databaseName = sysproperty.databaseName;
    this.table ={
        detailTable : sysproperty.detailTable ,
        detailTableTemp : sysproperty.detailTableTemp ,
        detailTableView : sysproperty.detailTableView==''||sysproperty.detailTableView === undefined ? sysproperty.detailTable : sysproperty.detailTableView,
        detailTableTempView : sysproperty.detailTableTempView==''||sysproperty.detailTableTempView === undefined ? sysproperty.detailTableTemp : sysproperty.detailTableTempView
    };
    this.gridHeight = sysproperty.detailGridHight;
	this.pType = _pType;
    this.gridStore = null;

	this.builderStore = Ext.create('Ext.data.Store', {
	     id: 'builderGridStore',
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
                  {	name: 'allowEmpty' ,type:'int'},
                  {	name: 'editable' ,type:'int'},
                  { name: 'saveable' ,type:'int'},
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
                 me.initDefaultRecord(ths,sysdocDefaultRecordG);
	    		 if(_systemdocument.sys_document === undefined){
		    		 me.createGridPanel( ths,'select * from detail_table_tmp' );
	    		 }else{
	    			 var property = eval( '('+_systemdocument.sys_document[0].property+')' );
		    		 me.gc = property.groupcolumns;
		    		 me.createGridPanel( ths,'' );
	    		 }
	    		 if(_pType == 'panel'){
	    			 Ext.getCmp(_pid).add( me.objId );
	    		 }
                 if(_pType == 'tabpanel'){
                     Ext.getCmp(_pid).add({
                         title: _systemdocument.sys_document[0].caption ,
                         layout : 'border' ,
                         items:['sys_mainTable']
                     });
                 }
	    	 }
	     },
	     autoLoad: true
	 });
}

builderGrid.prototype.enterKeyEvents = function( _field ,_sqlProc ,_baseParam ,_value ,_extendParam1 ,_extendParam2 ,_row ,_column ){
    var me = this;
    //var objId = me.objId;
    var rec = Ext.getCmp(me.objId).getSelectionModel().getSelection()[0];
    var columnIndex = Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition( ).column;
    var cellColumn = me.colMArray[columnIndex].dataIndex;
    var resultAssign = me.colMArray[columnIndex].resultAssign;
    var editorCfg = me.colMArray[columnIndex].editorCfg;
    var elId = _field.ownerCt.boundEl.id;
    rec.set(cellColumn,_value);
    if(editorCfg.enterCfg==-3 && _sqlProc!=''){
        var sqlProc = 'exec '+_sqlProc;
        var paramArray = _baseParam.getArray();
        paramArray.push(_value);
        if(_extendParam1!=null){
            paramArray = paramArray.concat(_extendParam1);
        }
        if(_extendParam2!=null){
            paramArray = paramArray.concat(_extendParam2);
        }
        var paramStr = "'"+paramArray.toString().replace(/,/g ,"','")+"',"+_row+','+_column;
        console.log('enterKeyEvents->(-3)->paramStr:'+paramStr);
        var posInside = me.getNextPosition( Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition() );
        sqlProc = sqlProc + " " + paramStr;
        new gridCombo(me ,sqlProc ,'test00001' ,editorCfg.wndSize ,Ext.getCmp(me.objId).store ,_row ,me.colMArray ,resultAssign ,posInside ,elId );
        return;
    }
    if(_sqlProc == '' || _sqlProc === undefined){
        //rec.set(cellColumn,_value);
        var nextCell = me.getNextPosition( Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition() );
        Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getAt(nextCell.row));
        Ext.getCmp(me.objId).getPlugin().startEditByPosition(nextCell);
        me.updateRecord(rec);
        return;
    }
    JbsManager.enterKeyEvents(
        _sqlProc ,
        arrayToString(_baseParam.getArray()) ,
        _value,
        (_extendParam1===null || _extendParam1.length == 0) ? null : _extendParam1.toString() ,
        (_extendParam2===null || _extendParam2.length == 0) ? null : _extendParam2.toString() ,
        _row ,
        _column ,
        function(data){
            if(data[0]=='success'){
                var returnValue = data[1].split('|')[0];
                var msgTitle = data[1].split('|')[1]===undefined ? "提示" : data[1].split('|')[1];
                var message = data[1].split('|')[2]===undefined ? "" : data[1].split('|')[2];
                //Ext.Msg.alert("返回值:",data[1]);
                //0:表示提示不通过;-1:表示通过;-2:表示询问;-3:表示返回列表;-4:表示日期等等;-5:直接存盘移到下一行记录
                switch(parseInt(data[2])){
                    case 0 :
                        if(message != '' ){
                            Ext.Msg.show({
                                title:msgTitle,
                                msg: message,
                                buttons: Ext.Msg.OK,
                                fn : function(bt,text,opt){
                                    rec.set(cellColumn,_value);
                                    me.updateRecord(rec);
                                    Ext.getCmp(me.objId).getPlugin().startEditByPosition(Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition());
                                }
                            });
                        }else{
                            rec.set(cellColumn,_value);
                            me.updateRecord(rec);
                            Ext.getCmp(me.objId).getPlugin().startEditByPosition(Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition());
                        }
                        break;
                    case -1:
                        if(message != '' ){
                            Ext.Msg.show({
                                title:msgTitle,
                                msg: message,
                                buttons: Ext.Msg.OK,
                                fn : function(bt,text,opt){
                                    rec.set(cellColumn,returnValue);
                                    var nextCell = me.getNextPosition( Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition() );
                                    Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getAt(nextCell.row));
                                    Ext.getCmp(me.objId).getPlugin().startEditByPosition(nextCell);
                                }
                            });
                        }else{
                            rec.set(cellColumn,returnValue);
                            var nextCell = me.getNextPosition( Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition() );
                            Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getAt(nextCell.row));
                            Ext.getCmp(me.objId).getPlugin().startEditByPosition(nextCell);
                        }
                        me.updateRecord(rec);
                        break;
                    case -2: Ext.Msg.show({
                        title:msgTitle,
                        msg: message,
                        buttons: Ext.Msg.YESNO,
                        fn : function(bt,text,opt){
                        if(bt=="yes"){
                            rec.set(cellColumn,returnValue);
                            me.updateRecord(rec);
                            var nextCell = me.getNextPosition( Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition() );
                            Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getAt(nextCell.row));
                            Ext.getCmp(me.objId).getPlugin().startEditByPosition(nextCell);
                        }else{
                            rec.set(cellColumn,_value);
                            me.updateRecord(rec);
                            Ext.getCmp(me.objId).getPlugin().startEditByPosition(Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition());
                        }
                    }
                    });
                        break;
                    case -3: var wndsize = eval('('+data[3].split('|')[0]+')');
                        var comboSql = data[3].split('|')[2].split('~')[0];
                        var comboType = data[3].split('|')[2].split('~')[1] === undefined ? 'grid' : data[3].split('|')[2].split('~')[1];
                        var posInside = me.getNextPosition( Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition() );
                        var setOpt = data[3].split('|')[1];
                        setOpt = (resultAssign === undefined || resultAssign == '') ? setOpt : resultAssign;
                        if(comboType == 'grid'){
                            new gridCombo(me ,comboSql ,'test00001' ,wndsize ,Ext.getCmp(me.objId).store ,_row ,me.colMArray ,setOpt ,posInside ,elId );
                            break;
                        }
                        if(comboType == 'tree'){
                            new treegridCombo(me ,comboSql ,'test00001' ,wndsize ,Ext.getCmp(me.objId).store ,_row ,me.colMArray ,setOpt ,pos ,elId );
                            break;
                        }
                        break;
                    case -4: posInside = me.getNextPosition( Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition() );
                        new dateCombo(me ,cellColumn ,_field ,elId ,posInside);
                        break;
                    case -5: break;
                }
            }else{
                Ext.Msg.show({
                    title:"系统错误",
                    msg: "无法访问服务器，请稍后再试。",
                    buttons: Ext.Msg.OK,
                    fn : function(bt,text,opt){
                        rec.set(cellColumn,_value);
                        Ext.getCmp(me.objId).getPlugin().startEditByPosition(Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition());
                    }
                });
            }
        }
    );
};

builderGrid.prototype.initMainObject = function(_mainObj){
    var me = this;
    me.mainObj = (_mainObj===undefined ? null : _mainObj);
};

builderGrid.prototype.getGridTable = function(){
	return this.table;
};

builderGrid.prototype.setComboValue = function( fieldObj ){
    this.FieldValue = fieldObj;
};

builderGrid.prototype.getLastEditorColumn = function(grid){
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

builderGrid.prototype.getNextPosition = function( currentPos ){
    var me = this;
    var gridObj = Ext.getCmp(me.objId);
    for( var i = currentPos.column+1 ; i<=me.colMArray.length ; ++i ){
        if( i == (me.colMArray.length) ){
            if( (currentPos.row+1) < gridObj.getStore().getCount() ){
                currentPos.row = currentPos.row + 1;
                currentPos.column = 0;
                var nextPos = me.getNextPosition( currentPos );
                return nextPos;
            }else{
                var insertRec = gridObj.getStore().getAt(currentPos.row);
                if(insertRec.get("entry_num")=='0'){
                    insertRec.set("entry_num",currentPos.row+1);
                    insertRec.set("seria_num",me.mainObj.getSeriaNum());
                    insertRec.set("work_time",me.mainObj.getWorkTime());
                    insertRec.set("sys_id",me.mainObj.getSysId());
                    JbsManager.insertDataForGrid(
                        me.databaseName ,
                        me.table.detailTableTemp ,
                        RecToStr( insertRec ) ,
                        function(data){
                        }
                    );
                }
                gridObj.getStore().add(Ext.create('sys_document_order_detail'+me.objId, {}));
                return { row:(currentPos.row +1),column:0 };
            }
            break;
        }else{
            if( me.colMArray[i].hidden || me.colMArray[i].editor == null || me.colMArray[i].editor === undefined ){
                continue;
            }else{
                currentPos.column = i;
                return currentPos;
            }
        }
    }
};

builderGrid.prototype.saveDataForGrid = function(){
    var me = this;
    var tmprec = Ext.getCmp(me.objId).getStore().getAt(0);
    JbsManager.saveDataForGrid(
        me.databaseName,
        me.table.detailTable,
        me.table.detailTableTemp,
        RecToStr( tmprec ),
        function(data){

        }
    );
};

builderGrid.prototype.getGridColumns = function(){
	
	return Ext.getCmp(this.objId).column;
	
};

builderGrid.prototype.setGridColumns = function( _columns ){
	
};

builderGrid.prototype.setGroupColumns = function( _group ){
	var group;
	if(_group.indexOf(",")==-1){
		var temp = [];
		temp.push(_group);
		group = temp;
	}else{
		group = _group.split(",");
	}
	var result = [];
	for(var i = 0 ; i<group.length ;++i){
		var tmp = {
			start : parseInt( group[i].split(":")[0].split("~")[0] ),
			end : parseInt( group[i].split(":")[0].split("~")[1] ),
			text : group[i].split(":")[1]
		};
		if( !isNaN(tmp.start) && !isNaN(tmp.end)  ){
			result.push(tmp);
		}
	}
	return result;	
};

builderGrid.prototype.getColumns = function( _column ,_group ){
	if(_group===undefined){
		return _column;
	}
	var group = this.setGroupColumns(_group);
	var columnTemp = [];
	for( var i = 0 ,j = 0 ; i<_column.length ; ++i ){
		if(i==group[j].start){
			var columns = [];
			for( var x = i ; x<=group[j].end ;++x ){
				columns.push(_column[x]);
				i=x;
			}
			var groupColumn = {
					text : group[j].text,
					columns : columns
			};
			columnTemp.push(groupColumn);
			j = ( (j+1) < group.length ? (j+1) : j );			
		}else{
			columnTemp.push(_column[i]);
		}
	}
	return columnTemp;
};

builderGrid.prototype.locateForGrid = function(_seria_num ,_sql){
    var me = this;
    var seria_num = _seria_num;
    if(me.gridStore == null) return;
    me.gridStore.reload({
        params : {
            dbName	    :	me.databaseName,
            defaultRec	:	jsonToStr(eval('sys_document_order_detail'+me.objId)),
            sessionId	:	sessionId,
            sysid       :   me.sys_id,
            worktime    :   me.mainObj===null?'0000':me.mainObj.getWorkTime(),
            seria_num   :   seria_num,
            table		:	me.table.detailTableView,
            sql			:   _sql
        },
        callback : function(r,opt,success){
            if(me.mainObj!=null){
                me.setGridStatus(me.mainObj.formStatus);
            }
        }
    });
};

builderGrid.prototype.updateGridViewer = function(workstation_id,seria_num){
    var me = this;
    if(me.gridStore == null) return;
    me.gridStore.reload({
        params : {
            dbName	    :	me.databaseName,
            defaultRec	:	jsonToStr(eval('sys_document_order_detail'+me.objId)),
            sessionId	:	sessionId,
            sysid       :   me.sys_id,
            worktime    :   me.mainObj===null?'0000':me.mainObj.getWorkTime(),
            seria_num   :   seria_num,
            table		:	me.table.detailTableTempView,
            sql			:   "",
            workstationId:  workstation_id
        },
        callback : function(r,opt,success){
            if(me.mainObj!=null){
                me.setGridStatus(me.mainObj.formStatus);
            }
        }
    });
};

builderGrid.prototype.setGridStatus = function(statusCode){
    var me = this;
    if(me.gridStatus == statusCode) return;
    switch(statusCode){
        case 0 :Ext.getCmp(me.objId).reconfigure( me.gridStore ,me.getColumns(me.colMArrayR,me.gc) );
                break;
        case 1 :Ext.getCmp(me.objId).reconfigure( me.gridStore ,me.getColumns(me.colMArray,me.gc) );
                break;
    }
    me.gridStatus = statusCode;
};


builderGrid.prototype.createEditor = function(_enable ,_type ,_config){
    var me = this;
    if( !Boolean(parseInt(_enable)) ){
        return null;
    }
    if( _type == 'checkboxfield' ){
        return null;
    }
    var allowBlank = _config===undefined ? true : (_config.allowEmpty==1);
    var editorCfg = {
        xtype: _type,
        allowBlank : allowBlank ,  // requires a non-empty value
        selectOnFocus : true,
        listeners:{
            specialkey: function(field, e){
                if (e.getKey() == e.ENTER) {
                    var row = Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition().row;
                    var column = Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition().column;
                    var editorCfg = me.colMArray[Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition().column].editorCfg;
                    var extParam = editorCfg.extParam;
                    var extendParamCfg = (extParam === undefined ? '' : extParam.split(';')[0]);
                    var extendFormParamCfg;
                    if(extParam !== undefined && extParam.split(';')[1]!==undefined){
                        extendFormParamCfg = (extParam === undefined ? '' : extParam.split(';')[1]);
                    }else{
                        extendFormParamCfg = '';
                    }
                    var extendParam1 = recordForColumnToArray(Ext.getCmp(me.objId).getSelectionModel().getSelection()[0] ,me.colMArray ,extendParamCfg);
                    var extendFormParaml;
                    if(me.mainObj!=null){
                        extendFormParaml = recordForColumnToArray(me.mainObj.getRecord() ,me.mainObj.colMArray ,extendFormParamCfg);
                    }else{
                        extendFormParaml = [];
                    }
                    var value = field.getValue();
                    var sqlProc = me.colMArray[column].extOpt.sqlProc === undefined ? '' : me.colMArray[column].extOpt.sqlProc;
                    me.enterKeyEvents( field ,sqlProc ,new baseParam(me.work_time,m_workstation,m_operator) ,value ,extendParam1 ,extendFormParaml ,row ,column );
                    e.stopEvent();
                }
            }
        }
    };
    return editorCfg;
};

builderGrid.prototype.createColumnObj = function(_columnOrig ,_isReadOnly){
    var me = this;
    var columnRec = _columnOrig;
    var editorXType = columnRec.get('editorXType');
    var editorCfg = columnRec.get('editorCfg') == '' ? eval( '({})' ) : eval( '('+columnRec.get('editorCfg')+')' );
    var fieldShowName = columnRec.get('field_showname');
    var fieldRawName =  columnRec.get('field_rawname');
    var fieldVisible = !(columnRec.get('visible')=='1');
    var fieldWidth = parseInt(columnRec.get('width'));
    var fieldBeforeOpt = columnRec.get('beforeOpt')=='' ? eval( '({})' ) : eval( '(' + columnRec.get('beforeOpt') + ')' );
    var fieldAfterOpt = columnRec.get('afterOpt')=='' ? eval( '({})' ) : eval( '(' + columnRec.get('afterOpt') + ')' );
    var fieldExtOpt = columnRec.get('extOpt')=='' ? eval( '({})' ) : eval( '(' + columnRec.get('extOpt') + ')' );
    var fieldresultAssign = columnRec.get('result_assign');
    var columnCfg = {
        //xtype: editorXType,
        text : fieldShowName,
        dataIndex : fieldRawName,
        draggable : false,
        menuDisabled : true,
        hidden : fieldVisible,
        sortable: false,
        width : fieldWidth
    };
    if(!_isReadOnly){
        columnCfg.beforeOpt = fieldBeforeOpt;
        columnCfg.afterOpt = fieldAfterOpt;
        columnCfg.extOpt = fieldExtOpt;
        columnCfg.resultAssign = fieldresultAssign;
        columnCfg.editorCfg = editorCfg;
        columnCfg.editorXType = editorXType;
    }
    if(editorXType == 'checkboxfield'){
        columnCfg.xtype = 'checkcolumn';
        columnCfg.align = 'center';
        if(_isReadOnly){
            columnCfg.disabled = true;
            columnCfg.disabledCls = '';
        }else{
            columnCfg.listeners = {
                checkchange : function( ths, rowIndex, checked, eOpts ){
                    var rec = Ext.getCmp(me.objId).getStore().getAt(rowIndex);
                    if(rec.get('entry_num')!='0' && rec.get('entry_num')!='' ){
                        me.updateRecord(rec);
                    }
                }
            };
        }
        return columnCfg;
    }
    if(editorXType == 'button'){
        var icon = editorCfg.icon===undefined?'button':editorCfg.icon;
        columnCfg.xtype = 'actioncolumn';
        columnCfg.align = 'center';
        columnCfg.items = [{
            icon : 'images/btn/'+icon+'.png',
            handler: function(grid,rowIndex,colIndex){
                var extParam = columnCfg.extParam;
                var extendParamCfg = (extParam === undefined ? '' : extParam.split(';')[0]);
                var extendFormParamCfg;
                if(extParam !== undefined && extParam.split(';')[1]!==undefined){
                    extendFormParamCfg = (extParam === undefined ? '' : extParam.split(';')[1]);
                }else{
                    extendFormParamCfg = '';
                }
                var extendParam1 = arrayToString( recordForColumnToArray(Ext.getCmp(me.objId).getSelectionModel().getSelection()[0] ,me.colMArray ,extendParamCfg) );
                var extendFormParaml;
                if(me.mainObj!=null){
                    extendFormParaml = arrayToString( recordForColumnToArray(me.mainObj.getRecord() ,me.mainObj.colMArray ,extendFormParamCfg) );
                }else{
                    extendFormParaml = '';
                }
                var parameters = me.work_time+','+m_workstation+','+m_operator+','
                if(extendParam1!=''){
                    parameters=parameters+extendParam1;
                }
                if(extendFormParaml!=''){
                    parameters=parameters+extendFormParaml;
                }
                JbsManager.commonEnterEventProc(
                    columnCfg.extOpt,
                    parameters,
                    rowIndex,
                    colIndex,
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
        }];
        return columnCfg;
    }
    columnCfg.align = columnRec.get('datatype')=='string'?'left':'right';
    columnCfg.summaryType = columnRec.get('summary');
    if(!_isReadOnly){
        editorCfg.allowEmpty = columnRec.get('allowEmpty');
        columnCfg.editor = me.createEditor( columnRec.get('editable') ,columnRec.get('editorXType') ,editorCfg );
    }
    return columnCfg;
};

builderGrid.prototype.createGridPanel = function(_store,_sql){
    this.colMArray = [];
    this.colMArrayR= [];
    this.fieldMArray = [];
    var me = this;
    this.colMArray.push({
        xtype: 'rownumberer',
        width: 40,
        sortable: false
    });
    this.colMArrayR.push({
        xtype: 'rownumberer',
        width: 40,
        sortable: false
    });
	for( var i = 0 ; i<_store.getCount() ; ++i ){
		if( _store.getAt(i).get('sys_id')!=me.sys_id || _store.getAt(i).get('subtype')!='grid' ){
			continue;
		}
        var fieldRawName =  _store.getAt(i).get('field_rawname');
        var editorXType = _store.getAt(i).get('editorXType');
        var editorCfg = _store.getAt(i).get('editorCfg') == '' ? eval( '({})' ) : eval( '('+_store.getAt(i).get('editorCfg')+')' );
        me.colMArray.push(me.createColumnObj(_store.getAt(i),false));
        me.colMArrayR.push(me.createColumnObj(_store.getAt(i),true));
        var fieldValue = "";
        var fieldType = _store.getAt(i).get('datatype');
        fieldType = (fieldType === undefined || fieldType == "")?'string':fieldType;

		me.fieldMArray.push({
			name : _store.getAt(i).get('field_rawname'),
			type : fieldType,
            saveable : _store.getAt(i).get('saveable')===undefined ? 1 : _store.getAt(i).get('saveable'),
			defaultValue : _store.getAt(i).get('default_value')
		}) ;
	}

	Ext.define('sys_document_order_detail'+me.objId, {
		extend: 'Ext.data.Model',
        fields: me.fieldMArray
	});

	this.emptyRecord = Ext.create('sys_document_order_detail'+me.objId, {});
	
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	    clicksToEdit: 1,
	    listeners:{
	    	beforeedit:function( editor, e, eOpts ){
                //e.record.commit();
	    	},
            edit : function( editor, e, eOpts ){
	    		if(e.record.get('entry_num')!='0' && e.record.get('entry_num')!='' ){
	    			if( e.value != e.originalValue ){
                        console.log('cellEditing event: Edit');
                        me.updateRecord(e.record);
                    }
                }
            },
	    	validateedit: function( editor, e, eOpts ){
                e.cancel = true;
	    		e.record.commit();
	    	}
	    }
	});

    me.gridStore = Ext.create('Ext.data.Store', {
	    model: 'sys_document_order_detail'+me.objId,
	    //pageSize: 5000,
	    proxy: {
	        type: 'jsonp',
	        url: 'buildergrid_jsonp.jsp',
	        extraParams : {
                    dbName	    :	me.databaseName,
	        		defaultRec	:	jsonToStr(eval('sys_document_order_detail'+me.objId)),
	        		sessionId	:	sessionId,
                    sysid       :   me.sys_id,
                    worktime    :   me.mainObj===null?'0000':me.mainObj.getWorkTime(),
                    seria_num   :   "0",
	        		table		:	me.table.detailTableView,
	        		sql			:   _sql
	        	},
            reader: {
                root: 'sys_document_order_detail',
                totalProperty: 'totalCount'
            }
	    },
	    listeners:{
	    	load : function(ths ,records ,successful ,eOpts){
                me.setGridStatus(0);
	    		if(successful){
	    			if(ths.getCount()==0/*&&me.gridStatus==1*/){
                        var defaultRec = Ext.create('sys_document_order_detail'+me.objId, {});
	    				ths.add(defaultRec);
	    			}	    			
	    		}else{
	    			
	    		}

	    	},
	    	add : function( store, records, index, eOpts ){
	    		var d = new Ext.util.DelayedTask(function(){
	    			//Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getCount() - 1);
	    			//Ext.getCmp(me.objId).view.bufferedRenderer.scrollTo(Ext.getCmp(me.objId).getStore().getCount() - 1, true);
                    try{
                        Ext.getCmp(me.objId).getPlugin().startEditByPosition( me.getNextPosition( {row:Ext.getCmp(me.objId).getStore().getCount()-1,column:0} ) );
                    }catch(e){
                        console.log(me.objId);
                        console.log(e);
                    }
                    //
	            });  
	            d.delay(50);  	    		
	    	}
	    },
	    autoLoad: true
	});

    var deleteAction = Ext.create('Ext.Action', {
        icon   : 'images/itemDelete.gif',  // Use a URL in the icon config
        text: '删除记录',
        disabled: true,
        handler: function(widget, event) {
            var rec = Ext.getCmp(me.objId).getSelectionModel().getSelection()[0];
            me.deleteRecord(rec);
        }
    });

    var insertAction = Ext.create('Ext.Action', {
        icon   : 'images/itemInsert.gif',  // Use a URL in the icon config
        text: '插入记录',
        disabled: true,
        handler: function(widget, event) {
        }
    });

    var gridSelectionMenu = Ext.create('Ext.menu.Menu', {
        items: [
            deleteAction//,
            //insertAction
        ]
    });

	Ext.create('Ext.grid.Panel', {
		id     	: me.objId,
		store  	: me.gridStore,
		region 	: 'south',
        border : false,
		margins	: '4 0 0 0',
        height : (me.gridHeight === undefined ? 300 : me.gridHeight),
        resizable : true,
        resizeHandles : 'n',
        columns	: me.getColumns(me.colMArrayR,me.gc),
		columnLines : true,
	    plugins	: ( me.table != '' ? [ cellEditing ,{ ptype: 'bufferedrenderer',numFromEdge : 50 ,trailingBufferZone: 1000, leadingBufferZone: 50 }] : [ { ptype: 'bufferedrenderer',numFromEdge : 50 ,trailingBufferZone: 1000, leadingBufferZone: 50 }] ),
	    selModel: {
	        selType: 'cellmodel',
	        //mode : 'SINGLE',
	        //pruneRemoved: false,
            listeners : {
                selectionchange : function(sm, selections) {
                    //var tipMsg =
                    if (selections.length==1 && me.gridStatus == 1) {
                        //Ext.getCmp('mainstatusbar').setText(me.getTipMsg(selections[0]));
                        //deleteAction.enable();
                        //insertAction.enable();
                    } else {
                        //deleteAction.disable();
                        //Ext.getCmp('mainstatusbar').setText("正常状态");
                        //insertAction.disable();
                    }
                }
            }
	    },
	    viewConfig: {
            //stripeRows: true,
            //trackOver: true,
            loadMask:false,
            listeners: {
                render: function(ths) {
                    me.createTooltip(ths);
                },
                itemcontextmenu : function(view, rec, node, index, e) {
                    e.stopEvent();
                    gridSelectionMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
		features: [{
		    ftype: 'summary',
		    dock: 'bottom'
		}]
	});
	return this.objId;
};

builderGrid.prototype.getRecDefine = function(){
    var me = this;
    var rec = Ext.getCmp(me.objId).getStore().getAt(0);
    var result = GetRecDefine(rec);//GetRecDefine( eval('sys_document_order_detail'+me.objId) );
    return result;
};

builderGrid.prototype.defaultValueProc = function(default_value){
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

builderGrid.prototype.initDefaultRecord = function(store ,docDefaultRecordG){
    var me = this;
    store.filter("subtype", "grid");
    for(var i = 0 ; i < docDefaultRecordG.length ; ++i){
        if(docDefaultRecordG[i].name=='workstation_id'){
            store.getAt(store.findExact('field_rawname' ,docDefaultRecordG[i].name)).set('default_value',m_workstation);
            continue;
        }
        if(docDefaultRecordG[i].name=='work_time'){
            store.getAt(store.findExact('field_rawname' ,docDefaultRecordG[i].name)).set('default_value',me.work_time);
            continue;
        }
        if(docDefaultRecordG[i].name=='sys_id'){
            store.getAt(store.findExact('field_rawname' ,docDefaultRecordG[i].name)).set('default_value',me.sys_id);
            continue;
        }
        store.getAt(store.findExact('field_rawname' ,docDefaultRecordG[i].name)).set('default_value',docDefaultRecordG[i].defaultValue);
    }
    store.clearFilter(true);
};

builderGrid.prototype.updateRecord = function(record ){
    var me = this;
    if(record.get("entry_num")>0){
        var wsid = record.get("workstation_id");
        if( typeof(wsid)=='string' && wsid.length<32 ){
            record.set("workstation_id",m_workstation);
        }
        JbsManager.modifyDataForGrid(
            me.databaseName,
            me.table.detailTableTemp,
            me.table.detailTableTempView,
            RecToStr( record ),
            function(data){

            }
        );
    }
};

builderGrid.prototype.deleteRecord = function(record){
    var me = this;
    var seria_num = record.get("seria_num");
    var entry_num = record.get("entry_num");
    var work_time = record.get("work_time");
    var workstationId = m_workstation;
    if(entry_num!==undefined && entry_num>0){
        JbsManager.deleteRecordGrid(
            me.databaseName,
            me.table.detailTableTemp,
            me.sys_id,
            workstationId,
            work_time,
            seria_num,
            entry_num,
            function(data){
                if(data=="success"){
                    me.updateGridViewer(workstationId ,me.mainObj.getSeriaNum());
                }else{
                    showMessageBox(msgTitleWarning,"分录删除失败，数据库报错！",Ext.Msg.OK,Ext.MessageBox.WARNING);
                }
            }
        )
    }else{
        if(Ext.getCmp(me.objId).getStore().getCount()>1){
            Ext.getCmp(me.objId).getStore().remove([record]);
        }
    }
};

builderGrid.prototype.setResult = function(_record){
    var me = this;
    var setOptArray = me.setOpt.split(',');
    var arrayCount = setOptArray.length;
    for(var i = 0 ; i < arrayCount ; ++i ){
        var index1 = parseInt( setOptArray[i].split('-')[0] );
        var index2 = parseInt( setOptArray[i].split('-')[1] );
        var result = _record.get(_record.fields.get(index1).name);
        me.parentStore.getAt(me.parentRecIndex).set(me.parentColumn[index2].dataIndex ,result);
        Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getAt(me.pos.row));
        Ext.getCmp(me.objId).getPlugin().startEditByPosition(me.pos);
        me.parentObj.updateRecord(me.parentStore.getAt(me.parentRecIndex));
    }
};

builderGrid.prototype.getTipMsg = function(rec){
    var me = this;
    var tipmsg = '';
    if(rec===undefined){
        return tipmsg;
    }
    for(var i = 0 ;i<me.colMArray.length;++i){
        if(me.colMArray[i].editorCfg!==undefined&&me.colMArray[i].editorCfg.istip!==undefined&&me.colMArray[i].editorCfg.istip==1){
            tipmsg = tipmsg+me.colMArray[i].text+'：'+rec.get(me.colMArray[i].dataIndex)+'  ';
        }
    }
    return tipmsg;
};

builderGrid.prototype.createTooltip = function(view) {
    var me = this;
    view.tip = Ext.create('Ext.tip.ToolTip', {
        // The overall target element.
        target: view.el,
        // Each grid row causes its own seperate show and hide.
        delegate: view.itemSelector,
        // Moving within the row should not hide the tip.
        trackMouse: true,
        showDelay : 1500,
        // Render immediately so that tip.body can be referenced prior to the first show.
        renderTo: Ext.getBody(),
        listeners: {
            // Change content dynamically depending on which element triggered the show.
            beforeshow: function (tip) {
                var tooltip = me.gridStatus==1 ? me.getTipMsg(view.getRecord(tip.triggerElement)) : undefined;
                if(tooltip){
                    tip.update(tooltip);
                } else {
                    tip.on('show', function(){
                        Ext.defer(tip.hide, 10, tip);
                    }, tip, {single: true});
                }
            }
        }
    });
};
