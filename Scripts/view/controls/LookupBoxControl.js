(function(){
    var ViewUtil = Class("ViewUtil"),
        IKeyboardProcessorImpl = InterfaceImplementer("IKeyboardProcessorImpl"),
        ICustomParameterizationStdImpl = InterfaceImplementer("ICustomParameterizationStdImpl"),
        ITemplateSourceImpl = InterfaceImplementer("ITemplateSourceImpl");

    /**
     * LookupBoxControl
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
    function ILookupBoxCallback() {}
    ILookupBoxCallback.Interface("ILookupBoxCallback");
    /**
     * 
     * @param {string|null} flt - filter for the choices to serve
     * @param {null|integer} offset - optional (not used in LookupBox)
     * @param {null|integer} limit - optional (not used in LookupBox)
     * 
     * @returns {Opration<Array<object>>|Array<object>|null} - choices to display to the user
     */
    ILookupBoxCallback.prototype.getChoices = function(flt, offset, limit) { throw "not implemented"; }
    /**
     * 
     * @param {object} selection - selected object from the $selectedobject property
     * @param {boolean} forDisplay - optional for future use
     * 
     * @returns {string|null} - text to display as selection to the user
     * 
     * Never called with null for the @selection
     */
    ILookupBoxCallback.prototype.translateSelection = function(selection, forDisplay) { throw "not implemented"; }
    /**
     * 
     * @param {object|null} choice - an object from choices just chosen by the user in the drop list.
     * @param {boolean} forDisplay - optional for future use
     * 
     * @returns {Operation<object>|object|null} - The same or morphed/translated form of the object from choices being selected. It may be desired to
     * consume different/transformed objects from the selection, thus the lookup box has the option to do this here.
     */
    ILookupBoxCallback.prototype.makeSelection = function(choice, forDisplay) { throw "not implemented"; }
    

    function LookupBoxControl() {
        Base.apply(this,arguments);
    }
    LookupBoxControl.Inherit(Base, "LookupBoxControl")
        .Implement(IUIControl)
        .Implement(IDisablable)
        .Implement(IKeyboardProcessorImpl)
        .Implement(ICustomParameterizationStdImpl, "sourcedata", "identification", "filterbyfield","dropwidth", "dropheight", "interface", "noselection", "showclear","selectinputonfocus")
        .Implement(IItemTemplateConsumerImpl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"),"autofill")
        .Implement(IItemTemplateSourceImpl, true, "single")
        .Defaults({
            templateName: "bindkraft/control-lookupbox"
        });

    LookupBoxControl
        .ImplementProperty("filterbox") // The text box
        .ImplementProperty("droplist") // The drop list - selectable repeater
        .ImplementProperty("droppanel") // The DOM element of the drop panel
        .ImplementProperty("display") // Selection display HTML Element (readonly textbox)
        .ImplementProperty("selectinputonfocus", new  InitializeBooleanParameter("select all when theinput is focused",false))
        .ImplementProperty("dropwidth", new InitializeNumericParameter("",null))
        .ImplementProperty("dropheight", new InitializeNumericParameter("",null))
        .ImplementActiveProperty("choices", new InitializeArray("Choices for selection"),true) // The drop list - selectable repeater
        .ImplementProperty("noselection", new InitializeStringParameter("text for no selection", "(please select)"))
        .ImplementProperty("showclear", new InitializeBooleanParameter("text for no selection", true))
        .ImplementActiveProperty("selectedobject", new Initialize("the current selection"), null, true, function(oval, nval) {
            if (nval != oval) {
                this.callAsync(function() {
                    this.$filter = this.$translateSelection();
                    this.updateTargets("filterbox");
                });
            }
        })
        /**
         * Bind using data-on-$callback
         * proto: this function(filter): Array<objs>
         * @param {string} filter - the text entered by the user
         * 
         * objs - objects returned by the callback, item template must bind what needs to be seen from them
         */
        .ImplementProperty("callback", new Initialize("Callback providing choices as objects, can be used together with identification.", null))
        /**
         * Bind using data-on-$translate
         * proto: this function(obj)
         * @param {object} obj - a single object to translate to text appropriate for the filter.
         * Typically called when the filter box needs to be populated with initial text
         */
        .ImplementProperty("translate", new Initialize("Callback providing translation from the selected object (Object_Type2) to text in the filter or display.", null))
        /**
         * Bind using data-on-$makeselection
         * proto: this function(obj)
         * @param {object} obj - a single object to transform for final form for the selectedobject property.
         * Called when selection is made
         */
        .ImplementProperty("makeselection", new Initialize("Callback finalizing the selection. The selected object is not necessarily the same as the choices", null))
        .ImplementProperty("interface", new Initialize("Callback interface (alternative to callbacks) see ILookupBoxCallback.", null))

        //#region  Mostly for the internal callback and translate - can be used by custom ones if convenient.
        .ImplementProperty("sourcedata", new Initialize("Optional, for use by the callback, the default internal callback expects array with identification property holding strings."), true, function(oval,nval){
            this.$choicesRefresh.windup();
        })
        .ImplementProperty("filterbyfield", new InitializeStringParameter("field by which to filter the items, used by the internal callback and optionally by the user callback", null))
        //#endregion
        .ImplementProperty("filter", new InitializeStringParameter("Bound to the text (filter) box, change invokes refresh of choices", null),null, function(oval, nval){
            if (nval != oval) {
                this.$choicesRefresh.windup();
            }
        });

    //#region Events
    LookupBoxControl.prototype.activatedevent = new InitializeEvent("Event fired on user made selection");
    LookupBoxControl.prototype.clearselectionevent = new InitializeEvent("Fired when the selection is cleared by the user.");
    //#endregion

    LookupBoxControl.prototype.get_identification = function() {
        if (this.get_droplist() != null) {
            return this.get_droplist().identification;
        }
    };
    LookupBoxControl.prototype.set_identification = function(v) {
        if (this.get_droplist() != null) {
            this.get_droplist().identification = v;
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

    // LookupBoxControl.prototype.$itemTemplate = null;
    
    LookupBoxControl.prototype.init = function () {
        //this.$itemTemplate = this.root.innerHTML;
        //ITemplateSourceImpl.InstantiateTemplate(this);
    };
    LookupBoxControl.prototype.finalinit = function () {
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
    LookupBoxControl.prototype.refreshChoices = function() {
        this.$choicesRefresh.windup();
    }
    LookupBoxControl.prototype.$choicesRefresh = new InitializeMethodTrigger("Initiates new search", function () { 
        var flt = this.get_filter();
        var op = null;
        var  me = this;
        if (BaseObject.is(this.get_interface(), ILookupBoxCallback )) {
            var iface = this.get_interface();
            op = iface.getChoices(flt);
            if (BaseObject.is(op, "Operation")) {
                op.onsuccess(function(ch) {
                    me.set_choices(ch);
                });
            } else {
                this.set_choices(op);
            }
        } else if (this.get_callback() != null) {
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
                });
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
                    });
                }
            } else {
                this.set_choices(null);    
            }
        } else {
            this.set_choices(null);
        }
    };
    LookupBoxControl.prototype.$translateSelection = function() {
        var sel = this.get_selectedobject();
        var result;
        if (sel != null) {
            if (BaseObject.is(this.get_interface(), ILookupBoxCallback )) {
                result = this.get_interface().translateSelection(sel);
            } else {
                var cb = this.get_translate();
                if (BaseObject.is(cb, "Delegate")) {
                    result = cb.invoke(this, sel);
                } else if (typeof cb == "function") {
                    result = cb.call(this, this, sel);
                } else {
                    this.LASTERROR("Cannot call the callback, it is nor delegate, nor function");
                }
            }
            if (result != null) return result;
            return "--";
        }
    };

    //#endregion

    //#region Show/hide drop list
    LookupBoxControl.prototype.$bodyVisible = false;
    LookupBoxControl.prototype.get_bodyVisible = function () { return this.$bodyVisible; };
    LookupBoxControl.prototype.set_bodyVisible = function (v) {
        var prevstate = this.get_bodyVisible();
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
    LookupBoxControl.prototype.$pendingOpenClose = null; // odd open/even close, priority rises with the number.
    LookupBoxControl.prototype.$pendingOpenCloseTrigger = new InitializeMethodTrigger("Operates open close", function(){
        if (this.$pendingOpenClose != null) {
            if (this.$pendingOpenClose % 2 == 0) {
                this.goClose();
            } else {
                this.goOpen();
            }
            this.$pendingOpenClose = null;
        }
    }, 50);
    LookupBoxControl.prototype.goOpen = function() {
        this.set_filterVisible(true);
        this.set_bodyVisible(true);
        this.get_filterbox().focus();
    }
    LookupBoxControl.prototype.goClose = function() {
        this.set_filterVisible(false);
        this.set_bodyVisible(false);
    }
    LookupBoxControl.prototype.Open = function() {
        if (this.$pendingOpenClose == null || this.$pendingOpenClose < 1) {
            this.$pendingOpenClose = 1;
            this.$pendingOpenCloseTrigger.windup();
        }
    }
    LookupBoxControl.prototype.Close = function(force) {
        var act = force?2:0;
        if (this.$pendingOpenClose == null || this.$pendingOpenClose < act) {
            this.$pendingOpenClose = act;
            this.$pendingOpenCloseTrigger.windup();
        }
    }
    //#endregion

    //#region box visual management
    LookupBoxControl.prototype.get_passivetext = function() {
        if (this.get_selectedobject() == null) {
            return this.get_noselection();
        } else {
            return this.$translateSelection();
        }
    }
    LookupBoxControl.prototype.$filterVisible = false;
    LookupBoxControl.prototype.get_filterVisible = function() {
        return this.$filterVisible;
    }
    LookupBoxControl.prototype.set_filterVisible = function(v) {
        var v = v?true:false;
        var f = this.get_filterbox(), d = this.get_display();
        if (v) {
            DOMUtil.hideElement(d);
            DOMUtil.unHideElement(f);
        } else {
            DOMUtil.hideElement(f);
            DOMUtil.unHideElement(d);
        }
        this.$filterVisible = v; 
    };
    //#endregion box visual management

    //#region focusing
    LookupBoxControl.prototype.onBlurFilter = function(e,dc, bind) {
        this.Close();
    };
    LookupBoxControl.prototype.onFocusFilter = function(e,dc, bind) {
        if (this.get_selectinputonfocus()) {
            this.get_filterbox().select();
        }
        this.Open();
    };
    //#endregion focusing

    //#region Selector
    LookupBoxControl.prototype.onClearSelection = function() {
        if (this.get_selectedobject() == null) return;
        this.set_selectedobject(null);
        this.clearselectionevent.invoke(this, null);
        this.Close(true);
    }
    LookupBoxControl.prototype.onMakeSelection = function(sender, dc) {
        var me = this;
        this.$makeSelection(dc).onsuccess(function(sel) {
            me.set_selectedobject(sel);
            me.activatedevent.invoke(me, sel);
            me.Close(true);
        }).onfailure(function(e) {
            me.LASTERROR("Error resolving the selected item:" + e, "onMakeSelection");
        });
    }
    LookupBoxControl.prototype.$makeSelection = function(obj) {
            var result = obj;
            if (BaseObject.is(this.get_interface(), "ILookupBoxCallback")) {
                var r = this.get_interface().makeSelection(obj);
                if (r != null) result = r;
            } else if (this.get_makeselection() != null) {
                var d = this.get_makeselection();
                if (BaseObject.is(d, "Delegate")) {
                    result = d.invoke(this, obj);
                } else if (typeof d == "function") {
                    result = d.call(this, this, obj);
                }
            }
            if (BaseObject.is(result, "Operation")) return result;
            return Operation.From(result);
    };

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
    };
    //#endregion

})();