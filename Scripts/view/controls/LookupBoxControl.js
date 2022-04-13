(function(){

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
                this.keydataevent.add(new Delegate(this.get_droplist(), this.get_droplist().onKeyObject));
            }
        }
        if (this.get_filterbox() == null) {
            this.LASTERROR("filterbox not bound");
        } else {
            // Anything?
        }
    }

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
                this.get_droppanel().style.display = 'none'; ////////////////
            } else {
                var dp = $(this.get_droppanel())
                this.get_droppanel().style.display = '';
                JBUtil.adjustPopupInHost(this, this.get_droppanel(), 0, -30);
                if (this.$el_scrollable != null && $(this.$el_scrollable).activeclass() != null) {
                    $(this.$el_scrollable).activeclass().onDataAreaChange();
                }
            }
        } else {
            $(this.$el_drop).hide();
        }
            // this.updateTargets();
        
    };

    LookupBoxControl.prototype.showDropList = function() { 
        var panel = this.get_droppanel();

    }
    LookupBoxControl.prototype.hideDropList = function() { 
        
    }
    //#endregion

    //#region focusing
    LookupBoxControl.prototype.onBlurFilter = function(e,dc, bind) {

    }
    LookupBoxControl.prototype.onFocusFilter = function(e,dc, bind) {
        
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