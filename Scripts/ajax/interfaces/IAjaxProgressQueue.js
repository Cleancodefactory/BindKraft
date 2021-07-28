(function(){

    /**
     * Implements a pool (queue is a misnomer) of all the requests given to IAjaxRequestSender-s. 
     * The requests here can be in unsent state, because they are waiting the particular sender to
     *  actually send them or in waiting response state or complete.
     * 
     * The requests in the queue are typically packed ones (IAjaxPackedRequest).
     * 
     * The queue serves two main purposes:
     *  - place for debugging
     *  - keeping track of requests in order to provide emergency operations like cancelling timeouted ones etc.
     * 
     */
    function IAjaxProgressQueue() {}
    IAjaxProgressQueue.Interface("IAjaxProgressQueue");

    IAjaxProgressQueue.prototype.putRequest = function(request) { throw "not impl.";}

    IAjaxProgressQueue.prototype.removeRequest = function(request) { throw "not impl.";}

    IAjaxProgressQueue.prototype.cancelRequest = function(request) { throw "not impl."; }

    /**
     * @param callback {callback} Proto: function(IAjaxRequest): boolean returns true for each request matching the 
     *                              implemented by the callback criteria.
     * @returns {Array<IAjaxRequest>} An array of references to all the requests (rather IAjaxPackedRequest-s) matching 
     *                                the callback's criteria.
     */
    IAjaxProgressQueue.prototype.peekRequests = function(callback) { throw "not impl."; }

})();