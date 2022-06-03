(function() {

    var WindowBehaviorBase = Class("WindowBehaviorBase"),
        IServiceLocator = Interface("IServiceLocator");

    function ChildrenLocatorBehavior() {
        WindowBehaviorBase.call(this, true); // Single use only - one such behavior per window is allowed
        this.get_lookup().push("views"); // The default
        var typesReset = false;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] == "views") {
                if (!typesReset) {
                    typesReset = true;
                    this.get_lookup().splice(0);
                }
                this.get_lookup().push("views");
            } 
            if (arguments[i] == "windows") {
                if (!typesReset) {
                    typesReset = true;
                    this.get_lookup().splice(0);
                }
                this.get_lookup().push("windows");
            }
            if (typeof arguments[i] == "number") {
                if (arguments[i] >= 0)
                this.set_depth(Math.floor(arguments[i]));
            }
        }
    }
    ChildrenLocatorBehavior.Inherit(WindowBehaviorBase, "ChildrenLocatorBehavior")
        .Implement(IServiceLocator)
        .ImplementProperty("lookup", new InitializeArray("Kinds of objects to look for"))
        .ImplementProperty("depth", new InitializeNumericParameter("How deep to look. Default is 1 - only direct children", 1));

    //#region IServiceLocator

    ChildrenLocatorBehavior.prototype.locateService = function(iface, reason) {
        if (this.isPaused()) return null;
        var typeName = Class.getTypeName(iface);
        if (typeName != null) {
            return this.$searchService(this.$window, typeName, reason, this.get_depth());
        }
        return null;
    }

    ChildrenLocatorBehavior.prototype.$searchService = function (w, ifacename, reason, level) {
        if (level <= 0) return null;
        var i,c = null;
        if (BaseObject.is(w, "BaseWindow")) {
            for (i = 0; i < w.children; i++) {
                c = w.children[i];
                if (!BaseObject.is(c, "BaseWindow")) continue;
                if (this.get_lookup().indexOf("windows") >= 0) {
                    if (c.is(ifacename)) {
                        if (reason != null) {
                            if (c.get_windowName() == reason) return c;
                        } else {
                            return c;
                        }
                    }
                }
                if (this.get_lookup().indexOf("views") >= 0) {
                    if (BaseObject.is(c.currentView, "ifacename")) {
                        return c.currentView;
                    }
                }
            }
            if (level > 1) {
                for (i = 0; i < w.children; i++) {
                    c = w.children[i];
                    c = this.$searchService(c, ifacename, reason, level - 1);
                    if (c != null) return c;
                }
            }
        }
        return null;
    }

    //#endregion
    

})();