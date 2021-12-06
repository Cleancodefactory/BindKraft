(function() {

    /**
     * All menu processor interfaces have to extend this one.
     */
    function IUIMenuBaseProcessor() {}
    IUIMenuBaseProcessor.Interface("IUIMenuBaseProcessor");

    IUIMenuBaseProcessor.prototype.catchAll = function(signal, sender, data) { throw "not implemented"; }


})();