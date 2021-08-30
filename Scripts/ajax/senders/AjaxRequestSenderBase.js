(function() {

    function AjaxRequestSenderBase() {
        AjaxBase.apply(this, arguments);
    }

    AjaxRequestSenderBase.Inherit(AjaxBase, "AjaxRequestSenderBase")
        .Implement(IAjaxRequestSender);

    //#region IAjaxRequestSender
    AjaxRequestSenderBase.prototype.get_blocked = function() {throw "not implemented."; }

    // override
    AjaxRequestSenderBase.prototype.sendRequest = function(request) {
        // TODO: Try sending request, if the limitations prevent that, enqueue it and grab it when it becomes possible to send it.
    }
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
            response = new AjaxErrorResponse(null, message || "Your request received error response");
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
            return this.$requests.pop();
        }
        return null;
    }
    AjaxRequestSenderBase.prototype.$hasQueuedRequests = function() {
        return this.$requests.length > 0;
    }

    //#endregion

    //#region Fetcher pool
    //AjaxRequestSenderBase.prototype.reCreatePool
    //#endregion
})();