var msgTitleError = "错误：";
var msgTitleTip = "提示：";
var msgTitleWarning = "警告：";

var m_loadMark = null;

function showMessageBox(titleMsg ,msgContent ,buttonType ,messageBoxIcon ,callback){
    Ext.Msg.show({
        title: titleMsg,
        msg: msgContent,
        buttons: buttonType,
        icon: messageBoxIcon
    });

}

function loadMark(_status){
    if(m_loadMark==null){
        m_loadMark = new Ext.LoadMask(Ext.getCmp('main_viewport'), {msg:"正在读取数据,请稍等..."});
    }
    if(_status){
        m_loadMark.show();
    }else{
        m_loadMark.hide();
    }
}
function formatNumber(number,bit){
    var str = number.toString();
    var zeroStream = "0000000000";
    if(str.length<bit&&(bit-str.length)<=10){
        return zeroStream.substr(0,bit-str.length)+str;
    }
    return str
}

Date.prototype.formatDate = function(style){
    if(style == 'y-m'){
        return formatNumber(this.getFullYear(),4)+"-"+formatNumber(this.getMonth()+1,2);
    }
    if(style == 'y'){
        return formatNumber(this.getFullYear(),4);
    }
    if(style == 'm'){
        formatNumber(this.getMonth()+1,2);
    }
    return formatNumber(this.getFullYear(),4)+"-"+formatNumber(this.getMonth()+1,2)+"-"+formatNumber(this.getDate(),2);
};

var m_operator = '007';
var m_workstation = sessionId;
var m_worktime = (new Date()).formatDate('y-m');

function formatDate(value) {
    return value ? value.dateFormat('Y-m-d') : '';
}

function json2str(obj) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in obj) if(i=='name'||i=='defaultValue'||i=='type'){arr.push('"' + i + '":' + fmt(obj[i]));}
    return '{' + arr.join(',') + '}';
}

function json2str3(obj) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number|boolean)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in obj) if(i=='name'||i=='value'||i=='type'||i=='saveable'){arr.push('"' + i + '":' + fmt(obj[i]));}
    return '{' + arr.join(',') + '}';
}

function json2str2(obj) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in obj) if(i=='name'||i=='defaultValue'){arr.push('"' + i + '":' + fmt(obj[i]));}
    return '{' + arr.join(',') + '}';
}

function jsonToStr(obj){
    var jsontemp='';
    for( var i = 0 ;i < obj.getFields().length ;++i ){
        if( i<(obj.getFields().length-1) ){
            jsontemp=jsontemp+json2str2(obj.getFields()[i])+',';
        }else{
            jsontemp=jsontemp+json2str2(obj.getFields()[i]);
        }
    }
    return jsontemp;
}

function RecToStr(rec){
    var jsontemp='';
    //tmprec.getProxy().model.getFields()[0]
    var obj = rec.getProxy().model;
    for( var i = 0 ;i < obj.getFields().length ;++i ){
        var field = eval( '(' + json2str3(obj.getFields()[i]) + ')' );
        field.value = rec.get(field.name);
        if( i<(obj.getFields().length-1) ){
            jsontemp=jsontemp+json2str3(field)+',';
        }else{
            jsontemp=jsontemp+json2str3(field);
        }
    }
    return jsontemp;
}

function fieldsToStr(fields){
    var jsontemp = "";
    for( var i = 0 ; i< fields.length ;++i ){
        jsontemp = jsontemp + json2str(fields[i]);
        if((i+1)<fields.length){
            jsontemp = jsontemp + ",";
        }
    }
    return jsontemp;
}


function GetRecDefine(rec ,isTemp){
    var jsontemp='';
    //tmprec.getProxy().model.getFields()[0]
    var obj = rec.getProxy().model;
    for( var i = 0 ;i < obj.getFields().length ;++i ){
        var field = eval( '(' + json2str3(obj.getFields()[i]) + ')' );
        if( field.saveable== "0"||field.name == 'id'||(isTemp) )continue;
        field.value = rec.get(field.name);
        if( i<(obj.getFields().length-1) ){
            jsontemp=jsontemp+json2str3(field)+',';
        }else{
            jsontemp=jsontemp+json2str3(field);
        }
    }
    return jsontemp;
}

function permissionCheck(permission ,sys_id ,key){
    for(var i = 0 ; i<permission.length ;++i){
        if(permission[i].model_sys_id==sys_id){
            var temp = permission[i];
            return parseInt(eval('temp.'+key));
        }
    }
    return -1;
}
/*

function json2str(obj) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in obj) if(i=='name'||i=='defaultValue'||i=='type'){arr.push('"' + i + '":' + fmt(obj[i]));}
    return '{' + arr.join(',') + '}';
}

function json2str3(obj) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in obj) if(i=='name'||i=='value'||i=='type'){arr.push('"' + i + '":' + fmt(obj[i]));}
    return '{' + arr.join(',') + '}';
}

function json2str2(obj) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    };
    for (var i in obj) if(i=='name'||i=='defaultValue'){arr.push('"' + i + '":' + fmt(obj[i]));}
    return '{' + arr.join(',') + '}';
}

function jsonToStr(obj){
    var jsontemp='';
    for( var i = 0 ;i < obj.getFields().length ;++i ){
        if( i<(obj.getFields().length-1) ){
            jsontemp=jsontemp+json2str2(obj.getFields()[i])+',';
        }else{
            jsontemp=jsontemp+json2str2(obj.getFields()[i]);
        }
    }
    return jsontemp;
}

function RecToStr(rec){
    var jsontemp='';
    //tmprec.getProxy().model.getFields()[0]
    var obj = rec.getProxy().model;
    for( var i = 0 ;i < obj.getFields().length ;++i ){
        var field = eval( '(' + json2str3(obj.getFields()[i]) + ')' );
        field.value = rec.get(field.name);
        if( i<(obj.getFields().length-1) ){
            jsontemp=jsontemp+json2str3(field)+',';
        }else{
            jsontemp=jsontemp+json2str3(field);
        }
    }
    return jsontemp;
}
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
    var recArray = [];
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
/*
Object.prototype.getKV = function(key){
    var me = this;
    var result = eval('me.'+key);
    if(result === undefined){
        result = null;
    }
    return result;
};*/


function RecordToString(rec){
    var fieldsCount = rec.fields.getCount();
    var recArray = [];
    for(var i = 0 ; i<fieldsCount ; ++i){
        var fieldName = rec.fields.get(i).name;
        if(fieldName=='id') continue;
        recArray.push(rec.get(fieldName));
    }
    return recArray.toString();
}
