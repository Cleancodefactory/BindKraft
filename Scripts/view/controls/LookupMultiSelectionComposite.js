(function() {

    var ILookupBoxCallback = Interface("ILookupBoxCallback"),
        ISelectedItemsCallback = Interface("ISelectedItemsCallback");

    /**
     * This composite is using two controls - LookupBoxControl and SelectedItemsControl in a specific manner.
     * It implements the callbacks required so that the user would need only to supply items to the $items and current selection to the
     * $selectedobjects.
     * 
     * The selected objects are the same as in the items (no conversion is made, while in a custom use it is possible and sometimes used.)
     * The impact on this is that ISelectedItemsCallback.identifyItem will work on both the $selectedobjects and the available $items.
     * 
     * Identification is performed over the value of the $identification parameter/property, while filtering is implemented over the property specified 
     * in the $description parameter/property.
     */
    function LookupMultiSelectionComposite() {
        Base.apply(this, arguments);
    }
    /**
     * 
     * Templates required
     * selected-item - template for the item shown in the selected items control
     * list-item - template for the drop list of the lookup box
     */
    LookupMultiSelectionComposite.Inherit(Base, "LookupMultiSelectionComposite")
    .Implement(IUIControl)
    .Implement(IDisablable)
    .Implement(ICustomParameterizationStdImpl, "identification", "description", "noselection", "fixselection")
    .Implement(ITemplateSourceImpl, new Defaults("templateName"), "autofill")
    .Implement(IItemTemplateSourceImpl, true)
    .Defaults({
        templateName: "bindkraft/composite-lookupmultiselection"
    });

    LookupMultiSelectionComposite
        .ImplementProperty("selector")
        .ImplementProperty("lookup");


    //#region Data properties
    LookupMultiSelectionComposite
        .ImplementProperty("identification", new InitializeStringParameter("The name of the id field"))
        .ImplementProperty("description", new InitializeStringParameter("The name of the display field"))
        .ImplementActiveProperty("items", new Initialize("Items for selection in the LookupBoxControl"),true, function(oval,nval) {
            if (BaseObject.is(this.get_lookup(),"LookupBoxControl")) {
                this.get_lookup().refreshChoices();
            }
        })
        .ImplementProperty("fixselection", new InitializeBooleanParameter("Fix the selected items by removing the ones not available for choosing",false))
        .ImplementProperty("noselection", new InitializeStringParameter("Text shown in the lookup box before typing","(select to add)"))
        .ImplementProperty("clearselection", new InitializeStringParameter("Text for the clear selection button/icon","clear selection"))
        .ImplementActiveProperty("selectedobjects", new InitializeArray("Items for handling in the SelectedItemsControl. Must be the same type as the $selectedobject of the lookup box"),true,function(oval,nval){
            // May be needed for fine tunning
        })
    //#endregion

    //#region Events
    LookupMultiSelectionComposite.prototype.selchangedevent = new InitializeEvent("Fired when selection changed");
    //#endregion

    //#region ILookupBoxCallback
    LookupMultiSelectionComposite.ImplementInterfaceBubble("lookupcallback", ILookupBoxCallback,{
        getChoices: function(flt, offset, limit) { 
            var me = this;
            var d = this.get_description();
            var items =  this.get_items();
            var sels = this.get_selectedobjects();
            
            if (this.get_fixselection()) {
                // Remove from the selection array the items not available in the newly set items
                if (Array.isArray(sels) && sels.length > 0 && Array.isArray(items)) {
                    if (items.length > 0) {
                        for (var i = sels.length - 1; i >= 0; i--) {
                            var selItem = sels[i];
                            var selIdent = me.get_selectioncallback().identifyItem(selItem)
                            if (items.FirstOrDefault(function(idx, item) {
                                if (me.get_selectioncallback().identifyItem(item) == selIdent) return item;
                                return null;
                            }) == null) {
                                sels.splice(i, 1);
                            }
                        }
                    } else {
                        // Remove all the selected
                        sels.splice(0);
                    }
                    this.get_selector().updateTargets();
                }
            }
            // if (Array.isArray(sels)) {
            //     sels = sels.Select(function(i,o) {
            //         return me.get_selectioncallback().identifyItem(o);
            //     });
            // } else {
            //     sels = [];
            // }
            //if (flt == null || flt.length == 0) return items;
            // sels - contains the selected objects
            // flt - the current filter supplied by the lookup
            if (Array.isArray(items) && d != null) {
                return items.Select(function(idx, item) {
                    var it = item[d];
                    if (flt == null || flt.length == 0 || (typeof it == "string" && it.toLowerCase().indexOf(flt.toLowerCase()) >= 0)) {
                        if (!sels.Any(function(idx,t){
                            if (me.areEqualItems(t, item)) return true;
                            return false;
                        })) {
                            return item;
                        }
                    }
                });
            }
            return items;
        },
        translateSelection: function(selection, forDisplay) { 
            return BaseObject.getProperty(selection, this.get_description());
        },
        makeSelection: function(choice, forDisplay) { 
            return choice;
        }
    })
    //#endregion

    //#region ISelectedItemsCallback
    LookupMultiSelectionComposite.ImplementInterfaceBubble("selectioncallback", ISelectedItemsCallback,{
        translateItems: function(rawItems) { return rawItems; }, // returns Operation<Array>|Array
        identifyItem: function(rawItem) { 
            if (rawItem != null) {
                return BaseObject.getProperty(rawItem, this.get_identification());
            }
            return null;
        }
    });
    // Helper - comparer
    LookupMultiSelectionComposite.prototype.areEqualItems = function(item1, item2) {
        var id1 = this.get_selectioncallback().identifyItem(item1);
        var id2 = this.get_selectioncallback().identifyItem(item2);
        return id1 == id2;
    }
    //#endregion

    LookupMultiSelectionComposite.prototype.init = function() {
        this.$itemTemplate = this.root.innerHTML;
        ITemplateSourceImpl.InstantiateTemplate(this);
    }

    LookupMultiSelectionComposite.prototype.finalinit = function() {
        // Too late - happens after the final init of the child controls.
        // var tml = this.get_itemTemplate("selected-item");
        // if (tml != null) {
        //     if (this.get_selector()) { this.get_selector().set_itemTemplate(tml); } else {
        //         this.LASTERROR("Canot find the SelectedItemsControl in the template");
        //     }
        // }
        // var tml = this.get_itemTemplate("list-item");
        // if (tml != null) {
        //     if (this.get_lookup()) { this.get_lookup().set_itemTemplate(tml); } else {
        //         this.LASTERROR("Canot find the LookupBoxControl in the template");
        //     }
        // }
    }

})();