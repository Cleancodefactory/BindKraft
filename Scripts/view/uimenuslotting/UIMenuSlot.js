
(function() {

    // TODO Needs changes? or deprecation??

    var IUIMenuHost = Interface("IUIMenuHost"),
        UIMenuSlotBase = Class("UIMenuSlotBase");
    
    /**
     * This is a very simplified slot not supporting add/remove - no dynamic editing
     * If kept should be used for simple scenarios (may be context menus?)
     */
    function UIMenuSlot() {
        UIMenuSlotBase.apply(this,arguments);
    }
    UIMenuSlot.Inherit(UIMenuSlotBase, "UIMenuSlot")
        .Implement(ITemplateSourceImpl, new Defaults("templateName"))
        .Implement(IUIMenuHost)
        .Defaults({
            templateName: new StringConnector('<div data-class="%%%"></div>')
        });

    UIMenuSlot.ImplementProperty("menudata", new Initialize("Array of menus based on UIMenuItem or a sinlgle menu item", null),null, function(ov, nv) {
        this.$().Empty();
        this.$item = null;
        
        // TODO: Clear the slot first!?!?

        if (BaseObject.is(nv, "UIMenuItem")) {
            nv = [nv];
        }
        if (BaseObject.is(nv, "Array")) {
            var $_template = this.get_template();
            if ($_template == null) {
                this.LASTERROR("Cannot regenerate menu, because there is not template");
                return;
            }
            var items = nv;
            for (var i = 0; i < items.length; i++) {
                tml = $_template.replace("%%%", this.getOpinion(IUIMenuHost, items[i], "UIMenuComponentActivate"));
                Materialize.cloneTemplate(this.root, tml, items[i]);
            }
            this.rebind();
            this.updateTargets();    
        }
    });
    
    UIMenuSlot.prototype.$item = null;

    UIMenuSlot.prototype.init = function() {

    }

})();