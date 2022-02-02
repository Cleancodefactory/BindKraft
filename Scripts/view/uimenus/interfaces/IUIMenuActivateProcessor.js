(function() {

    /**
     * All menu processor interfaces have to extend this one.
     */
    function IUIMenuActivateProcessor() {}
    IUIMenuActivateProcessor.Interface("IUIMenuActivateProcessor" , "IUIMenuBaseProcessor");

    IUIMenuActivateProcessor.prototype.onActivate = function(sender, data) { throw "not implemented"; }

    //#region Helpers
    IUIMenuActivateProcessor.wrapMethod = function(obj, method) {
        var Wrapper_UIMenuActivateProcessor = Class("Wrapper_UIMenuActivateProcessor");
        return new Wrapper_UIMenuActivateProcessor(obj, method);
    }
    //#endregion

})();