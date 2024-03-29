(function() {

    var IUIMenuActivateProcessor = Interface("IUIMenuActivateProcessor");

    function UIMenuComponentBase() {
        Base.apply(this,arguments);
    }
    UIMenuComponentBase.Inherit(Base, "UIMenuComponentBase")
        .Implement(IUIControl)
        .Implement(IInvocationWithArrayArgs)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .CompatibleTypes(IUIMenuActivateProcessor)
        .Defaults({
            templateName: "bkdevmodule1/menu-itembase"
        });

    UIMenuComponentBase.prototype.obliterate = function() {
        var item = this.get_data();
        if (BaseObject.is(item, "UIMenuItem")) {
            item.changed.remove(this);
        }
        Base.prototype.obliterate.apply(this,arguments);
    }
    UIMenuComponentBase.prototype.menuItem = function() {
        var item = this.get_data();
        if (BaseObject.is(item, "UIMenuItem")) {
            return item;
        }
        return null;
    }

    UIMenuComponentBase.prototype.init = function() {
        ITemplateSourceImpl.InstantiateTemplate(this);
    }
    UIMenuComponentBase.prototype.finalinit = function() {
        // TODO This should be base code
        var item = this.get_data();
        if (BaseObject.is(item, "UIMenuItem")) {
            item.changed.add(this);
            this.updateVisibility();
        }
    }
    //#region IInvocationWithArrayArgs
    UIMenuComponentBase.prototype.invokeWithArgsArray = function() {
        this.OnMenuItemChanged();
    }

    // override
    UIMenuComponentBase.prototype.OnMenuItemChanged = function() {
        this.updateTargets();
        this.updateVisibility();
    }
    
    //#endregion

    UIMenuComponentBase.prototype.$displayStyle = null; // last known display style
    UIMenuComponentBase.prototype.updateVisibility = function() {
        var mi = this.menuItem();
        if (mi.get_data("hide")) {
            this.$visibility(false);
        } else {
            this.$visibility(true);
        }
    }
    UIMenuComponentBase.prototype.$visibility = function(v) {
        var me = this;
        function _isvisble() {
            var d = window.getComputedStyle(me.root).display;
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

    //#region Helpers for random stuff

    UIMenuComponentBase.prototype.packKeyboardEventData = function(ke) { 
        if (ke.originalEvent) {
            ke = ke.originalEvent;
        }
        if (ke instanceof KeyboardEvent) {
            var keydata = {
                shift: ke.shiftKey,
                alt: ke.altKey,
                meta: ke.metaKey,
                ctrl: ke.ctrlKey,
                // TODO handle browsers that have no key
                key: ke.key // string representation
            };
            return keydata;
        } else {
            return null;
        }
    }
    UIMenuComponentBase.prototype.packInputSelectionData = function(field) { 
        if (field instanceof HTMLInputElement) {
            var sel = {
                start: field.selectionStart,
                end: field.selectionEnd,
                direction: field.selectionDirection,
                collapsed: field.selectionStart == field.selectionEnd
            };
            return sel;
        } else {
            return null;
        }
    }

    //#endregion

    

})();