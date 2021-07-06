(function() {

    var IAjaxSendQueueInspector = Interface("IAjaxSendQueueInspector"),
        AjaxBase = Class("AjaxBase")
        IAjaxRequestInspectorUser = Interface("IAjaxRequestInspectorUser");

    function AjaxSendQueueInspector(){
        AjaxBase.apply(this, arguments);
    }
    AjaxSendQueueInspector.Inherit(AjaxBase,"AjaxSendQueueInspector")
        .Implement(IAjaxSendQueueInspector)
        .Implement(IAjaxRequestInspectorUser);

    //#region IAjaxSendQueueInspector
    AjaxSendQueueInspector.prototype.$queue = null;
    AjaxSendQueueInspector.prototype.get_queue = function() { 
        return this.$queue;
    }
    AjaxSendQueueInspector.prototype.set_queue = function(q) { 
        if (BaseObject.is(q, "IAjaxSendQueue") || q == null) {
            this.$queue = q;
        } else {
            this.LASTERROR("The argument can be an ajax send queue or null only");
        }
    }
 
    AjaxSendQueueInspector.prototype.$criticallimit = -1; // no limit => negative number
    AjaxSendQueueInspector.prototype.get_criticallimit = function () {
        return this.$criticallimit;
    }
    AjaxSendQueueInspector.prototype.set_criticallimit = function (v) {
        if (v == null) {
            this.$criticallimit = -1;    
        } else if (typeof v == "number") {
            this.$criticallimit = v;
        } else {
            this.LASTERROR("Unsupported type", "set_criticallimit");
        }
    }
 
    AjaxSendQueueInspector.prototype.$criticalpriority = -1; 
    AjaxSendQueueInspector.prototype.get_criticalpriority = function () {
        return this.$criticalpriority;
    }
    AjaxSendQueueInspector.prototype.set_criticalpriority = function (v) {
        if (v == null) {
            this.$criticalpriority = -1;
        } else if (typeof v == "number") {
            this.$criticalpriority = v;
        } else {
            this.LASTERROR("Unsupported type", "set_criticalpriority");
        }
    }
 
    AjaxSendQueueInspector.prototype.checkQueue = function(priority) { 
        var _priority = priority || this.$criticalpriority || -1;
        var queue = this.get_queue();
        var inspector = this.get_requestinspector();
        if (queue != null) {
            if (inspector != null) {
                
            } else {
                return queue.queueLength();
            }
        }
        
    }

    //#endregion

    //#region IAjaxRequestInspectorUser
    AjaxSendQueueInspector.prototype.$requestInspector = null;
    AjaxSendQueueInspector.prototype.get_requestinspector = function() {
         return this.$requestInspector;
    }
    AjaxSendQueueInspector.prototype.set_requestinspector = function(v) {
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