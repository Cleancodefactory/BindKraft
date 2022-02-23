(function(){

    var IAttachedInfoImpl = InterfaceImplementer("IAttachedInfoImpl");

    /**
     * 
     * 
     * 
     * data keys in wide use
     * 
     *   hide {boolean} - hide (true)/show (false) the menu item (the whole thing)
     *   open {boolean} - open (true)/close (false) a drop down part of a menu (usually a strip)
     *   text (string)  - text content for edit box items and anything else along these lines. (not the caption!)
     * 
     */
    function UIMenuItem() {
        BaseObject.apply(this, arguments);
    }
    UIMenuItem.Inherit(BaseObject, "UIMenuItem")
        .Implement(IAttachedInfoImpl)
        .ImplementProperty("caption", null, null, "fireChanged")
        .ImplementProperty("icon", null, null, "fireChanged") // Module/resource? IconSpec?
        .ImplementProperty("owner", null, null, "fireChanged") // Structural query sink
        .ImplementProperty("processor", null, null, "fireChanged") // Delegate-like
        .ImplementProperty("userdata")
        
        /**
         * Data contains an object accessed as index property in order to easily fire changed event.
         * We can create specialized menu items which provide dedicated accessors for individual fields in it for easy usage.
         */
        .ImplementIndexedProperty("data", new InitializeObject("data context for custom use shared between showing components and the processor"), null, "fireChanged")
        .ImplementProperty("hostComponentClass") // Explicit fallback specification of the ui component class that should show the item if nothing else is suggested by processor or owner
        .ImplementChainSetters(); // className of the Base component that will be slotted in the menu item area

    UIMenuItem.prototype.fireChanged = function() { 
        this.changed.invoke(this, null);
    }
    UIMenuItem.prototype.changed = new InitializeEvent("Any change");

})();