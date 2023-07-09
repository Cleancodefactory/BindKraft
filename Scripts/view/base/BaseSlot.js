(function(){
    var ViewBase = Class("ViewBase");
    /**
     * A slot to put a template into. This can be done through setting the set_templates property or by specifying templateName as parameter in data-class
     */
    function BaseSlot() {
        BaseSlot.apply(this,arguments);
    }
    BaseSlot.Inherit(Base,"BaseSlot")
    .Implement(ITemplateSource)
    .Implement(ICustomParameterizationStdImpl,"templateName")
    .ImplementProperty("templateName", new InitializeStringParameter("module/templatename",null));

    BaseSlot.prototype.$slottemplate = null;
    BaseSlot.prototype.get_template = function () { return this.$slottemplate; };
    BaseSlot.prototype.set_template = function (v) { 
        this.$slottemplate = v + ""; 
        this.reinstantinateTemplate();
    }
    BaseSlot.prototype.get_visible = function () { 
        return !this.$().get_hidden();
    }
    BaseSlot.prototype.set_visible = function (v) {
        this.$().set_hidden(!v);
    }
    BaseSlot.prototype.reinstantinateTemplate = function () {
        this.ExecAfterFinalInit(function () {
        var root = this.$();
        if (!root.get_isempty()) {
                root.Empty();
                if (this.$slottemplate != null) {
                
                    ViewBase.materializeIn(this.root, this.$slottemplate);
                    // materialize does the internal initialization, only rebind remains to be done
                    this.rebind();
                
                }
            }
        }
    }
})();