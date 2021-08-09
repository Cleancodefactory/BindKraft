(function() {
    function IAjaxRequesterImpl() {}
    IAjaxRequesterImpl.InterfaceImpl(IAjaxRequester);

    IAjaxRequesterImpl.classInitialize = function(cls, _defaultPriority, _getSendQueue) {
        var defaultPriority = _defaultPriority || 0;
        function _sendQueue() {
            if (typeof _getSendQueue == "function") {
                return _getSendQueue();
            } else {
                return AjaxSendQueue.Default();
            }
        }

        function _enqueueRequest(req) {
            AjaxSendQueue.Default().enqueueRequest(req, defaultPriority);
        }


        cls.prototype.ajaxSendRequest = function(url_or_req, data_or_reqdata_or_callback, callback, cache) {

            if (BaseObject.is(url_or_req, "IAjaxRequest")) {
                var request = url_or_req;
                if (BaseObject.isCallback(data_or_reqdata_or_callback)) {
                    if (typeof callback == "boolean") {
                        request.set_cache(callback);
                    }
                    request.completeRequest = function(response) {
                        BaseObject.callCallback(data_or_reqdata_or_callback, response);
                    }
                    _enqueueRequest(request);
                    return true;
                } else {
                    if (typeof data_or_reqdata_or_callback == "boolean") {
                        request.set_cache(data_or_reqdata_or_callback);
                    }
                    var op = new Operation(); // TODO: Needs some safe timeouts etc.
                    request.completeRequest = function(response) {
                        if (BaseObject.is(response, "IAjaxResponse")) {
                            if (response.get_success()) {
                                op.CompleteOperation(true, response);
                            } else {
                                op.CompleteOperation(false, response.get_message);
                            }
                        } else {
                            op.CompleteOperation(false, "" + response);
                        }
                    }
                    _enqueueRequest(request);
                    return op;
                }
                
            } else { // URL then callback or op
                
                // Build a request ourselves
                var err = null;
                var _url = url_or_req;
                var _data = data_or_reqdata_or_callback;
                var _callback = null, _cache = false;
                if (BaseObject.isCallback(callback)) {
                    _callback = callback;
                } else if (typeof cache == "boolean") {
                    _cache = cache;
                }
                var request = new AjaxRequest(this);
                var bkurl = BKUrl.getBasePathAsUrl();
                if (typeof _url == "string" || BaseObject.is(_url, "BKUrl")) {
                    if (!bkurl.set_nav(_url)) request.set_constructionError("Cannot determine the url") ;
                } 
                request.set_url(bkurl);
                if (_data) request.set_data(_data);
                return this.ajaxSendRequest(request, callback || _cache, _cache != null?_cache: null);
            }
        }

    }
})();