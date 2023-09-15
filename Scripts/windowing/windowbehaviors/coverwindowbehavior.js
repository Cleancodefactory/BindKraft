(function() {
    var WindowStyleFlags = Enumeration("WindowStyleFlags"),
    WindowBehaviorBase = Class("WindowBehaviorBase"),
    IServiceLocator = Interface("IServiceLocator");

    function CoverWindowBehavior() {
        WindowBehaviorBase.apply(this,arguments);
    }
    CoverWindowBehavior.Inherit(WindowBehaviorBase, "CoverWindowBehavior")
        .Implement(IServiceLocator)
        .ImplementProperty("coverWindow")
        .ImplementProperty("autoflags", new InitializeNumericParameter("",WindowStyleFlags.visible | WindowStyleFlags.topmost| WindowStyleFlags.fillparent));

    CoverWindowBehavior.prototype.$nomultiuse = true;

    CoverWindowBehavior.prototype.locateService = function(iface, reason) {
        var typeName = Class.getTypeName(iface);
        if (typeName == "CoverWindowBehavior") {
            return this;
        }
        return null;
    }
    CoverWindowBehavior.prototype.showCover = function(){
        var w = this.get_coverWindow();
        if (BaseObject.is(w,"BaseWindow")) {
            w.setWindowStyles(this.get_autoflags(),"set");
            w.set_windowparent(this.$window);
            
        }

    }
    CoverWindowBehavior.prototype.hideCover = function(){
        var w = this.get_coverWindow();
        if (BaseObject.is(w,"BaseWindow")) {
            w.set_windowparent(null);
        }
    }
        
})();