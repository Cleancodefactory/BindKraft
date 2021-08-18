(function() {
    function IAjaxRequester() {}
    IAjaxRequester.Interface("IAjaxRequester");

    /**
     * Sends an ajax request. The actual processing will depend on the implementation and usually depends on arguments passed to an implementor.
     * Overloads:
     * @overload function(url: {string|BKUrl}, data_or_reqdata: object, callback: callback, cache:boolean): void
     * @overload function(url: {string|BKUrl}, data_or_reqdata: object,cache:boolean): Operation
     * @overload function(request: {IAjaxRequest}, callback: callback,cache:boolean): void
     * @overload function(request: {IAjaxRequest}, cache:boolean): Operation
     * Arguments:
     * @param url - Can be url or BKUrl. 
     * @param request - Prepared request
     * @data_or_reqdata - object data to be sent through query string ot json post or multipart form post. (normal form post is not currently used)
     */
    IAjaxRequester.prototype.ajaxSendRequest = function(url_or_req, data_or_reqdata_or_callback, callback, cache) { throw "not impl."; }
})();