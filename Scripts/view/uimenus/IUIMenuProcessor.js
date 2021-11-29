(function() {

    /**
     * All menu processor interfaces have to extend this one.
     */
    function IUIMenuProcessor() {}
    IUIMenuProcessor.Interface("IUIMenuProcessor");

    IUIMenuProcessor.prototype.catchAll = function(signal, sender, data) { throw "not implemented"; }


})();