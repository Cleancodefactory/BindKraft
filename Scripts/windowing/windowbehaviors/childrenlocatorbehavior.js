(function() {

    var WindowBehaviorBase = Class("WindowBehaviorBase"),
        IServiceLocator = Interface("IServiceLocator"),
        IElementsLocator = Interface("IElementsLocator");

    /**
     * Service locator and Element locator behavior enabling location or collection of children or the views in them by type.
     * Construction:
     * new ChildrenLocatorBehavior(["views"] ["windows"] ["service"] ["noservice"] ["elements"] ["noelements"] [depth])
     * With all arguments omitted it assumes "views" and depth of 1 and service location enabled only.
     * Lookups or collects the specified elements (windows and/or views) up to the specified depth.
     * The element can be found by any type it belongs to. 
     * 
     * Argument strings "service"/"noservice" turn on/off service locator (if off - it returns null always)
     * Argument strings "elements"/"noelements" turn on/off elements locator (if off - it returns empty [] always)
     * 
     * As a service locator this behavior is expected to return a single instance - call locateService for this effect
     * As an element locator this behavior is expected to return all the elements of a given type - call locateElements for this.
     * 
     * BaseWindow supports the idea that behaviours can be locators and will try them when asked.
     * 
     * Unlike other implementations of IElementsLocator this one does not use registration, instead it considers all view and or windows potential elements.
     * Condition can be passed as an argument to achieve more selective results.
     * 
     * 
     */
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
            if (arguments[i] == "service") {
                this.set_service(true);
            }
            if (arguments[i] == "noservice") {
                this.set_service(false);
            }
            if (arguments[i] == "elements") {
                this.set_elements(true);
            }
            if (arguments[i] == "noelements") {
                this.set_elements(false);
            }
            if (typeof arguments[i] == "number") {
                if (arguments[i] >= 0)
                this.set_depth(Math.floor(arguments[i]));
            }
        }
    }
    ChildrenLocatorBehavior.Inherit(WindowBehaviorBase, "ChildrenLocatorBehavior")
        .Implement(IServiceLocator)
        .Implement(IElementsLocator)
        .ImplementProperty("lookup", new InitializeArray("Kinds of objects to look for"))
        .ImplementProperty("service", new InitializeBooleanParameter("Locate service enabled", true))
        .ImplementProperty("elements", new InitializeBooleanParameter("Locate elements enabled", false))
        .ImplementProperty("depth", new InitializeNumericParameter("How deep to look. Default is 1 - only direct children", 1));


    //#region IElementsLocator
    ChildrenLocatorBehavior.prototype.locateElements = function(iface, condition) {
        if (this.isPaused() || !this.get_elements()) return [];
        var typeName = Class.getTypeName(iface);
        if (typeName != null) {
            return this.$collectElements(this.$window, typeName, condition, this.get_depth());
        }
        return [];
    }


    ChildrenLocatorBehavior.prototype.$collectElements = function (w, ifacename, reason, level, accumulator) {
        var accumulator = accumulator || [];
        if (level <= 0) return null;
        var i,c = null;
        if (BaseObject.is(w, "BaseWindow")) {
            for (i = 0; i < w.children.length; i++) {
                c = w.children[i];
                if (!BaseObject.is(c, "BaseWindow")) continue;
                if (this.get_lookup().indexOf("windows") >= 0) {
                    if (c.is(ifacename)) {
                        if (typeof reason == "string") {
                            if (c.get_windowName() == reason) accumulator.push(c);
                        } else if (BaseObject.isCallback(reason)) {
                            if (BaseObject.callCallback(reason,c)) accumulator.push(c);
                        } else {
                            accumulator.push(c);
                        }
                    }
                }
                if (this.get_lookup().indexOf("views") >= 0) {
                    if (BaseObject.is(c.currentView, ifacename)) {
                        if (BaseObject.isCallback(reason)) {
                            if (BaseObject.callCallback(reason,c.currentView)) accumulator.push(c);
                        } else {
                            accumulator.push(c.currentView);
                        }
                    }
                }
            }
            if (level > 1) {
                for (i = 0; i < w.children.length; i++) {
                    c = w.children[i];
                    this.$collectElements(c, ifacename, reason, level - 1, accumulator);
                }
            }
        }
        return accumulator;
    }

    //#endregion

    //#region IServiceLocator

    ChildrenLocatorBehavior.prototype.locateService = function(iface, reason) {
        if (this.isPaused() || !this.get_service()) return null;
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
            for (i = 0; i < w.children.length; i++) {
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
                    if (BaseObject.is(c.currentView, ifacename)) {
                        return c.currentView;
                    }
                }
            }
            if (level > 1) {
                for (i = 0; i < w.children.length; i++) {
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