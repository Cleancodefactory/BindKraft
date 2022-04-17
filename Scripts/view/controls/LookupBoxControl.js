(function(){
    var viewUtil = Class("ViewUtil");
    function LookupBoxControl() {
        Base.apply(this,arguments);
    }
    LookupBoxControl.Inherit(Base, "LookupBoxControl")
        .Implement(IUIControl)
        .Implement(IDisablable)
        .Implement(IKeyboardProcessorImpl)
        .Implement(ICustomParameterizationStdImpl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Defaults({
            templateName: "bindkraft/control-combobox"
        });

    LookupBoxControl
        .ImplementProperty("filterbox") // The text box
        .ImplementProperty("droplist") // The drop list - selectable repeater
        .ImplementProperty("droppanel") // The DOM element of the drop panel
        .ImplementActiveProperty("choices", new InitializeArray("Choices for selection"),true) // The drop list - selectable repeater
        .ImplementProperty("callback", new Initialize("Callback providing choices as objects, can be used together with identification.", null))
        .ImplementProperty("sourcedata", new Initialize("Optional, for use by the callback, the default internal callback expects array with identification property holding strings."))
        .ImplementProperty("filter", new InitializeStringParameter("Bound to the text (filter) box, change invokes refresh of choices", null,function(oval, nval){
            if (nval != oval) {
                this.$choicesRefresh().windup();
            }
        }));

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
                    this.LASTERROR("droplist is not bound while trying to set identification field")
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
                this.LASTERROR("The template for the control does not bind the drop down list SelectableRepeater to the droplist property.")
            } else {
                this.get_droplist().set_itemTemplate(this.$itemTemplate);
                this.keydataevent.add(new Delegate(this.get_droplist(), this.get_droplist().onKeyObject));
            }
        }
        if (this.get_filterbox() == null) {
            this.LASTERROR("filterbox not bound");
        } else {
            // Anything?
        }
    }
    //#region Data
    LookupBoxControl.prototype.$choicesRefresh = InitializeMethodTrigger("Initiates new search", function () { 
        var flt = this.get_filter();
        var op = null;
        var  me = this;
        if (this.get_callback() != null) {
            var cb = this.get_callback();
            if (BaseObject.is(cb, "Delegate")) {
                op = cb.invoke(this, flt);
            } else if (typeof cb == "function") {
                op = cb.call(this, this, filter);
            } else {
                this.LASTERROR("Cannot call the callback, it is nor delegate, nor function");
            }
            if (BaseObject.is(op, "Opration")) {
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
            var ind = this.get_identification();
            var me = this;
            if (typeof ind == "string") {
                if (flt == null || flt.length == 0) {
                    this.set_choices(me.get_sourcedata());
                } else {
                    this.callAsync(function() {
                        var items = me.get_sourcedata();
                        var ch = items.Select(function(idx, item) {
                            if (item[ind] == flt) return item;
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
                ViewUtil.adjustPopupInHost(this, this.get_droppanel());

                // TODO: May be update the drop
            }
        } else {
            DOMUtil.hideElement(this.get_droppanel());
        }
    };

    LookupBoxControl.prototype.showDropList = function() { 
        var panel = this.get_droppanel();

    }
    LookupBoxControl.prototype.hideDropList = function() { 
        
    }
    //#endregion

    //#region focusing
    LookupBoxControl.prototype.onBlurFilter = function(e,dc, bind) {
        this.set_bodyVisible(false);
    }
    LookupBoxControl.prototype.onFocusFilter = function(e,dc, bind) {
        this.set_bodyVisible(true);
    }

    //#endregion focusing


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