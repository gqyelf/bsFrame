function builderGrid ( _systemdocument ,_pid ,_pType ){
	var me = this;
    var sysdoc = _systemdocument.sys_document[0];
    var sysproperty = eval('('+sysdoc.property+')');
	this.objId = sysdoc.sys_id+'Grid';
    this.sys_id = sysdoc.sys_id;
    this.mainObj = null;
    this.emptyRecord;
    this.type = 'grid';
    this.gridStatus = 0;
    this.colMArray = new Array();
    this.colMArrayR= new Array();
    this.fieldMArray = new Array();
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
/*	    		 var property = eval( '('+_systemdocument.sys_document[0].property+')' );
	    		 me.gc = property.groupcolumns;
	    		 me.createGridPanel( ths,property.sql );
	    		 if(_pType == 'panel'){
	    			 Ext.getCmp(_pid).add( me.objId );
	    		 }
*/	    	 }
	     },
	     autoLoad: true
	 });
}

builderGrid.prototype.initMainObject = function(_mainObj){
    var me = this;
    me.mainObj = (_mainObj===undefined ? null : _mainObj);
};

builderGrid.prototype.getGridTable = function(){
	return this.table;
};

builderGrid.prototype.setComboValue = function(fieldObj){
    this.FieldValue = fieldObj;
};

builderGrid.prototype.createEditor = function(_enable ,_type ,_config){
	var me = this;
	if( !Boolean(parseInt(_enable)) ){
		return null;
	}
    if( _type == 'checkboxfield' ){
        return null;
    }
	var editorCfg = {
        xtype: _type,
        allowBlank: false,  // requires a non-empty value
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
                    var extendParam1 = arrayToString( recordForColumnToArray(Ext.getCmp(me.objId).getSelectionModel().getSelection()[0] ,me.colMArray ,extendParamCfg) );
                    var extendFormParaml;
                    if(me.mainObj!=null){
                        extendFormParaml = arrayToString( recordForColumnToArray(me.mainObj.getRecord() ,me.mainObj.colMArray ,extendFormParamCfg) );
                    }else{
                        extendFormParaml = '';
                    }
                    var value = field.getValue();
                    //var currentRec = Ext.getCmp(me.objId).getSelectionModel().getSelection()[0];
                    //var selectCount = Ext.getCmp(me.objId).getSelectionModel().getSelection().length;
                    //console.log('selectCount'+selectCount);
                    //console.log('currentEN:'+currentRec.get('entry_num'));
                    //currentRec.set(field.getName(),value);

                    var sqlProc = me.colMArray[column].extOpt.sqlProc === undefined ? '' : me.colMArray[column].extOpt.sqlProc;
                    //var nextCell = me.getNextEditCellPosition(Ext.getCmp(me.objId) ,Ext.getCmp(me.objId).getSelectionModel().getCurrentPosition() ,field );
                    //Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getAt(nextCell.row));
                    //Ext.getCmp(me.objId).getPlugin().startEditByPosition(nextCell);
                    //enterKeyEvents(me ,field ,'Example_enterKeyEvents' ,new baseParam('2017-07',sessionId,'007') ,field.getValue() ,extendParam1 ,'' ,row ,column);
                    enterKeyEvents( me ,field ,sqlProc ,new baseParam(m_worktime,m_workstation,m_operator) ,value ,extendParam1 ,extendFormParaml ,row ,column );
                    e.stopEvent();
                }
            }
        }
    };
    var sqlProcess = (_config.sqlProc === undefined || _config.sqlProc == '') ? "('')" : _config.sqlProc;
    if(editorCfg.xtype == "combobox"){
        editorCfg.store = Ext.create('Ext.data.Store', {
            fields: ["showValue","rawValue"],
            proxy: {
                type: 'ajax',
                url: 'buildercombo_jsonp.jsp',
                extraParams : {
                    dbName	    :	me.databaseName,
                    sql			:   sqlProcess
                },
                reader: {
                    type : 'json',
                    root : 'combo'
                }
            },
            autoLoad: true
        });
        editorCfg.displayField = 'showValue';
    }
	return editorCfg;
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

builderGrid.prototype.getNextEditCellPosition = function(grid ,obj ,field){
	var table = this.table;
	var me = this;
	if(field != null){
		//grid.getStore().getAt(obj.row).set( eval('sys_document_order_detail'+me.objId).getFields()[obj.column-1].name,field.getValue() );
		//Ext.Msg.alert(field,field);
	}
	for( var i = obj.column+1 ; i<=this.colMArray.length ; ++i ){
		if( i == (this.colMArray.length) ){
			if( (obj.row+1) < grid.getStore().getCount() ){
				obj.row = obj.row + 1;
				obj.column = 0;				
				var pos = this.getNextEditCellPosition(grid ,obj,null);
				return pos;
			}else{
				var tmprec = grid.getStore().getAt(obj.row);
				if(tmprec.get('entry_num')=='0'){
					tmprec.set('entry_num',obj.row+1);
                    tmprec.set('seria_num',me.mainObj.getSeriaNum());
                    tmprec.set('work_time',me.mainObj.getWorkTime());
                    tmprec.set('sys_id',me.mainObj.getSysId());
					JbsManager.insertDataForGrid(
                        me.databaseName ,
                        me.table.detailTableTemp ,
                        RecToStr( tmprec ) ,
                        function(data){

                        }
                    );
				}
                grid.getStore().add(Ext.create('sys_document_order_detail'+me.objId, {}));
				return { row:(obj.row +1),column:0 };
			}
			break;			
		}else{
			if( this.colMArray[i].hidden || this.colMArray[i].editor===null ){
				continue;		
			}else{
				obj.column = i;
				return obj;
			}
		}
	}
};

builderGrid.prototype.getNextCell = function(){
    var me = this;
    var currentPos
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
		var temp = new Array();
		temp.push(_group);
		group = temp;
	}else{
		group = _group.split(",");
	}
	var result = new Array();
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
	var columnTemp = new Array();
	for( var i = 0 ,j = 0 ; i<_column.length ; ++i ){
		if(i==group[j].start){
			var columns = new Array();
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

builderGrid.prototype.createGridPanel = function(_store,_sql){
    this.colMArray = new Array();
    this.colMArrayR= new Array();
    this.fieldMArray = new Array();
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
    var columnConfig;
    var columnRConfig;
	for( var i = 0 ; i<_store.getCount() ; ++i ){
		if( _store.getAt(i).get('sys_id')!=me.sys_id || _store.getAt(i).get('subtype')!='grid' ){
			continue;
		}
        var fieldShowName = _store.getAt(i).get('field_showname');
        var fieldRawName =  _store.getAt(i).get('field_rawname');
        var fieldConfig = {
            xtype : _store.getAt(i).get('editorXType')
        };
        var editorXType = _store.getAt(i).get('editorXType');
        var editorCfg = _store.getAt(i).get('editorCfg') == '' ? eval( '({})' ) : eval( '('+_store.getAt(i).get('editorCfg')+')' );
        if( editorXType == 'checkboxfield' ){
            me.colMArray.push( {
                xtype: 'checkcolumn',
                text : fieldShowName,
                dataIndex : fieldRawName,
                draggable : false,
                menuDisabled : true,
                //locked : i < 10,
                hidden : !(_store.getAt(i).get('visible')=='1'),
                align: 'center',
                //lockable: true,
                //sortable: false,
                width : parseInt(_store.getAt(i).get('width')),
                beforeOpt : _store.getAt(i).get('beforeOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('beforeOpt') + ')' ),
                afterOpt : _store.getAt(i).get('afterOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('afterOpt') + ')' ),
                extOpt : _store.getAt(i).get('extOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('extOpt') + ')' ),
                resultAssign : _store.getAt(i).get('result_assign'),
                editorCfg : editorCfg,
                editorXType : editorXType,
                listeners : {
                    checkchange : function( ths, rowIndex, checked, eOpts ){
                        var rec = Ext.getCmp(me.objId).getStore().getAt(rowIndex);
                        if(rec.get('entry_num')!='0' && rec.get('entry_num')!='' ){
                            me.updateRecord(rec);
/*
                            JbsManager.modifyDataForGrid(
                                me.databaseName,
                                me.table.detailTableTemp,
                                me.table.detailTableTempView,
                                RecToStr( rec ),
                                function(data){

                                });
*/
                        }
                    }
                }
            } );
            me.colMArrayR.push( {
                xtype: 'checkcolumn',
                text : fieldShowName,
                dataIndex : fieldRawName,
                draggable : false,
                menuDisabled : true,
                //locked : i < 10,
                //lockable: true,
                hidden : !(_store.getAt(i).get('visible')=='1'),
                align: 'center',
                //sortable: false,
                flex: ( ( parseInt(_store.getAt(i).get('width')) ) == -1 ? 1 : null ),
                width : parseInt(_store.getAt(i).get('width')),
                listeners : {
                    checkchange : function( ths, rowIndex, checked, eOpts ){

                    }
                }
            } );
        }else{
            me.colMArray.push( {
                text : fieldShowName,
                dataIndex : fieldRawName,
                menuDisabled : true,
                draggable : false,
                hidden : !(_store.getAt(i).get('visible')=='1'),
                align: _store.getAt(i).get('datatype')=='string'?'left':'right',
                //locked : i<10,
                //sortable: false,
                //lockable: true,
                flex: ( ( parseInt(_store.getAt(i).get('width')) ) == -1 ? 1 : null ),
                width : parseInt(_store.getAt(i).get('width')),
                summaryType: _store.getAt(i).get('summary'),
                beforeOpt : _store.getAt(i).get('beforeOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('beforeOpt') + ')' ),
                afterOpt : _store.getAt(i).get('afterOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('afterOpt') + ')' ),
                extOpt : _store.getAt(i).get('extOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('extOpt') + ')' ),
                resultAssign : _store.getAt(i).get('result_assign'),
                editorCfg : editorCfg ,
                editorXType : editorXType ,
                editor : me.createEditor( _store.getAt(i).get('editable') ,_store.getAt(i).get('editorXType') ,editorCfg )
            } );
            me.colMArrayR.push( {
                text : fieldShowName,
                dataIndex : fieldRawName,
                menuDisabled : true,
                draggable : false,
                hidden : !(_store.getAt(i).get('visible')=='1'),
                align: _store.getAt(i).get('datatype')=='string'?'left':'right',
                //sortable: false,
                //lockable: true,
                //locked : i < 10,
                flex: ( ( parseInt(_store.getAt(i).get('width')) ) == -1 ? 1 : null ),
                width : parseInt(_store.getAt(i).get('width')),
                summaryType: _store.getAt(i).get('summary')} );
        }
		//me.colMArray.push(columnConfig);
        //me.colMArrayR.push(columnRConfig);
        var fieldValue = "";
        var fieldType = _store.getAt(i).get('datatype');
        fieldType = (fieldType === undefined || fieldType == "")?'string':fieldType;
        if( fieldRawName == 'workstation_id' || fieldRawName == 'sys_id' || fieldRawName == 'work_time' ){
            if(fieldRawName == 'workstation_id'){
                fieldValue = m_workstation;
            }
            if(fieldRawName == 'sys_id'){
                fieldValue = me.sys_id;
            }
            if(fieldRawName == 'work_time'){
                fieldValue = m_worktime;
            }
        }else{
            var dv = me.defaultValueProc(_store.getAt(i).get('default_value'));
            if(fieldType=='float'){
                fieldValue = isNaN(parseFloat(dv))?0:parseFloat(dv);
            }
            if(fieldType=='int'|| fieldType=='bool'){
                fieldValue = isNaN(parseInt(dv))?0 : parseInt(dv);
            }
            if(fieldType=='string'){
                fieldValue = dv;
            }
        }
		me.fieldMArray.push({
			name : _store.getAt(i).get('field_rawname'),
			type : fieldType,
            saveable : _store.getAt(i).get('saveable')===undefined ? 1 : _store.getAt(i).get('saveable'),
			defaultValue : fieldValue
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
	    	},
            edit : function( editor, e, eOpts ){
	    		if(e.record.get('entry_num')!='0' && e.record.get('entry_num')!='' ){
	    			if( e.value != e.originalValue ){
                        me.updateRecord(e.record);
                    }
                }
            },
	    	validateedit: function( editor, e, eOpts ){
	    		e.cancel = true;
	    		//e.record.data[e.field] = e.value;
	    	}

	    }
	});

    me.gridStore = Ext.create('Ext.data.Store', {
	    model: 'sys_document_order_detail'+me.objId,
	    pageSize: 5000,
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
                        Ext.getCmp(me.objId).getPlugin().startEditByPosition( me.getNextEditCellPosition(Ext.getCmp(me.objId) ,{row:Ext.getCmp(me.objId).getStore().getCount()-1,column:0},null ) );
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
        //resizable : true,
        //resizeHandles : 'n',
        //collapsible : true,
        //collapseMode : 'mini',
        //enableLocking : true,
        columns	: me.getColumns(me.colMArrayR,me.gc),
		columnLines : true,
	    plugins	: ( me.table != '' ? [ cellEditing ,{ ptype: 'bufferedrenderer',numFromEdge : 50 ,trailingBufferZone: 1000, leadingBufferZone: 50 }] : [ { ptype: 'bufferedrenderer',numFromEdge : 50 ,trailingBufferZone: 1000, leadingBufferZone: 50 }] ),
	    selModel: {
	        selType: 'cellmodel',
	        mode : 'SINGLE',
	        pruneRemoved: false,
            listeners : {
                selectionchange : function(sm, selections) {
                    if (selections.length==1 && me.gridStatus == 1) {
                        deleteAction.enable();
                        //insertAction.enable();
                    } else {
                        deleteAction.disable();
                        //insertAction.disable();
                    }
                }
            }
	    },
	    viewConfig: {
            stripeRows: true,
            trackOver: false,
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
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

builderGrid.prototype.updateRecord = function(record){
    var me = this;
    JbsManager.modifyDataForGrid(
        me.databaseName,
        me.table.detailTableTemp,
        me.table.detailTableTempView,
        RecToStr( record ),
        function(data){

        }
    );
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