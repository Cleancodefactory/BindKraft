
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

    UIMenuSlot.ImplementProperty("menudata", new Initialize("Menu model based on UIMenuItem", null),null, function(ov, nv) {
        this.$().Empty();
        this.$item = null;
        // The first item is not displayed - its items matter only.
        if (BaseObject.is(nv, "UIMenuItem")) {
            var $_template = this.get_template();
            if ($_template == null) {
                this.LASTERROR("Cannot regenerate menu, because there is not template");
                return;
            }
            
            var tml,item;
            if (nv.is("UIMenuStrip")) {
                var items = nv.get_items();
                for (var i = 0; i < items.length; i++) {
                    tml = $_template.replace("%%%", this.getOpinion(IUIMenuHost, items[i], "UIMenuComponent"));
                    Materialize.cloneTemplate(this.root, tml, items[i]);
                }
                this.rebind();
                this.updateTargets();    
            } else {
                tml = $_template.replace("%%%", this.getOpinion(IUIMenuHost, nv, "UIMenuComponent"));
                this.$item = Materialize.cloneTemplate(this.root, tml, nv);
                this.rebind();
                this.updateTargets();
            }
        }
    });
    
    UIMenuSlot.prototype.$item = null;

    UIMenuSlot.prototype.init = function() {

    }

})();