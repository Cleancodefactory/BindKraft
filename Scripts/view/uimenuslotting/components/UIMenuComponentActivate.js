(function() {

    var IUIMenuActivateProcessor = Interface("IUIMenuActivateProcessor"),
        UIMenuComponentBase = Class("UIMenuComponentBase");;

    function UIMenuComponentActivate() {
        UIMenuComponentBase.apply(this,arguments);
        this.on("click", this.on_click);
    }
    UIMenuComponentActivate.Inherit(UIMenuComponentBase, "UIMenuComponentActivate")
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .CompatibleTypes(IUIMenuActivateProcessor)
        .Defaults({
            templateName: "bkdevmodule1/menu-itembase"
        });

    
    // override
    UIMenuComponentActivate.prototype.OnMenuItemChanged = function() {
        this.updateTargets();
    }

    UIMenuComponentActivate.prototype.on_click = function(event) {
        var item = this.get_data();   
        if (item != null) { // !!!
            if (BaseObject.is(item.get_processor(), "IUIMenuActivateProcessor")) {
                item.get_processor().onActivate(this, item); // args model is temporary !!!
            }
        }
    }

})();