(function() {

    var IUIMenuActivateProcessor = Interface("IUIMenuActivateProcessor");

    function UIMenuComponent() {
        Base.apply(this,arguments);
        this.on("click", this.on_click);
    }
    UIMenuComponent.Inherit(Base, "UIMenuComponent")
        .Implement(IUIControl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .compatibleTypes(IUIMenuActivateProcessor)
        .Defaults({
            templateName: "bkdevmodule1/menu-itembase"
        });
    UIMenuComponent.prototype.init = function() {
        ITemplateSourceImpl.InstantiateTemplate(this);
    }
    UIMenuComponent.prototype.on_click = function(event) {
        var item = this.get_dataContext();   
        if (item != null) { // !!!
            if (BaseObject.is(item.get_processor(), "IUIMenuActivateProcessor")) {
                item.get_processor().onActivate(this, item); // args model is temporary !!!
            } else if (BaseObject.is(item.get_processor(), "Delegate")) {
                // Temporary here
                item.get_processor().invoke(this, item);
            }
        }
    }

})();