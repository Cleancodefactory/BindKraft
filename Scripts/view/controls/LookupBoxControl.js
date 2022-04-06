(function(){

    function LookupBoxControl() {
        Base.apply(this,arguments);
    }
    LookupBoxControl.Inherit(Base, "LookupBoxControl")
        .Implement(IUIControl)
        .Implement(ICustomParameterizationStdImpl)
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Defaults({
            templateName: "bindkraft/control-combobox"
        });

    LookupBoxControl.ImplementProperty("filterbox") // The text box
        .ImplementProperty("droplist") // The drop list - selectable repeater
        .ImplementActiveProperty("choices", new InitializeArray("Choices for selection"),true); // The drop list - selectable repeater

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
            }
        }
        if (this.get_filterbox() == null) {
            this.LASTERROR("filterbox not bound");
        } else {
            
        }
    }

})();