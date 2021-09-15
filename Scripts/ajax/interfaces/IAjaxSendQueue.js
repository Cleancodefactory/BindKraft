(function() {

    /**
     * Interface of the scheduled requests queue/pool. This is operated more like a pool and less like queue, because
     * requests are picked by inspectors that determine which ones they want to process.
     * 
     * The interface is a bit overloaded with methods which may remain unused. Still some of them could be left for 
     * administrative / debugging purposes. The actual operation of the queue depends on: 
     *  enqueueRequest, removeRequest, peekRequests
     */
    function IAjaxSendQueue() {}
    IAjaxSendQueue.Inteface("IAjaxSendQueue");

    IAjaxSendQueue.prototype.enqueueRequest = function(req, priority) { throw "not impl.";}
    IAjaxSendQueue.prototype.dequeueRequest = function(priority) { throw "not impl.";}

    /**
     * Removes the given request from the queue if it is in it.
     * Needed for queue inspectors that need to peek and then decide what to pick and what to leave.
     */
    IAjaxSendQueue.prototype.removeRequest = function(request) { throw "not impl."; }

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
    IAjaxSendQueueEnumApi.prototype.peekRequests = function(requestInspector_or_callback, priority, limit) { throw "not implemented"; }
    

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