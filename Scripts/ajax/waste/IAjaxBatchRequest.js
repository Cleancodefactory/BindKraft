(function() {

    var IAjaxRequest = Interface("IAjaxRequest");

    /**
     * Extends IAjaxRequest and adds batch request management. The original request is the result
     * of encoding the requests in the batch. This is invoked by calling the packRequests method, which
     * will pack/repack them (if they were previously packed the work will be done again - allowing for 
     * all kinds of changes).
     */
    function IAjaxBatchRequest() {}
    IAjaxBatchRequest.Interface("IAjaxBatchRequest", IAjaxRequest);

    IAjaxBatchRequest.prototype.packRequests = function() {
        throw "not impl.";
    }

    IAjaxBatchRequest.prototype.$requests = new InitializeArray("");
    IAjaxBatchRequest.prototype.add = function(request) {
        if (BaseObject.is(request, "IAjaxRequest")) {
            this.$requests.push(request);
        }
    }
    IAjaxBatchRequest.prototype.remove = function(request_id) {

    }
    IAjaxBatchRequest.prototype.requestsCount = function() {

    }

    // TODO:

})();