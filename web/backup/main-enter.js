/**

 **/

Ext.override(Ext.Element, {
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
});

Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
    login_wnd.show();//longin and start
});


//----------------------------------------------------

