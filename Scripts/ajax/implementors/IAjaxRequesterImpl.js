(function() {

    var IAjaxRequester = Interface("IAjaxRequester");
    function IAjaxRequesterImpl() {}
    IAjaxRequesterImpl.InterfaceImpl(IAjaxRequester, "IAjaxRequesterImpl");

    IAjaxRequesterImpl.classInitialize = function(cls, _defaultPriority, _pipeline) {
        var _pipeline = _pipeline || null;
        var defaultPriority = _defaultPriority || 0; // has to be used later
        

        cls.prototype.ajaxSendRequest = function(url_or_req, data_or_reqdata_or_callback, callback, cache) {
            var pipeline = Class("AjaxPipelines").Default().getPipeline(_pipeline); // Without arg gets the main pipeline.
            return pipeline.ajaxSendRequest(this, url_or_req, data_or_reqdata_or_callback, callback, cache);            
        }
        
    }
})();