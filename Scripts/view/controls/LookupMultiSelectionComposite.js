(function() {

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
    .Implement(ICustomParameterizationStdImpl)
    .Implement(ITemplateSourceImpl, new Defaults("templateName"), "autofill")
    .Implement(IItemTemplateSourceImpl, true)
    .Defaults({
        templateName: "bindkraft/composite-lookupmultiselection"
    });

    LookupMultiSelectionComposite
        .ImplementProperty("selector")
        .ImplementProperty("lookup");


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