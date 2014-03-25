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
var tabpanelObj;

Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';
/*    Ext.create('Ext.Viewport', {
        id : 'basicFramework_viewport',
        layout:'border',
        title:'caption',
        items:[
            {
                region: 'north',
                height : 64,
                bodyCls : 'label_h2',
                html:'<img src="images/title_TxtImg.gif"/>'
            },
            {
                region: 'west',
                width: 20
            },
            {
                region: 'south',
                height: 20
            },
            {
                region: 'east',
                width: 20
            }
        ],
        listeners:{
            render:function(){
                tabpanelObj = new builderTabPanel(databaseName,category,kind,sysId,'basicFramework_viewport');
                grid.initMainTabpanelObj(tabpanelObj);
            }
        }
    });*/
    login_wnd.show();//longin and start
});
