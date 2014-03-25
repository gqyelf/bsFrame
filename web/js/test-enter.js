/**
 * Created by Gqy on 13-12-25.
 */

Ext.require(['*']);
var systemdocument;
/*
var databaseName = m_databaseName;
var category = m_category               //项目标识名
var kind = m_kind                   //模块标识名
var sysId = m_sysId;             //模块系统ID
*/
var m_databasename = m_databaseName;
var m_category = m_category;
var m_kind = m_kind;
var m_sys_id = m_sysId;
var m_set_permission;
var m_set_login_id;


var bw = navigator.appName == 'Microsoft Internet Explorer' ? 'ie' : 'ns';
var login_status = false;
var blongAppVer = "( v.0.10.29a(i) )";
var tabpanelObj;


var mainViewPortCfg = {
    id : 'main_viewport',
    region : 'center',
    layout:'border',
    border : false,
    bbar : moduleDetailStatusBar,
    items:[
        {
            xtype:'tabpanel',
            id : 'moduleTest'+'tabpanel',
            region: 'center',
            enableTabScroll : true,
            activeTab:0,
            autoDestroy : true,
            activeItem:0
        }
    ]
};

Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    Ext.create('Ext.Viewport', {
        id : 'basicFramework_viewport',
        layout:'border',
        title:'caption',
        items:[
            mainViewPortCfg,
            {
                region: 'north',
                height : 0
            },
            {
                region: 'west',
                width: 0
            },
            {
                region: 'south',
                height: 0
            },
            {
                region: 'east',
                width: 0
            }
        ],
        listeners:{
            render:function(){
                JbsManager.loginProcess(
                    m_databasename,
                    m_loginname,
                    Ext.getCmp('login_input_psw').getValue(),
                    function(data) {
                        var _loginName;
                        var _checkoutDate;
                        if(data[0]== 'failure' || data[0] == 'error'){
                            Ext.Msg.alert("提示：","未找到用户信息！");
                        } else {
                            login_status = true;
                            m_set_permission = eval(data[1]);
                            if(m_set_permission.length>0){
                                m_set_login_id = m_set_permission[0].operator_login_id;
                                new builderFrame(m_databasename,m_category,m_kind,m_sys_id,'moduleTest'+'tabpanel','tabpanel');
                            }
                        }
                        return;
                    }
                );
                //grid.initMainTabpanelObj(tabpanelObj);
            }
        }
    });
});

