(function() {

    var IAjaxConnected = Interface("IAjaxConnected");
        

    function IAjaxConnectedImpl() {}
    IAjaxConnectedImpl.InterfaceImpl(IAjaxConnected, "IAjaxConnectedImpl");

    IAjaxConnectedImpl.classInitialize = function(cls, _pipeline) {
        var defpipeline = _pipeline || null;
        cls.prototype.ajaxRequest = function(url, data) { 
            var AjaxRequest = Class("AjaxRequest"),
                AjaxRequestManipulator = Class("AjaxRequestManipulator");

            var pipeline = Class("AjaxPipelines").Default().getPipeline(defpipeline); // Without arg gets the main pipeline.
            if (pipeline == null) {
                this.LASTERROR("The specified ajax pipeline cannot be found: " + defpipeline + ". Using the default pipeline.");
                pipeline = Class("AjaxPipelines").Default().get_main();
            }
            var req = new AjaxRequest(this);
            m = new AjaxRequestManipulator(req, pipeline);
            if (url != null) m.url(url);
            if (data != null) m.data(data);
            return m;
        }
    }

})();