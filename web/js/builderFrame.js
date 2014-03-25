function builderFrame (_databaseName ,_category ,_kind ,_sysId ,_pId ,_pType){
    this.databaseName = _databaseName;
    this.category = _category;
    this.kind = _kind;
    this.sysId = _sysId;
    this.objId = this.sysId+'viewport';
    this.pId = _pId;
    this.pType = _pType;
    this.indexList = null;
    this.mainForm = null;
    this.mainGrid = null;
    this.hasGrid = false;
    var me = this;
    this.systemdocument=null;
    this.querySqlProc=null;
    JbsManager.loadSysDocument(
        me.databaseName,
        me.category,
        me.kind,
        me.sysId,
        function(data){
            if(data){
                me.systemdocument = eval( '(' + data + ')' );
                var listIndexProperty;
                if(me.systemdocument.sys_document[0].property!==undefined){
                    var property = me.systemdocument.sys_document[0].property;
                    property = (property == '' ? '{}' :property);
                    property = eval('('+property+')');
                    listIndexProperty = property.listIndex;
                    if(property.querySqlProc!==undefined&&property.querySqlProc!=""){
                        me.querySqlProc = property.querySqlProc;
                    }
                    me.hasGrid = !( property.detailTable == "" || property.detailTable === undefined || property.detailTableTemp === undefined || property.detailTableView === undefined )
                }
                Ext.create('Ext.container.Container', {
                    id:me.sysId+'viewport',
                    region:'center',
                    layout:'border',
                    title:'caption',
                    items:[
                        {
                            xtype:'panel',
                            id:me.sysId+'viewportcenter',
                            region:'center',
                            layout:'border',
                            margins:'2 2 2 2',
                            border: true,
                            frame : false,
                            tbar: ['-',
                                {
                                    icon:'images/page-first.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        me.mainForm.prevForForm(me.mainForm.table.mainTableView,-1,"");
                                    }
                                },
                                {
                                    icon:'images/page-prev.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        me.mainForm.prevForForm(me.mainForm.table.mainTableView,undefined,"");
                                    }
                                },
                                {
                                    icon:'images/page-next.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        me.mainForm.nextForForm(me.mainForm.table.mainTableView,undefined,"");
                                    }
                                },
                                {
                                    icon:'images/page-last.gif',
                                    cls:'x-btn-icon',
                                    handler:function() {
                                        me.mainForm.nextForForm(me.mainForm.table.mainTableView,-1,"");
                                    }
                                },'-',
                                {
                                    icon:'images/Document.png',
                                    cls:'x-btn-text-icon',
                                    text : '新  增',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        if(m_set_permission!==undefined){
                                            var permissionTag = permissionCheck(m_set_permission,me.sysId,'add_permission');
                                            if(permissionTag==1){
                                                me.newProcess();
                                            }else{
                                                Ext.Msg.alert("提示信息 :","无此权限!");
                                            }
                                        }


                                    }
                                },'-',
                                {
                                    icon:'images/Cut.png',
                                    cls:'x-btn-text-icon',
                                    text : '删  除',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        if(m_set_permission===undefined) {
                                            return;
                                        }
                                        var permissionTag = permissionCheck(m_set_permission,me.sysId,'del_permission');
                                        if(permissionTag!=1){
                                            Ext.Msg.alert("提示信息 :","无此权限!");
                                            return;
                                        }
                                        var doc_num = me.mainForm.getRecord().get("document_num");
                                        var ser_num = me.mainForm.getSeriaNum();
                                        if(me.mainForm.formStatus != 0){
                                            Ext.Msg.show({
                                                title: msgTitleTip,
                                                msg: '单据['+doc_num+']正在修改，无法执行删除操作！',
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.WARNING
                                            });
                                            return;
                                        }
                                        if(doc_num == '' || doc_num===undefined || ser_num == 0 || ser_num===undefined){
                                            showMessageBox(msgTitleWarning,"请选择需要删除的单据！",Ext.Msg.OK,Ext.MessageBox.WARNING);
                                            return;
                                        }
                                        Ext.Msg.show({
                                            title: msgTitleTip,
                                            msg: '单据['+doc_num+']是否删除，请确认！',
                                            buttons: Ext.Msg.YESNO,
                                            fn: function(result) {
                                                if (result == 'yes') {
                                                    me.deleteProcess();
                                                }
                                            },
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                    }
                                },'-',
                                {
                                    icon:'images/Edit.png',
                                    cls:'x-btn-text-icon',
                                    text : '修  改',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        if(m_set_permission===undefined) {
                                            return;
                                        }
                                        var permissionTag = permissionCheck(m_set_permission,me.sysId,'write_permission');
                                        if(permissionTag!=1){
                                            Ext.Msg.alert("提示信息 :","无此权限!");
                                            return;
                                        }
                                        var doc_num = me.mainForm.getDocumentNum();
                                        var ser_num = me.mainForm.getSeriaNum();
                                        if(doc_num == '' || doc_num===undefined || ser_num == 0 || ser_num===undefined){
                                            showMessageBox(msgTitleWarning,"请选择需要修改的单据！",Ext.Msg.OK,Ext.MessageBox.WARNING);
                                            return;
                                        }
                                        if(me.mainForm.formStatus==1){
                                            showMessageBox(msgTitleWarning,"单据["+doc_num+"]正在编辑中！",Ext.Msg.OK,Ext.MessageBox.WARNING);
                                            return;
                                        }
                                        me.modifyProcess()
                                    }
                                },'-',
                                {
                                    icon:'images/Save.png',
                                    cls:'x-btn-text-icon',
                                    text : '存  盘',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        if(me.mainForm.formStatus==1){
                                            me.SaveProcess();
                                        }else{
                                            showMessageBox(msgTitleWarning,"请在新增或修改后执行存盘操作！",Ext.Msg.OK,Ext.MessageBox.WARNING);
                                        }
                                    }
                                },'-',
                                {
                                    icon:'images/print.gif',
                                    cls:'x-btn-text-icon',
                                    text : '打  印',
                                    listeners:{
                                        render:function(ths){
                                        }
                                    },
                                    handler : function() {
                                        if(m_set_permission===undefined) {
                                            return;
                                        }
                                        var permissionTag = permissionCheck(m_set_permission,me.sysId,'print_permission');
                                        if(permissionTag!=1){
                                            Ext.Msg.alert("提示信息 :","无此权限!");
                                            return;
                                        }
                                        showMessageBox(msgTitleWarning,"打印模块未设置！",Ext.Msg.OK,Ext.MessageBox.CANCEL);
                                    }
                                },'-',
                                {
                                    icon:'images/search.gif',
                                    cls:'x-btn-text-icon',
                                    text : '查  询',
                                    listeners:{
                                        render:function(ths){
                                            if(me.querySqlProc==null||me.querySqlProc==""){
                                                ths.disable();
                                            }else{
                                                ths.enable();
                                            }
                                        }
                                    },
                                    handler : function() {
                                        if(m_set_permission===undefined) {
                                            return;
                                        }
                                        var permissionTag = permissionCheck(m_set_permission,me.sysId,'query_permission');
                                        if(permissionTag!=1){
                                            Ext.Msg.alert("提示信息 :","无此权限!");
                                            return;
                                        }else{
                                            new builderSimpleQuery(me.systemdocument ,me.sysId +'viewportcenter' ,'panel',me);
                                        }
                                        //showMessageBox(msgTitleWarning,"查询模块未设置！",Ext.Msg.OK,Ext.MessageBox.CANCEL);
                                    }
                                },'-','->','-','当前记录：',
                                {
                                    id : me.sysId+'location',
                                    xtype   : 'numberfield',
                                    readOnly : true,
                                    width   : 50
                                },' ','记录总数：',
                                {
                                    id : me.sysId+'total',
                                    xtype   : 'numberfield',
                                    readOnly : true,
                                    width   : 50
                                },'-'
                            ]
                        }
                    ]
                });
                me.mainForm = new builderForm (me.systemdocument ,me.sysId+'viewportcenter','panel');
                if(me.hasGrid){
                    me.mainGrid = new builderGrid(me.systemdocument ,me.sysId +'viewportcenter' ,'panel');
                }
                me.mainForm.initDetailObject(me.mainGrid);
                me.initListIndex(listIndexProperty);
/*                if(listIndexProperty!==undefined){
                    me.indexList = new builderIndexList (listIndexProperty.sqlProc ,me.sysId+'_list' ,me.sysId+'viewportwest',me.mainForm);
                }else{
                    Ext.getCmp(me.sysId+'viewportwest').collapse();
                }*/
                if(me.pType == 'tabpanel'){
                    Ext.getCmp(me.pId).add({
                        title: me.systemdocument.sys_document[0].caption ,
                        layout : 'border' ,
                        items:[me.objId]
                    });
                }

            }
        }
    );
    return this.objId;
}


builderFrame.prototype.getNewSeriaNum = function(sys_id ,work_time ,seria_num_length ,callback){
    var me = this;
    JbsManager.getSeriaObj(
        me.databaseName,
        sys_id,
        work_time,
        seria_num_length,
        function(data){
            if(data=="{}"||data==""||data==null||data===undefined){
                loadMark(false);
                showMessageBox(msgTitleWarning ,'未能获得有效的单据编号，请重试！' ,Ext.Msg.OK ,Ext.MessageBox.WARNING);
                return;
            }
            var seria_obj = eval('('+data+')');
            var rec = me.mainForm.getRecord();
            //rec.set("document_num" ,seria_obj.document_num);
            //rec.set("seria_num" ,seria_obj.seria_num);
            //rec.set("sys_id",sys_id);
            //rec.set("work_time",me.mainForm.work_time);
            var param = me.sys_id+','+me.work_time+','+seria_obj.document_num+','+sessionId;
            callback(seria_obj.document_num ,seria_obj.seria_num ,rec);
        }
    );
};

builderFrame.prototype.UpdateDataForTempTable = function(document_num ,seria_num ,rec ,callback){
    var me = this;
    JbsManager.insertDataForForm(
        me.databaseName,
        me.mainForm.table.mainTableTemp,
        me.mainGrid!=null?me.mainGrid.table.detailTableTemp:null,
        document_num ,
        seria_num ,
        RecToStr( rec ),
        function(data){
            var resultTag = data.split('|')[0];
            if (resultTag != 'success'){
                //Ext.getCmp(me.objId).getForm().loadRecord( orgRec );
                loadMark(false);
                if(resultTag == 'failure'){
                    Ext.Msg.show({
                        title:msgTitleWarning,
                        msg: '单据未能更新在临时表中，请重试！',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }else{
                    if(resultTag == 'error'){

                        var msg;
                        try{
                            msg = data.split('|')[1];
                        }catch(e){
                            msg = '';
                        }
                        showMessageBox("单据未能更新在临时表中，数据库错误",msg,Ext.Msg.OK,Ext.MessageBox.WARNING);
/*
                        Ext.Msg.show({
                            title:msgTitleError,
                            msg: '数据库异常！',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
*/
                    }
                }
                return;
            }
            rec.set("document_num" ,document_num);
            rec.set("seria_num" ,seria_num);
            Ext.getCmp(me.mainForm.objId).getForm().loadRecord(rec);
            Ext.getCmp(me.mainForm.objId).getForm().updateRecord();
            var param = me.mainForm.sys_id+','+me.mainForm.work_time+','+rec.get("document_num")+','+m_workstation;
            if(me.mainForm.saveAgoProc === undefined || me.mainForm.saveAgoProc == ""){
                //me.saveDataForForm(orgRec ,rec ,_obj);
                callback(rec);
            }else{
                me.saveAgoEvent(
                    param ,
                    rec ,
                    function(_rec){
                        callback(_rec);
                    }
                )
            }
        }
    )
};

builderFrame.prototype.saveDataForFrame = function(rec){
    var me = this;
    var seriaNum = me.mainForm.getSeriaNum();
    JbsManager.saveDataForFrame(
        me.mainForm.databaseName,
        me.mainForm.table.mainTable+","+me.mainForm.table.mainTableTemp,
        me.mainForm.getRecDefine(),
        me.mainGrid!==null?me.mainGrid.table.detailTable+","+me.mainGrid.table.detailTableTemp:null,
        me.mainGrid!==null?me.mainGrid.getRecDefine():null,
        me.mainForm.sys_id,
        me.mainForm.work_time,
        m_workstation,
        me.mainForm.getDocumentNum(),
        me.mainForm.getSeriaNum(),
        function(data){
            var resultTag = data.split('|')[0];
            if (resultTag == 'success'){
                loadMark(false);
                var doc_num = data.split('|')[1];
                if(me.indexList != null){
                    me.indexList.refresh(doc_num);
                }
                me.mainForm.locateForForm(seriaNum);
                Ext.Msg.show({
                    title:msgTitleTip,
                    msg: '单据['+doc_num+']保存成功！',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.QUESTION
                });

            }else{
                loadMark(false);
                Ext.getCmp(me.mainForm.objId).getForm().loadRecord( rec );
                if(resultTag == 'failure'){
                    Ext.Msg.show({
                        title:msgTitleWarning,
                        msg: '单据保存失败，请重试！',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }else{
                    showMessageBox("单据未能更新在临时表中，数据库错误",msg,Ext.Msg.OK,Ext.MessageBox.WARNING);
/*
                    Ext.Msg.show({
                        title:msgTitleError,
                        msg: '数据库异常，请重试！',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
*/
                }
            }
        }
    );
};

builderFrame.prototype.initListIndex = function(listIndexProperty){
    if(listIndexProperty===undefined) return;
    var me = this;
    var listIndexWidth = (listIndexProperty.width===undefined ? 200 : listIndexProperty.width);

    me.listIndexCfg = {
        xtype:'panel',
        id:me.sysId+'viewportwest',
        region:'west',
        title : '单据索引',
        layout:'border',
        resizable : true,
        resizeHandles : 'e',
        collapsible : true,
        collapseMode : 'mini',
        width:listIndexWidth,
        margins:'2 2 2 2',
        tbar :[
            '-',{
                xtype:'textfield',
                flex : 1,
                listeners:{
                    change :function(){

                    }
                }
            },{
                icon:'images/search.gif',
                cls:'x-btn-icon',
                listeners:{
                    render:function(ths){
                    }
                },
                handler : function() {
                    var searchValue = Ext.getCmp(me.sysId+'viewportwest').getDockedItems()[1].getComponent(1).getValue();
                    if(searchValue == '')return;
                    me.indexList.find(searchValue);
                }
            },'-',
            {
                icon:'images/refresh.gif',
                cls:'x-btn-icon',
                handler:function() {
                    if(me.indexList!=null){
                        me.indexList.refresh();
                    }
                }
            }
        ]
    };
    Ext.getCmp(me.sysId+'viewport').add(me.listIndexCfg);
    me.indexList = new builderIndexList (listIndexProperty.sqlProc ,me.sysId+'_list' ,me.sysId+'viewportwest',me.mainForm);
};

builderFrame.prototype.saveAgoEvent = function(param ,rec ,callback){
    var me = this;
    JbsManager.commonEventProc(
        me.mainForm.saveAgoProc,
        param,
        function(data){
            var resultTag = data[0];
            if(resultTag=='success'){
                var result = eval(data[1])[0].result;
                var tag = parseInt(result.split('|')[0]);
                var resultMsg = result.split('|')[1] === undefined ? '' : result.split('|')[1];
                switch(tag){
                    case -1 :
                        callback(rec);
                        break;
                    case 0  :
                        loadMark(false);
                        Ext.Msg.show({
                            title:msgTitleWarning,
                            msg: resultMsg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING});
                        break;
                    case -2 :
                        loadMark(false);
                        Ext.Msg.show({
                            title:msgTitleTip,
                            msg: resultMsg,
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.MessageBox.QUESTION,
                            fn:function(result){
                                if(result == 'yes'){
                                    loadMark(true);
                                    callback(rec);
                                }
                            }
                        });
                        break;
                }
            }else{
                //Ext.getCmp(me.objId).getForm().loadRecord( orgRec );
                loadMark(false);
                if(resultTag == 'error'){
                    Ext.Msg.show({
                        title:'存盘处理程序执行失败，请重试',
                        msg: data[0],
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }else{
                    Ext.Msg.show({
                        title:msgTitleError,
                        msg: '其他错误，请重试！',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        }
    );
};

builderFrame.prototype.newProcess = function(){
    var me = this;
    loadMark(true);
    JbsManager.newDataForFrame(
        me.databaseName,
        me.mainForm.table.mainTableTemp,
        me.mainGrid != null ? me.mainGrid.table.detailTableTemp : null,
        me.sysId,
        m_workstation,
        function(data){
            var result = data.split('|');
            if(result[0]=="success"){
                me.mainForm.newRecord();
                if(me.mainGrid!=null){
                    me.mainGrid.locateForGrid("0");
                }
                loadMark(false);
                JbsManager.getLocationForModel(
                    me.mainForm.databaseName ,
                    me.mainForm.table.mainTableView ,
                    me.mainForm.sys_id ,
                    me.mainForm.work_time ,
                    '-1',
                    function(data){
                        var resultTag = data.split('|')[0];
                        if(resultTag=='success'){
                            if(Ext.getCmp(me.mainForm.sys_id+'location')!==undefined){
                                Ext.getCmp(me.mainForm.sys_id+'location').setValue(data.split('|')[1].split(',')[0]);
                            }
                            if(Ext.getCmp(me.mainForm.sys_id+'total')!==undefined){
                                Ext.getCmp(me.mainForm.sys_id+'total').setValue(data.split('|')[1].split(',')[1]);
                            }
                        }
                    }
                );

            }else{
                loadMark(false);
                if(result[0]=='failure'){
                    showMessageBox(msgTitleError,"新建单据初始化失败!",Ext.Msg.OK,Ext.MessageBox.WARNING);
                }else{
                    if(result[0]=='error'){
                        showMessageBox("新建单据初始化失败,数据库错误",result[1],Ext.Msg.OK,Ext.MessageBox.ERROR);
                    }
                    //showMessageBox(msgTitleError,"新建单据初始化失败,数据库错误!",Ext.Msg.OK,Ext.MessageBox.WARNING);
                }
            }
        }
    )
};

builderFrame.prototype.deleteProcess = function(){
    var me = this;
    var rec = me.mainForm.getRecord();
    var seria_num = rec.get('seria_num');
    var document_num = rec.get('document_num');
    loadMark(true);
    JbsManager.deleteDataForFrame(
        me.databaseName,
        me.mainForm.table.mainTable,
        me.mainGrid != null ? me.mainGrid.table.detailTable : null,
        document_num,
        function(data){
            loadMark(false);
            var resultTag = data.split('|')[0];
            if (resultTag != 'success'){
                if(resultTag == 'failure'){
                    Ext.Msg.show({
                        title:msgTitleWarning,
                        msg: '单据删除失败，请重试！',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }else{
                    Ext.Msg.show({
                        title:msgTitleError,
                        msg: '数据库异常，请重试！',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
                return;
            }else{
                var doc_num = data.split('|')[1];
                Ext.Msg.show({
                    title:msgTitleTip,
                    msg: '单据['+doc_num+']删除成功！',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.QUESTION
                });
            }
            me.mainForm.prevForForm(me.mainForm.table.mainTable ,seria_num ,"");
            if( me.indexList !== undefined && me.indexList != null ){
                me.indexList.refresh();
            }
        }
    );
};

builderFrame.prototype.modifyProcess = function(){
    loadMark(true);
    var me = this;
    JbsManager.loadDataToTableTemp(
        me.mainForm.databaseName,
        me.mainForm.table.mainTable+","+me.mainForm.table.mainTableTemp,
        me.mainForm.getRecDefine(),
        me.mainGrid!==null?me.mainGrid.table.detailTable+","+me.mainGrid.table.detailTableTemp:null,
        me.mainGrid!==null?me.mainGrid.getRecDefine():null,
        me.mainForm.getDocumentNum(),
        me.mainForm.getSeriaNum(),
        m_workstation,
        function(data){
            var result = data.split('|');
            if(result[0]=='success'){
                me.mainForm.setFormStatus(1);
                loadMark(false);
            }else{
                loadMark(false);
                if(result[0]=='failure'){
                    showMessageBox(msgTitleError,"单据["+result[1]+"]无法加载失败!",Ext.Msg.OK,Ext.MessageBox.WARNING);
                }else{
                    if(result[0] == 'error'){
                        showMessageBox(数据库错误,result[1],Ext.Msg.OK,Ext.MessageBox.WARNING);
                    }else{
                        showMessageBox(msgTitleError,"单据["+result[1]+"]无法加载失败,数据库错误!",Ext.Msg.OK,Ext.MessageBox.WARNING);
                    }
                    //showMessageBox(msgTitleError,"单据["+result[1]+"]无法加载失败,数据库错误!",Ext.Msg.OK,Ext.MessageBox.WARNING);
                }
            }
        }
    );
};

builderFrame.prototype.SaveProcess = function(){
    var me = this;
    if(me.mainForm.formStatus==0)return;
    loadMark(true);
    var rec = me.mainForm.getRecord();
    var document_num = rec.get("document_num");
    if(document_num==""){
        me.getNewSeriaNum(
            me.mainForm.sys_id ,
            me.mainForm.work_time ,
            me.mainForm.seria_num_length ,
            function(_document_num ,_seria_num ,_rec){
                JbsManager.checkSeriaNumForFrame(
                    me.databaseName,
                    me.mainForm.table.mainTable,
                    me.mainGrid!==null?me.mainGrid.table.detailTable:null,
                    me.mainForm.sys_id,
                    me.mainForm.work_time,
                    _seria_num,
                    _document_num,
                    function(data){
                        var resultTag = data.split('|')[0];
                        if(resultTag == 'success'){
                            var resultCount = isNaN( parseInt(data.split('|')[1]) ) ? -1 : parseInt(data.split('|')[1]) ;
                            if(resultCount == 0){
                                me.UpdateDataForTempTable(
                                    _document_num,
                                    _seria_num,
                                    _rec,
                                    function(rec){
                                        me.saveDataForFrame(rec);
                                    }
                                );
                            }else{
                                loadMark(false);
                                if(resultCount == -1){
                                    showMessageBox(msgTitleWarning,"单据编号生成错误！",Ext.Msg.OK,Ext.MessageBox.WARNING);
                                }else{
                                    showMessageBox(msgTitleWarning,"单据编号重复，请检查...",Ext.Msg.OK,Ext.MessageBox.WARNING);
                                }
                            }
                        }else{
                            loadMark(false);
                            if(resultTag == 'failure'){
                                showMessageBox(msgTitleWarning,"单据编号生成错误！",Ext.Msg.OK,Ext.MessageBox.WARNING);
                            }else{
                                showMessageBox(msgTitleError,"数据库操作异常，单据编号生成失败！",Ext.Msg.OK,Ext.MessageBox.ERROR);
                            }
                        }
                    }
                );
            }
        );
    }else{
        me.UpdateDataForTempTable(
            rec.get("document_num"),
            rec.get("seria_num"),
            rec,
            function(rec){
                me.saveDataForFrame(rec);
            }
        )
    }
};


