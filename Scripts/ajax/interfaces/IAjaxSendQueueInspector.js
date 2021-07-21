(function() {

    /**
     * This can be implemented on its own, but its primary purpose is interoperation with IAjaxRequestInspector which is responsible for the identification of the requests.
     * IAjaxSendQueueInspector on theother hand is responsible to collect/generate aggregated information from the inspected queue.
     * 
     * The actual conditions being checked depend on the request inspector used.
     * 
     * The collected data is count (advanced versions may add more).
     * 
     * The limits are set in a way not covered by this interface
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
     * Critical priority under which the requests are checked. If set to negative number - all requests are checked.
     * This is used for the internal calls to checkQueue when the implementation is attached to the queue and also
     * as a default value whenever checkQueue is called without arguments.
     */
    IAjaxSendQueueInspector.prototype.get_criticalpriority = function () {throw "not impl.";}
    IAjaxSendQueueInspector.prototype.set_criticalpriority = function (v) {throw "not impl.";}

    /**
     * Returns the number of requests in the queue that meet the inspected criteria and have priority lower or equal to the one specified.
     */
    IAjaxSendQueueInspector.prototype.checkQueue = function(priority) { throw "not impl.";}

    /**
     * Performs the same tests as checkQueue, but picks the requests in question and performs the actions implemented by the specific inspector with them.
     * These actions typically include sending the requests to a packer (sender).
     */
    IAjaxSendQueueInspector.prototype.grabRequests = function(priority) { throw "not implemented."; }

    IAjaxSendQueueInspector.prototype.queuefullevent = new InitializeEvent("Fired when the requests meeting the criteria in the queue pass certain limit.");
})();