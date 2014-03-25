/**
 * Created with IntelliJ IDEA.
 * User: Gqy
 * Date: 13-7-15
 * Time: 上午11:46
 * To change this template use File | Settings | File Templates.
 */

//json above
function json2str(obj) {
    var arr = [];
    var fmt = function(s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return (typeof s)=="string" ? '"' + s + '"' : s;
    };
    for (var i in obj){
        arr.push('' + i + ':' + fmt(obj[i]));
    }
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

// 更新状态 0 :
function statusBarInfo(_type ,_str){
    var sb = Ext.getCmp('mainstatusbar');
    switch(_type){
        case 0 :
            sb.setStatus({
                text : '正常',
                iconCls : 'x-status-valid',
                clear : true
            });
            break;
        case 1 :
            sb.setStatus({
                text : _str,
                iconCls : 'x-status-valid',
                clear : true
            });
            break;
        case -1 :
            sb.setStatus({
                text : _str,
                iconCls : 'x-status-error',
                clear : true
            });
            break;
        case 2 :
            sb.showBusy();
            break;
    }
}

//刷新组件配置信息
function updatesModuleDetail(_st ,_id){
    //var st = Ext.getCmp('sys_detailFormStore');
    statusBarInfo(2);
    var _model = _st.model;
    _st.reload({
        params : {
            sessionId	:	'',
            table		:	'',
            sql			:   'select id ,sys_id ,category ,kind ,caption ,xtype ,[property] from sys_document where id = '+_id
        },
        callback : function(_recs,_opt,_success){
            var modulePanle = Ext.getCmp('moduleBCfgPanlex01');
            if(_success){
                statusBarInfo(1,'组件已加载');
                var rec = _recs.length > 0 ? _recs[0] : new _model({});
                var propertyStr = rec.get('property');
                propertyStr = propertyStr == "" || propertyStr === undefined ? "{}" : propertyStr;
                var propObj = eval('('+propertyStr+')');
                rec.set('mainTable',propObj.mainTable);
                rec.set('mainTableTemp',propObj.mainTableTemp);
                rec.set('counterTable',propObj.counterTable);
                rec.set('detailTable',propObj.detailTable);
                rec.set('detailTableTemp',propObj.detailTableTemp);
                rec.set('mainTableView',propObj.mainTableView);
                rec.set('detailTableView',propObj.detailTableView);
                modulePanle.getForm().loadRecord( new sys_LeftGridMod({id : rec.get('id') ,sys_id : rec.get('sys_id') ,caption : rec.get('caption') ,mainTable : rec.get('mainTable') ,mainTableTemp : rec.get('mainTableTemp') ,counterTable : rec.get('counterTable') ,detailTable : rec.get('detailTable') ,detailTableTemp : rec.get('detailTableTemp') ,mainTableView : rec.get('mainTableView') ,detailTableView : rec.get('detailTableView')}) );
                Ext.getCmp('newModuleCfgx01').enable();
                Ext.getCmp('modifyModuleCfgx01').enable();
                Ext.getCmp('confirmModuleCfgx01').disable();
            }else{
                statusBarInfo(-1,'组件加载失败，请重试');
            }
        }
    });
}

