(function(){

    /**
     * This is a queue inspector that uses a request inspector to choose requests from the queue
     */
    function AjaxSendQueueInspectorSingleBase() {
        AjaxSendQueueInspectorBase.apply(this, arguments);
    }
    AjaxSendQueueInspectorSingleBase.Inherit(AjaxSendQueueInspectorBase,"AjaxSendQueueInspectorSingleBase")
        .Implement(IAjaxRequestInspectorUser);

    // Override
    AjaxSendQueueInspectorSingleBase.prototype.$checkQueue = function(queue, priority) {
        if (this.$requestInspector != null) {
            var reqs = queue.peekRequests(this.$requestInspector, priority);
            return reqs.length;
        } else {
            return []; // Usage without request inspector is prevented in order to force people to use the base class for non-inspected picking.
        }
    }

    //#region IAjaxRequestInspectorUser
    AjaxSendQueueInspectorBase.prototype.$requestInspector = null;
    AjaxSendQueueInspectorBase.prototype.get_requestinspector = function() {
         return this.$requestInspector;
    }
    AjaxSendQueueInspectorBase.prototype.set_requestinspector = function(v) {
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