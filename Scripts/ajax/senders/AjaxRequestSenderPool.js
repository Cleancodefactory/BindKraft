(function(){

    var AjaxRequestSenderBase = Class("AjaxRequestSenderBase"),
        IAjaxResponseUnpacker = Interface("IAjaxResponseUnpacker"),
        PackedRequestStateEnum = Enumeration("PackedRequestStateEnum");

    /**
     * This sender uses as default post encoding "json" and "multipart" if any binary is available in the data.
     * It will use the packed request's suggestions if they exist (multipart has to be suggested by the packer in order to happen)
     * 
     * The expected type is always "packetxml", unless something else is suggested by the packed request
     */
    function AjaxRequestSenderPool(fcount, fetcherCreator) { 
        AjaxRequestSenderBase.apply(this, arguments);
        var _creator = fetcherCreator || this.$createFetcher;
        fcount = fcount || 1;
        for (var i = 0; i < fcount; i++) {
            this.$fetchers.push(_creator.call(this));
        }
    }
    AjaxRequestSenderPool.Inherit(AjaxRequestSenderBase,"AjaxRequestSenderPool");

    AjaxRequestSenderPool.prototype.sendRequest = function(req) {
        if (BaseObject.is(req, IAjaxPackedRequest)) {
            this.$enqueueRequest(req);
            this.trySend();
            return true;
        } else {
            return false;
        }
    }

    //#region Fetchers pool
    AjaxRequestSenderPool.prototype.$fetchers = new InitializeArray("Fetchers to use");
    AjaxRequestSenderPool.prototype.get_fetchersCount = function() {
        return this.$fetchers.length;
    }
    /**
     * Tries to send a request if there are any waiting - dequeues one and sends it if possible.
     * For the request to be send a free fetcher is also needed (in this implementation, others can behave differently)
     */
    AjaxRequestSenderPool.prototype.trySend = function() {
        if (this.$hasQueuedRequests()) {
            var fetcher = this.$fetchers.FirstOrDefault(function(idx, f){
                if (!f.isOpened()) return f;
                return null;
            });
            if (fetcher != null) {
                var req = this.$dequeueRequest();
                if (req != null) {
                    // We have to update the status in the processing queue to sent (waiting response)
                    req.set_progressState(PackedRequestStateEnum.sent);
                    var expected = req.get_expectedtype() || "packetxml";
                    if (req.get_verb() == "POST") {
                        // determine postdata encoding and expected type by the suggestions left in the IAjaxPAckedRequest
                        var postencode = req.get_postencoding() || "json";
                        fetcher.postEx(req.get_url(), req.get_reqdata(), teq.get_data(),postencode, expected).then(new Delegate(this, this.requestComplete,[req, fetcher])); 
                    } else { // Get by default
                        fetcher.get(req.get_url(), req.get_reqdata(), expected).then(new Delegate(this, this.requestComplete,[req, fetcher]));
                    }
                    return true;
                }
            } 
        } else {
            // TODO poke carrier 
        }
        return false;
    }
    AjaxRequestSenderPool.prototype.requestComplete = function(operation, request, fetcher) { 
        var response = null;
        if (operation.isOperationSuccessful()) {
            var responseData = operation.getOperationResult();
            var unpacker = request.get_responseUnpacker();
            if (unpacker == null) {
                unpacker = request.get_requestPacker();
            }
            
            if (BaseObject.is(unpacker, "IAjaxResponseUnpacker")) {
                response = unpacker.unpackResponse(request, responseData);
                // TODO return it ??
            } else {
                this.LASTERROR("Invalid response unpacker");
                this.$failRequest(request, null, "Invalid response unpacker, check the ajax configuration.");
            }
            if (response == null) {
                this.$failRequest(request, null, "Unknown error. No response was returned.");
            }
            
            // TODO create response with the unpacker
        } else {
            response = new AjaxErrorResponse(null, operation.getOperationErrorInfo())
            this.$failRequest(request, response);
            
        }
        this.trySend();
        // request.completeRequest(response);
    };

    // override to implement differently configured fetchers
    AjaxRequestSenderPool.prototype.$createFetcher = function() { 
        return new LightFetchHttp();
    }
    
    //#endregion

})();