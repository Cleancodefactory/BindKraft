(function(){
    var Control = Class("Control"),
        IDisablableThroughImpl = InterfaceImplementer("IDisablableThroughImpl"),
        ITemplateSourceImpl = InterfaceImplementer("ITemplateSourceImpl"),
        IItemTemplateSourceImpl = InterfaceImplementer("IItemTemplateSourceImpl"),
        ILookupBoxCallback = Interface("ILookupBoxCallback");

    function LookupDropDownControl() {
        Control.apply(this,arguments);
    }
    LookupDropDownControl.Inherit(Control,"LookupDropDownControl")
    .Implement(ITemplateSourceImpl, new Defaults("templateName"),"autofill")
    .Implement(IDisablableThroughImpl,"lookup")
    .Implement(IItemTemplateSourceImpl, true)
    .Implement(IItemTemplateConsumerImpl)
    .ImplementProperty("lookup", new Initialize("must be bound using pluginto to LookupBoxControl",null))
    .ImplementProperty("description", new InitializeStringParameter("Specifies the name of the displayable property","description"))
    .ImplementProperty("selectinputonfocus", new InitializeBooleanParameter("Should be bound to same named parameter of the lookp box in the template",true))
    // .ImplementProperty("identification", new InitializeStringParameter("The name of the field to use as id on the items.",null),true,function(ov,nv){
    //     if (this.get_lookup() != null) {
    //         this.set_lookup().refreshChoicesIfOpen();
    //     }
    // })
    .Defaults({
        templateName: "bindkraft/control-lookupdropdown"
    });
    //#region events
    LookupDropDownControl.prototype.activatedevent = new InitializeEvent("Fired when new selection is made by the user");
    //#endregion events
    LookupDropDownControl.ImplementInterfaceBubble("lookupcallback", ILookupBoxCallback,{
        getChoices: function(flt, offset, limit) {
            var d = this.get_description();
            if (String.IsNullOrWhiteSpace(flt)) {
                return this.$items;
            } else {
                if (typeof d === "string") {
                    var f = flt.toLowerCase();
                    return this.$items.Select(function(idx,item) {
                        if (typeof item[d] == "string" && item[d].toLowerCase().indexOf(f) >= 0) return item;
                    })
                } else {
                    this.LASTERROR("description property is not specified and filtering cannot be performed");
                    return null;
                }
            }
        },
        translateSelection: function(selection,forDisplay) {
            if (typeof this.get_description() != "string") {
                this.LASTERROR("description property is not specified and filtering cannot be performed");
                return "######";
            }
            if (selection != null) {
                return selection[this.get_description()];
            }
        },
        makeSelection: function(item, forDisplay) {
            return item;
        }
    });
    LookupDropDownControl.prototype.finalinit = function() {
        if (this.get_lookup() == null) {
            throw "Property $lookup does not contain a reference to a lookup box - check the template of " + this.classType();
        }
    }
    LookupDropDownControl.prototype.get_identification = function() {
        if (this.get_lookup() != null) {
            return this.get_lookup().get_identification();
        }
        return null;
    }
    LookupDropDownControl.prototype.set_identification = function(v) {
        this.ExecAfterFinalInit(function() {
            this.get_lookup().set_identification(v);

        });
    }
    LookupDropDownControl.prototype.$items = null;
    LookupDropDownControl.prototype.set_items = function(items) {
        this.$items = items;
        this.$updateSelectionFromValue();
        this.get_lookup().refreshChoicesIfOpen();
    }
    LookupDropDownControl.prototype.get_items = function() {
        return this.$items;
    }
    LookupDropDownControl.prototype.$updateSelectionFromValue = function() {
        var me = this;
        if (Array.isArray(this.$items) && this.$value != null) {
           var selitm = this.$items.FirstOrDefault(function(idx,item) {
                if (me.$getItemIdentification(item) == me.$value) return item;
                return null;
            });
            this.get_lookup().set_selectedobject(selitm);
        }
    }
    LookupDropDownControl.prototype.$updateValueFromSelection = function() {
        var itm = this.get_selecteditem();
        if (itm != null) {
            this.$value = this.$getItemIdentification(itm);
        } else {
            this.$value = null;
        }
    }
    LookupDropDownControl.prototype.onLookupActivated = function() {
        this.$updateValueFromSelection();
        this.activatedevent.invoke(this,this.get_value())
    }
    LookupDropDownControl.prototype.$value = null;
    /**
     * Sets the idenntification of the selected item
     * @param {any} value The identification of the selected item, usually string or number
     */
    LookupDropDownControl.prototype.set_value = function(value) {
        this.$value = value;
        this.$updateSelectionFromValue();
        
    }
    LookupDropDownControl.prototype.get_value = function() {
        return this.$value;
    }
    LookupDropDownControl.prototype.$getItemIdentification = function(item) {
        var idName = this.get_identification();
        if (item != null && typeof item == 'object' && idName != null) {
            return item[idName];
        }
        return null;
    }
    LookupDropDownControl.prototype.set_selecteditem = function(item) {
        this.get_lookup().set_selectedobject(item);
        this.$updateValueFromSelection();
    }
    LookupDropDownControl.prototype.get_selecteditem = function() {
        return this.get_lookup().get_selectedobject();
    }
})()