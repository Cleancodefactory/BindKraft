(function() {
    function UIMenuStripComponent() {
        Base.apply(this,arguments);
    }
    UIMenuStripComponent.Inherit(Base, "UIMenuStripComponent")
        .Implement(IUIControl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Defaults({
            templateName: "bkdevmodule1/menu-itemstripbase"
        });

    UIMenuStripComponent.prototype.obliterate = function() {
        // TODO This should be base code
        var item = this.get_data();
        if (BaseObject.is(item, "UIMenuItem")) {
            var proc = item.get_processor();
            if (BaseObject.is(proc, "IUIMenuBaseProcessor")) {
                proc.set_component(null);
            }
        }
        Base.prototype.obliterate.apply(this, arguments);
    }
    UIMenuStripComponent.ImplementProperty("slot");
    UIMenuStripComponent.prototype.init = function() {
        ITemplateSourceImpl.InstantiateTemplate(this);
    }
    UIMenuStripComponent.prototype.finalinit = function() {
        // TODO This should be base code
        var item = this.get_data();
        if (BaseObject.is(item, "UIMenuItem")) {
            var proc = item.get_processor();
            if (BaseObject.is(proc, "IUIMenuBaseProcessor")) {
                proc.set_component(this);
            }
        }
    }
    UIMenuStripComponent.prototype.visibility = function(v) {
        if (this.__obliterated) return;
        var _isvisble = (function () {
            var d = window.getComputedStyle(this.root).display;
            return (d != "none");
        }).bind(this);
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
                this.root.style.display = "none";
            }
        }
        dspl = window.getComputedStyle(this.root).display;
        return (dspl != "none");
    }


    UIMenuStripComponent.prototype.on_click = function(event) {
        var item = this.get_dataContext();   
        if (this.get_slot() != null) {
            this.get_slot().toggleVisibility();
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