(function(){
    var ViewBase = Class("ViewBase");
    function BaseSlot() {
        BaseSlot.apply(this,arguments);
    }
    BaseSlot.Inherit(Base,"BaseSlot")
    .Implement(ITemplateSource)

    BaseSlot.prototype.$slottemplate = null;
    BaseSlot.prototype.get_template = function () { return this.$slottemplate; };
    BaseSlot.prototype.set_template = function (v) { 
        this.$slottemplate = v + ""; 

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