
(function() {
    function UIMenuSlot() {
        Base.apply(this,arguments);
    }
    UIMenuSlot.Inherit(Base, "UIMenuSlot");

    UIMenuSlot.ImplementProperty("menudata", new Initialize("Menu moeel based on UIMenuItem", null),null, function(ov, nv) {
        this.$().Empty();
        this.$item = null;
        if (BaseObject.is(nv, "UIMenuItem")) {
            var tml,item;
            if (nv.is("UIMenuStrip")) {
                var items = nv.get_items();
                for (var i = 0; i < items.length; i++) {
                    tml = this.$_template.replace("%%%", items[i].get_classname() );
                    Materialize.cloneTemplate(this.root, tml, items[i]);
                }
                this.rebind();
                this.updateTargets();    
            } else {
                tml = this.$_template.replace("%%%", nv.get_classname() );
                this.$item = Materialize.cloneTemplate(this.root, tml, nv);
                this.rebind();
                this.updateTargets();
            }
        }
    });
    UIMenuSlot.prototype.$_template = '<div data-class="%%%"></div>';
    UIMenuSlot.prototype.$item = null;

    UIMenuSlot.prototype.init = function() {

    }

})();