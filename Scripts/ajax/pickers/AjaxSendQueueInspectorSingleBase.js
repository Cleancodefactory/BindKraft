(function(){

    var IAjaxRequestInspectorUser = Interface("IAjaxRequestInspectorUser"),
        AjaxSendQueueInspectorBase = Class("AjaxSendQueueInspectorBase"),
        IAjaxRequestInspector = Interface("IAjaxRequestInspector");

    /**
     * This is a queue inspector that uses a single request inspector to choose requests from the queue.
     * It can be configured to grab only up to 1 each time or more (picklimit)
     */
    function AjaxSendQueueInspectorSingleBase() {
        AjaxSendQueueInspectorBase.apply(this, arguments);
    }
    AjaxSendQueueInspectorSingleBase.Inherit(AjaxSendQueueInspectorBase,"AjaxSendQueueInspectorSingleBase")
        .Implement(IAjaxRequestInspectorUserImpl);

    // Override
    AjaxSendQueueInspectorSingleBase.prototype.$checkQueue = function(queue, priority) {
        var limit = this.get_picklimit();
        return queue.peekRequests(this, priority, limit);
    }
    
})();