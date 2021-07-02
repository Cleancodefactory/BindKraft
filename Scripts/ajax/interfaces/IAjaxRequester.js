(function() {
    function IAjaxRequester() {}
    IAjaxRequester.Interface("IAjaxRequester");

    IAjaxRequester.prototype.ajaxSendRequest = function(url_or_req, data_or_reqdata, cache) { throw "not impl."; }
})();