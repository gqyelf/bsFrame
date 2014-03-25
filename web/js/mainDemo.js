/**

 **/

Ext.require(['*']);
var systemdocument;
var m_builder;
var m_ingrid;

Ext.onReady(function(){
    var m_combo = Ext.create('Ext.ux.TreeComboBox', {
        fieldLabel: 'testcombo',
        renderTo: 'comboBoxTree',
        width: 500,
        labelWidth: 130
        //store: bookStore
    });
});
