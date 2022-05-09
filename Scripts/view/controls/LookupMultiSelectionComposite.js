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
    .Implement(ICustomParameterizationStdImpl, "identification", "description")
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
        .ImplementProperty("items", new Initialize("Items for selection in the LookupBoxControl"))
        .ImplementProperty("selectedobjects", new InitializeArray("Items for handling in the SelectedItemsControl. Must be the same type as the $selectedobject of the lookup box"))
    //#endregion

    //#region ILookupBoxCallback
    LookupMultiSelectionComposite.ImplementInterfaceBubble("lookupcallback", ILookupBoxCallback,{
        getChoices: function(flt, offset, limit) { 
            return this.get_items();
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