(function(){
    var ViewUtil = Class("ViewUtil"),
        IKeyboardProcessorImpl = InterfaceImplementer("IKeyboardProcessorImpl"),
        ICustomParameterizationStdImpl = InterfaceImplementer("ICustomParameterizationStdImpl"),
        ITemplateSourceImpl = InterfaceImplementer("ITemplateSourceImpl");

    function LookupBoxControl() {
        Base.apply(this,arguments);
    }
    LookupBoxControl.Inherit(Base, "LookupBoxControl")
        .Implement(IUIControl)
        .Implement(IDisablable)
        .Implement(IKeyboardProcessorImpl)
        .Implement(ICustomParameterizationStdImpl, "sourcedata", "identification", "filterbyfield","dropwidth", "dropheight")
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Defaults({
            templateName: "bindkraft/control-combobox"
        });

    LookupBoxControl
        .ImplementProperty("filterbox") // The text box
        .ImplementProperty("droplist") // The drop list - selectable repeater
        .ImplementProperty("droppanel") // The DOM element of the drop panel
        .ImplementProperty("display") // Selection display
        .ImplementProperty("dropwidth", new InitializeNumericParameter("",null))
        .ImplementProperty("dropheight", new InitializeNumericParameter("",null))
        .ImplementActiveProperty("choices", new InitializeArray("Choices for selection"),true) // The drop list - selectable repeater
        .ImplementActiveProperty("selectedobject", new Initialize("the current selection"), true)
        .ImplementProperty("callback", new Initialize("Callback providing choices as objects, can be used together with identification.", null))
        .ImplementProperty("sourcedata", new Initialize("Optional, for use by the callback, the default internal callback expects array with identification property holding strings."), true, function(oval,nval){
            this.$choicesRefresh.windup();
        })
        .ImplementProperty("filterbyfield", new InitializeStringParameter("field by which to filter the items, used by the internal callback and optionally by the user callback", null))
        .ImplementProperty("filter", new InitializeStringParameter("Bound to the text (filter) box, change invokes refresh of choices", null),null, function(oval, nval){
            if (nval != oval) {
                this.$choicesRefresh.windup();
            }
        });

    //#region Events
    LookupBoxControl.prototype.activatedevent = new InitializeEvent("Event fired on user made selection");
    //#endregion

    LookupBoxControl.prototype.get_identification = function() {
        if (this.get_droplist() != null) {
            return this.get_droplist().identification;
        }
    }
    LookupBoxControl.prototype.set_identification = function(v) {
        if (this.get_droplist() != null) {
            this.get_droplist().identification = v;
        } else if (!this.isFullyInitialized()) {
            this.ExecWhenInitialized([v],function(val) {
                if (this.get_droplist() != null) {
                    this.get_droplist().identification = val;
                } else {
                    this.LASTERROR("droplist is not bound while trying to set identification field");
                }
            });
        }
    }

    LookupBoxControl.prototype.$itemTemplate = null;
    
    LookupBoxControl.prototype.init = function () {
        this.$itemTemplate = this.root.innerHTML;
        ITemplateSourceImpl.InstantiateTemplate(this);
    }
    LookupBoxControl.prototype.finalinit = function () {
        if (this.$itemTemplate == null) {
            this.LASTERROR("No template for the drop items. Please specify the template as content of the control element.");
        } else {
            if (this.get_droplist() == null) {
                this.LASTERROR("The template for the control does not bind the drop down list SelectableRepeater to the droplist property.");
            } else {
                this.get_droplist().set_itemTemplate(this.$itemTemplate);
                this.keydataevent.add(new Delegate(this.get_droplist(), this.get_droplist().onKeyObject));
            }
            if (this.get_display() != null) {
                this.get_display().set_template(this.$itemTemplate);
            }
        }
        if (this.get_filterbox() == null) {
            this.LASTERROR("filterbox not bound");
        } else {
            // Anything?
        }
        // Initial state
        this.set_bodyVisible(false);

    }
    //#region Data
    LookupBoxControl.prototype.$choicesRefresh = new InitializeMethodTrigger("Initiates new search", function () { 
        var flt = this.get_filter();
        var op = null;
        var  me = this;
        if (this.get_callback() != null) {
            var cb = this.get_callback();
            if (BaseObject.is(cb, "Delegate")) {
                op = cb.invoke(this, flt);
            } else if (typeof cb == "function") {
                op = cb.call(this, this, flt);
            } else {
                this.LASTERROR("Cannot call the callback, it is nor delegate, nor function");
            }
            if (BaseObject.is(op, "Operation")) {
                op.onsuccess(function(ch) {
                    me.set_choices(ch);
                })
            } else {
                // Use it as a result
                this.set_choices(op);
            }
        } else {
            this.$internalCallback(flt);
        }
    }, 300);
    LookupBoxControl.prototype.$internalCallback = function(flt) {
        if (Array.isArray(this.get_sourcedata())) {

            var ind = this.get_filterbyfield();
            if (ind == null || ind.length == 0) ind = this.get_identification();
            var me = this;
            if (typeof ind == "string") {
                if (flt == null || flt.length == 0) {
                    this.set_choices(me.get_sourcedata());
                } else {
                    this.callAsync(function() {
                        var items = me.get_sourcedata();
                        var ch = items.Select(function(idx, item) {
                            if (item[ind] != null && item[ind].toString().indexOf(flt) >= 0) return item;
                        });
                        this.set_choices(ch);
                    })
                }
            } else {
                this.set_choices(null);    
            }
        } else {
            this.set_choices(null);
        }
    }

    //#endregion

    //#region Show/hide drop list
    LookupBoxControl.prototype.$bodyVisible = false;
    LookupBoxControl.prototype.get_bodyVisible = function () { return this.$bodyVisible; };
    LookupBoxControl.prototype.set_bodyVisible = function (v) {
        if (this.get_disabled()) {
            this.$bodyVisible = false;
        } else {
            this.$bodyVisible = v;
        }
        
        if (this.$bodyVisible) {
            if (this.get_disabled()) {
                // Impossible case, but ...
                DOMUtil.hideElement(this.get_droppanel());
            } else {
                
                DOMUtil.unHideElement(this.get_droppanel());
                if (this.get_dropwidth() == null) {
                    this.get_droppanel().style.removeProperty("width");
                } else {
                    this.get_droppanel().style.width = this.get_dropwidth() + "px";
                }
                if (this.get_dropheight() == null) {
                    this.get_droppanel().style.removeProperty("height");
                } else {
                    this.get_droppanel().style.height = this.get_dropheight() + "px";
                }
                var pos = ViewUtil.adjustLocalPopupInHost(this, this.get_droppanel());
                // if (pos != null) {
                //     pos.placementRect.mapTo()
                // }
                

                // TODO: May be update the drop
            }
        } else {
            DOMUtil.hideElement(this.get_droppanel());
        }
    };
    //#endregion

    //#region box visual management
    LookupBoxControl.prototype.get_filterVisible = function() {

    }
    LookupBoxControl.prototype.set_filterVisible = function(v) {
    }
    //#endregion box visual management

    //#region focusing
    LookupBoxControl.prototype.onBlurFilter = function(e,dc, bind) {
        this.set_bodyVisible(false);
    }
    LookupBoxControl.prototype.onFocusFilter = function(e,dc, bind) {
        this.set_bodyVisible(true);
    }

    //#endregion focusing

    //#region Selector
    LookupBoxControl.prototype.onMakeSelection = function(sender, dc) {
        this.set_selectedobject(dc);
        this.activatedevent.invoke(this, dc);
        this.set_bodyVisible(false);
    }
    //#endregion


    //#region IKeyboardProcessor
    LookupBoxControl.prototype.$keysToPass = ["ArrowDown","ArrowUp","PageDown","PageUp","Enter","Escape"];
    /**
     * In this case receives everything from the textbox and
     */
    LookupBoxControl.prototype.processKeyObject = function(keyData) {
        if (this.$keysToPass.some(k => k == keyData.key)) {
            return false; // let these go
        }

        return true;
    }
    //#endregion

})();