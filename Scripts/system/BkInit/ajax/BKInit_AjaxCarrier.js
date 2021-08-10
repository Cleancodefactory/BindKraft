(function() {

    function BKInit_AjaxCarrier(carrier, pipeline) {
        BaseObject.apply(this, arguments);
        this.carrier = carrier;
        this.pipeline = pipeline;
    }
    BKInit_AjaxCarrier.Inherit(BaseObject,"BKIniti_AjaxCarrier");

    BKInit_AjaxCarrier.prototype.pickSingle = function(fn) {
        var queueInspector = new AjaxSendQueueInspectorSingleBase();
        queueInspector.set_queue(this.pipeline.get_sendqueue());
        if (typeof fn == "function") {
            fn(new BKInit_AjaxQueueInspector(this.pipeline, queueInspector));
        } else {
            throw "pickSingle requires a function(bkinit_queueinspector)";
        }
        return this;
    }

})();