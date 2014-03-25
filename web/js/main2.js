Ext.onReady(function(){
    //Ext.QuickTips.init();
    var viewport = Ext.create('Ext.Viewport', {
    	id:"viewport_001",
        layout:'border',
        items:[
        {
            region:'center',
            layout:'border',
            margins:'2 2 2 2',
            items:[grid]
        }]
    });
 
});