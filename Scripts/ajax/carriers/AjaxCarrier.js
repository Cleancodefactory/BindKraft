(function() {
    var AjaxBase = Class("AjaxBase"),
        IAjaxSendQueuePickerImpl = InterfaceImplementer("IAjaxSendQueuePickerImpl"),
        IAjaxRequestPacker = Interface("IAjaxRequestPacker"),
        IAjaxResponseUnpacker = Interface("IAjaxResponseUnpacker"),
        IAjaxRequestSender = Interface("IAjaxRequestSender");

    /**
     * The carrier is responsible for driving the main part of the pipeline. It becomes a hub that connects many (if not most) of the other components
     * to form routes for the requests.
     * 
     * How is it connected:
     * 1 or more SendQueue inspectors connect it to a (the) IAjaxSendQueue - implemented by IAjaxSendQueuePickerImpl
     * 1 request packer
     * 1 response unpacker
     * 1 (packed) request sender
     * 
     * The carrier picks requests, passes them through the packer, sets both the packer and the unpacker on them, passes them to the sender.
     * The sender is responsible to queue internally all the requests send through it if it cannot send them immediately.
     * The carrier is also responsible to put the requests passed to the sender in the processing pool. 
     * 
     * Additional negotiation between carrier and sender is possible, but up to the implementer. Such a negotiation can prevent the carrier from
     * feeding too many requests to the sender whenever the sender is overburdened with work to do. THIS WILL PROBABLY BE ADDED AS REQUIRED FEATURE
     * IN THE RELEASE VERSION OF THIS BRANCH OF BinsKraft.
     * 
     * Aside of that the main responsibility of the carrier is to track the incoming requests and process them. This requires its run or/and asyncrun methods
     * to be called whenever a chance exists that the carrier will find appropriate requests in the send queue.
     * 
     * 
     * Not sure if we ara going to use this with multiple queue inspectors. Still it will be supported, but it might be impractical (We will see).
     * 
     */
    function AjaxCarrier() {
        AjaxBase.apply(this,arguments);
    }
    AjaxCarrier.Inherit(AjaxBase, "AjaxCarrier")
        .Implement(IAjaxSendQueuePickerImpl)
        .Implement(IAjaxCarrier);

    //#region Parameters
    AjaxCarrier.ImplementProperty("limit", new InitializeNumericParameter("Limit requests processed on each run.", 1));
    //#endregion


    //#region IAjaxCarrier
    AjaxCarrier.prototype.run = function() {
        // It is important to complete all the picked requests. For this reason any requests not passed to the sender have to be
        // cancelled/failed.
        var reqs, me = this;
        if (this.$inspectors.length > 0) {
            reqs = this.pickQueue(null, this.get_limit());
            if (reqs.length > 0) {
                packer = this.get_requestPacker();
                if (BaseObject.is(packer, "IAjaxRequestPacker")) {
                    this.LASTERROR().clear();
                    var packed = packer.packRequests(reqs);
                    if (packed != null) {
                        // Something to send is available
                        sender = this.get_requestSender();
                        if (packed.length > 0) {
                            packed.Each(function(i,r) {
                                r.set_progressQueue(me.get_progressQueue());
                                sender.sendRequest(r);
                            });
                        } else {
                            // No requests pACKED
                            this.LASTERROR( reqs.length + " requestes were picked, but the packer returned none.");
                            reqs.Each(function(idx, req) {
                                req.completeRequest(new AjaxErrorResponse(req, "Packing the request for sending failed. Packer: " + packer.classType()));
                            });
                        }
                        
                    } else {
                        this.AMMEND_LASTERROR("Failed to pack the requests");
                        reqs.Each(function(idx, req) {
                            req.completeRequest(new AjaxErrorResponse(req, "Packing the request for sending failed. Packer: " + packer.classType()));
                        });
                    }
                } else { // No packer 
                    this.LASTERROR("No request packer is set to the carrier");
                    reqs.Each(function(idx, req) {
                        req.completeRequest(new AjaxErrorResponse(req, "The carrier have no configured request packer."));
                    });
                }
            }
        }
    }
    AjaxCarrier.prototype.asyncRun = function() {
        this.callAsync(this.run);
    }
    //#endregion


    //#region Packer
    AjaxCarrier.prototype.$requestPacker = null;
    AjaxCarrier.prototype.get_requestPacker = function() { 
        return this.$requestPacker;
    }
    AjaxCarrier.prototype.set_requestPacker = function(v) {
        if (BaseObject.is(v, "IAjaxRequestPacker") || v == null) {
            this.$requestPacker = v; 
        } else {
            this.LASTERROR("Attempt to set request packer not supporting IAjaxRequestPacker");
        }
    }

    AjaxCarrier.prototype.$responseUnpacker = null;
    AjaxCarrier.prototype.get_responseUnpacker = function() {
        return this.$responseUnpacker;
    }
    AjaxCarrier.prototype.set_responseUnpacker = function(v) {
        if (BaseObject.is(v, "IAjaxResponseUnpacker") || v == null) {
            this.$responseUnpacker = v; 
        } else {
            this.LASTERROR("Attempt to set response unpacker not supporting IAjaxResponseUnpacker");
        }
    }
    //#endregion

    //#region Request sender
    AjaxCarrier.prototype.$requestsender = null;
    AjaxCarrier.prototype.get_requestSender = function() {
        return this.$requestsender;
    }
    AjaxCarrier.prototype.set_requestSender = function(v) {
        if (v == null || BaseObject.is(v, "IAjaxRequestSender")) {
            this.$requestsender = v;
        }
    }
    //#endregion

    //#region Progress queue
    AjaxCarrier.prototype.$progressQueue = null;
    AjaxCarrier.prototype.get_progressQueue = function() { 
        return this.$progressQueue;
    }
    AjaxCarrier.prototype.set_progressQueue = function(v) { 
        if (v == null || BaseObject.is(v, "IAjaxProgressQueue")) {
            this.$progressQueue = v;
        }
    }
    //#endregion

    
})();