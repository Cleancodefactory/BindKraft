(function(){

    var AjaxSendQueueInspectorBase = Class("AjaxSendQueueInspectorBase");

    function BKInit_AjaxQueueInspector(pipeline, inspector) {
        BaseObject.apply(this, arguments);
        this.inspector = inspector;
        this.pipeline = pipeline;
    }
    BKInit_AjaxQueueInspector.Inherit(BaseObject,"BKInit_AjaxQueueInspector");

    BKInit_AjaxQueueInspector.criticalLimit = function(n) {
        if (n == null || typeof n == "number" && n > 0) {
            this.inspector.set_criticallimit(n);
        } else {
            throw "criticalLimit requires a number or null";
        }
        return this;
    }
    BKInit_AjaxQueueInspector.criticalAge = function(n) {
        if (n == null || typeof n == "number" && n > 0) {
            if (n == null) n = AjaxSendQueueInspectorBase.$defaultCriticalAge; // Default critical age
            this.inspector.set_criticallAge(n);
        } else {
            throw "criticalAge requires a number of milliseconds or null for the default setting.";
        }
        return this;
    }
    BKInit_AjaxQueueInspector.prototype.pickLimit = function(n) { 
        if (n == null || typeof n == "number" && n > 0) {
            if (n == null) n = 1; // Default critical limit
            this.inspector.set_picklimit(n);
        } else {
            throw "criticalAge requires a number of milliseconds or null for the default setting.";
        }
        return this;
    }
})();