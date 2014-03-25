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

function builderGrid (obj ,detail){
	this.moduleId = obj.get('sys_id');
	this.modle = builderGrid.prototype.createGridPanel(this.moduleId);
    
}

builderGrid.prototype.createEditor = function createEditor(_enable ,_type ,_grid){
	if( !Boolean(parseInt(_enable)) ){
		return null;
	}
	var editor = {
        xtype: _type,
        allowBlank: false,  // requires a non-empty value
        listeners:{
            specialkey: function(field, e){
                if (e.getKey() == e.ENTER) {
                	var pos = builderGrid.prototype.getNextEditCellPosition(Ext.getCmp(_grid) ,Ext.getCmp(_grid).getSelectionModel().getCurrentPosition() );
                	//var pos1 = {row:pos.row,column:0};
                	//Ext.getCmp('demo').getSelectionModel().setCurrentPosition(pos1);
                	Ext.getCmp(_grid).getPlugin().startEditByPosition(pos);
                    e.stopEvent();
                }
            }
        }
    };
	return editor;
};
/*
builderGrid.prototype.cellNext = function cellNext(editor ,e ){
	for( var i = e.colIdx+1 ; i<=e.grid.columns.length ; ++i ){
		if( i == (e.grid.columns.length) ){
			if( e.rowIdx < e.grid.getStore().getCount() ){
				cellNext( editor ,{grid:e.grid,rowIdx:e.rowIdx+1 ,colIdx:0} );
			}else{
				JbsManager.cellSaveDwr(0,'result','',e.grid.getStore().getCount(),
						function(data){
					e.grid.getStore().load();
				});
			}
			break;			
		}else{
			if( editor.startEditByPosition({row:e.rowIdx,column:i}) ){
				break;
			}else{
				cellNext(editor,{grid:e.grid,rowIdx:e.rowIdx ,colIdx:i});
				break;
			}
		}
	}
};
*/

/*builderGrid.prototype.cellNext = function cellNext(grid ,obj ){
	if(!grid.getSelectionModel().getCurrentPosition().columnHeader.getEditor().isValid()){
		return;
	}
	for( var i = obj.column+1 ; i<=grid.columns.length ; ++i ){
		if( i == (grid.columns.length) ){
			if( ! (obj.row < grid.getStore().getCount()) ){
				obj.row = obj.row+1;
				obj.column = -1;
				cellNext( grid ,obj );
			}else{
				grid.getStore().add(new sys_document_order_detail1({}));
				//cellNext( grid ,{row : row+1 ,column : -1} );
			}
			break;			
		}else{
			if( grid.columns[i].hidden ){
				if( grid.getPlugin().startEditByPosition({row:obj.row,column:i}) ){
					break;
				}else{
					obj.column = i;
					cellNext( grid ,obj );
					break;
				}				
			}else{
				obj.column = i;
				cellNext( grid ,obj );
				break;				
			}
		}
	}
};
*/

/*builderGrid.prototype.cellNext = function cellNext(grid ,obj){
	for( var i = obj.column+1 ; i<=grid.columns.length ; ++i ){
		if( i == (grid.columns.length) ){
			if( ! (obj.row < grid.getStore().getCount()) ){
				obj.row = obj.row+1;
				obj.column = -1;
				cellNext( grid ,obj );
			}else{
				grid.getStore().add(new sys_document_order_detail1({}));
			}
			break;			
		}else{
			if( ! grid.columns[i].hidden ){
				if( grid.getPlugin().startEditByPosition({row:obj.row,column:i}) ){
					break;
				}else{
					obj.column = i;
					cellNext( grid ,obj );
					break;
				}				
			}else{
				obj.column = i;
				cellNext( grid ,obj );
				break;				
			}
		}
	}
};
*/
builderGrid.prototype.getNextEditCellPosition = function getNextEditCellPosition(grid ,obj){
	for( var i = obj.column+1 ; i<=grid.columns.length ; ++i ){
		if( i == (grid.columns.length) ){
			if( (obj.row+1) < grid.getStore().getCount() ){
				obj.row = obj.row + 1;
				obj.column = 0;
				var pos = getNextEditCellPosition(grid ,obj);
				//JbsManager.updateRecordDwr( 'demo' ,'detail_table_tmp' ,String jsonObjStr ,int opt );
				return pos;
			}else{
				grid.getStore().add(new sys_document_order_detail1({}));
				return {row:(obj.row +1),column:0};
			}
			break;			
		}else{
			if( grid.columns[i].hidden || grid.columns[i].editor===null ){
				continue;		
			}else{
				obj.column = i;
				return obj;
			}
		}
	}
};

builderGrid.prototype.createEditGridPanel = function createEditGridPanel(){
	var colMArray = new Array();
	var fieldMArray = new Array();
	var module;
    Ext.create('Ext.data.Store', {
	     fields: [{	name: 'id', type: 'int'	},
	              {	name: 'category'},
	              {	name: 'kind'},
	              { name: 'sys_id'},
	              {	name: 'entry_num',type:'int'},
	              {	name: 'field_showname'},
	              {	name: 'field_rawname'},
	              {	name: 'visible'},
	              {	name: 'datatype'},
	              {	name: 'width'},
	              {	name: 'editable' ,type:'int'},
	              {	name: 'default_value'},
	              {	name: 'editorXType'},
	              { name: 'summary'}],
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
					colMArray.push({
						xtype:	'rownumberer',
						width:	40,
						sortable:false
					});
					for( var i = 0 ; i<_store.getCount() ; ++i ){
						if(_store.getAt(i).get(sys_id)!=_id){
							continue;
						}
						colMArray.push({
							text : _store.getAt(i).get('field_showname'),
							dataIndex : _store.getAt(i).get('field_rawname'),
							menuDisabled : false,
							hidden : ( (_store.getAt(i).get('visible')=='1') ? false : true ),
							align: _store.getAt(i).get('datatype')=='string'?'left':'right',
							sortable: false,
							flex: ( ( parseInt(_store.getAt(i).get('width')) ) == -1 ? 1 : null ),
							width : parseInt(_store.getAt(i).get('width')),
							summaryType: _store.getAt(i).get('summary'),
							editor:builderGrid.prototype.createEditor( _store.getAt(i).get('editable') ,_store.getAt(i).get('editXType') ,this.editgridId )});
						fieldMArray.push({ 
							name : _store.getAt(i).get('field_rawname'),
							type : _store.getAt(i).get('datatype'),
							defaultValue : _store.getAt(i).get('datatype')=='int' ? parseInt(_store.getAt(i).get('default_value')) : _store.getAt(i).get('default_value') });
					}
					Ext.define('sys_document_order_detail', {
						extend: 'Ext.data.Model',
				        fields: fieldMArray
					});
					module = Ext.create('Ext.grid.Panel', {
						id     	: this.editgridId,
						store  	: 'orderStore',
						region 	:'center',
						margins	:'2 2 2 2',
						columns	: colMArray,
					    plugins	: [cellEditing,{ ptype: 'bufferedrenderer' ,trailingBufferZone: 20, leadingBufferZone: 50 }],
					    selModel: {
					        selType: 'cellmodel',
					        mode : 'SINGLE',
					        preventWrap : true
					    },
					    viewConfig: {
					        stripeRows: true,
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
	    	 }
	     },
	     autoLoad: true
	});
    
};

builderGrid.prototype.createGridPanel = function createGridPanel(_store,_id){
    var colMArray = new Array();
    var fieldMArray = new Array();
    colMArray.push({
    	xtype: 'rownumberer',
        width: 40,
        sortable: false});
	for( var i = 0 ; i<_store.getCount() ; ++i ){
		if(_store.getAt(i).get(sys_id)!=_id){
			continue;
		}
		colMArray.push({
			text : _store.getAt(i).get('field_showname'),
			dataIndex : _store.getAt(i).get('field_rawname'),
			menuDisabled : false,
			hidden : ( (_store.getAt(i).get('visible')=='1') ? false : true ),
			align: _store.getAt(i).get('datatype')=='string'?'left':'right',
			sortable: false,
			flex: ( ( parseInt(_store.getAt(i).get('width')) ) == -1 ? 1 : null ),
			width : parseInt(_store.getAt(i).get('width')),
			summaryType: _store.getAt(i).get('summary'),
			editor:builderGrid.prototype.createEditor( _store.getAt(i).get('editable') ,_store.getAt(i).get('editXType') ,this.editgridId )});
		fieldMArray.push({ 
			name : _store.getAt(i).get('field_rawname'),
			type : _store.getAt(i).get('datatype'),
			defaultValue : _store.getAt(i).get('datatype')=='int' ? parseInt(_store.getAt(i).get('default_value')) : _store.getAt(i).get('default_value') });
	}
	Ext.define('sys_document_order_detail', {
		extend: 'Ext.data.Model',
        fields: fieldMArray
	});
	this.emptyRecord = Ext.create('sys_document_order_detail1', {});
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	    clicksToEdit: 1,
	    listeners:{
	    	edit : function( editor, e, eOpts ){
	    		if( e.value != e.originalValue ){
	    			JbsManager.cellSaveDwr(e.record.get('id'),e.field,e.value,e.record.get('entry_num'),
	    					function(data) {
	    			});
	    		}
	    	}
	    }
	});
	//sys_document_order_detail.setFields(fieldMArray);
    var deleteAction = Ext.create('Ext.Action', {
        icon   : 'images/itemDelete.gif',  // Use a URL in the icon config
        text: '删除记录',
        disabled: true,
        handler: function(widget, event) {
        	var rec = Ext.getCmp(this.editgridId).getSelectionModel().getSelection()[0];
        	//Ext.Msg.alert(rec.get('productName'),rec.get('productName'));
        	Ext.getCmp(this.editgridId).getStore().remove( rec );
        }
    });

    var insertAction = Ext.create('Ext.Action', {
        icon   : 'images/itemInsert.gif',  // Use a URL in the icon config
        text: '插入记录',
        disabled: true,
        handler: function(widget, event) {
            var rec = grid.getSelectionModel().getSelection()[0];
            if (rec) {
                Ext.example.msg('Sell', 'Sell ' + rec.get('productName'));
            }
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
	    model: 'sys_document_order_detail1',
	    pageSize: 5000,
	    proxy: {
	        type: 'jsonp',
	        url: 'buildergrid_jsonp.jsp',
	        extraParams : {defaultRec:jsonToStr(sys_document_order_detail1)},
            reader: {
                root: 'sys_document_order_detail',
                totalProperty: 'totalCount'
            }
	    },
	    listeners:{
	    	load : function(ths ,records ,successful ,eOpts){
	    		if(successful){
	    			if(ths.getCount()==0){
	    				ths.add(sys_document_order_detail1);
	    			}	    			
	    		}else{
	    			
	    		}
	    	},
	    	add : function( store, records, index, eOpts ){
	    		var d = new Ext.util.DelayedTask(function(){
	    			Ext.getCmp(this.editgridId).getPlugin().startEditByPosition( builderGrid.prototype.getNextEditCellPosition(Ext.getCmp(this.editgridId) ,{row:Ext.getCmp(this.editgridId).getStore().getCount()-1,column:0} ) );
	            });  
	            d.delay(50);  	    		
	    	}
	    },
	    autoLoad: true
	});
	
	Ext.create('Ext.grid.Panel', {
		id     	: this.editgridId,
		store  	: 'orderStore',
		region 	:'center',
		margins	:'2 2 2 2',
		columns	: colMArray,
	    plugins	: [cellEditing,{ ptype: 'bufferedrenderer' ,trailingBufferZone: 20, leadingBufferZone: 50 }],
	    selModel: {
	        selType: 'cellmodel',
	        mode : 'SINGLE',
	        preventWrap : true
	    },
        viewConfig: {
            stripeRows: true,
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
	
	Ext.getCmp(this.editgridId).getSelectionModel().on({
        selectionchange: function(sm, selections) {
            if (selections.length==1) {
                deleteAction.enable();
                insertAction.enable();
            } else {
            	deleteAction.disable();
            	insertAction.disable();
            }
        }
    });
	return this.editgridId;
};
