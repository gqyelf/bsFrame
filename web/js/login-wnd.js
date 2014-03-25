/**
 客户登录;密码修改
 **/
var bw = navigator.appName == 'Microsoft Internet Explorer' ? 'ie' : 'ns';
var login_status = false;
var login_log = new Ext.form.Label({id:'login_log',autoWidth:true,text : '正确输入用户名和密码，回车确认。',cls:'label_h1'});
var blongAppVer = "( v.0.10.29a(i) )";
var tabpanelObj;
var m_set_login_id;
var m_set_permission;
var m_set_worktime;

var LoginIPanel = new Ext.FormPanel({
    id: 'LoginI-panel',
    region        : 'center',
    layout        : 'fit',
    border        : false,
    frame        : false,
    waitMsgTarget: true,
    items    : {
        xtype:'tabpanel',
        activeTab:0,
        activeItem:0,
        defaults:{autoHeight:true,bodyStyle:'padding:30px'},
        items:[
            {
                id   : 'login_input',
                title: '用户登录',
                layout:'form',
                defaults:{width:230},
                defaultType:'textfield',
                items:[
                    {
                        id:'login_input_userid',
                        fieldLabel:'用户代码',
                        selectOnFocus : true,
                        name:'user_id',
                        listeners:{
                            render : function(ths){
                                console.log("render ok"+ths.name);
                            },
                            show : function(ths){
                                console.log("show ok"+ths.name);
                            },
                            change : function( ths, newValue, oldValue ){

                            },
                            specialkey : function( field,e ){
                                if( e.getKey() == e.ENTER ){
                                    if(Ext.getCmp("login_input_userid").getValue()==""){
                                        login_log.setText("用户名不能为空！");
                                        Ext.getCmp("login_input_userid").focus(true);
                                    }else{
                                        Ext.getCmp("login_input_psw").focus(true);
                                    }
                                    //var form = field.up('form').getForm();
                                    //form.submit();
                                }
                            }
                        }
                    },
                    {
                        id:'login_input_psw',
                        fieldLabel:'用户密码',
                        inputType:'password',
                        selectOnFocus : true,
                        name:'user_pw',
                        listeners:{
                            change : function( ths, newValue, oldValue ){

                            },
                            specialkey : function( field,e ){
                                if( e.getKey() == e.ENTER ){
                                    if(Ext.getCmp("login_input_userid").getValue()==""){
                                        login_log.setText("用户名不能为空！");
                                        Ext.getCmp("login_input_userid").focus(true);
                                    }
                                    Ext.getCmp("login_input_worktime").focus(true);
                                    //var form = field.up('form').getForm();
                                    //form.submit();
                                }
                            }
                        }
                    },
                    {
                        id:'login_input_worktime',
                        xtype: 'monthfield',
                        name: 'user_work_time',
                        fieldLabel: '工作年月',
                        value : '2013-10',
                        format: 'Y-m',
                        listeners:{
                            change : function( ths, newValue, oldValue ){

                            },
                            specialkey : function( field,e ){
                                if( e.getKey() == e.ENTER ){
                                    Ext.getCmp("loginwnd_ok").focus(true);
                                    //var form = field.up('form').getForm();
                                    //form.submit();
                                }
                            }
                        }

                    },
                    login_log
                ]
            },
            {
                id   : 'modify_psw',
                title: '密码修改',
                layout:'form',
                disabled: true,
                defaults:{width:230},
                defaultType:'textfield',
                items:[
                    {
                        fieldLabel:'用户代码',
                        name:'c_user_id',
                        readOnly: true,
                        disabled: false
                    },
                    {
                        id:'new_psw',
                        fieldLabel:'新密码',
                        selectOnFocus : true,
                        inputType:'password',
                        name:'new_psw'
                    },
                    {
                        id:'new_psw_cfrm',
                        fieldLabel:'新密码（确认）',
                        inputType:'password',
                        vtype:'password',
                        initialPassField:'new_psw',
                        name:'new_psw_cfrm'
                    }
                ]
            }
        ],
        listeners:{
            render : function(ths){
                console.log("render ok"+ths.id);
            },
            show : function(ths){
                console.log("show ok"+ths.id);
            },
            tabchange:function(t, p) {
                if (p.getId() == 'login_input') {
                    Ext.getCmp('loginwnd_ok').setText('登 录');
                } else {
                    Ext.getCmp('loginwnd_ok').setText('修 改');
                    Ext.getCmp('new_psw').setValue('');
                    Ext.getCmp('new_psw_cfrm').setValue('');
                    Ext.getCmp('new_psw').focus(false);
                }
                Ext.getCmp('new_psw').setValue('');
                Ext.getCmp('new_psw_cfrm').setValue('');
            }
        }
    }
});

var login_wnd_cfg = {
    id            : 'login_wnd',
    title        : '管理系统'+ blongAppVer +'系统登录',
    layout      : 'border',
    width       : 450,
    height      : 350,
    resizable     : false,
    draggable    : false,
    closable    : false,
    closeAction : 'hide',
    plain       : true,
    listeners:{
        render : function(ths){
            console.log("render ok"+ths.id);
        },
        show : function(ths){
            Ext.getCmp('login_input_userid').focus();
            console.log("show ok"+ths.id);
        },
        hide :    function(ts){
            //Ext.Msg.alert(msgTitleTip ,"您登陆的门店已撤柜！");
            //if(disableLoginOutlet == 1){Ext.Msg.alert(msgTitleTip ,"您登陆的门店已撤柜！");}
        }
    },
    items : [
        {
            id:'login_img',
            xtype:'panel',
            region: 'north',
            border:false,
            autoWidth:true,
            height: 100,
            html:'<img src="images/login_pic.png"/>'
        },
        LoginIPanel
    ],
    buttons : [
        {
            id    : 'loginwnd_ok',
            text: '登 录',
            handler: function() {
                if (Ext.getCmp('loginwnd_ok').getText() == '登 录') {
                    if (login_status == false) {
                        if (Ext.getCmp('login_input_userid').getValue() != '' ) {
                            Ext.getCmp('loginwnd_ok').disable();
                            Ext.getCmp('loginwnd_cancel').disable();
                            LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText('正在校验用户是否合法,请稍等...');
                            LoginIPanel.getComponent(0).getComponent(0).getComponent(0).disable();
                            LoginIPanel.getComponent(0).getComponent(0).getComponent(1).disable();
                            LoginIPanel.getComponent(0).getComponent(0).getComponent(2).disable();
                            JbsManager.loginProcess(
                                "demo",
                                Ext.getCmp('login_input_userid').getValue(),
                                Ext.getCmp('login_input_psw').getValue(),
                                function(data) {
                                    var _loginName;
                                    var _checkoutDate;
                                    if(data[0]== 'failure' || data[0] == 'error'){
                                        login_status = false;
                                        if(data[0]== 'failure'){
                                            LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText('不存在的用户代码');
                                        }else{
                                            LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText('错误：'+data[0]);
                                        }
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(0).enable();
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(1).enable();
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(2).enable();
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(1).setValue('');
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(1).focus(false);
                                        LoginIPanel.getComponent(0).getComponent(1).disable();
                                    } else {
                                        login_status = true;
                                        m_set_permission = eval(data[1]);
                                        if(m_set_permission.length>0){
                                            m_set_login_id = m_set_permission[0].operator_login_id;
                                        }
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText(_loginName);
                                        LoginIPanel.getComponent(0).getComponent(1).getComponent(0).setValue(LoginIPanel.getComponent(0).getComponent(0).getComponent(0).getValue());
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(0).disable();
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(1).disable();
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(2).disable();
                                        LoginIPanel.getComponent(0).getComponent(1).enable();
                                    }
                                    Ext.getCmp('loginwnd_ok').enable();
                                    Ext.getCmp('loginwnd_cancel').enable();
                                    if (login_status){
                                        Ext.getCmp('loginwnd_ok').disable();
                                        Ext.getCmp('loginwnd_cancel').disable();
                                        Ext.getCmp('login_wnd').hide();
                                        new basicFramework(databaseName,category,kind,"BFW");
                                    }
                                    return;
                                }
                            )
                        } else {
                            Ext.Msg.alert('错误：', '请输入正确的用户代码。');
                            return;
                        }
                    } else {
                        Ext.getCmp('loginwnd_ok').disable();
                        Ext.getCmp('loginwnd_cancel').disable();
                        userPositionOutletStore.load(
                            {   params :{userId : LoginIPanel.getComponent(0).getComponent(0).getComponent(0).getValue()},
                                callback:function(rec, options, success) {
                                    if(success == false ){
                                        //Initmod14Panel(null);
                                        //Initmod15Panel(null);
                                    }else{
                                        //Initmod14Panel(rec);
                                        //Initmod15Panel(rec);
                                    }
                                    Ext.getCmp('login_wnd').hide();
                                    new basicFramework(databaseName,category,kind,"BFW");
                                }
                            });
                    }
                } else {
                    modify_login_psw();
                }
            }
        },
        {
            id  : 'loginwnd_cancel',
            text: '注 销',
            handler: function() {

            }
        }
    ]
};
var login_wnd = new Ext.Window(login_wnd_cfg);
