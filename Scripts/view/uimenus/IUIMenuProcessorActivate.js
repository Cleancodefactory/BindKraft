(function() {

    /**
     * All menu processor interfaces have to extend this one.
     */
    function IUIMenuProcessorActivate() {}
    IUIMenuProcessorActivate.Interface("IUIMenuProcessorActivate" , "IUIMenuProcessor");

    IUIMenuProcessorActivate.prototype.onActivate = function(sender, data) { throw "not implemented"; }

    //#region Helpers
    IUIMenuProcessorActivate.wrapMethod = function(obj, method) {
        var Wrapper_UIMenuProcessorActivate = Class("Wrapper_UIMenuProcessorActivate");
        return new Wrapper_UIMenuProcessorActivate(obj, method);
    }
    //#endregion

})();