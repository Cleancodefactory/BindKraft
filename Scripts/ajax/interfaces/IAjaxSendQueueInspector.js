(function() {

    /**
     * This can be implemented on its own, but its primary purpose is interoperation with IAjaxRequestInspector which is responsible for the identification of the requests.
     * IAjaxSendQueueInspector on the other hand is responsible to collect/generate aggregated information from the inspected queue. 
     * 
     * More about the implementations:
     * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     * 
     * This interface is the inspecting part of classes intended to collect and schedule requests for actual sending. The implementations 
     * can use any method for requests selection, but implementation using one or more IAjaxRequestInspector-s are the primary intent here.
     * 
     * Except the limit and age properties the interface has two main methods - checkQueue and grabRequests. The intended usage assumes that checkQueue
     * is called whenever the queue has to be checked. This may be done in response to several events - for instance:
     *  - by the queue when new request is added or not so often based on some rule.
     *  - Regularly on some intervals which may or may not be dependent on other conditions.
     *  - Whenever free carrier for the inspector's requests is available (the other side of the pipeline)
     * The result can be considered as the count of found requests or in other more general way to determine how much work is available for this inspector.
     * Then if the amount of work is considered worthy the array is passed to grabRequests method which is responsible to remove them from the queue and 
     * eliminate any request that became no longer available between the time of checkQueue and grabRequests (if any). Then the requests are sent to the 
     * carrier served by the inspector.
     * 
     */
    function IAjaxSendQueueInspector() {}
    IAjaxSendQueueInspector.Interface("IAjaxSendQueueInspector");

    /**
     * Gets/sets the IAjaxSendQueue to inspect. if auto inspection is needed the implementer should
     * subscribe for requestaddedevent in order to inspect each request as it arrives into the queue.
     */
    IAjaxSendQueueInspector.prototype.get_queue = function() { throw "not impl."; }
    IAjaxSendQueueInspector.prototype.set_queue = function(q) { throw "not impl."; }

    /**
     * The count over which the critical limit is considered to be reached. The limit applies to whatever the inspector is interested in.
     */
    IAjaxSendQueueInspector.prototype.get_criticallimit = function () {throw "not impl.";}
    IAjaxSendQueueInspector.prototype.set_criticallimit = function (v) {throw "not impl.";}

    /**
     * The critical request age at which the requests should picked even if they are under the critical limit.
     */
    IAjaxSendQueueInspector.prototype.get_criticalage = function() { throw "not implemented.";}
    IAjaxSendQueueInspector.prototype.set_criticalage = function(v) { throw "not implemented.";}

    /**
     * Critical priority under which the requests are checked. If set to negative number - all requests are checked.
     * This is used for the internal calls to checkQueue when the implementation is attached to the queue and also
     * as a default value whenever checkQueue is called without arguments.
     */
    IAjaxSendQueueInspector.prototype.get_criticalpriority = function () {throw "not impl.";}
    IAjaxSendQueueInspector.prototype.set_criticalpriority = function (v) {throw "not impl.";}

    /**
     * Limits the number of requests reported by checkQueue. For example a limit of 1 MUST cause checkQueue to stop
     * searching for further requests after finding one matching the criteria. grabRequests should not need a limitation in
     * normal usage - passing the requests found by checkQueue to grabRequests. However implementing the limitation there also
     * is RECOMMENDED.
     */
    IAjaxSendQueueInspector.prototype.get_picklimit = function() { throw "Not implemented"; }
    IAjaxSendQueueInspector.prototype.set_picklimit = function(v) { throw "Not implemented"; }

    /**
     * Returns an array of peeked of request details (IAjaxRequestDetails) in the queue that meet the inspected criteria and have priority lower or equal to the one specified.
     * Passing this array to grab requests will remove it from the queue. See the interface description for more usage information.
     * @param priority {integer|null}   The minimal priority to peek
     * @returns {Array<IAjaxRequestDetails>} Array of references to the requests matching the used criteria (usually IAjaxRequestInspector).
     * 
     * Often the Carrier which drives the queue inspector would be interested only in the number of the requests found, but as it is necessary 
     * to perform the sometimes costly operations for checking the requests it is more practical to obtain the list so that they can be grabbed if 
     * so decided without the need to recheck them.
     * 
     */
    IAjaxSendQueueInspector.prototype.checkQueue = function(priority) { throw "not impl.";}

    /**
     * This method usually works with the results produced by the checkQueue method, but it should support both Array<IAjaxRequest> and Array<IAjaxRequestDetails>
     * @param requests {Array<IAjaxRequest>|Array<IAjaxRequestDetails>} Requests or request details typically obtained from checkQueue.
     * @returns {Array<IAjaxRequest>|Array<IAjaxRequestDetails>} The same type of array as received. If the array contains mixed details and requests LASTERROR is set
     *          and the result contains only the first type met in the array.
     * 
     */
    IAjaxSendQueueInspector.prototype.grabRequests = function(requests) { throw "not implemented."; }

    IAjaxSendQueueInspector.prototype.queuefullevent = new InitializeEvent("Fired when the requests meeting the criteria in the queue pass certain limit.");
})();