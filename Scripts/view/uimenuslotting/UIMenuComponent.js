(function() {
    function UIMenuComponent() {
        Base.apply(this,arguments);
        this.on("click", this.on_click);
    }
    UIMenuComponent.Inherit(Base, "UIMenuComponent")
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Defaults({
            templateName: "bkdevmodule1/menu-itembase"
        });

    UIMenuComponent.prototype.on_click = function(event) {
        var item = this.get_dataContext();   
        if (item != null) { // !!!
            if (BaseObject.is(item.get_processor(), "Delegate")) {
                item.get_processor().invoke(this, item);
            }
        }
    }

})();