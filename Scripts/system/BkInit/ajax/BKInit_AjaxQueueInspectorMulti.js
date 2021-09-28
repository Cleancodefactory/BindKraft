(function(){

    var AjaxSendQueueInspectorBase = Class("AjaxSendQueueInspectorBase"),
        BKInit_AjaxQueueInspectorSingle = Class("BKInit_AjaxQueueInspectorSingle");

    function BKInit_AjaxQueueInspectorMulti(pipeline, inspector) {
        BaseObject.apply(this, arguments);
        this.inspector = inspector;
        this.pipeline = pipeline;
    }
    BKInit_AjaxQueueInspectorMulti.Inherit(BKInit_AjaxQueueInspectorSingle,"BKInit_AjaxQueueInspectorMulti");

    // Creates and configures an IAjaxRequestInspector to use with the queue inspector
    BKInit_AjaxQueueInspectorMulti.prototype.rule = function(classType, fn) { 
        throw "BKInit_AjaxQueueInspectorMulti does not support usage of the rule() method, use addRule instead.";
    }
    BKInit_AjaxQueueInspectorMulti.prototype.addRule = function(classType, fn) {
        if (Class.is(classType, "IAjaxRequestInspector")) {
            var inspectorClass = Class.getClassDef(classType);
            var inspector = new inspectorClass();
            if (typeof fn == "function") {
                fn(inspector);
                this.inspector.addInspector(inspector);
            } else {
                throw "BKInit_AjaxQueueInspectorSingle.rule requires a function that configures the created inspector";
            }
        } else {
            throw "BKInit_AjaxQueueInspectorSingle.rule requires as first argument name or type of a IAjaxRequestInspector";
        }
        return this;
    }
})();