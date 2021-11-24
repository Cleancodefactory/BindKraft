
(function() {
    function UIMenuSlot() {
        Base.apply(this,arguments);
    }
    UIMenuSlot.Inherit(Base, "UIMenuSlot");

    UIMenuSlot.ImplementProperty("menudata", new Initialize("Menu moeel based on UIMenuItem", null),null, function(ov, nv) {
        this.$().Empty();
        this.$item = null;
        if (Class.is(nv, "UIMenuItem")) {
            nv.get_classname();
            var tml = this.$_template.replace("%%%", nv.get_classname() );
            this.$item = Materialize.cloneTemplate(this.root, tml, nv);
            this.rebind();
            this.updateTargets();
        }
    });
    UIMenuSlot.prototype.$_template = '<div data-class="%%%"></div>';
    UIMenuSlot.prototype.$item = null;

    UIMenuSlot.prototype.init = function() {

    }

})();