function dateCombo(_obj ,_index ,_field ,_el ,_pos ,_offset){
    this.objId = _obj.objId;
    this.objColumns = _obj.colMArray;
    this.objType = _obj.type;
    this.recIndex = _index;
    this.offset = (_offset === undefined ? [0,0] : _offset);
    this.pos = _pos;
    var me = this;
    this.wnd = Ext.create('Ext.Window', {
        modal : true,
        items:[
        {
            xtype: 'datepicker',
            //width:200,
            //minDate: new Date(),
            handler: function(picker, date) {
                if( me.objType == 'grid' ){
                    me.updateGridRec(date);
                }
                if( me.objType == 'form' ){
                    me.updateFormRec(date);
                }
            }
        }],
        listeners:{
            show : function(ths){
                ths.anchorTo(_el,'bl',me.offset);
            }
        }
    }).show();
}

dateCombo.prototype.updateGridRec = function(_data ){
    var me = this;
    var rec = Ext.getCmp(me.objId).getSelectionModel().getSelection()[0];
    rec.set(me.recIndex ,_data.formatDate() );
    Ext.getCmp(me.objId).getPlugin().startEditByPosition(me.pos);
    me.wnd.close();
};

dateCombo.prototype.updateFormRec = function(_data ){
    var me = this;
    var rec = Ext.getCmp(me.objId).getForm().getRecord();
    rec.set(me.recIndex ,_data.formatDate() );
    Ext.getCmp(me.objId).getForm().loadRecord(rec);
    //Ext.getCmp(me.objId).getComponent(me.pos.column).focus(true);
    if(me.objColumns[me.pos.column].position==''){
        Ext.getCmp(me.objId).getComponent().focus(true);
    }else{
        Ext.getCmp(me.objId).getComponent(parseInt(me.objColumns[me.pos.column].position.split(',')[0])-1).getComponent(parseInt(me.objColumns[me.pos.column].position.split(',')[1])-1).getComponent(0).focus(true);
    }
    me.wnd.close();
};
/*

dateCombo.prototype.act = function(_el){
    this.wnd.show();
    this.wnd.anchorTo(_el,'bl');
}*/
