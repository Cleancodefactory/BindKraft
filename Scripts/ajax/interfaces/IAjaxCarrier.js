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
    /**
     * Unlike asyncRun this method should only push the configured sender to try sending what it can from its internally queued requests.
     * This method is here for balancing purposes - to make sure the pipeline is progressing. If every component is written well enough then
     * usage of asyncPush should be redundant. However to compensate for any minor problems in the implementation of senders (mainly) and carriers
     * it should be invoked regularly.
     * 
     * The carrier must call trySend on its sender when called - that is all.
     */
    IAjaxCarrier.prototype.asyncPush = function() { throw "not implemented"; }

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

    /**
     * Optional, useful for better management of pipelines.
     */
    IAjaxCarrier.prototype.get_name = function() { throw "not implemented"; }
    IAjaxCarrier.prototype.set_name = function(v) { throw "not implemented"; }

})();