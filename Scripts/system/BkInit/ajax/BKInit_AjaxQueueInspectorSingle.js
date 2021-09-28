(function(){

    var AjaxSendQueueInspectorBase = Class("AjaxSendQueueInspectorBase");

    function BKInit_AjaxQueueInspectorSingle(pipeline, inspector) {
        BaseObject.apply(this, arguments);
        this.inspector = inspector;
        this.pipeline = pipeline;
    }
    BKInit_AjaxQueueInspectorSingle.Inherit(BaseObject,"BKInit_AjaxQueueInspectorSingle");

    // The number of qualifying requests in the send queue over which the picking can start
    BKInit_AjaxQueueInspectorSingle.prototype.criticalLimit = function(n) {
        if (n == null || typeof n == "number" && n > 0) {
            this.inspector.set_criticallimit(n);
        } else {
            throw "criticalLimit requires a number or null";
        }
        return this;
    }
    // Age over which critical limit does not matter anymore
    BKInit_AjaxQueueInspectorSingle.prototype.criticalAge = function(n) {
        if (n == null || typeof n == "number" && n > 0) {
            if (n == null) n = AjaxSendQueueInspectorBase.$defaultCriticalAge; // Default critical age
            this.inspector.set_criticalage(n);
        } else {
            throw "criticalAge requires a number of milliseconds or null for the default setting.";
        }
        return this;
    }
    // How many requests max to pick at once (the inspector does not pick them itself - it only reports them)
    BKInit_AjaxQueueInspectorSingle.prototype.pickLimit = function(n) { 
        if (n == null || typeof n == "number" && n > 0) {
            if (n == null) n = 1; // Default critical limit
            this.inspector.set_picklimit(n);
        } else {
            throw "criticalAge requires a number of milliseconds or null for the default setting.";
        }
        return this;
    }
    // Creates and configures an IAjaxRequestInspector to use with the queue inspector
    BKInit_AjaxQueueInspectorSingle.prototype.rule = function(classType, fn) { 
        if (Class.is(classType, "IAjaxRequestInspector")) {
            var inspectorClass = Class.getClassDef(classType);
            var inspector = new inspectorClass();
            if (typeof fn == "function") {
                fn(inspector);
                this.inspector.set_requestinspector(inspector);
            } else {
                throw "BKInit_AjaxQueueInspectorSingle.rule requires a function that configures the created inspector";
            }
        } else {
            throw "BKInit_AjaxQueueInspectorSingle.rule requires as first argument name or type of a IAjaxRequestInspector";
        }
        return this;
    }
})();