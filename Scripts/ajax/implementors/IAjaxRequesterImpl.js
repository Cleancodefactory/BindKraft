(function() {

    var IAjaxRequester = Interface("IAjaxRequester");
    function IAjaxRequesterImpl() {}
    IAjaxRequesterImpl.InterfaceImpl(IAjaxRequester, "IAjaxRequesterImpl");

    IAjaxRequesterImpl.classInitialize = function(cls, _pipeline, _defaultPriority) {
        var defaultPriority = _defaultPriority || 0;
        var BKinit_AjaxPipeline = Class("BKinit_AjaxPipeline");
        var pipeline = _pipeline || BKinit_AjaxPipeline.$pipeline;
        


        cls.prototype.ajaxSendRequest = function(url_or_req, data_or_reqdata_or_callback, callback, cache) {
            return pipeline.ajaxSendRequest(this, url_or_req, data_or_reqdata_or_callback, callback, cache);            
        }

    }
})();