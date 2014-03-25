function builder (_vid ,_systemdocument){
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
	this.builderStore = Ext.create('Ext.data.Store', {
	     model: 'sys_document',
	     data: _systemdocument,
	     proxy: {
	    	 type: 'memory',
	         reader: {
	        	 type:'json',
	             root: 'sys_document'
	         }
	     },
	     listeners:{
	    	 load : function( ths, record, successful, eOpts ){
	    		 var sd = ths;
	    		 this.builderDetailStore = Ext.create('Ext.data.Store', {
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
	    		    		 for( var i = 0 ; i<sd.getCount() ; ++i ){
	    		    			 if( sd.getAt(i).get('xtype')=='gridedit' ){
	    		    				 builder.prototype.createModule(sd ,ths ,'main_frame_editgrid');	    				 
	    		    			 }	    			 
	    		    		 }
	    		    	 }
	    		     }
	    		 });
	    	 }
	     },
	     autoLoad: true
	 });
};
//生成单一组件
builder.prototype.createModule = function createModule(_store ,_detailstore ,_sys_id){
	var rec = _store.findRecord( 'sys_id', _sys_id );
	var module;
	if(rec!=null){//builderEditGrid
		if(rec.get( 'xtype' ) == 'viewport'){
			module = new builderViewport(rec);
			return module;
		}
		if(rec.get('xtype') == 'gridedit'){
			module = new builderEditGrid(rec,_detailstore);
			return module;
		}
	}
};

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

builder.prototype.createInputTypeComponent = function createInputTypeComponent(_store ,_index){
	if(Ext.getCmp(_store.getAt(_index).get('sys_id')) == null){
		 Ext.create('Ext.Viewport', {
		    	id:_store.getAt(_index).get('sys_id'),
		        layout:'border',
		        title:_store.getAt(_index).get('caption'),
		        items:[{
					id:_store.getAt(_index).get('sys_id')+'center',
					region:'center',
					layout:'border',
		            margins:'2 2 2 2'
	            }]
			 });
		 m_editgrid = new builderGrid (_systemdocument ,_store.getAt(_index).get('sys_id')+'center');
	}
};

