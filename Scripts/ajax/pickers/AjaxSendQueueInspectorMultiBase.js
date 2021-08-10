(function(){

    var IAjaxRequestInspectorUser = Interface("IAjaxRequestInspectorUser"),
        AjaxSendQueueInspectorBase = Class("AjaxSendQueueInspectorBase"),
        IAjaxRequestInspector = Interface("IAjaxRequestInspector");

    /**
     * This is a queue inspector that uses multiple request inspector in AND modeto choose requests from the queue.
     * It can be configured to grab only up to 1 each time or more (picklimit)
     */
    function AjaxSendQueueInspectorMultiBase() {
        AjaxSendQueueInspectorBase.apply(this, arguments);
    }
    AjaxSendQueueInspectorMultiBase.Inherit(AjaxSendQueueInspectorBase,"AjaxSendQueueInspectorMultiBase")
        .Implement(IAjaxRequestInspectorsUser);

    // Override
    AjaxSendQueueInspectorMultiBase.prototype.$checkQueue = function(queue, priority) {
        var limit = this.get_picklimit();
        if (this.$requestInspector != null) {
            var reqs = queue.peekRequests(this.$requestInspector, priority, limit);
            return reqs;
        } else {
            return []; // Usage without request inspector is prevented in order to force people to use the base class for non-inspected picking.
        }
    }

    //#region IAjaxRequestInspectorUser
    AjaxSendQueueInspectorMultiBase.prototype.$requestInspector = null;
    AjaxSendQueueInspectorMultiBase.prototype.get_requestinspector = function() {
         return this.$requestInspector;
    }
    AjaxSendQueueInspectorMultiBase.prototype.set_requestinspector = function(v) {
        if (v == null) {
            this.$requestInspector = null;
        } else if (BaseObject.is(v, "IAjaxRequestInspector")) {
            this.$requestInspector = v;
        } else {
            this.LASTERROR("Unsupprted type set.", "set_requestinspector");
        }

    }
    //#endregion
})();