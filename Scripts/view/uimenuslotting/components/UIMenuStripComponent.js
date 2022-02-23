(function() {

    var UIMenuComponentBase = Class("UIMenuComponentBase");
    function UIMenuStripComponent() {
        UIMenuComponentBase.apply(this,arguments);
    }
    UIMenuStripComponent.Inherit(UIMenuComponentBase, "UIMenuStripComponent")
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Defaults({
            templateName: "bkdevmodule1/menu-itemstripbase"
        });

    UIMenuStripComponent.prototype.obliterate = function() {
        Base.prototype.obliterate.apply(this, arguments);
    }
    UIMenuStripComponent.ImplementProperty("slot");
    UIMenuStripComponent.prototype.init = function() {
        ITemplateSourceImpl.InstantiateTemplate(this);
    }
    

    UIMenuStripComponent.prototype.on_click = function(event) {
        var item = this.get_data(); 
        if (BaseObject.is(item,"UIMenuItem")) {
            item.set_data("open", !item.get_data("open"));
        }
    }

    UIMenuStripComponent.prototype.on_click_shavidim = function(event) {
        var item = this.get_dataContext();   
        if (item != null) { // !!!
            // This should be nothing or rather show/hide of the slot inside
            if (BaseObject.is(item.get_processor(), "IUIMenuActivateProcessor")) {
                item.get_processor().onActivate(this, item); // args model is temporary !!!
            } else if (BaseObject.is(item.get_processor(), "Delegate")) {
                // Temporary here
                item.get_processor().invoke(this, item);
            }
        }
    }

})();