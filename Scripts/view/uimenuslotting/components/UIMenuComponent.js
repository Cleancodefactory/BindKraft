(function() {

    var IUIMenuActivateProcessor = Interface("IUIMenuActivateProcessor");

    function UIMenuComponent() {
        Base.apply(this,arguments);
        this.on("click", this.on_click);
    }
    UIMenuComponent.Inherit(Base, "UIMenuComponent")
        .Implement(IUIControl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .CompatibleTypes(IUIMenuActivateProcessor)
        .Defaults({
            templateName: "bkdevmodule1/menu-itembase"
        });

    UIMenuComponent.prototype.$displayStyle = null; // last known display style
    UIMenuComponent.prototype.init = function() {
        ITemplateSourceImpl.InstantiateTemplate(this);
    }
    UIMenuComponent.prototype.finalinit = function() {
        // TODO This should be base code
        var item = this.get_data();
        if (BaseObject.is(item, "UIMenuItem")) {
            var proc = item.get_processor();
            if (BaseObject.is(proc, "IUIMenuBaseProcessor")) {
                proc.set_component(this);
            }
        }
    }
    
    UIMenuComponent.prototype.visibility = function(v) {
        function _isvisble() {
            var d = window.getComputedStyle(this.root).display;
            return (d != "none");
        }
        var dspl = this.root.style.display;
        if (dspl != "none") {
            this.$displayStyle = dspl;
        }
        if (arguments.length > 0) {
            if (v) {
                this.root.style.display = "";
                if (!_isvisble()) {
                    this.root.style.display = this.$displayStyle || "";
                }
            } else {
                this.root.style.display = this.$displayStyle || "none";
            }
        }
        dspl = window.getComputedStyle(this.root).display;
        return (dspl != "none");
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