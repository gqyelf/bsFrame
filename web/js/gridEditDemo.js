Ext.require([
    'Ext.selection.CellModel',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*'
]);

Ext.define('Demo', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'category', type: 'string'},
        {name: 'kind', type: 'string'},
        {name: 'workstation_id', type: 'string'},
        {name: 'document_num', type: 'string'},
        {name: 'work_time', type: 'string'},
        {name: 'operator_id', type: 'string'},
        {name: 'issuance_date', type: 'string'},
        {name: 'seria_num', type: 'int'},
        {name: 'entry_num', type: 'int'},
        {name: 'actual_date', type: 'string'},
        {name: 'productName', type: 'string'},
        {name: 'productType', type: 'string'},
        {name: 'quantity', type:'money'},
        {name: 'price', type: 'money'},
        {name: 'sumMoney', type: 'money'}
    ]
});

var storeGridEdit = Ext.create('Ext.data.Store', {
    model: 'Demo',
    buffered: true,
    leadingBufferZone: 150,
    pageSize: 50,
    proxy: {
        type: 'jsonp',
        url: 'demoGrid_jsonp.jsp',
        reader: {
            root: 'Demo',
            totalProperty: 'totalCount'
        }
    },
    sorters: [{
        property: 'id',
        direction:'ASC'
    }],
    listeners:{
    	load:function(ths, records, successful, eOpts){
    		if(ths.getCount()<1){
				JbsManager.cellSaveDwr(0,'result','',0,
    					function(data){
					if(data){
						ths.load();					
					}
    			});    			
    		}
    		//cellEditing.startEditByPosition({row: ths.getCount()-1, column: 1});
    		//cellNext(cellEditing,{grid:gridEdit,rowIdx:ths.getCount()-1 ,colIdx:0});
    	}
    },
    autoLoad: true
});

var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1,
    listeners:{
/*    	beforeedit:function( editor, e, eOpts ){
    		var _e = e;
    		_e.cancel = false;
    		return _e;
    	},
*/    	edit : function( editor, e, eOpts ){
    		if( e.value != e.originalValue ){
    			JbsManager.cellSaveDwr(e.record.get('id'),e.field,e.value,e.record.get('entry_num'),
    					function(data) {
    			});
    		}
    	}
    }
});
//cellEditing.removeManagedListener(cellEditing.view, 'celldblclick');
function cellNext(grid ,obj ){
	if(!grid.getSelectionModel().getCurrentPosition().columnHeader.getEditor().isValid( )){
		return;
	}
	for( var i = obj.column+1 ; i<=grid.columns.length ; ++i ){
		if( i == (grid.columns.length) ){
			if( obj.row < grid.getStore().getCount() ){
				obj.row = obj.row+1;
				obj.column = obj.column+1;
				cellNext( grid ,obj );
			}/*else{

			}*/
			break;			
		}else{
			if( grid.getPlugin().startEditByPosition({row:obj.row,column:i}) ){
				break;
			}else{
				obj.column = i;
				cellNext( grid ,obj );
				break;
			}
		}
	}
};



var gridEdit = Ext.create('Ext.grid.Panel', {
	id :'gridEdit001',
    store: storeGridEdit,
	region:'center',
    columns: [{
        header: '序号',
        dataIndex: 'entry_num',
        width: 50,
    },{
        header: '产品名称',
        dataIndex: 'productName',
        flex: 1,
        editor: {
            xtype: 'textfield',
            allowBlank: false,  // requires a non-empty value
            listeners:{
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                    	cellNext(gridEdit ,gridEdit.getSelectionModel().getCurrentPosition() );
                        e.stopEvent();
                    }
                }
            }
        }
    }, {
        header: '产品类型',
        dataIndex: 'productType',
        width: 130,
        editor: new Ext.form.field.ComboBox({
            typeAhead: true,
            triggerAction: 'all',
            selectOnTab: true,
            store: [
                ['Shade','Shade'],
                ['Mostly Shady','Mostly Shady'],
                ['Sun or Shade','Sun or Shade'],
                ['Mostly Sunny','Mostly Sunny'],
                ['Sunny','Sunny']
            ],
            lazyRender: true,
            listClass: 'x-combo-list-small',
            listeners:{
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                    	cellNext(gridEdit ,gridEdit.getSelectionModel().getCurrentPosition() );
                        e.stopEvent();
                    }
                }
            }
        })
    }, {
        header: '单价',
        dataIndex: 'price',
        width: 70,
        align: 'right',
        renderer: 'usMoney',
        editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 0,
            maxValue: 100000,
            listeners:{
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                    	cellNext(gridEdit ,gridEdit.getSelectionModel().getCurrentPosition() );
                        e.stopEvent();
                    }
                }
            }
        }
    }, {
        header: '金额',
        dataIndex: 'sumMoney',
        width: 95,
        align: 'right',
        renderer: 'usMoney',
        editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 0,
            maxValue: 100000,
            listeners:{
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                    	cellNext(gridEdit ,gridEdit.getSelectionModel().getCurrentPosition() );
                        e.stopEvent();
                    }
                }
            }
        }
    }],
    selModel: {
        selType: 'cellmodel'
    },
    width: 600,
    height: 300,
    title: 'Edit Plants?',
    frame: true,
    plugins: [cellEditing]
});

// manually trigger the data store load
storeGridEdit.load();
