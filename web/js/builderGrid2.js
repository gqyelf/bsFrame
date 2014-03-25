Ext.define('sys_document_order', {
	extend: 'Ext.data.Model',
	fields: [
 		{name: 'id', type: 'int'},
		{name: 'category'},
		{name: 'kind'},
		{name: 'field_showname'},
		{name: 'field_rawname'},
		{name: 'datatype'}
	]
});

function builderGrid (_dataBase ,_vid){
	this.dataBase = _dataBase;
	this.builderStore = Ext.create('Ext.data.Store', {
	     id: _vid+'builderGridStore',
	     model: 'sys_document_order',
	     proxy: {
	    	 type: 'ajax',
	         url: 'sys_document_order_json.jsp?database='+this.dataBase+'&sql=select * ,0 as status from sys_document_order order by sort_id',
	         reader: {
	        	 type:'json',
	             root: 'sys_document_order',
	             totalProperty: 'totalCount'
	         }
	     },
	     listeners:{
	    	 load : function( ths, record, successful, eOpts ){
	    		 builderGrid.prototype.createGridPanel(ths);
				 Ext.create('Ext.Viewport', {
				    	id:'main_frame',
				        layout:'border',
				        items:['testGrid']
				 });				 
	    	 }
	     },
	     autoLoad: true
	 });
	
}

builderGrid.prototype.createComponent = function createComponent(_store ,_index){
	if(Ext.getCmp(_store.getAt(_index).get('sys_id')) == null){
		if( Ext.getCmp(_store.getAt(_index).get('parentid')) == null && _store.getAt(_index).get('parentid') != '' ){
			for(var i = 0 ;i<_store.getCount();++i){
				if( _store.getAt(i).get(sys_id)==_store.getAt(_index).get('parentid') ){
					createComponent(_store ,i);
					break;
				}
			}
		}else{
			 if(_store.getAt(_index).get('xtype')=='viewport'){
				 Ext.create('Ext.Viewport', {
			    	id:_store.getAt(_index).get('sys_id'),
			        layout:'border',
			        items:[	
			         Ext.create('Ext.grid.Panel', {
						 id:_store.getAt(_index).get('sys_id'),
						 //region:eval( '('+_store.getAt(_index).get('property')+')').location,
						 margins:'2 2 2 2',
						 height:50,
						 title: _store.getAt(_index).get('caption'),
						 columns: [{text: "Name"}],
						 renderTo:_store.getAt(_index).get('parentid')+eval( '('+_store.getAt(_index).get('property')+')').location
					 })]
				 });
			 }
			 if(_store.getAt(_index).get('xtype')=='gridpanel'){
				 Ext.create('Ext.grid.Panel', {
					 id:_store.getAt(_index).get('sys_id'),
					 //region:eval( '('+_store.getAt(_index).get('property')+')').location,
					 margins:'2 2 2 2',
					 height:50,
					 title: _store.getAt(_index).get('caption'),
					 columns: [{text: "Name"}],
					 renderTo:_store.getAt(_index).get('parentid')+eval( '('+_store.getAt(_index).get('property')+')').location
				 });
				 //Ext.Msg.alert(_store.getAt(_index).get('parentid')+eval( '('+_store.getAt(_index).get('property')+')').location);
				 if( _store.getAt(_index).get('parentid') != '' ){					 
					 Ext.getCmp( _store.getAt(_index).get('parentid')+eval( '('+_store.getAt(_index).get('property')+')').location ).items.add( Ext.getCmp( _store.getAt(_index).get('sys_id') ) );
					 //Ext.getCmp( _store.getAt(_index).get('sys_id') ).render();
				 }
			 }
			 if(_store.getAt(_index).get('xtype')=='gridedit'){
				 
			 }
		}
	}
};

builderGrid.prototype.createGridPanel = function createGridPanel(_store){
    var colMArray = new Array();

	for( var i = 0 ; i<_store.getCount() ; ++i ){
		colMArray.push({  header : _store.getAt(i).get('field_showname') ,dataIndex : _store.getAt(i).get('field_rawname') ,menuDisabled : false ,hidden : false ,align: _store.getAt(i).get('datatype')=='String'?'left':'right' ,sortable: false ,width : 150  });
	}
	Ext.create('Ext.grid.Panel', {
		id:'testGrid',
		region:'center',
		margins:'2 2 2 2',
		title: 'testGrid',
		columns: colMArray
	});

};