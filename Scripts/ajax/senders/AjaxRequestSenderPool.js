(function(){

    var AjaxRequestSenderBase = Class("AjaxRequestSenderBase"),
        IAjaxResponseUnpacker = Interface("IAjaxResponseUnpacker"),
        PackedRequestStateEnum = Enumeration("PackedRequestStateEnum"),
        IAjaxPackedRequest = Interface("IAjaxPackedRequest"),
        AjaxErrorResponse = Class("AjaxErrorResponse");

    /**
     * This sender uses as default post encoding "json" and "multipart" if any binary is available in the data.
     * It will use the packed request's suggestions if they exist (multipart has to be suggested by the packer in order to happen)
     * 
     * The expected type is always "packetxml", unless something else is suggested by the packed request
     * 
     * @param fcount {integer} the number of fetchers to use for sending pool. If omitted - 1
     * @param fetcherCreator {function} Custom fetcher creator function. It must create a single LightFetchHttp object and return it. 
     *                                  Used when specially configured fetchers are necessary.
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

    // AjaxRequestSenderPool.prototype.flush = function() { 

    // } // Returns(Operation)

    AjaxRequestSenderPool.prototype.get_overloaded = function() {
        var fetcher = this.$fetchers.FirstOrDefault(function(idx, f){
            if (!f.isOpened()) return f;
            return null;
        });
        return (fetcher == null); // No free fetchers
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
    AjaxRequestSenderPool.prototype.$trySend = function() {
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
                        fetcher.postEx(req.get_url(), req.get_reqdata(), req.get_data(),postencode, expected).then(new Delegate(this, this.requestComplete,[req, fetcher])); 
                    } else { // Get by default
                        fetcher.get(req.get_url(), req.get_reqdata(), expected).then(new Delegate(this, this.requestComplete,[req, fetcher]));
                    }
                    return true;
                }
            } else {
                // clogged
            } 
        } else {
            this.demandrequestsevent.invoke(this, null);
        }
        return false;
    }
    AjaxRequestSenderPool.prototype.trySend = function() { 
        while(this.$trySend());
        if (!this.get_overloaded()) {
            this.uncloggedevent.invoke(this, null);
        }
    }
    AjaxRequestSenderPool.prototype.requestComplete = function(operation, request, fetcher) { 
        var response = null;
        if (operation.isOperationSuccessful()) {
            var responseData = operation.getOperationResult();
            var unpacker = request.get_responseUnpacker();
            if (unpacker == null) {
                unpacker = request.get_requestPacker();
            }
            
            // Get the configured unpacker and complete the request.
            if (BaseObject.is(unpacker, "IAjaxResponseUnpacker")) {
                unpacker.unpackResponse(request, responseData);
            } else {
                this.LASTERROR("Invalid response unpacker");
                this.$failRequest(request, null, "Invalid response unpacker, check the ajax configuration.");
            }
        } else {
            response = new AjaxErrorResponse(operation.getOperationErrorInfo())
            this.$failRequest(request, response);
            
        }
        fetcher.reset();
        this.trySend();
    };

    // override to implement differently configured fetchers
    AjaxRequestSenderPool.prototype.$createFetcher = function() { 
        return new LightFetchHttp();
    }
    
    //#endregion

})();