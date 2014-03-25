//the config_json parameter is a json object
function builderGrid ( _config_json ,_grid_id ){
	this.grid = 	Ext.create('Ext.grid.Panel', {
						id     	: _grid_id,
						store  	: 'orderStore',
						columns	: [{
										xtype: 'rownumberer',
								        width: 40,
								        sortable: false
								   }],
						columnLines : true,
					    plugins	: ( [cellEditing ,{ ptype: 'bufferedrenderer',numFromEdge : 50 ,trailingBufferZone: 1000, leadingBufferZone: 50 }] ),
					    selModel: {
					        selType: 'cellmodel',//ths.table != '' ? 'cellmodel' : 'rowmodel',
					        mode : 'SINGLE',
					        pruneRemoved: false
					    },
						features: [{
						    ftype: 'summary',
						    dock: 'bottom'
						}],
						renderTo : Ext.getBody()
					});
}

builderGrid.prototype.getId = function(){
	this.grid.getId();
};


Ext.define('g_comboGrid', {
    extend: 'Ext.form.field.ComboBox',
    initComponent: function() {
        this.text = new Date();
        this.renderTo = Ext.getBody();
        this.callParent();
    }
});

