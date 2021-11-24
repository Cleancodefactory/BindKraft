(function(){

    function UIMenuItem() {
        BaseObject.apply(this, arguments);
    }
    UIMenuItem.Inherit(BaseObject, "UIMenuItem")
        .ImplementProperty("caption")
        .ImplementProperty("icon") // Module/resource? IconSpec?
        .ImplementProperty("owner") // Structural query sink
        .ImplementProperty("processor") // Delegate-like
        .ImplementProperty("classname")
        .ImplementChainSetters(); // className of the Base component that will be slotted in the menu item area

})();