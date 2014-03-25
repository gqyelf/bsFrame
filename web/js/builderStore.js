/**
 * Created with IntelliJ IDEA.
 * User: Gqy
 * Date: 13-7-15
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */

//mainViewPort left grid Store
Ext.define('sys_LeftGridMod', {
    extend: 'Ext.data.Model',
    fields: [
        {	name: 'id', type: 'int'	},
        {	name: 'caption' },
        {   name: 'category' },
        {	name: 'kind' },
        { 	name: 'sys_id' },
        {   name: 'property' },
        {	name: 'mainTable' },
        {   name: 'mainTableTemp' },
        {	name: 'counterTable' },
        { 	name: 'detailTable' },
        {   name: 'detailTableTemp' },
        {   name: 'mainTableView'},
        {   name: 'detailTableView'}
    ]
});

var sys_LeftStore = Ext.create('Ext.data.Store', {
    model: 'sys_LeftGridMod',
    pageSize: 5000,
    proxy: {
        type: 'jsonp',
        url: 'sys_grid_jsonp.jsp',
        extraParams : {
            sessionId	:	'',
            table		:	'',
            sql			:   'select id ,sys_id ,category ,kind ,caption ,xtype ,[property] from sys_document'
        },
        reader: {
            root: 'sys_document',
            totalProperty: 'totalCount'
        }
    },
    listeners:{
        load : function(ths ,records ,successful ,eOpts){

        },
        add : function( store, records, index, eOpts ){

        }
    },
    autoLoad: true
});

//
Ext.define('sys_detailFormMod', {
    extend: 'Ext.data.Model',
    fields: [	{	name: 'id', type: 'int'	},
        {	name: 'caption' },
        {   name: 'category' },
        {	name: 'kind' },
        { 	name: 'sys_id' },
        {   name: 'property' },
        {	name: 'mainTable' },
        {   name: 'mainTableTemp' },
        {	name: 'counterTable' },
        { 	name: 'detailTable' },
        {   name: 'detailTableTemp' },
        {   name: 'mainTableView'},
        {   name: 'detailTableView'}
    ]
});

/*
Ext.define('sys_detailFormModProperty', {
    extend: 'Ext.data.Model',
    fields: [
        {	name: 'mainTable' },
        {   name: 'mainTableTemp' },
        {	name: 'counterTable' },
        { 	name: 'detailTable' },
        {   name: 'detailTableTemp' },
        {   name: 'mainTableView'},
        {   name: 'detailTableTemp'}
    ]
});
*/

var sys_detailFormStore = Ext.create('Ext.data.Store', {
    model: 'sys_detailFormMod',
    pageSize: 5000,
    proxy: {
        extraParams : {
            sessionId	:	'',
            table		:	'',
            sql			:   'select id ,sys_id ,category ,kind ,caption ,xtype ,[property] from sys_document'
        },
        type: 'jsonp',
        url: 'sys_grid_jsonp.jsp',
        reader: {
            root: 'sys_document',
            totalProperty: 'totalCount'
        }
    },
    listeners:{
        load : function(ths ,records ,successful ,eOpts){

        },
        add : function( store, records, index, eOpts ){

        }
    },
    autoLoad: true
});
