(function() {
    function IAjaxSendQueue() {}
    IAjaxSendQueue.Inteface("IAjaxSendQueue");

    IAjaxSendQueue.prototype.enqueueRequest = function(req, priority) { throw "not impl.";}
    IAjaxSendQueue.prototype.dequeueRequest = function(priority) { throw "not impl.";}

    /**
     * Picks (removes from the queue) the first request that matches the callback's conditions.
     */
    IAjaxSendQueue.prototype.pickRequest = function(callback) { throw "not impl.";}
    /**
     * Like pick request ut gets al the requests that match the callback
     */
    IAjaxSendQueue.prototype.pickRequests = function(callback) { throw "not impl.";}

    /**
     * Gets a reference to the request at index
     * @returns {IAjaxRequest} Returns null if the index is out of range
     */
    IAjaxSendQueue.prototype.peekRequest = function(index) { throw "not impl.";}

    /**
     * Returns array of the requests the inspector or callback approved without removing them.
     */
    IAjaxSendQueueEnumApi.prototype.peekRequests = function(requestInspector_or_callback) { throw "not implemented"; }
    

    /**
     * Cancels all the requests or if callback is supplied only those selected by the callback
     * @param callback {callback|IAjaxRequestInspector} Request selector
     * @returns {integer} The number of the canceled requests
     * 
     * Canceling requests includes reporting failure to the caller (the request sender)
     */
    IAjaxSendQueue.prototype.cancelRequests = function(callback) {throw "not impl.";}

    /**
     * @returns {integer} The number of all the requests in the queue
     */
    IAjaxSendQueue.prototype.queueLength = function() { throw "not impl.";}
})();