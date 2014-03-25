//json to string
function json2str(obj) {
   var arr = [];
   var fmt = function(s) {
       if (typeof s == 'object' && s != null) return json2str(s);
       return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in obj) if(i=='name'||i=='defaultValue'||i=='type'){arr.push('"' + i + '":' + fmt(obj[i]));}
    return '{' + arr.join(',') + '}';
}

function json2str3(obj) {
	   var arr = [];
	   var fmt = function(s) {
	       if (typeof s == 'object' && s != null) return json2str(s);
	       return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
	    };
	    for (var i in obj) if(i=='name'||i=='value'||i=='type'){arr.push('"' + i + '":' + fmt(obj[i]));}
	    return '{' + arr.join(',') + '}';
}

function json2str2(obj) {
   var arr = [];
   var fmt = function(s) {
       if (typeof s == 'object' && s != null) return json2str(s);
       return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in obj) if(i=='name'||i=='defaultValue'){arr.push('"' + i + '":' + fmt(obj[i]));}
    return '{' + arr.join(',') + '}';
}

function jsonToStr(obj){
	var jsontemp='';
	for( var i = 0 ;i < obj.getFields().length ;++i ){
		if( i<(obj.getFields().length-1) ){
			jsontemp=jsontemp+json2str2(obj.getFields()[i])+',';
		}else{
			jsontemp=jsontemp+json2str2(obj.getFields()[i]);
		}
	}
	return jsontemp;
}

function RecToStr(rec){
	var jsontemp='';
	//tmprec.getProxy().model.getFields()[0]
	var obj = rec.getProxy().model;
	for( var i = 0 ;i < obj.getFields().length ;++i ){
		var field = eval( '(' + json2str3(obj.getFields()[i]) + ')' );
		field.value = rec.get(field.name);		
		if( i<(obj.getFields().length-1) ){
			jsontemp=jsontemp+json2str3(field)+',';
		}else{
			jsontemp=jsontemp+json2str3(field);
		}
	}
	return jsontemp;	
}

function builderGrid ( _systemdocument ,_table ,_pid ,_pType ){
	var me = this;
    var sysdoc = _systemdocument.sys_document[0];
    var sysproperty = eval('('+sysdoc.property+')');
	this.objId = sysdoc.sys_id+'Grid';
    this.sys_id = sysdoc.sys_id;
    this.emptyRecord;
    this.type = 'grid';
    this.colMArray = new Array();
    this.fieldMArray = new Array();
	this.table =_table;
	this.pType = _pType;
    //this.defaultRec = '';//jsonToStr(sys_document_order_detail1);
	this.builderStore = Ext.create('Ext.data.Store', {
	     id: 'builderGridStore',
	     fields: [{	name: 'id', type: 'int'	},
	              {	name: 'category'},
	              {	name: 'kind'},
	              { name: 'sys_id'},
	              {	name: 'type'},
	              {	name: 'field_showname'},
	              {	name: 'field_rawname'},
	              {	name: 'visible'},
	              {	name: 'datatype'},
	              {	name: 'width'},
	              {	name: 'editable' ,type:'int'},
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
		    		 me.createGridPanel( ths,_table,'select * from detail_table_tmp' );
	    		 }else{
	    			 var property = eval( '('+_systemdocument.sys_document[0].property+')' );
		    		 me.gc = property.groupcolumns;
		    		 me.createGridPanel( ths,_table,property.sql );
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
	    		 me.createGridPanel( ths,_table,property.sql );
	    		 if(_pType == 'panel'){
	    			 Ext.getCmp(_pid).add( me.objId );
	    		 }
*/	    	 }
	     },
	     autoLoad: true
	 });
}

builderGrid.prototype.getGridTable = function(){
	return this.table;
};

builderGrid.prototype.setComboValue = function(fieldObj){
    this.FieldValue = fieldObj;
};

builderGrid.prototype.createEditor = function(_enable ,_type ,_grid){
	var ths = this;
	if( !Boolean(parseInt(_enable)) ){
		return null;
	}
	var editor = {
        xtype: _type,
        allowBlank: false,  // requires a non-empty value
        selectOnFocus : true,
        listeners:{
            specialkey: function(field, e){
            	
            	if (e.getKey() == e.ENTER) {
                    var row = Ext.getCmp(ths.objId).getSelectionModel().getCurrentPosition().row;
                    var column = Ext.getCmp(ths.objId).getSelectionModel().getCurrentPosition().column;
                    var extendParamCfg = ths.colMArray[Ext.getCmp(ths.objId).getSelectionModel().getCurrentPosition().column].editorCfg;
                    var extendParam1 = arrayToString( recordForColumnToArray(Ext.getCmp(ths.objId).getSelectionModel().getSelection()[0] ,ths.colMArray ,extendParamCfg) );
                    enterKeyEvents(ths ,field ,'Example_enterKeyEvents' ,new baseParam('2017-07',sessionId,'007') ,field.getValue() ,extendParam1 ,'' ,row ,column);
                    e.stopEvent();
                }
            }
        }
    };
	return editor;
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
	var ths = this;
	if(field != null){
		grid.getStore().getAt(obj.row).set( eval('sys_document_order_detail'+ths.objId).getFields()[obj.column-1].name,field.getValue() );
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
					JbsManager.addRecordDwr( 
							'demo' ,
							table ,
							RecToStr( tmprec ) ,
							function(data){
								//e.record.
							} );
				}
				grid.getStore().add(new eval('sys_document_order_detail'+ths.objId)({}));								
				return {row:(obj.row +1),column:0};
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

builderGrid.prototype.reloadReconfigGrid = function (_id,_table,_sql,_systemdocumentdetail){
	var ths = this;
	this.table = _table;
	Ext.create('Ext.data.Store', {
	     id: 'builderGridStore',
	     fields: [{	name: 'id', type: 'int'	},
	              {	name: 'category' },
	              {	name: 'kind' },
	              { name: 'sys_id' },
	              {	name: 'entry_num',type:'int' },
	              {	name: 'field_showname' },
	              {	name: 'field_rawname' },
	              {	name: 'visible' },
	              {	name: 'datatype' },
	              {	name: 'width' },
	              {	name: 'editable' ,type:'int' },
	              {	name: 'default_value' },
	              {	name: 'editorXType' },
	              {	name: 'editorCfg'},
	              { name: 'summary' },
	              { name: 'beforeOpt' },
	              { name: 'afterOpt' },
	              { name: 'extOpt' }],
	     data:_systemdocumentdetail,
	     proxy: {
	    	 type: 'memory',
	         reader: {
	        	 type:'json',
	             root: 'sys_document_order_detail'
	         }
	     },
	     listeners:{
	    	 load : function( _ths, record, successful, eOpts ){
	    		 ths.builderStore = _ths;
	    		 ths.reconfigGrid(_id,_table,_sql);
	    	 }
	     },
	     autoLoad: true
	 });
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
	if( _group === undefined ){
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

builderGrid.prototype.reconfigGrid = function( _id,_table,_sql ){
	var _store = this.builderStore;
	var _gridId = this.objId;
	var grid = Ext.getCmp(this.objId);
    this.colMArray = new Array();
    this.fieldMArray = new Array();
    this.table = _table;
    ths = this;
    this.colMArray.push({
    	xtype: 'rownumberer',
        width: 40,
        sortable: false});
	for( var i = 0 ; i<_store.getCount() ; ++i ){
		if(_store.getAt(i).get('sys_id')!=_id){
			continue;
		}
		this.colMArray.push({
			text : _store.getAt(i).get('field_showname'),
			dataIndex : _store.getAt(i).get('field_rawname'),
			menuDisabled : false,
			hidden : ( (_store.getAt(i).get('visible')=='1' || _store.getAt(i).get('visible')===undefined ) ? false : true ),
			align: _store.getAt(i).get('datatype')=='string'?'left':'right',
			sortable: false,
			flex: ( ( parseInt(_store.getAt(i).get('width')) ) == -1 ? 1 : null ),
			width : parseInt(_store.getAt(i).get('width')),
			summaryType: _store.getAt(i).get('summary'),
			beforeOpt : _store.getAt(i).get('beforeOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('beforeOpt') + ')' ),
			afterOpt : _store.getAt(i).get('afterOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('afterOpt') + ')' ),
			extOpt : _store.getAt(i).get('extOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('extOpt') + ')' ),
            editorCfg : _store.getAt(i).get('editorCfg'),
            editorXType : _store.getAt(i).get('editorXType'),
			editor:ths.table!=''? (this.createEditor( _store.getAt(i).get('editable') ,_store.getAt(i).get('editXType') ,_gridId )) : null });
		this.fieldMArray.push({ 
			name : _store.getAt(i).get('field_rawname'),
			type : _store.getAt(i).get('datatype'),
			defaultValue : ( _store.getAt(i).get('field_rawname')=='workstation_id' ) ? sessionId : ( _store.getAt(i).get('datatype')=='int' ? parseInt(_store.getAt(i).get('default_value')) : _store.getAt(i).get('default_value') )
		}) ;
	}
	Ext.define('sys_document_order_detail'+ths.objId, {
		extend: 'Ext.data.Model',
        fields: ths.fieldMArray
	});
	
	var store = Ext.create('Ext.data.Store', {
	    model: 'sys_document_order_detail'+ths.objId,
	    pageSize: 5000,
	    proxy: {
	        type: 'jsonp',
	        url: 'buildergrid_jsonp.jsp',
	        extraParams : {
	        		defaultRec	:	jsonToStr(eval('sys_document_order_detail'+ths.objId)),
	        		sessionId	:	sessionId,
	        		sql			:	_sql,
	        		table		:	_table
	        	},
            reader: {
                root: 'sys_document_order_detail',
                totalProperty: 'totalCount'
            }
	    },
	    listeners:{
	    	load : function(ths ,records ,successful ,eOpts){
	    		if(successful){
	    			if(ths.getCount()==0){
	    				ths.add(eval('sys_document_order_detail'+ths.objId));
	    			}	    			
	    		}else{
	    			
	    		}
	    	},
	    	add : function( store, records, index, eOpts ){
	    		var d = new Ext.util.DelayedTask(function(){
	    			//Ext.getCmp(_id).getSelectionModel().select(Ext.getCmp(_id).getStore().getCount() - 1);
	    			//Ext.getCmp(_id).view.bufferedRenderer.scrollTo(Ext.getCmp(_id).getStore().getCount() - 1, true);
	    			//if()
	    			Ext.getCmp(_gridId).getPlugin().startEditByPosition( ths.getNextEditCellPosition(Ext.getCmp(_gridId) ,{row:Ext.getCmp(_gridId).getStore().getCount()-1,column:0},null ) );
	            });  
	            d.delay(50);  	    		
	    	}
	    },
	    autoLoad: true
	});
	//grid.reconfigure(store,colMArray);
	Ext.getCmp(_gridId).reconfigure(store,ths.getColumns(ths.colMArray,ths.gc));

};

builderGrid.prototype.resetGrid = function(_datebase ,_categroy ,_kind ,_sys_id ,_table ,_sql){
	var ths = this;
	JbsManager.loadSysDocumentDetail(
			_datebase,
			_categroy,
            _kind,
			_sys_id,
			function(data){
				if(data){
					var systemdocumentdetail = eval( '(' + data + ')' );
					ths.reloadReconfigGrid(_sys_id ,_table ,_sql,systemdocumentdetail);
					
				}
	});	
};

builderGrid.prototype.createGridPanel = function(_store,_table,_sql){
    this.table = _table;
    this.colMArray = new Array();
    this.fieldMArray = new Array();
    var me = this;

    this.colMArray.push({
    	xtype: 'rownumberer',
        width: 40,
        sortable: false});
	for( var i = 0 ; i<_store.getCount() ; ++i ){
		if( _store.getAt(i).get('sys_id')!=me.sys_id || _store.getAt(i).get('type')!='grid' ){
			continue;
		}
		me.colMArray.push({
			text : _store.getAt(i).get('field_showname'),
			dataIndex : _store.getAt(i).get('field_rawname'),
			menuDisabled : false,
			hidden : ( (_store.getAt(i).get('visible')=='1') ? false : true ),
			align: _store.getAt(i).get('datatype')=='string'?'left':'right',
			sortable: false,
			flex: ( ( parseInt(_store.getAt(i).get('width')) ) == -1 ? 1 : null ),
			width : parseInt(_store.getAt(i).get('width')),
			summaryType: _store.getAt(i).get('summary'),
			beforeOpt : _store.getAt(i).get('beforeOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('beforeOpt') + ')' ),
			afterOpt : _store.getAt(i).get('afterOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('afterOpt') + ')' ),
			extOpt : _store.getAt(i).get('extOpt')=='' ? eval( '({})' ) : eval( '(' + _store.getAt(i).get('extOpt') + ')' ),
			editorCfg : _store.getAt(i).get('editorCfg'),
            editorXType : _store.getAt(i).get('editorXType'),
			editor:me.table!=''? (this.createEditor( _store.getAt(i).get('editable') ,_store.getAt(i).get('editXType') ,me.objId )) : null });
		me.fieldMArray.push({
			name : _store.getAt(i).get('field_rawname'),
			type : _store.getAt(i).get('datatype'),
			defaultValue : ( _store.getAt(i).get('field_rawname')=='workstation_id' ) ? sessionId : ( _store.getAt(i).get('datatype')=='int' ? parseInt(_store.getAt(i).get('default_value')) : _store.getAt(i).get('default_value') ) 
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
	    		//var tmpE = e;me.colMArray[e.colIdx]
	    		if(e.record.get('entry_num')!='0' && e.record.get('entry_num')!='' ){
	    			if( e.value != e.originalValue ){
	    				JbsManager.cellSaveDwr(
	    						me.table,
	    						e.record.get('entry_num'),
	    						e.record.get('workstation_id'),
	    						e.field,
	    						e.value,
	    						function(data){
	    							
	    						});
	    			}
	    		}
	    	},
	    	validateedit: function( editor, e, eOpts ){
	    		e.cancel = false;
	    		e.record.data[e.field] = e.value;
	    	}
	    }
	});
	//sys_document_order_detail.setFields(fieldMArray);
    var deleteAction = Ext.create('Ext.Action', {
        icon   : 'images/itemDelete.gif',  // Use a URL in the icon config
        text: '删除记录',
        disabled: true,
        handler: function(widget, event){
        	var rec = Ext.getCmp(me.objId).getSelectionModel().getSelection()[0];
        	JbsManager.deleteRecordDwr(
					'demo' ,
					me.getGridTable() ,
					RecToStr( rec ) ,
					function(data){
						Ext.getCmp(me.objId).getStore().reload();
					});
        }
    });

    var insertAction = Ext.create('Ext.Action', {
        icon   : 'images/itemInsert.gif',  // Use a URL in the icon config
        text: '插入记录',
        disabled: true,
        handler: function(widget, event) {
            var rec = Ext.getCmp(me.objId).getSelectionModel().getSelection()[0];
            var rectmp = Ext.create('sys_document_order_detail'+ths.objId, {});
            rectmp.set('entry_num',(parseInt(rec.get('entry_num'))).toString());
        	JbsManager.insertRecordDwr(
					'demo' ,
					me.getGridTable() ,
					RecToStr( rectmp ) ,
					function(data){
						Ext.getCmp(me.objId).getStore().reload();
					});
        }
    });

	var contextMenu = Ext.create('Ext.menu.Menu', {
        items: [
            deleteAction,
            insertAction
        ]
    });
	
	Ext.create('Ext.data.Store', {
		id:'orderStore',
	    model: 'sys_document_order_detail'+me.objId,
	    pageSize: 5000,
	    proxy: {
	        type: 'jsonp',
	        url: 'buildergrid_jsonp.jsp',
	        extraParams : {
	        		defaultRec	:	jsonToStr(eval('sys_document_order_detail'+me.objId)),
	        		sessionId	:	sessionId,
	        		table		:	_table,
	        		sql			:   _sql
	        	},
            reader: {
                root: 'sys_document_order_detail',
                totalProperty: 'totalCount'
            }
	    },
	    listeners:{
	    	load : function(ths ,records ,successful ,eOpts){
	    		if(successful){
	    			if(ths.getCount()==0){
	    				ths.add(eval('sys_document_order_detail'+ths.objId));
	    			}	    			
	    		}else{
	    			
	    		}
	    	},
	    	add : function( store, records, index, eOpts ){
	    		var d = new Ext.util.DelayedTask(function(){
	    			//Ext.getCmp(me.objId).getSelectionModel().select(Ext.getCmp(me.objId).getStore().getCount() - 1);
	    			//Ext.getCmp(me.objId).view.bufferedRenderer.scrollTo(Ext.getCmp(me.objId).getStore().getCount() - 1, true);
	    			Ext.getCmp(me.objId).getPlugin().startEditByPosition( me.getNextEditCellPosition(Ext.getCmp(me.objId) ,{row:Ext.getCmp(me.objId).getStore().getCount()-1,column:0},null ) );
	            });  
	            d.delay(50);  	    		
	    	}
	    },
	    autoLoad: true
	});

	Ext.create('Ext.grid.Panel', {
		id     	: me.objId,
		store  	: 'orderStore',
		region 	: 'south',
        border : false,
		margins	: '4 0 0 0',
        height : 300,
        resizable : true,
        resizeHandles : 'n',
        //collapsible : true,
        //collapseMode : 'mini',

        columns	: me.getColumns(me.colMArray,me.gc),
		columnLines : true,
	    plugins	: ( me.table != '' ? [cellEditing ,{ ptype: 'bufferedrenderer',numFromEdge : 50 ,trailingBufferZone: 1000, leadingBufferZone: 50 }] : [{ ptype: 'bufferedrenderer',numFromEdge : 50 ,trailingBufferZone: 1000, leadingBufferZone: 50 }] ),
	    selModel: {
	        selType: 'cellmodel',
	        mode : 'SINGLE',
	        pruneRemoved: false
	    },
	    viewConfig: {
            stripeRows: true,
            trackOver: false,
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
		features: [{
		    ftype: 'summary',
		    dock: 'bottom'
		}]
	});
	
	Ext.getCmp(me.objId).getSelectionModel().on({
        selectionchange: function(sm, selections) {
            if (selections.length==1 && me.table!='') {
                deleteAction.enable();
                insertAction.enable();
            } else {
            	deleteAction.disable();
            	insertAction.disable();
            }
        }
    });
	return this.objId;
};
