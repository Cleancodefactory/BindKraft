(function() {

    /**
     * This interface contains only the non-construction methods of the carrier!!!
     * The rest is implemented in the AjaxCarrier class without corresponding interface
     * 
     */
    function IAjaxCarrier() {}
    IAjaxCarrier.Interface("IAjaxCarrier");

    IAjaxCarrier.prototype.run = function() { throw "not implemented"; }
    /**
     * Async run should call run on next (further) javascript event cycle
     */
    IAjaxCarrier.prototype.asyncRun = function() { throw "not implemented"; }

})();