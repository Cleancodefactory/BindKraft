(function() {

    var IAjaxSendQueueInspector = Interface("IAjaxSendQueueInspector"),
        AjaxBase = Class("AjaxBase")
        IAjaxRequestInspectorUser = Interface("IAjaxRequestInspectorUser");

    function AjaxSendQueueInspectorBase() {
        AjaxBase.apply(this, arguments);
    }
    AjaxSendQueueInspectorBase.Inherit(AjaxBase,"AjaxSendQueueInspectorBase")
        .Implement(IAjaxSendQueueInspector)
        .Implement(IAjaxRequestInspectorUser);

    //#region IAjaxSendQueueInspector
    AjaxSendQueueInspectorBase.prototype.$queue = null;
    AjaxSendQueueInspectorBase.prototype.get_queue = function() { 
        return this.$queue;
    }
    AjaxSendQueueInspectorBase.prototype.set_queue = function(q) { 
        if (BaseObject.is(q, "IAjaxSendQueue") || q == null) {
            this.$queue = q;
        } else {
            this.LASTERROR("The argument can be an ajax send queue or null only");
        }
    }
 
    AjaxSendQueueInspectorBase.prototype.$criticallimit = -1; // no limit => negative number
    AjaxSendQueueInspectorBase.prototype.get_criticallimit = function () {
        return this.$criticallimit;
    }
    AjaxSendQueueInspectorBase.prototype.set_criticallimit = function (v) {
        if (v == null) {
            this.$criticallimit = -1;    
        } else if (typeof v == "number") {
            this.$criticallimit = v;
        } else {
            this.LASTERROR("Unsupported type", "set_criticallimit");
        }
    }
 
    AjaxSendQueueInspectorBase.prototype.$criticalpriority = -1; 
    AjaxSendQueueInspectorBase.prototype.get_criticalpriority = function () {
        return this.$criticalpriority;
    }
    AjaxSendQueueInspectorBase.prototype.set_criticalpriority = function (v) {
        if (v == null) {
            this.$criticalpriority = -1;
        } else if (typeof v == "number") {
            this.$criticalpriority = v;
        } else {
            this.LASTERROR("Unsupported type", "set_criticalpriority");
        }
    }
 
    AjaxSendQueueInspectorBase.prototype.checkQueue = function(inspector, priority) { 
        var _priority = priority || this.$criticalpriority || -1;
        var queue = this.get_queue();
        if (queue != null) {
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