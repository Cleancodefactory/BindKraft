(function(){

    /**
     * The sender has to support two things - a queue for the requests fed into it and indication if it should accept more.
     * The sender accepts whole requests only - any batch packing has to be done by a packer before that.
     * The sender has to accept all the requests sent to it, no matter what the indication says - it is up to the caller to decide
     * how to not overwhelm the sender.
     */
    function IAjaxRequestSender() {}
    IAjaxRequestSender.Interface("IAjaxRequestSender");

    /**
     * The request senders can obey limitations determined in way not described by this interface. The blocked property indicates
     * if they can accept new requests at this moment or the limiting logic blocks them to do so for now.
     * The inspectors must wait and retry. They can also use the get_unblock() property to get an operation that will complete when the sender unblocks
     */
    IAjaxRequestSender.prototype.get_blocked = function() {throw "not implemented."; }

    /**
     * Schedules ALL the requests given synchronously, the actual sending may occur asynchronously.
     * Returns immediately with confirmation (true) or rejection (false). The rejection may occur, because the
     * sender reached its queue capacity (which is impacted by various conditions depending on the implementation, including number of concurrent requests).
     * 
     * @param request {IAjaxPackedRequest} A request to send
     */
    IAjaxRequestSender.prototype.sendRequest = function(request) {throw "not implemented";}

    IAjaxRequestSender.prototype.unblockedevent = new InitializeEvent("Fired when the sender can accept more requests");

     //#region Under consideration
    /**
     * Returns an operation that completes when the sender is ready.
     */
    IAjaxRequestSender.prototype.get_unblock = function() {throw "not implemented.";}

    //#endregion
    
})();