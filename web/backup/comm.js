/**
 通用grid组件
 **/
//for CheckColumn
Ext.grid.CheckColumn = function(config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
    init : function(grid) {
        this.grid = grid;
        this.grid.on('render', function() {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown : function(e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var cindex = this.grid.getView().findCellIndex(t);
            var record = this.grid.store.getAt(index);
            var field = this.grid.colModel.getDataIndex(cindex);
            e = {
                grid : this.grid,
                record : record,
                field : field,
                originalValue : record.data[this.dataIndex],
                value : !record.data[this.dataIndex],
                row : index,
                column : cindex,
                cancel : false
            };
            if (this.grid.fireEvent("validateedit", e) !== false && !e.cancel) {
                delete e.cancel;
                record.set(this.dataIndex, !record.data[this.dataIndex]);
                this.grid.fireEvent("afteredit", e);
            }
        }
    },
    renderer : function(v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};

//define '￥'money 's render
function cnMoney(v) {
    v = (Math.round((v - 0) * 100)) / 100;
    v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
    return ('￥ ' + v);
}

function cnSex(s) {
    return s == 1 ? "男性" : ( s == 2 ? "女性" : "未填" );
}

function cmBirthday(s) {
    return s == "1900-01-01" ? "未填" : s;
}

function qCreateColumn(_dataIndex, _header, _width) {
    return createTextColumn(_dataIndex, _header, _dataIndex, _width);
}
/*
//为Grid Row制定行配色方案
grid.getView().getRowClass =
function(record, index) {
    return ( record.data.qrfh == 1 ? (record.data.ddsl > record.data.kdsl ? 'red-row' : (record.data.ddsl < record.data.kdsl ? 'green-row' : '')) : '' );
};

//为Left_Grid Row制定行配色方案
left_grid.getView().getRowClass =
function(record, index) {
    return ( record.data.status == 0 ? 'gray-row' : (record.data.status == 1 ? 'red-row' : '') );
};
*/
var kh_user_id;
var kh_user_name;
var loginOutletId;
var loginOutletName;
var loginUserId;
var loginUserName;
var loginCheckoutDate;
var loginDiscount;
var loginAdjust;
var disableLoginOutlet;
var disableLoginUser;
var sb_loginTime = new Date().format('g:i:s A');
var msgTitleError = "错误：";
var msgTitleTip = "提示：";
var msgTitleWarning = "警告：";

var userPositionOutletRecord = Ext.data.Record.create([{ name : 'outletId' },{ name : 'outletName' },{name : 'tag', type : 'int'},{name : 'enable',type :'int'}]);
var userPositionOutletStore = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({url:"userPositionOutlet.jsp"}),
    reader : new Ext.data.XmlReader({
        record : 'userPositionOutletRecord'
    }, userPositionOutletRecord ),
    listeners : {
    },
    sortInfo : {
        field : 'outletId',
        direction : 'DESC'
    }// 排序信息
});

function formatDate(value) {
    return value ? value.dateFormat('Y-m-d') : '';
}

function formatMonth(value) {
    return value ? value.dateFormat('Y-m') : '';
}

/*
销售查询
门店销售汇总查询
门店销售(折让商品)查询
门店销售分布汇总
门店期初销售与退货查询

商品查询
门店商品库存查询
商品库存分布查询
总部库存查询
门店进销存查询

其他查询
店间调拨查询
盘点差异查询
入库验收差异查询
        */
var queryMenu = new Ext.menu.Menu({
    id : "queryMenu001",
    items: [
        {
            text : "门店销售汇总查询",
            //icon: "images/menu-02.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "03" );
            }
        },
        {
            text : "门店销售(折让商品)查询",
            //icon: "images/menu-02.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "13" );
            }
        },
/*        {
            text : "滞销商品查询",
            //icon: "images/menu-02.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "18" );
            }
        },*/
        {
            text : "门店销售明细查询",
            //icon: "images/menu-02.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "33" );
            }
        },
        {
            text : "门店销售(Vip客户)查询",
            //icon: "images/menu-02.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "23" );
            }
        },
        {
            text : "门店销售分布汇总",
            icon : "images/menu-01.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "15" );
            }
        },
        {
            text : "门店销售数据分析",
            icon: "images/excel.gif",
            handler : function(){
                SAproductTypeTag = 1;
                salesAnalysis_wnd.show();
            }
        },
        {
            text : "门店期初销售与退货查询",
            //icon: "images/menu-02.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "09" );
            }
        },"-",
        {
            text : "门店商品库存查询",
            icon: "images/menu-01.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "04" );
            }
        },
        {
            text : "滞销商品查询",
            icon: "images/menu-01.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "19" );
            }
        },
        {
            text : "商品库存分布查询",
            icon : "images/menu-01.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "14" );
            }
        },
        {
            text : "商品库存分布查询（按业务库位）",
            icon : "images/menu-01.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "17" );
            }
        },
        {
            text : "总部库存查询",
            icon : "images/menu-01.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "01" );
            }
        },
        {
            text : "门店进销存查询",
            icon : "images/menu-01.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "06" );
            }
        },
        {
            text : "商品跟踪查询",
            icon : "images/menu-01.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "50" );
            }
        },'-',
        {
            text : "店间调拨查询",
            //icon: "images/menu-02.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "08" );
            }
        },
        {
            text : "盘点差异查询",
            //icon: "images/menu-03.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "02" );
            }
        },
        {
            text : "入库验收差异查询",
            //icon: "images/menu-03.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "11" );
            }
        },
        {
            text : "入库验收汇总查询",
            //icon: "images/menu-03.gif",
            handler : function(){
                window.open('auth.jsp?loginUserId=' + loginUserId + '&loginOutletId=' + loginOutletId + '&queryNum=' + "16" );
            }
        }
    ]

});

