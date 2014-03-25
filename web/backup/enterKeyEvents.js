/*
_baseParam:object{}
*/
function baseParam(_wm ,_ws ,_op){
    this.workMonth = _wm;
    this.workstation = _ws;
    this.operator = _op;
}
baseParam.prototype.getArray = function(){
    var array = new Array();
    array.push(this.workMonth);
    array.push(this.workstation);
    array.push(this.operator);
    return array;
};

function recordForColumnToArray(_record ,_column ,_indexStr){
    var recArray = new Array();
    if(_indexStr === undefined || _indexStr == ""){
        return recArray;
    }
    var indexArray = _indexStr.split(',');
    for(var i = 0 ; i < indexArray.length ;++i){
        recArray.push(_record.get(_column[parseInt(indexArray[i])].dataIndex));
    }
    return recArray;
}

function arrayToString(_array){
    var str = "";
    for(var i = 0 ; i<_array.length ; ++i){
        str = str + _array[i] + ",";
    }
    return str.substring(0,str.length-1);
}

function enterKeyEvents ( _obj ,_field ,_sqlProc ,_baseParam ,_value ,_extendParam1 ,_extendParam2 ,_row ,_column ){
    /*
    初始化 obj
    **/
    var objColumns = _obj.colMArray;
    var objId = _obj.objId;
    var rec = Ext.getCmp(objId).getSelectionModel().getSelection()[0];
    var cellColumn = objColumns[Ext.getCmp(objId).getSelectionModel().getCurrentPosition( ).column].dataIndex;
    var resultAssign = objColumns[Ext.getCmp(objId).getSelectionModel().getCurrentPosition( ).column].resultAssign;
    var parentObj = _obj;
    var elId = _field.ownerCt.boundEl.id;
    if(_sqlProc == '' || _sqlProc === undefined){
        rec.set(cellColumn,_value);
        Ext.getCmp(objId).getPlugin().startEditByPosition(_obj.getNextEditCellPosition(Ext.getCmp(objId) ,Ext.getCmp(objId).getSelectionModel().getCurrentPosition() ,_field ));
        parentObj.updateRecord(rec);
        return;
    }
    rec.set(cellColumn,_value);
    JbsManager.enterKeyEvents(
        _sqlProc ,
        arrayToString(_baseParam.getArray()) ,
        _value,
        _extendParam1 ,
        _extendParam2 ,
        _row ,
        _column ,
        function(data){
            if(data[0]=='success'){
                var returnValue = data[1].split('|')[0];
                var msgTitle = data[1].split('|')[1]===undefined ? "提示" : data[1].split('|')[1];
                var message = data[1].split('|')[2]===undefined ? "" : data[1].split('|')[2];
                //Ext.Msg.alert("返回值:",data[1]);
                //0:表示提示不通过;-1:表示通过;-2:表示询问;-3:表示返回列表;-4:表示日期等等;-5:直接存盘移到下一行记录
                var posInside;
                switch(parseInt(data[2])){
                    case 0 :
                            if(message != '' ){
                                Ext.Msg.show({
                                    title:msgTitle,
                                    msg: message,
                                    buttons: Ext.Msg.OK,
                                    fn : function(bt,text,opt){
                                        rec.set(cellColumn,_value);
                                        parentObj.updateRecord(rec);
                                        Ext.getCmp(objId).getPlugin().startEditByPosition(Ext.getCmp(objId).getSelectionModel().getCurrentPosition());
                                    }
                                });
                            }else{
                                rec.set(cellColumn,_value);
                                parentObj.updateRecord(rec);
                                Ext.getCmp(objId).getPlugin().startEditByPosition(Ext.getCmp(objId).getSelectionModel().getCurrentPosition());
                            }
                            break;
                    case -1:
                            if(message != '' ){
                                Ext.Msg.show({
                                    title:msgTitle,
                                    msg: message,
                                    buttons: Ext.Msg.OK,
                                    fn : function(bt,text,opt){
                                        rec.set(cellColumn,returnValue);
                                        Ext.getCmp(objId).getPlugin().startEditByPosition(_obj.getNextEditCellPosition(Ext.getCmp(objId) ,Ext.getCmp(objId).getSelectionModel().getCurrentPosition() ,_field ));
                                    }
                                });
                            }else{
                                rec.set(cellColumn,returnValue);
                                Ext.getCmp(objId).getPlugin().startEditByPosition(_obj.getNextEditCellPosition(Ext.getCmp(objId) ,Ext.getCmp(objId).getSelectionModel().getCurrentPosition() ,_field ));
                            }
                            parentObj.updateRecord(rec);
                            break;
                    case -2: Ext.Msg.show({
                                 title:msgTitle,
                                 msg: message,
                                 buttons: Ext.Msg.YESNO,
                                 fn : function(bt,text,opt){
                                     if(bt=="yes"){
                                         rec.set(cellColumn,returnValue);
                                         parentObj.updateRecord(rec);
                                         Ext.getCmp(objId).getPlugin().startEditByPosition(_obj.getNextEditCellPosition(Ext.getCmp(objId) ,Ext.getCmp(objId).getSelectionModel().getCurrentPosition() ,_field ));
                                     }else{
                                         rec.set(cellColumn,_value);
                                         parentObj.updateRecord(rec);
                                         Ext.getCmp(objId).getPlugin().startEditByPosition(Ext.getCmp(objId).getSelectionModel().getCurrentPosition());
                                     }
                                 }
                             });
                             break;
                    case -3: var wndsize = eval('('+data[3].split('|')[0]+')');
                             var comboSql = data[3].split('|')[2].split('~')[0];
                             var comboType = data[3].split('|')[2].split('~')[1] === undefined ? 'grid' : data[3].split('|')[2].split('~')[1];
                             posInside = _obj.getNextEditCellPosition(Ext.getCmp(objId) ,Ext.getCmp(objId).getSelectionModel().getCurrentPosition() ,_field );
                             var setOpt = data[3].split('|')[1];
                             setOpt = (resultAssign === undefined || resultAssign == '') ? setOpt : resultAssign;
                             if(comboType == 'grid'){
                                 new gridCombo(_obj ,comboSql ,'test00001' ,wndsize ,Ext.getCmp(objId).store ,_row ,objColumns ,setOpt ,posInside ,elId );
                                 break;
                             }
                             if(comboType == 'tree'){
                                 new treegridCombo(_obj ,comboSql ,'test00001' ,wndsize ,Ext.getCmp(objId).store ,_row ,objColumns ,setOpt ,pos ,elId );
                                 break;
                             }
                             break;
                    case -4: posInside = _obj.getNextEditCellPosition(Ext.getCmp(objId) ,Ext.getCmp(objId).getSelectionModel().getCurrentPosition() ,_field );
                             new dateCombo(_obj ,cellColumn ,_field ,elId ,posInside);
                             break;
                    case -5: break;
                }
            }else{
                Ext.Msg.show({
                    title:"系统错误",
                    msg: "无法访问服务器，请稍后再试。",
                    buttons: Ext.Msg.OK,
                    fn : function(bt,text,opt){
                        rec.set(cellColumn,_value);
                        Ext.getCmp(objGridId).getPlugin().startEditByPosition(Ext.getCmp(objGridId).getSelectionModel().getCurrentPosition());
                    }
                });
            }
        }
    );
}

function enterKeyEventsF ( _obj ,_field ,_sqlProc ,_baseParam ,_value ,_extendParam1 ,_extendParam2 ,_row ,_column ){
    var objColumns = _obj.colMArray;
    var objId = _obj.objId;
    var rec = Ext.getCmp(objId).getForm().getRecord();
    var cellColumn = objColumns[_column].dataIndex;
    var resultAssign = objColumns[_column].resultAssign;
    var currentPos = {row:_row ,column:_column};
    var nextPos = _obj.getNextEditCellPosition(Ext.getCmp(objId) ,{row:_row,column:_column} ,_field );
    var elId = _field.getEl();
    if(_sqlProc == '' || _sqlProc === undefined){
        var rec = Ext.getCmp(objId).getForm().getRecord();
        rec.set(cellColumn,_value);
        Ext.getCmp(objId).getForm().loadRecord(rec);
        //Ext.getCmp(objId).getComponent(nextPos.column).focus(true);
        Ext.getCmp(objColumns[nextPos.column].id).focus(true);
/*
        if(objColumns[currentPos.column].position==''){
            Ext.getCmp(objId).getComponent().focus(true);
        }else{
            Ext.getCmp(objId).getComponent(parseInt(objColumns[nextPos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[nextPos.column].position.split(',')[1])-1).getComponent(0).focus(true);
        }
*/
        return;
    }
    JbsManager.enterKeyEvents(
        _sqlProc ,
        arrayToString(_baseParam.getArray()) ,
        _value,
        _extendParam1 ,
        _extendParam2 ,
        _row ,
        _column ,
        function(data){
            if(data[0]=='success'){
                var returnValue = data[1].split('|')[0];
                var msgTitle = data[1].split('|')[1]===undefined ? "提示" : data[1].split('|')[1];
                var message = data[1].split('|')[2]===undefined ? "" : data[1].split('|')[2];
                var pos = nextPos;
                //Ext.Msg.alert("返回值:",data[1]);
                //0:表示提示不通过;-1:表示通过;-2:表示询问;-3:表示返回列表;-4:表示日期等等;-5:直接存盘移到下一行记录
                switch(parseInt(data[2])){
                    case 0 :
                        if(message != '' ){
                            Ext.Msg.show({
                                title:msgTitle,
                                msg: message,
                                buttons: Ext.Msg.OK,
                                fn : function(bt,text,opt){
                                    rec.set(cellColumn,_value);
                                    Ext.getCmp(objId).getForm().loadRecord(rec);
                                    Ext.getCmp(objColumns[currentPos.column].id).focus(true);
/*
                                    if(objColumns[currentPos.column].position==''){
                                        Ext.getCmp(objId).getComponent().focus(true);
                                    }else{
                                        Ext.getCmp(objId).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[1])-1).getComponent(0).focus(true);
                                    }
*/
                                }
                            });
                        }else{
                            rec.set(cellColumn,_value);
                            Ext.getCmp(objId).getForm().loadRecord(rec);
                            //Ext.getCmp(objId).getComponent(currentPos.column).focus(true);
                            Ext.getCmp(objColumns[currentPos.column].id).focus(true);
/*
                            if(objColumns[currentPos.column].position==''){
                                Ext.getCmp(objId).getComponent().focus(true);
                            }else{
                                Ext.getCmp(objId).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[1])-1).getComponent(0).focus(true);
                            }
*/
                        }
                        break;
                    case -1:
                        if(message != '' ){
                            Ext.Msg.show({
                                title:msgTitle,
                                msg: message,
                                buttons: Ext.Msg.OK,
                                fn : function(bt,text,opt){
                                    rec.set(cellColumn,returnValue);
                                    Ext.getCmp(objId).getForm().loadRecord(rec);
                                    //Ext.getCmp(objId).getComponent(pos.column).focus(true);
                                    Ext.getCmp(objColumns[pos.column].id).focus(true);
/*
                                    if(objColumns[pos.column].position==''){
                                        Ext.getCmp(objId).getComponent().focus(true);
                                    }else{
                                        Ext.getCmp(objId).getComponent(parseInt(objColumns[pos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[pos.column].position.split(',')[1])-1).getComponent(0).focus(true);
                                    }
*/
                                }
                            });
                        }else{
                            rec.set(cellColumn,returnValue);
                            Ext.getCmp(objId).getForm().loadRecord(rec);
                            //Ext.getCmp(objId).getComponent(pos.column).focus(true);
                            Ext.getCmp(objColumns[pos.column].id).focus(true);
/*
                            if(objColumns[pos.column].position==''){
                                Ext.getCmp(objId).getComponent().focus(true);
                            }else{
                                Ext.getCmp(objId).getComponent(parseInt(objColumns[pos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[pos.column].position.split(',')[1])-1).getComponent(0).focus(true);
                            }
*/
                        }
                        break;
                    case -2: Ext.Msg.show({
                        title:msgTitle,
                        msg: message,
                        buttons: Ext.Msg.YESNO,
                        fn : function(bt,text,opt){
                            if(bt=="yes"){
                                rec.set(cellColumn,returnValue);
                                Ext.getCmp(objId).getForm().loadRecord(rec);
                                //Ext.getCmp(objId).getComponent(pos.column).focus(true);
                                Ext.getCmp(objColumns[pos.column].id).focus(true);
/*
                                if(objColumns[pos.column].position==''){
                                    Ext.getCmp(objId).getComponent().focus(true);
                                }else{
                                    Ext.getCmp(objId).getComponent(parseInt(objColumns[pos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[pos.column].position.split(',')[1])-1).getComponent(0).focus(true);
                                }
*/
                            }else{
                                rec.set(cellColumn,_value);
                                Ext.getCmp(objId).getForm().loadRecord(rec);
                                //Ext.getCmp(objId).getComponent(currentPos.column).focus(true);
                                Ext.getCmp(objColumns[currentPos.column].id).focus(true);
/*
                                if(objColumns[currentPos.column].position==''){
                                    Ext.getCmp(objId).getComponent().focus(true);
                                }else{
                                    Ext.getCmp(objId).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[1])-1).getComponent(0).focus(true);
                                }
*/
                            }
                            //Ext.getCmp(objGridId).getPlugin().startEditByPosition(pos);
                        }
                    });
                    break;
                    case -3:
                        var wndsize = eval('('+data[3].split('|')[0]+')');
                        var offset;
                        if(objColumns[currentPos.column].position==''){
                            offset = [Ext.getCmp(objId).getComponent(currentPos.column).labelWidth,0];
                        }else{
                            offset = [Ext.getCmp(objId).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[1])-1).getComponent(0).labelWidth,0];
                        }
                        //var nextPos = _obj.getNextEditCellPosition(Ext.getCmp(objId) ,Ext.getCmp(objId).getSelectionModel().getCurrentPosition() ,_field );
                        var comboSql = data[3].split('|')[2].split('~')[0];
                        var comboType = data[3].split('|')[2].split('~')[1] === undefined ? 'grid' : data[3].split('|')[2].split('~')[1];
                        var setOpt = data[3].split('|')[1];
                        setOpt = (resultAssign === undefined || resultAssign == '') ? setOpt : resultAssign;
                        //var gc;
                        if(comboType == 'grid'){
                            new gridCombo(_obj ,comboSql ,'test00001' ,wndsize ,Ext.getCmp(objId).store ,_row ,objColumns ,setOpt ,pos ,elId ,offset);
                            break;
                        }
                        if(comboType == 'tree'){
                            new treegridCombo(_obj ,comboSql ,'test00001' ,wndsize ,Ext.getCmp(objId).store ,_row ,objColumns ,setOpt ,pos ,elId ,offset);
                            break;
                        }
                        break;
                    case -4:
                        var offset;
                        if(objColumns[currentPos.column].position==''){
                            offset = [Ext.getCmp(objId).getComponent(currentPos.column).labelWidth,0];
                        }else{
                            offset = [Ext.getCmp(objId).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[0])-1).getComponent(parseInt(objColumns[currentPos.column].position.split(',')[1])-1).getComponent(0).labelWidth,0];
                        }
                        new dateCombo(_obj ,cellColumn ,_field ,elId ,pos ,offset);
                        break;
                    case -5: break;
                }
            }else{
                Ext.Msg.show({
                    title:"系统错误",
                    msg: "无法访问服务器，请稍后再试。",
                    buttons: Ext.Msg.OK,
                    fn : function(bt,text,opt){
                        rec.set(cellColumn,_value);
                        ///Ext.getCmp(objId).getPlugin().startEditByPosition(Ext.getCmp(objId).getSelectionModel().getCurrentPosition());
                    }
                });
            }
        }
    );
}