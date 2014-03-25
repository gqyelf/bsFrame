/**
 客户登录;密码修改
 **/
var bw = navigator.appName == 'Microsoft Internet Explorer' ? 'ie' : 'ns';
var login_status = false;
var login_log = new Ext.form.Label({id:'login_log',autoWidth:true,text : '正确输入用户名和密码，回车确认。',cls:'label_h1'});
var blongAppVer = "( v.4.01.29a(i) )";

var comboOutlet = Ext.data.Record.create([
    {   name : 'outletId'   },
    {   name : 'outletName' }
]);

var outletComboSt = new Ext.data.Store({
    proxy    : new Ext.data.HttpProxy({url:'outlet_xml.jsp'}),
    reader    : new Ext.data.XmlReader({record  : 'combooutlet'}, comboOutlet),
    sortInfo : {field : 'outletId',direction : 'ASC'},
    listeners:{
        beforeload : function( ts, opt ){
            if( Ext.getCmp('login_input_userid').getValue() == ''){
                return false;
            }else{
                outletComboSt.baseParams = { loginSn : Ext.getCmp('login_input_userid').getValue() };
                return true;
            }
        }
    }
});

var LoginIPanel = new Ext.FormPanel({
    id: 'LoginI-panel',
    region        : 'center',
    layout        : 'fit',
    //	width		: 440,
    //	height		: 230,
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
                            change : function( ts, newValue, oldValue ){
                                Ext.getCmp('login_outlet_combo').reset();
                                outletComboSt.reload();
                            }
                        }
                    },
                    {
                        id:'login_input_psw',
                        fieldLabel:'用户密码',
                        inputType:'password',
                        selectOnFocus : true,
                        name:'user_pw'
                    },
                    {
                        xtype : 'combo',
                        id:'login_outlet_combo',
                        fieldLabel:'门店选择',
                        hiddenName:'outletId',
                        store: outletComboSt,
                        valueField:'outletId',
                        displayField:'outletName',
                        typeAhead : true,
                        disabled : false,
                        editable : false,
                        hide : true,
                        triggerAction : 'all',
                        selectOnFocus : true,
                        minHeight : 80,
                        maxHeight : 150,
                        listeners :{
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
            //					show:function(ts){Ext.Msg.alert('aa','aa');},
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
                /*						Ext.getCmp('login_input_userid').enable();
                 Ext.getCmp('login_input_userid').setText('');
                 Ext.getCmp('login_input_psw').enable();
                 Ext.getCmp('login_input_psw').setText('');
                 Ext.getCmp('login_log').setText('正确输入用户名和密码，回车确认。');
                 login_status = false;*/
            }
        }
    },
    keys:[
        {
            //处理键盘回车事件
            key:Ext.EventObject.ENTER,
            //		delay: 30,
            fn:function(e) {
                if (!Ext.getCmp('login_wnd').isVisible()) {
                    return;
                }
                if (LoginIPanel.getComponent(0).getActiveTab().getId() == 'login_input') {//用户登录标签被激活
                    if (LoginIPanel.getComponent(0).getComponent(0).getComponent(0).getValue() == '') {
                        LoginIPanel.getComponent(0).getComponent(0).getComponent(0).focus(true);
                    } else {
                        if (LoginIPanel.getComponent(0).getComponent(0).getComponent(1).getValue() == '') {
                            LoginIPanel.getComponent(0).getComponent(0).getComponent(1).focus(true);
                        } else {
                            if(LoginIPanel.getComponent(0).getComponent(0).getComponent(2).getValue() == '') {
                                LoginIPanel.getComponent(0).getComponent(0).getComponent(2).focus(true);
                            } else{
                                Ext.getCmp('loginwnd_ok').disable();
                                Ext.getCmp('loginwnd_cancel').disable();
                                LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText('正在校验用户是否合法,请稍等...');
                                LoginIPanel.getComponent(0).getComponent(0).getComponent(0).disable();
                                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).disable();
                                LoginIPanel.getComponent(0).getComponent(0).getComponent(2).disable();
                                JblongDbManager.chkUser(
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(2).getValue(),
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(0).getValue(),
                                        LoginIPanel.getComponent(0).getComponent(0).getComponent(1).getValue(),
                                        function(data) {
                                            var _loginName;
                                            var _checkoutDate;
                                            if (data[0] == 'error') {
                                                login_status = false;
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText('不存在的用户代码或密码错误');
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent(0).enable();
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).enable();
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent(2).enable();
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).setValue('');
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).focus(false);
                                                LoginIPanel.getComponent(0).getComponent(1).disable();
                                            } else {
                                                login_status = true;
                                                _loginName = data[1];
                                                _checkoutDate = data[2];
                                                loginDiscount = parseFloat(data[3]);
                                                loginAdjust = parseFloat(data[4]);
                                                disableLoginUser = parseInt(data[5]);
                                                disableLoginOutlet = parseInt(data[6]);
                                                loginCheckoutDate = new Date();
                                                loginCheckoutDate.setFullYear(_checkoutDate.substr(0,4),_checkoutDate.substr(5,2)-1,_checkoutDate.substr(8,2));
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText(_loginName);
                                                LoginIPanel.getComponent(0).getComponent(1).getComponent(0).setValue(LoginIPanel.getComponent(0).getComponent(0).getComponent(0).getValue());
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent(0).disable();
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).disable();
                                                LoginIPanel.getComponent(0).getComponent(0).getComponent(2).disable();
                                                LoginIPanel.getComponent(0).getComponent(1).enable();
                                            }
                                            Ext.getCmp('loginwnd_ok').enable();
                                            Ext.getCmp('loginwnd_cancel').enable();
                                            if (login_status) Ext.getCmp('loginwnd_ok').focus(true);
                                        }
                                        )
                            }
                        }
                    }
                } else {//密码修改标签被激活
                    if (Ext.getCmp('new_psw').getValue() == '') {
                        Ext.getCmp('new_psw').focus(false);
                    } else {
                        if (Ext.getCmp('new_psw_cfrm').getValue() == '') {
                            Ext.getCmp('new_psw_cfrm').focus(false);
                        } else {
                            if (Ext.getCmp('new_psw').getValue() != '' && Ext.getCmp('new_psw_cfrm').getValue() != '') {
                                modify_login_psw();
                            }else{
                                
                            }
                        }
                    }
                }
            },
            scope:this
        }
    ]
});

function init_app_layout() {
    login_wnd.hide();
    loginUserId = LoginIPanel.getComponent(0).getComponent(0).getComponent(0).getValue();
    loginUserName = LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').text;
    loginOutletName = Ext.getCmp('login_outlet_combo').getRawValue();
    loginOutletId = Ext.getCmp('login_outlet_combo').getValue();
    new Ext.Viewport({
        id : 'main-viewport',
        layout: 'border',
        title: '宝隆零售管理系统',
        items: [
            {
                xtype:'tabpanel',
                id     :'vp_tabpanel_0001',
                region: 'center',
                enableTabScroll : true,
                activeTab:0,
                activeItem:0,
                items:[
                    {
                        title: '<font size="2">【 日门店销售 】</font>',
                        layout:'border',
                        items:[outlet03Panel]
                    },
                    {
                        title: '<font size="2">【 门店销售退货 】</font>',
                        layout:'border',
                        items:[outlet04Panel]
                    },
                    /*{
                        title: '<font size="2">【门店销售汇总查询 】</font>',
                        layout:'border',
                        items:[outlet03QPanel]
                    },
                    {
                        title: '<font size="2">【门店销售(折让商品)查询 】</font>',
                        layout:'border',
                        items:[outlet13QPanel]
                    },
                    {
                        title: '<font size="2">【门店商品库存查询 】</font>',
                        layout:'border',
                        items:[outlet04QPanel]
                    },
                    {
                        title: '<font size="2">【商品库存分布查询 】</font>',
                        layout:'border',
                        disabled : false,
                        items:[outlet14QPanel]
                    },
                    {
                        title: '<font size="2">【门店销售分布汇总 】</font>',
                        layout:'border',
                        disabled : false,
                        items:[outlet15QPanel]
                    },
                    {
                        title: '<font size="2">【门店进销存查询 】</font>',
                        layout:'border',
                        items:[outlet06QPanel]
                    },
                    {
                        title: '<font size="2">【 总部库存查询 】</font>',
                        layout:'border',
                        items:[outlet01QPanel]
                    },*/
                    {
                        title: '<font size="2">【 门店店间调拨 】</font>',
                        layout:'border',
                        disabled : false,
                        items:[outlet07Panel]
                    },
                    {
                        title: '<font size="2">【 门店店间调拨验收 】</font>',
                        layout:'border',
                        disabled : false,
                        items:[outlet08Panel]
                    },
                    /*{
                        title: '<font size="2">【 店间调拨查询 】</font>',
                        layout:'border',
                        disabled : false,
                        items:[outlet08QPanel]
                    },*/
                    {
                        title: '<font size="2">【 门店库存盘点 】</font>',
                        layout:'border',
                        items:[outlet02Panel]
                    },
                    /*{
                        title: '<font size="2">【 盘点差异查询 】</font>',
                        layout:'border',
                        items:[outlet02QPanel]
                    },*/
                    {
                        title:'<font size="2">【 门店入库验收 】</font>',
                        layout:'border',
                        items:[outlet01Panel]
                    },
                    /*{
                        title:'<font size="2">【 入库验收差异查询 】</font>',
                        layout:'border',
                        items:[outlet11QPanel]
                    },*/
                    {
                        title: '<font size="2">【 门店商品退货 】</font>',
                        layout:'border',
                        items:[outlet06Panel]
                    },
                    {
                        title: '<font size="2">【 门店期初销售与退货 】</font>',
                        layout:'border',
                        disabled : true,
                        items:[outlet09Panel]
                    },
                    /*{
                        title: '<font size="2">【 门店期初销售与退货查询 】</font>',
                        layout:'border',
                        disabled : false,
                        items:[outlet09QPanel]
                    },*/
                    {
                        title: '<font size="2">【 门店期初库存 】</font>',
                        layout:'border',
                        disabled : true,
                        items:[outlet05Panel]
                    },
                    {
                        title:'<font size="2">【 Vip客户信息管理 】</font>',
                        layout:'border',
                        items:[optTree,optVipCustomer]
                    }
                ]
            }
        ],
        renderTo: Ext.getBody()
    });
    /*    ChangeLeftGridUrl(kh_user_id, Ext.getCmp('btn_current_month').getText());
     //	status_bar.showBusy();
     opstatus(true);
     store2.load({
     callback : function(r, options, success) {
     if (success == false) {
     Ext.Msg.alert("订购单装载出错", "出错原因:由于网络通信质量或者服务器维护,请稍后重试");
     }
     //						status_bar.clearStatus({useDefaults:true});
     opstatus(false);
     left_grid.getSelectionModel().selectFirstRow(false);
     }
     });*/
}

function testProc(_str) {
    var obj;
    obj =
    [
        { id : _str.indexOf(',') },
        { name : _str.indexOf(',') },
        { data : _str.indexOf(',') }
    ];
    return obj;
}

function modify_login_psw() {
    if (Ext.getCmp('new_psw').getValue() != Ext.getCmp('new_psw_cfrm').getValue() || Ext.getCmp('new_psw').getValue() == '') {
        Ext.getCmp('new_psw').setValue('');
        Ext.getCmp('new_psw_cfrm').setValue('');
        Ext.getCmp('new_psw').focus();
        return;
    }
    LoginIPanel.getEl().mask('修改密码......', 'x-mask-loading');
    Ext.getCmp('loginwnd_ok').disable();
    Ext.getCmp('loginwnd_cancel').disable();
    JblongDbManager.ModifyPsw(Ext.getCmp('login_input_userid').getValue(),
            Ext.getCmp('login_input_psw').getValue(),
            Ext.getCmp('new_psw').getValue(),
            function(data) {
                login_status = false;
                LoginIPanel.getComponent(0).activate(0);
                LoginIPanel.getComponent(0).getComponent(1).disable();
                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).setValue('');
                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).enable();
                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).focus();
                if (data) {
                    LoginIPanel.getComponent(0).getComponent(0).getComponent(3).setText('密码修改成功，请输入新密码，回车确认。');
                } else {
                    LoginIPanel.getComponent(0).getComponent(0).getComponent(3).setText('密码修改失败，请输入密码，回车确认。');
                }
                LoginIPanel.getEl().unmask();
                Ext.getCmp('loginwnd_ok').enable();
                Ext.getCmp('loginwnd_cancel').enable();
            });
}

var login_wnd_cfg = {
    id            : 'login_wnd',
    title        : '宝隆零售管理系统'+ blongAppVer +'系统登录',
    layout      : 'border',
    width       : 450,
    height      : 350,
    resizable     : false,
    draggable    : false,
    closable    : false,
    closeAction : 'hide',
    plain       : true,
    listeners:{
        show :    function(ts) {
            Ext.get('login_input_userid').focus.defer(100, Ext.get('login_input_userid'));
        },
        hide :    function(ts){
            //Ext.Msg.alert(msgTitleTip ,"您登陆的门店已撤柜！");
            if(disableLoginOutlet == 1){Ext.Msg.alert(msgTitleTip ,"您登陆的门店已撤柜！");}
        }
    },
    items        : [
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
    buttons        : [
        {
            id    : 'loginwnd_ok',
            text: '登 录',
            handler: function() {
                if (!Ext.getCmp('login_wnd').isVisible()) {
                    return;
                }
                if (Ext.getCmp('loginwnd_ok').getText() == '登 录') {
                    if (login_status == false) {
                        if (Ext.getCmp('login_input_userid').getValue() != '' && Ext.getCmp('login_input_psw').getValue() != '' && Ext.getCmp('login_outlet_combo').getValue()!='') {
                            Ext.getCmp('loginwnd_ok').disable();
                            Ext.getCmp('loginwnd_cancel').disable();
                            LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText('正在校验用户是否合法,请稍等...');
                            LoginIPanel.getComponent(0).getComponent(0).getComponent(0).disable();
                            LoginIPanel.getComponent(0).getComponent(0).getComponent(1).disable();
                            LoginIPanel.getComponent(0).getComponent(0).getComponent(2).disable();
                            JblongDbManager.chkUser(
                                    LoginIPanel.getComponent(0).getComponent(0).getComponent(2).getValue(),
                                    LoginIPanel.getComponent(0).getComponent(0).getComponent(0).getValue(),
                                    LoginIPanel.getComponent(0).getComponent(0).getComponent(1).getValue(),
                                    function(data) {
                                        var _loginName;
                                        var _checkoutDate;
                                        if (data[0] == 'error') {
                                            login_status = false;
                                            LoginIPanel.getComponent(0).getComponent(0).getComponent('login_log').setText('不存在的用户代码或密码错误');
                                            LoginIPanel.getComponent(0).getComponent(0).getComponent(0).enable();
                                            LoginIPanel.getComponent(0).getComponent(0).getComponent(1).enable();
                                            LoginIPanel.getComponent(0).getComponent(0).getComponent(2).enable();
                                            LoginIPanel.getComponent(0).getComponent(0).getComponent(1).setValue('');
                                            LoginIPanel.getComponent(0).getComponent(0).getComponent(1).focus(false);
                                            LoginIPanel.getComponent(0).getComponent(1).disable();
                                        } else {
                                            login_status = true;
                                            _loginName = data[1];
                                            _checkoutDate = data[2];
                                            loginDiscount = parseFloat(data[3]);
                                            loginAdjust = parseFloat(data[4]);
                                            disableLoginUser = parseInt(data[5]);
                                            disableLoginOutlet = parseInt(data[6]);
                                            loginCheckoutDate = new Date();
                                            loginCheckoutDate.setFullYear(_checkoutDate.substr(0,4),_checkoutDate.substr(5,2)-1,_checkoutDate.substr(8,2));
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
                                                                    init_app_layout();
                                                                }
                                                            });
                                        }
                                        return;
                                    }
                                    )
                        } else {
                            Ext.Msg.alert('错误！', '请输入正确的用户代码和密码，并选择操作的门店。');
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
                                                init_app_layout();
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
                login_status = false;
                LoginIPanel.getComponent(0).activate(0);
                LoginIPanel.getComponent(0).getComponent(1).disable();
                LoginIPanel.getComponent(0).getComponent(0).getComponent(0).setValue('');
                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).setValue('');
                LoginIPanel.getComponent(0).getComponent(0).getComponent(2).reset();
                LoginIPanel.getComponent(0).getComponent(0).getComponent(3).setText('正确输入用户名和密码，回车确认。');
                LoginIPanel.getComponent(0).getComponent(1).getComponent(0).setValue('');
                LoginIPanel.getComponent(0).getComponent(1).getComponent(1).setValue('');
                LoginIPanel.getComponent(0).getComponent(1).getComponent(2).setValue('');
                LoginIPanel.getComponent(0).getComponent(0).getComponent(0).enable();
                LoginIPanel.getComponent(0).getComponent(0).getComponent(1).enable();
                LoginIPanel.getComponent(0).getComponent(0).getComponent(2).enable();
                LoginIPanel.getComponent(0).getComponent(0).getComponent(0).focus();
            }
        }
    ]
};
var login_wnd = new Ext.Window(login_wnd_cfg);
