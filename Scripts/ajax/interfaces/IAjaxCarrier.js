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

    IAjaxCarrier.prototype.get_requestPacker = function() { throw "not implemented"; }
    IAjaxCarrier.prototype.set_requestPacker = function(v) { throw "not implemented"; }

    IAjaxCarrier.prototype.get_responseUnpacker = function() { throw "not implemented"; }
    IAjaxCarrier.prototype.set_responseUnpacker = function(v) { throw "not implemented"; }

    IAjaxCarrier.prototype.get_requestSender = function() { throw "not implemented"; }
    IAjaxCarrier.prototype.set_requestSender = function(v) { throw "not implemented"; }

    /**
     * The carrier is responsible to register the packed requests it gives to sender in the
     * progress queue if one is set in this property.
     */
    IAjaxCarrier.prototype.get_progressQueue = function() { throw "not implemented"; }
    IAjaxCarrier.prototype.set_progressQueue = function(v) { throw "not implemented"; }

})();