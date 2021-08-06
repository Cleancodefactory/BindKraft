(function(){

    var AjaxRequestSenderBase = Class("AjaxRequestSenderBase"),
        IAjaxResponseUnpacker = Interface("IAjaxResponseUnpacker"),
        PackedRequestStateEnum = Enumeration("PackedRequestStateEnum");

    function AjaxRequestSenderPool(fcount) { 
        AjaxRequestSenderBase.apply(this, arguments);
        fcount = fcount || 1;
        for (var i = 0; i < fcount; i++) {
            this.$fetchers.push(this.$createFetcher());
        }
    }
    AjaxRequestSenderPool.Inherit(AjaxRequestSenderBase,"AjaxRequestSenderPool");

    AjaxRequestSenderPool.prototype.sendRequest = function(req) {
        if (BaseObject.is(req, IAjaxPackedRequest)) {
            
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
                    if (req.get_verb() == "POST") {
                        // TODO: How to determine postdata encode and expected type.
                        fetcher.postEx(req.get_url(), req.get_reqdata(), teq.get_data()).then(new Delegate(this, this.requestComplete,[req])); 
                    } else { // Get by default
                        fetcher.get(req.get_url(), req.get_reqdata()).then(new Delegate(this, this.requestComplete,[req]));
                    }
                    
                }
            }
        }
    }
    AjaxRequestSenderPool.prototype.requestComplete = function(operation, request, fetcher) { 
        if (operation.isOperationSuccessful()) {
            var responseData = operation.getOperationResult();
            var unpacker = request.get_responseUnpacker();
            if (unpacker == null) {
                unpacker = request.get_requestPacker();
            }
            if (BaseObject.is(unpacker, "IAjaxResponseUnpacker")) {
                unpacker.
            } else {
                this.LASTERROR("Invalid response unpacker")
            }
            // TODO create response with the unpacker
        } else {
            // TODO - cancel the request appropriately
        }
    };

    // override to implement differently configured fetchers
    AjaxRequestSenderPool.prototype.$createFetcher = function() { 
        return new LightFetchHttp();
    }
    
    //#endregion

})();