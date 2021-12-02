(function() {
    function UIMenuStripComponent() {
        Base.apply(this,arguments);
        this.on("click", this.on_click);
    }
    UIMenuStripComponent.Inherit(Base, "UIMenuStripComponent")
        .Implement(IUIControl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Defaults({
            templateName: "bkdevmodule1/menu-itemstripbase"
        });
    UIMenuStripComponent.prototype.init = function() {
        ITemplateSourceImpl.InstantiateTemplate(this);
    }
    UIMenuStripComponent.prototype.on_click = function(event) {
        var item = this.get_dataContext();   
        if (item != null) { // !!!
            // This should be nothing or rather show/hide of the slot inside
            if (BaseObject.is(item.get_processor(), "Delegate")) {
                item.get_processor().invoke(this, item);
            }
        }
    }

})();