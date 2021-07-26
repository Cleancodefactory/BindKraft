(function() {

    var IAjaxSendQueueInspector = Interface("IAjaxSendQueueInspector"),
        AjaxBase = Class("AjaxBase")
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

    AjaxSendQueueInspector.prototype.$criticalage = 1000;
    /**
     * The critical request age at which the requests should picked even if they are under the critical limit.
     */
    AjaxSendQueueInspector.prototype.get_criticalage = function() { return this.$criticalage; }
    AjaxSendQueueInspector.prototype.set_criticalage = function(v) { 
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
 
    AjaxSendQueueInspectorBase.prototype.checkQueue = function(_priority) { 
        var priority = _priority || this.$criticalpriority || null;
        var queue = this.get_queue();
        if (queue != null) {
            return this.$checkQueue(queue, priority);
        }
        return 0;
    }
    //Override
    /**
     * Override to implement variants. The default implementation assumes no checking on request characteristics except priority
     * @param queue {IAjaxSendQueue} The queue to inspect.
     * @param _priority {null|integer} Optional priority of the requests to count (all <= are counted)
     * @returns {integer} The number of requests in the queue matching the inspectors criteria.
     * 
     */
    AjaxSendQueueInspectorBase.prototype.$checkQueue = function(queue, priority) {
        var reqs = queue.peekRequests(function(req){
            return true;
        },priority);
        return reqs.length;
    }
    
    AjaxSendQueueInspectorBase.prototype.grabRequests = function(priority) { 
        var _priority = priority || this.$criticalpriority || -1;
        var queue = this.get_queue();
        var inspector = this.get_requestinspector();
        if (BaseObject.is(inspector, "IAjaxRequestInspector")) {
            // Use the inspector
        } else {
            if (priority != null) {
                // TODO
            } else {
                return queue.queueLength();
            }
        }
    }

    //#endregion

    
})();