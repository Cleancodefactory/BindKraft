(function() {

    var IAjaxSendQueueInspector = Interface("IAjaxSendQueueInspector"),
        AjaxBase = Class("AjaxBase"),
        IAjaxRequestInspectorUser = Interface("IAjaxRequestInspectorUser");

    /**
     * Queue inspectors
     */
    function AjaxSendQueueInspectorBase() {
        AjaxBase.apply(this, arguments);
    }
    AjaxSendQueueInspectorBase.Inherit(AjaxBase,"AjaxSendQueueInspectorBase")
        .Implement(IAjaxSendQueueInspector);
        
    AjaxSendQueueInspectorBase.$defaultCriticalAge = 1000; // 1 second in milliseconds

    //#region IAjaxSendQueueInspector
    AjaxSendQueueInspectorBase.prototype.$queue = null;
    /**
     * Gets the queue on which the inspector works.
     */
    AjaxSendQueueInspectorBase.prototype.get_queue = function() { 
        return this.$queue;
    }
    /**
     * Sets the queue on which the inspector works.
     */
    AjaxSendQueueInspectorBase.prototype.set_queue = function(q) { 
        if (BaseObject.is(q, "IAjaxSendQueue") || q == null) {
            this.$queue = q;
        } else {
            this.LASTERROR("The argument can be an ajax send queue or null only");
        }
    }
 
    AjaxSendQueueInspectorBase.prototype.$criticallimit = null; // no limit => negative number
    /**
     * Critical limit over which (inclusive) the inspector picks requests. This is the number of requests matching the
     * inspector's criteria that have to be in the queue in order for the inspector to start picking them. This limit 
     * works in combination with $criticalage
     */
    AjaxSendQueueInspectorBase.prototype.get_criticallimit = function () {
        return this.$criticallimit;
    }
    AjaxSendQueueInspectorBase.prototype.set_criticallimit = function (v) {
        if (v == null) {
            this.$criticallimit = null;    
        } else if (typeof v == "number") {
            this.$criticallimit = v;
        } else {
            this.LASTERROR("Unsupported type", "set_criticallimit");
        }
    }

    AjaxSendQueueInspectorBase.prototype.$criticalage = AjaxSendQueueInspectorBase.$defaultCriticalAge;
    /**
     * The critical request age at which the requests should picked even if they are under the critical limit.
     */
     AjaxSendQueueInspectorBase.prototype.get_criticalage = function() { return this.$criticalage; }
     AjaxSendQueueInspectorBase.prototype.set_criticalage = function(v) { 
        if (typeof v == "number") {
            this.$criticalage = v;
        } else if (v != null) {
            var n = parseInt(v, 10);
            if (!isNaN(n)) {
                this.$criticalage = n;
            }
        } else if (v == null) {
            this.$criticalage = Class.getClassDef(this).$defaultCriticalAge || AjaxSendQueueInspectorBase.$defaultCriticalAge;
        }
    }
 
    AjaxSendQueueInspectorBase.prototype.$criticalpriority = null; 
    AjaxSendQueueInspectorBase.prototype.get_criticalpriority = function () {
        return this.$criticalpriority;
    }
    AjaxSendQueueInspectorBase.prototype.set_criticalpriority = function (v) {
        if (v == null) {
            this.$criticalpriority = null;
        } else if (typeof v == "number") {
            this.$criticalpriority = v;
        } else {
            this.LASTERROR("Unsupported type", "set_criticalpriority");
        }
    }

    AjaxSendQueueInspectorBase.prototype.$picklimit = 1; // Default 1 looks like a good idea
    AjaxSendQueueInspectorBase.prototype.get_picklimit = function() { return this.$picklimit; }
    AjaxSendQueueInspectorBase.prototype.set_picklimit = function(v) { 
        if (typeof(v) == "number" && !isNaN(v)) {
            this.$picklimit = Math.floor(v);
        } else {
            this.LASTERROR("Unsupported type was assigned top set_picklimit.", "set_picklimit");
        }
    }
 
    AjaxSendQueueInspectorBase.prototype.checkQueue = function(_priority) { 
        // TODO: apply critical age and critical limit
        var priority = _priority || this.$criticalpriority || null;
        var queue = this.get_queue();
        if (queue != null) {
            var reqs = this.$checkQueue(queue, priority);
            // Additional check in case it is not implemented in $checkRequest
            if (reqs.length > this.get_picklimit()) return reqs.slice(0, this.get_picklimit() - 1);
        }
        return [];
    }
    //Override
    /**
     * Override to implement variants. The default implementation assumes no checking on request characteristics except priority
     * @param queue {IAjaxSendQueue} The queue to inspect.
     * @param _priority {null|integer} Optional priority of the requests to count (all <= are counted)
     * @returns {Array<IAjaxRequestDetails>} Callers may use both the requests or only the number. The array peeks the requests.
     * 
     */
    AjaxSendQueueInspectorBase.prototype.$checkQueue = function(queue, priority) {
        var count = 0, limit = this.get_picklimit();

        var reqs = queue.peekRequests(function(req) {
            if (count > limit) return false; // Example honouring the picklimit.
            return true;
        },priority, limit);
        return reqs;
    }
    
    AjaxSendQueueInspectorBase.prototype.grabRequests = function(requests) { 
        if (BaseObject.is(this.$queue,"IAjaxSendQueue")) {
            if (Array.isArray(requests)) {
                var type = null;
                return requests.Select(function(idx, req) {
                    if (BaseObject.is(req, "IAjaxRequest")) {
                        if (type == null) type = "IAjaxRequest";
                        if (type != "IAjaxRequest") return null; // exclude this one
                        this.$queue.removeRequest(req);
                        return req;
                    } else if (BaseObject.is(req, "IAjaxRequestDetails")) {
                        if (type == null) type = "IAjaxRequestDetails";
                        if (type != "IAjaxRequestDetails") return null; // exclude this one
                        this.$queue.removeRequest(req.request);
                        return req;
                    }
                });
            }
        } 
        return []; // ??? or may be null ?
    }

    //#endregion

    
})();