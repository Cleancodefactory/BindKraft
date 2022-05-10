(function() {

    var ILookupBoxCallback = Interface("ILookupBoxCallback"),
        ISelectedItemsCallback = Interface("ISelectedItemsCallback");
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
    .Implement(ICustomParameterizationStdImpl, "identification", "description", "noselection")
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
        .ImplementProperty("items", new Initialize("Items for selection in the LookupBoxControl"),true, function(oval,nval) {
            this.updateTargets();
        })
        .ImplementProperty("noselection", new InitializeStringParameter("Text shown in the lookup box before typing","(select to add)"))
        .ImplementProperty("clearselection", new InitializeStringParameter("Text for the clear selection button/icon","clear selection"))
        .ImplementProperty("selectedobjects", new InitializeArray("Items for handling in the SelectedItemsControl. Must be the same type as the $selectedobject of the lookup box"),true,function(oval,nval){
            this.updateTargets();
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
            if (Array.isArray(sels)) {
                sels = sels.Select(function(i,o) {
                    return me.get_selectioncallback().identifyItem(o);
                });
            } else {
                sels = [];
            }
            if (flt == null || flt.length == 0) return items;
            if (Array.isArray(items) && typeof flt == "string" && d != null) {
                return items.Select(function(idx, item) {
                    var it = item[d];
                    if (typeof it == "string" && it.toLowerCase().indexOf(flt.toLowerCase()) >= 0) {
                        if (sels.indexOf(me.get_selectioncallback().identifyItem(item)) >= 0) return;
                        return item;
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