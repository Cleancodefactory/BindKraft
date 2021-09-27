(function(){

    var IAjaxRequestInspectorUser = Interface("IAjaxRequestInspectorUser"),
        AjaxSendQueueInspectorBase = Class("AjaxSendQueueInspectorBase"),
        IAjaxRequestInspector = Interface("IAjaxRequestInspector"),
        IAjaxRequestInspectorsUserImpl = InterfaceImplementer("IAjaxRequestInspectorsUserImpl");

    /**
     * This is a queue inspector that uses multiple request inspector in AND modeto choose requests from the queue.
     * It can be configured to grab only up to 1 each time or more (picklimit)
     */
    function AjaxSendQueueInspectorMultiBase() {
        AjaxSendQueueInspectorBase.apply(this, arguments);
    }
    AjaxSendQueueInspectorMultiBase.Inherit(AjaxSendQueueInspectorBase,"AjaxSendQueueInspectorMultiBase")
        .Implement(IAjaxRequestInspectorsUserImpl);

    // Override
    AjaxSendQueueInspectorMultiBase.prototype.$checkQueue = function(queue, priority) {
        var limit = this.get_picklimit();
        return queue.peekRequests(this, priority, limit);
    }

    
})();