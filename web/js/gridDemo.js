/**

 **/
 Ext.define('gridDemoModel', {
     extend: 'Ext.data.Model',
     fields: [
         'name', 'xtype'
     ]
 });
 
 var columnStore = Ext.create('Ext.data.Store', {
     id: 'columnStore',
     model: 'gridDemoModel',
     buffered: true,
     leadingBufferZone: 600,
     pageSize: 200,
     proxy: {
         type: 'jsonp',
         url: "menu_jsonp_once.jsp?sql=select top 4000 * from T_gridDemoData",
         reader: {
             root: 'gridDemoData',
             totalProperty: 'totalCount'
         }
         // sends single sort as multi parameter
     },
     autoLoad: true
 });
 
 // create the Data Store
 var gridDemoStore = Ext.create('Ext.data.Store', {
     id: 'gridDemoStore',
     model: 'gridDemoModel',
     buffered: true,
     leadingBufferZone: 600,
     pageSize: 200,
     proxy: {
         type: 'jsonp',
         url: "menu_jsonp_once.jsp?sql=select top 4000 * from T_gridDemoData",
         reader: {
             root: 'gridDemoData',
             totalProperty: 'totalCount'
         }
         // sends single sort as multi parameter
     },
     autoLoad: true
 });


 var gridDemo = Ext.create('Ext.grid.Panel', {
     title: 'gridDemo',
     region:'center',
     store: Ext.create('Ext.data.Store', {
		         id: 'gridDemoStore',
		         model: 'gridDemoModel',
		         buffered: true,
		         leadingBufferZone: 600,
		         pageSize: 200,
		         proxy: {
		             type: 'jsonp',
		             url: "menu_jsonp_once.jsp?sql=select top 4000 * from T_gridDemoData",
		             reader: {
		                 root: 'gridDemoData',
		                 totalProperty: 'totalCount'
		             }
		             // sends single sort as multi parameter
		         },
		         autoLoad: true
		     }),
     loadMask: true,
     // grid columns
     columns:[{
         xtype: 'rownumberer',
         width: 50,
         sortable: false
     },{
         text: "Name",
         dataIndex: 'name',
         flex : 1,
         sortable: true
     },{
         text: "XType",
         dataIndex: 'xtype',
         align: 'center',
         width: 70,
         sortable: false
     }]
 });
