
(function(){

    /**
     * This is a class intended for construction of a pipeline. In most cases a single pipeline for the system should be created,
     * but there is the possibility for more - app specific, task specific etc.
     * 
     * - 1 send queue - argument or AjaxSendQueue.Default()
     * - 1 carrier - self created (AjaxCarrier)
     * ? 1 progress queue - self created (AjaxProgressQueue)
     */
    /*
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
    }*/
    function AjaxPipeline() {
        BaseObject.apply(this, arguments);
    }
    AjaxPipeline.Inherit(BaseObject, "AjaxPipeline");

    AjaxPipeline.prototype.$carriers = new InitializeArray("All the carriers are registered here");
    AjaxPipeline.prototype.get_carrier = function(idx) { 
        if (idx >= 0 && idx < this.$carriers.length) {
            return this.$carriers[idx];
        }
        return null;
    };
    AjaxPipeline.prototype.findCarrier = function(name_or_callback) {
        if (typeof name_or_callback == "string") {
            return this.$carriers.FirstOrDefault(function(idx, carr) {
                if (carr.get_name() == name_or_callback) return carr;
                return null;
            });
        } else if (BaseObject.isCallback(name_or_callback)) {
            return this.$carriers.FirstOrDefault(function(idx, carr) {
                if (BaseObject.callCallback(name_or_callback, carr)) return carr;
                return null;
            });
        }
    }
    AjaxPipeline.prototype.addCarrier = function (v) { 
        if (BaseObject.is(v, "IAjaxCarrier")) {
            this.$carriers.push(v);
        } else {
            throw "The argument is not IAjaxCarrier";
        }
    }
    AjaxPipeline.prototype.removeCarrier = function (cr) {
        this.$carriers.Delete(function(idx, carr) {
            if (carr == cr) return true;
            if (BaseObject.isCallback(cr) && BaseObject.callCallback(cr, carr)) return true;
            return false;
        })
    }


    AjaxPipeline.prototype.$sendqueue = null;
    AjaxPipeline.prototype.get_sendqueue = function(){
        return this.$sendqueue;
    }
    AjaxPipeline.prototype.set_sendqueue = function(v) {
        if (v == null || BaseObject.is(v, "IAjaxSendQueue")) {
            this.$sendqueue = v;
        }
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
    AjaxPipeline.prototype.set_progressqueue = function(v) {
        if (v == null || BaseObject.is(v, IAjaxProgressQueue)) {
            this.$progressQueue = v;
        }
        // TODO: Should we clean this further
    }

    /* Singleton by construction (BKInit)
    AjaxPipeline.Default = (function() { 
        var instance = null;
        return function() { 
            if (instance == null) instance = new AjaxPipeline(null, true);
            return instance;
        }
    })();
    */

})();