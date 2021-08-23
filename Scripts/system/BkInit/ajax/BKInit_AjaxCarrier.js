(function() {

    function BKInit_AjaxCarrier(carrier, pipeline) {
        BaseObject.apply(this, arguments);
        this.carrier = carrier;
        this.pipeline = pipeline;
    }
    BKInit_AjaxCarrier.Inherit(BaseObject,"BKIniti_AjaxCarrier");

    // Add queue inspector with a single rule
    BKInit_AjaxCarrier.prototype.addPickRule = function(fn) {
        var queueInspector = new AjaxSendQueueInspectorSingleBase();
        queueInspector.set_queue(this.pipeline.get_sendqueue());
        if (typeof fn == "function") {
            fn(new BKInit_AjaxQueueInspectorSingle(this.pipeline, queueInspector));
            this.carrier.addInspector(queueInspector);
        } else {
            throw "addPickRule requires a function(bkinit_queueinspector)";
        }
        return this;
    }
    // Add queue inspector with multiple rules
    BKInit_AjaxCarrier.prototype.addPickRules = function(fn) {
        var queueInspector = new AjaxSendQueueInspectorMultiBase();
        queueInspector.set_queue(this.pipeline.get_sendqueue());
        if (typeof fn == "function") {
            fn(new BKInit_AjaxQueueInspectorMulti(this.pipeline, queueInspector));
            this.carrier.addInspector(queueInspector);
        } else {
            throw "addPickRules requires a function(bkinit_queueinspector)";
        }
        return this;
    }
    

})();