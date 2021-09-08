(function(){

    /**
     * The sender has to support these features:
     *  - a queue for the requests fed into it,
     *  - indication if it is reasonable to accept more,
     *  - flush capability - with operation for completion (asynchronous).
     *  - Poke for sending - send what you can (synchronous)
     * The sender accepts whole requests only - any batch packing has to be done by a packer before that.
     * The sender has to accept all the requests sent to it, no matter what the indication says - it is up to the caller to decide
     * how to not overwhelm the sender.
     */
    function IAjaxRequestSender() {}
    IAjaxRequestSender.Interface("IAjaxRequestSender");

    /**
     * Schedules ALL the requests given synchronously, the actual sending may occur asynchronously.
     * Returns immediately with confirmation (true) or rejection (false). The rejection may occur, because the
     * sender reached its queue capacity (which is impacted by various conditions depending on the implementation, including number of concurrent requests).
     * 
     * @param request {IAjaxPackedRequest} A request to send
     * @returns {boolean} True if successfully scheduled for sending, false if not. When false is returned, the request is not completed!
     */
    IAjaxRequestSender.prototype.sendRequest = function(request) {throw "not implemented";} // Returns(boolean)

    /**
     * While this is to be used mostly internally by the sender, it is also exposed so that carriers can give it a push.
     * The method must send as much requests as possible/reasonable - e.g. use up all available connections if there are enough 
     * requests waiting or something along these lines in other kinds of implementations.
     */
    IAjaxRequestSender.prototype.trySend = function() {throw "not implemented";}

    /**
     * Has to consume all the currently scheduled requests and send them. The operation should complete when this is done.
     * It is allowed to return completed operation and continue flushing, but it is not recommended.
     */
    IAjaxRequestSender.prototype.flush = function() { throw "not implemented";} // Returns(Operation)

    /**
     * Cancel all scheduled requests. 
     * It is recommended to also cancel all sent requests which are not yet complete, but it is optional.
     */
    IAjaxRequestSender.prototype.cancel = function() { throw "not implemented";}

    /**
     * Returns true if the sender is overloaded with requests. Sending more requests in such a moment should be avoided if possible.
     * In practice this can be illustrated for example as "no free connections" in senders that maintain limited pool of connections.
     * It should be updated frequently or calculated when called.
     */
    IAjaxRequestSender.prototype.get_overloaded = function() {throw "not implemented"; }

    /**
     * // TODO Determine if this event can be scraped.
     * Should be fired asynchronously (in this.callAsync at least)
     */
    IAjaxRequestSender.prototype.flushedevent = new InitializeEvent("Fired when the sender's request buffer gets empty.");

    IAjaxRequestSender.prototype.uncloggedevent = new InitializeEvent("Fired when the sender has free resources for sending requests. There could be requests in the queue, calling trySend will consume from them.");

    IAjaxRequestSender.prototype.demandrequestsevent = new InitializeEvent("Fired when the sender has its queued requests sent and can reasonable process more. Usually listened by the carrier");

     //#region Under consideration
    /** DEPRECATED
     * Returns an operation that completes when the sender is ready.
     */
    // IAjaxRequestSender.prototype.get_unblock = function() {throw "not implemented.";}

    /** DEPRECATED
     * The request senders can obey limitations determined in way not described by this interface. The blocked property indicates
     * if they can accept new requests at this moment or the limiting logic blocks them to do so for now.
     * The inspectors must wait and retry. They can also use the get_unblock() property to get an operation that will complete when the sender unblocks
     */
    // IAjaxRequestSender.prototype.get_blocked = function() {throw "not implemented."; }

    //#endregion
    
})();