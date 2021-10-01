(function() {

    var AjaxSendQueueInspectorSingleBase = Class("AjaxSendQueueInspectorSingleBase"),
        AjaxSendQueueInspectorMultiBase = Class("AjaxSendQueueInspectorMultiBase"),
        AjaxRequestSenderPool = Class("AjaxRequestSenderPool"),
        BKInit_AjaxQueueInspectorSingle = Class("BKInit_AjaxQueueInspectorSingle"),
        AjaxRequestSenderCancel = Class("AjaxRequestSenderCancel"),
        AjaxRequestPackerSingleJson = Class("AjaxRequestPackerSingleJson"),
        AjaxResponseUnpackerSingleResponse = Class("AjaxResponseUnpackerSingleResponse")
        AjaxRequestPackerDummy = Class("AjaxRequestPackerDummy");

    function BKInit_AjaxCarrier(carrier, pipeline) {
        BaseObject.apply(this, arguments);
        this.carrier = carrier;
        this.pipeline = pipeline;
        carrier.set_progressQueue(pipeline.get_sendqueue());
    }
    BKInit_AjaxCarrier.Inherit(BaseObject,"BKInit_AjaxCarrier");

    BKInit_AjaxCarrier.prototype.packWith = function(packer) { 
        this.carrier.set_requestPacker(packer);
        return this;
    }
    BKInit_AjaxCarrier.prototype.packJson = function() {
        this.carrier.set_requestPacker(new AjaxRequestPackerSingleJson());
        return this;
    }
    BKInit_AjaxCarrier.prototype.unpackWith = function(unpacker) {
        this.carrier.set_responseUnpacker(unpacker);
        return this;
    }
    BKInit_AjaxCarrier.prototype.unpackJson = function() {
        this.carrier.set_responseUnpacker(new AjaxResponseUnpackerSingleResponse());
        return this;
    }
    BKInit_AjaxCarrier.prototype.dummyPacking = function() {
        var p = new AjaxRequestPackerDummy();
        this.carrier.set_requestPacker(p);
        this.carrier.set_responseUnpacker(p);
        return this;
    }
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
    BKInit_AjaxCarrier.prototype.name = function(name) {
        this.carrier.set_name(name);
        return this;
    }
    BKInit_AjaxCarrier.prototype.customSender = function(sender) { 
        this.carrier.set_requestSender(sender);
        return this;
    }
    BKInit_AjaxCarrier.prototype.poolSender = function(nFetchers, fetcherCreator) { 
        var _fetchers = nFetchers || 2;
        var sender = new AjaxRequestSenderPool(_fetchers, fetcherCreator);
        this.carrier.set_requestSender(sender);
        return this;
    }
    BKInit_AjaxCarrier.prototype.cancel = function() { 
        var sender = new AjaxRequestSenderCancel();
        this.carrier.set_requestSender(sender);
        return this;
    }


})();