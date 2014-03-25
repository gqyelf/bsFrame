/**

 **/
var title = '';

Ext.require(['*']);
Ext.define('Menu', {
    extend: 'Ext.data.Model',
    fields: ['menuName', 'menuType']
});
data2 = [{"menuName":"测试4","menuType":"ok"},{"menuName":"测试5","menuType":"ok1"}];
var store = new Ext.data.Store({
    model: 'Menu',
    data :[{"menuName":"测试","menuType":"ok"},{"menuName":"测试1","menuType":"ok1"},{"menuName":"测试2","menuType":"ok2"}],
    proxy: {
        type: 'memory',
        //url: 'jsondata.html',
        reader: {
            type: 'json'
        }
    }
});

Ext.onReady(function(){
    JbsManager.toJson(function(data){
    	store.loadData(eval(data));
    	
    });
    // create the Edit Grid
    var menuGrid = Ext.create('Ext.grid.Panel', {
    	title:'子菜单1',
        hideCollapseTool: true,
        store: store,
        columnLines: true,
        columns: [
            {
                text     : '菜单名称',
                flex     : 1,
                sortable : false,
                dataIndex: 'menuName'
            },
            {
                text     : '菜单类型',
                width    : 80,
                sortable : false,
                dataIndex: 'menuType'
            }
        ],
        //title: 'Array Grid (Click header to collapse)',
        viewConfig: {
            stripeRows: true
        }
    });

    var item1 = menuGrid;

    var item2 = Ext.create('Ext.Panel', {
        title: '子菜单 2',
        //html: '&lt;&gt;',
        cls:'empty'
    });

    var item3 = Ext.create('Ext.Panel', {
        title: '子菜单 3',
        //html: '&lt;&gt;',
        cls:'empty'
    });

    var mainMenu = Ext.create('Ext.Panel', {
        title: '主菜单',
        collapsible: true,
        region:'west',
        margins:'5 0 5 5',
        split:true,
        width: 210,
        layout:'accordion',
        items: [item1, item2, item3]
    });

    var viewport = Ext.create('Ext.Viewport', {
    	id:"viewport_001",
        layout:'border',
        items:[
        {
            region:'center',
            layout:'border',
            margins:'2 2 2 2',
            items:[gridEdit]
        }]
    });
});


//----------------------------------------------------

