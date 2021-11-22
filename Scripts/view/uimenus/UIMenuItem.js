(function(){

    function UIMenuItem() {
        BaseObject.apply(this, arguments);
    }
    UIMenuItem.Inherit(BaseObject, "UIMenuItem")
        .ImplementProperty("caption")
        .ImplementProperty("icon") // Module/resource? IconSpec?
        .ImplementProperty("owner") 
        .ImplementProperty("processor"); // callback delegates - like




})();