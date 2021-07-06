(function() {
    function IAjaxRequesterImpl() {}
    IAjaxRequesterImpl.InterfaceImpl(IAjaxRequester);

    IAjaxRequesterImpl.classInitialize = function(cls) {
        cls.prototype.ajaxSendRequest = function(url_or_req, data_or_reqdata_or_callback, callback, cache) {
            if (BaseObject.is(url_or_req, "IAjaxRequest")) {
                var request = url_or_req;
                if (BaseObject.isCallback(data_or_reqdata_or_callback)) {

                } else {
                    if (typeof data_or_reqdata_or_callback == "boolean") {
                        request.set_cache(data_or_reqdata_or_callback);
                    }
                    var op = new Operation(); // TODO: Needs some safe timeouts etc.
                    request.completeRequest = function(response) {
                        if (BaseObject.is(response, "IAjaxResponse")) {
                            ///////////
                        } else {
                            ////////
                        }
                    }
                }
            }
        }
    }
})();