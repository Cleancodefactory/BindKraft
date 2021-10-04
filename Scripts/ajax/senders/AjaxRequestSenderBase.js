(function() {

    var AjaxBase = Class("AjaxBase"),
        IAjaxRequestSender = Interface("IAjaxRequestSender"),
        AjaxErrorResponse = Class("AjaxErrorResponse");

    function AjaxRequestSenderBase() {
        AjaxBase.apply(this, arguments);
    }

    AjaxRequestSenderBase.Inherit(AjaxBase, "AjaxRequestSenderBase")
        .Implement(IAjaxRequestSender);

    //#region IAjaxRequestSender

    // override
    AjaxRequestSenderBase.prototype.sendRequest = function(request) {
        // TODO: Try sending request, if the limitations prevent that, enqueue it and grab it when it becomes possible to send it.
        throw "not implemented in base class";
    }
    // override
    AjaxRequestSenderBase.prototype.trySend = function() {
        // TODO Send what you can synchronously - use up all resources needed for sending and return (void)
        throw "not implemented in base class";
    }
    // override
    AjaxRequestSenderBase.prototype.flush = function() { 
        if (!this.$hasQueuedRequests()) return Operation.From(null);
        var op = new Operation(null, window.JBCoreConstants.LongOperationTimeout);
        this.uncloggedevent.add(this.thisCall(function() {
            if (!op.isOperationComplete()) {
                this.trySend();
                if (!this.$hasQueuedRequests()) op.CompleteOperation(true, null);
            } else {
                return false;
            }
        }));
        this.trySend();
        
        
        
        return op;
        // TODO Start sending, wait completion, continue the process until all buffered requests are sent. Return an operation(null) to indicate this.
        throw "not implemented in base class";
    } // Returns(Operation)

    AjaxRequestSenderBase.prototype.cancel = function() { 
        // TODO Any overriding method should call the parent implementation and then go on to implement more.
        if (this.$hasQueuedRequests()) {
            var req = null;
            while (req = this.$dequeueRequest()) {
                this.$failRequest(req, null, "Request has been canceled");
            }
        }
    }
    // override
    AjaxRequestSenderBase.prototype.get_overloaded = function() {throw "not implemented in base class";}

    /**
     * Fails the request and its original requests with the same response.
     * The response has to be unsuccessful in order to prevent wrong usage!
     * @param request {IAjaxPackedRequest} The request to fail - required
     * @param response {IAjaxResponse && IAjaxCloneable} The response to apply
     * @param message {string} Optional, required if response is null
     */
    AjaxRequestSenderBase.prototype.$failRequest = function(request, response, message) {
        if (response != null) {
            if (!BaseObject.is(response, "IAjaxResponse") || response.get_success()) {
                return null;
            }
            if (!BaseObject.is(response, "IAjaxCloneable")) return null;
        } else {
            response = new AjaxErrorResponse(message || "Your request received error response");
        }
        if (BaseObject.is(request, "IAjaxPackedRequest")) {
            var originals = request.get_originalRequests();
            if (originals != null && Array.isArray(originals)) {
                for (var i = 0; i < originals.length; i++) {
                    originals[i].completeRequest(response.cloneAjaxComponent());
                }
            }
            request.completeRequest(response.cloneAjaxComponent());
        }
        return response;
    }
    

    //IAjaxRequestSender.prototype.unblockedevent = new InitializeEvent("Fired when the sender can accept more requests");
    //#endregion

    //#region Internal queue
    AjaxRequestSenderBase.prototype.$requests = new InitializeArray("Buffered requests");
    AjaxRequestSenderBase.prototype.$enqueueRequest = function(r) {
        if (BaseObject.is(r, "IAjaxRequest")) {
            var r = this.$requests.unshift(r);
        } else {
            this.LASTERROR("Attempt to enqueue non-IAjaxRequest object.");
        }
        return -1;
    }
    AjaxRequestSenderBase.prototype.$dequeueRequest = function() {
        if (this.$requests.length > 0) {
            var req = this.$requests.pop();
            if (this.$requests.length == 0) {
                this.callAsync(function() {
                    this.flushedevent.invoke(this, null);
                });
            }
            return req;
        }
        return null;
    }
    AjaxRequestSenderBase.prototype.$hasQueuedRequests = function() {
        return this.$requests.length > 0;
    }

    //#endregion

})();