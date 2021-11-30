
(function() {

    var IUIAppMenuHost = Interface("IUIAppMenuHost"),
        IUIMenuHost = Interface("IUIMenuHost");

    function UIAppMenuSlot() {
        Base.apply(this,arguments);
    }
    UIAppMenuSlot.Inherit(Base, "UIAppMenuSlot")
        .Implement(IUIAppMenuHost);

    //#region IUIMenuSlot

    UIAppMenuSlot.prototype.addMenu = function(m) { 
        
    }
    UIAppMenuSlot.prototype.removeMenu = function(cookie) { throw "not implemented"; }

    //#endregion

    UIAppMenuSlot.ImplementProperty("menus", new InitializeArray("All the added menus"));

    UIAppMenuSlot.ImplementProperty("menudata", new Initialize("Menu moeel based on UIMenuItem", null),null, function(ov, nv) {
        this.$().Empty();
        this.$item = null;
        // TODO The first item ?!?
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
    UIAppMenuSlot.prototype.$_template = '<div data-class="%%%"></div>';
    UIAppMenuSlot.prototype.$item = null;

    UIAppMenuSlot.prototype.init = function() {

    }

})();