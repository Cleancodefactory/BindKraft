(function(){

    /**
     * This is a class intended for construction of a pipeline. In most cases a single pipeline for the system should be created,
     * but there is the possibility for more - app specific, task specific etc.
     * 
     * - 1 send queue - argument or AjaxSendQueue.Default()
     * - 1 carrier - self created (AjaxCarrier)
     * ? 1 progress queue - self created (AjaxProgressQueue)
     */
    function AjaxPipeline(sendQueue, useProgressQueue) {
        BaseObject.apply(this, arguments);
        if (BaseObject.is(sendQueue, "IAjaxSendQueue")) { 
            this.$sendqueue = sendQueue;
        } else if (sendQueue === true) {
            this.$sendqueue = new AjaxSendQueue();
        } else {
            this.$sendqueue = AjaxSendQueue().Default();
        }
        this.$carrier = new AjaxCarrier();
    }
    AjaxPipeline.Inherit(BaseObject, "AjaxPipeline");

    AjaxPipeline.prototype.$carrier = null;
    AjaxPipeline.prototype.$sendqueue = null;
    AjaxPipeline.prototype.get_sendqueue = function(){
        return this.$sendqueue;
    }

    /**
     * @returns {IAjaxSendQueuePicker} The picker is configured with queue inspectors
     */
    AjaxPipeline.prototype.get_picker = function() {
        if (BaseObject.is(this.$carrier, "IAjaxSendQueuePicker")) {
            return this.$carrier;
        }
    }

    AjaxPipeline.prototype.$progressQueue = null;
    AjaxPipeline.prototype.get_progressqueue = function() {
        return this.$progressQueue;
    }

    AjaxPipeline.Default = (function() { 
        var instance = null;
        return function() { 
            if (instance == null) instance = new AjaxPipeline(null, true);
            return instance;
        }
    })();

})();