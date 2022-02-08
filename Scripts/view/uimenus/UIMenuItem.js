(function(){

    var IAttachedInfoImpl = InterfaceImplementer("IAttachedInfoImpl");

    function UIMenuItem() {
        BaseObject.apply(this, arguments);
    }
    UIMenuItem.Inherit(BaseObject, "UIMenuItem")
        .Implement(IAttachedInfoImpl)
        .ImplementProperty("caption", null, null, "fireChanged")
        .ImplementProperty("icon", null, null, "fireChanged") // Module/resource? IconSpec?
        .ImplementProperty("owner", null, null, "fireChanged") // Structural query sink
        .ImplementProperty("processor", null, null, "fireChanged") // Delegate-like
        //.ImplementProperty("processorType")
        .ImplementIndexedProperty("data", new InitializeObject("data context for custom use shared between showing components and the processor"), null, "fireChanged")
        .ImplementProperty("hostComponentClass") // Explicit fallback specification of the ui component class that should show the item if nothing else is suggested by processor or owner
        //.ImplementProperty("classname") // TODO: Remove this.
        .ImplementChainSetters(); // className of the Base component that will be slotted in the menu item area

    UIMenuItem.prototype.fireChanged = function() { 
        this.changed.invoke(this, null);
    }
    UIMenuItem.prototype.changed = new InitializeEvent("Any change");

})();