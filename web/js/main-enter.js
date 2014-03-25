/**

 **/

/*Ext.override(Ext.Element, {
    contains: function() {
        var isXUL = Ext.isGecko ? function(node) {
            return Object.prototype.toString.call(node) == '[object XULElement]';
        } : Ext.emptyFn;

        return function(el) {
            return !this.dom.firstChild || // if this Element has no children, return false immediately
                   !el ||
                   isXUL(el) ? false : Ext.lib.Dom.isAncestor(this.dom, el.dom ? el.dom : el);
        };
    }()
});*/


Ext.require(['*']);
var systemdocument;

var databaseName = m_databaseName;
var category = ""               //项目标识名
var kind = ""                   //模块标识名
var sysId = "test";             //模块系统ID


Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    login_wnd.show();//longin and start
});
