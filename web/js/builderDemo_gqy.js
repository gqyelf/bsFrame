Ext.define('sys_document', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'},
		{name: 'sys_id'},
		{name: 'category'},
		{name: 'kind'},
		{name: 'caption'},
		{name: 'parentid'},
		{name: 'xtype'},
		{name: 'property'},
		{name: 'events'},
		{name: 'childrens'},
		{name: 'sortid'},
		{name: 'status', type:'int'}
	]
});

function builder (_dataBase ,_vid){
	this.dataBase = _dataBase;
	this.builderStore = Ext.create('Ext.data.Store', {
	     id: _vid+'builderStore',
	     model: 'sys_document',
	     proxy: {
	    	 type: 'ajax',
	         url: 'sys_document_json.jsp?database='+this.dataBase+'&sql=select * ,0 as status from sys_document order by id',
	         reader: {
	        	 type:'json',
	             root: 'sys_document',
	             totalProperty: 'totalCount'
	         }
	     },
	     listeners:{
	    	 load : function( ths, record, successful, eOpts ){
	    		 for(var i = 0 ; i< ths.getCount() ; ++i ){
	    			 builder.prototype.createComponent(ths , i);
	    		 }
	    		 Ext.getCmp('main_framecenter').doLayout();
	    	 }
	     },
	     autoLoad: true
	 });
	
}

builder.prototype.createComponent = function createComponent(_store ,_index){
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
			        items:[{
		            	   id:_store.getAt(_index).get('sys_id')+'center',
		            	   region:'center',
		                   margins:'2 2 2 2',
		                   autoScroll:true
		               }]
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
