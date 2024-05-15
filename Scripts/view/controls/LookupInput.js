(function(){
    var ViewUtil = Class("ViewUtil"),
        IKeyboardProcessorImpl = InterfaceImplementer("IKeyboardProcessorImpl"),
        ICustomParameterizationStdImpl = InterfaceImplementer("ICustomParameterizationStdImpl"),
        ITemplateSourceImpl = InterfaceImplementer("ITemplateSourceImpl"),
        IDisablableActiveImpl = InterfaceImplementer("IDisablableActiveImpl");

    /**
     * LookupInput
     * 
     * Objects in use:
     * 
     * The callback callback must serve array of objects shown in the dropdown list: Object_Type1. The item template has such an object as data context
     * The makeselection callback translates Object_Type1 to a Object_Type2 which is set as selectedobject. So, the selected object consumed further
     *  can be different from the item objects. The reason: Listed items can be obtained from anywhere with any structure and it is not hard to design simple
     *  item template for them. However the selected object is used by the business logic further and must be in convenient form for the application.
     * 
     * 
     * 
     */
    function ILookupInputCallback() {}
    ILookupInputCallback.Interface("ILookupInputCallback");
    /**
     * 
     * @param {string|null} flt - filter for the choices to serve
     * 
     * @returns {Opration<Array<object>>|Array<object>|null} - choices to display to the user
     */
    ILookupInputCallback.prototype.getChoices = function(flt) { throw "not implemented"; }
    
    /**
     * Allows the choices to be translated to value filled in the input in more complex way than just getting their value
     * @param {object|null} choice - an object from choices (as returned by getChoices) just chosen by the user in the drop list.
     * 
     * @returns {Operation<string>|string|null} - The same or morphed/translated form of the object from choices being selected. It may be desired to
     * consume different/transformed objects from the selection, thus the lookup box has the option to do this here.
     */
    ILookupInputCallback.prototype.makeSelection = function(choice) { throw "not implemented"; }
    

    function LookupInput() {
        Base.apply(this,arguments);
    }
    LookupInput.Inherit(Base, "LookupInput")
        .Implement(IUIControl)
        .Implement(IDisablableActiveImpl)
        .Implement(IKeyboardProcessorImpl)
        .Implement(ICustomParameterizationStdImpl, "sourcedata", "identification", "filterbyfield","dropwidth", "dropheight", "interface", "noselection", "showclear","selectinputonfocus","cleartext","showclearfilter","clearfiltertext")
        .Implement(IItemTemplateConsumerImpl)
        .Implement(IItemTemplateSourceImpl, true, "single")
        .Implement(ITemplateSourceImpl, new Defaults("templateName"),"autofill")
        .Defaults({
            templateName: "bindkraft/element-lookupinput"
        });

    LookupInput
        .ImplementProperty("filterbox") // The text box
        .ImplementProperty("droplist") // The drop list - selectable repeater
        .ImplementProperty("droppanel") // The DOM element of the drop panel
        .ImplementProperty("selectinputonfocus", new  InitializeBooleanParameter("select all when the input is focused",false))
        .ImplementProperty("dropwidth", new InitializeNumericParameter("",null))
        .ImplementProperty("dropheight", new InitializeNumericParameter("",null))
        .ImplementActiveProperty("choices", new InitializeArray("Choices for selection"),true) // The drop list - selectable repeater
        .ImplementProperty("noselection", new InitializeStringParameter("text for no selection", "(please select)"))
        .ImplementProperty("cleartext", new InitializeStringParameter("Display text for clear button - for use in templates", "clear selection"))
        .ImplementProperty("showclear", new InitializeBooleanParameter("Show the clear selection button (templates should honour this)", true))
        .ImplementProperty("interface", new Initialize("Callback interface (alternative to callbacks) see ILookupInputCallback.", null))
        .ImplementProperty("filter", new InitializeStringParameter("Bound to the text (filter) box, change invokes refresh of choices", null),null, function(oval, nval){
            if (nval != oval) {
                this.$choicesRefresh.windup();
            }
        });

    //#region Events
    LookupInput.prototype.activatedevent = new InitializeEvent("Event fired on user made selection");
    LookupInput.prototype.clearselectionevent = new InitializeEvent("Fired when the selection is cleared by the user.");
    //#endregion

    LookupInput.prototype.get_value = function() {
        return this.get_filterbox().value;
    }
    LookupInput.prototype.set_value = function(v) {
        this.get_filterbox().value = v;
        this.set_filter(v);

    }
    LookupInput.prototype.get_identification = function() {
        if (this.get_droplist() != null) {
            return this.get_droplist().identification;
        }
    };
    LookupInput.prototype.set_identification = function(v) {
        if (this.get_droplist() != null) {
            this.get_droplist().identification = v;
            this.refreshChoicesIfOpen();
        } else if (!this.isFullyInitialized()) {
            this.ExecBeforeFinalInit([v],function(val) {
                if (this.get_droplist() != null) {
                    this.get_droplist().identification = val;
                } else {
                    this.LASTERROR("droplist is not bound while trying to set identification field");
                }
            });
        }
    };
    

    // LookupInput.prototype.$itemTemplate = null;
    
    LookupInput.prototype.init = function () {
        //this.$itemTemplate = this.root.innerHTML;
        //ITemplateSourceImpl.InstantiateTemplate(this);
    };
    LookupInput.prototype.finalinit = function () {
        if (this.get_identification() != null) {
            if (this.get_droplist() != null) {
                this.get_droplist().identification = this.get_identification();
            }
        }
        if (this.get_itemTemplate() == null) {
            this.LASTERROR("No template for the drop items. Please specify the template as content of the control element.");
        } else {
            if (this.get_droplist() == null) {
                this.LASTERROR("The template for the control does not bind the drop down list SelectableRepeater to the droplist property.");
            } else {
                this.get_droplist().set_itemTemplate(this.get_itemTemplate());
                this.keydataevent.add(new Delegate(this.get_droplist(), this.get_droplist().onKeyObject));
            }
        }
        if (this.get_filterbox() == null) {
            this.LASTERROR("filterbox not bound");
        } else {
            // Anything?
        }
        if (this.get_droppanel() != null) {
            this.on(this.get_droppanel(),"mousedown", this.Open);
        }
        // Initial state
        // this.set_bodyVisible(false);
        this.Close();
    };
    //#region Data, choices and translation
    /**
     * For external (and internal sometimes) choices refresh invocation. Works the same as when the user writes, but can be called in all the cases 
     * when change of the choices may occur because of the data to make sure user see what's appropriate. Refresh will happen
     */
    LookupInput.prototype.refreshChoices = function() {
        this.$choicesRefresh.windup();
    }
    LookupInput.prototype.refreshChoicesIfOpen = function() {
        if (this.get_bodyVisible() && this.isFullyInitialized()) {
            this.refreshChoices();
        }
    }
    LookupInput.prototype.$choicesRefresh = new InitializeMethodTrigger("Initiates new search", function () { 
        var flt = this.get_filter();
        var op = null;
        var  me = this;
        if (BaseObject.is(this.get_interface(), ILookupInputCallback )) {
            var iface = this.get_interface();
            op = iface.getChoices(flt);
            if (BaseObject.is(op, "Operation")) {
                op.onsuccess(function(ch) {
                    me.set_choices(ch);
                });
            } else {
                this.set_choices(op);
            }
        } else {
            // nothing
        }
    }, 300);
    

    //#endregion

    //#region Show/hide drop list
    LookupInput.prototype.$bodyVisible = false;
    LookupInput.prototype.get_bodyVisible = function () { return this.$bodyVisible; };
    LookupInput.prototype.set_bodyVisible = function (v) {
        var prevstate = this.get_bodyVisible();
        if (this.get_disabled() || this.get_interface() == null) {
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
                    //this.get_droppanel().style.removeProperty("width");
                } else {
                    this.get_droppanel().style.width = this.get_dropwidth() + "px";
                }
                if (this.get_dropheight() == null) {
                    //this.get_droppanel().style.removeProperty("height");
                } else {
                    this.get_droppanel().style.height = this.get_dropheight() + "px";
                }
                var pos = ViewUtil.adjustPopupInHostLocally(this, this.get_droppanel());
                
                // TODO: May be update the drop => Yes!
                if (!prevstate) this.refreshChoices();
            }
        } else {
            DOMUtil.hideElement(this.get_droppanel());
        }
    };
    LookupInput.prototype.$pendingOpenClose = null; // odd open/even close, priority rises with the number.
    LookupInput.prototype.$pendingOpenCloseTrigger = new InitializeMethodTrigger("Operates open close", function(){
        if (this.$pendingOpenClose != null) {
            if (this.$pendingOpenClose % 2 == 0) {
                this.goClose();
            } else {
                this.goOpen();
            }
            this.$pendingOpenClose = null;
        }
    }, 50);
    LookupInput.prototype.goOpen = function() {
        this.set_bodyVisible(true);
        this.get_filterbox().focus();
    }
    LookupInput.prototype.goClose = function() {
        this.set_bodyVisible(false);
    }
    LookupInput.prototype.Open = function() {
        if (this.$pendingOpenClose == null || this.$pendingOpenClose < 1) {
            this.$pendingOpenClose = 1;
            this.$pendingOpenCloseTrigger.windup();
        }
    }
    LookupInput.prototype.Close = function(force) {
        var act = force?2:0;
        if (this.$pendingOpenClose == null || this.$pendingOpenClose < act) {
            this.$pendingOpenClose = act;
            this.$pendingOpenCloseTrigger.windup();
        }
    }
    //#endregion

    //#region focusing
    LookupInput.prototype.onBlurInput = function(e,dc, bind) {
        this.Close();
    };
    LookupInput.prototype.onFocusInput = function(e,dc, bind) {
        if (this.get_disabled()) return;
        if (this.get_selectinputonfocus()) {
            this.get_filterbox().select();
        }
        this.Open();
    };
    //#endregion focusing

    //#region Selector
    LookupInput.prototype.onClearFilter = function() {
        var fb = this.get_filterbox();
        if (fb != null) {
            fb.value = "";
            fb.focus();
        }
    }
    LookupInput.prototype.onMakeSelection = function(sender, dc) {
        var me = this;
        this.$makeSelection(dc).onsuccess(function(sel) {
            me.set_value(sel);
            me.activatedevent.invoke(me, sel);
            me.Close(true);
        }).onfailure(function(e) {
            me.LASTERROR("Error resolving the selected item:" + e, "onMakeSelection");
        });
    }
    LookupInput.prototype.$makeSelection = function(obj) {
            var result = obj;
            if (BaseObject.is(this.get_interface(), "ILookupInputCallback")) {
                var r = this.get_interface().makeSelection(obj);
                if (r != null) result = r;
            } else {
                return Operation.From(obj);
            }
            if (BaseObject.is(result, "Operation")) return result;
            return Operation.From(result);
    };

    //#endregion


    //#region IKeyboardProcessor
    LookupInput.prototype.$keysToPass = ["ArrowDown","ArrowUp","PageDown","PageUp","Enter","Escape"];
    /**
     * In this case receives everything from the textbox and
     */
    LookupInput.prototype.processKeyObject = function(keyData) {
        if (this.$keysToPass.some(k => k == keyData.key)) {
            return false; // let these go
        }

        return true;
    };
    //#endregion

})();