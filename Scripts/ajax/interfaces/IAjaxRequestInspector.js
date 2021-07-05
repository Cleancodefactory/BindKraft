(function() {
    /**
     * Driven by external logic to inspect one or more requests (one by one). the object implementing this interface
     */
    function IAjaxRequestInspector() {}
    IAjaxRequestInspector.Interace("IAjaxRequestInspector");

    /**
     * Inspects single request and returns arbitrary information about it. 
     * @param request {IAjaxRequest} The request to inspect
     * @returns {*} Arbitrary information about the request - depend on the implementation.
     * 
     * The returned result should be comparable with other results for equality (strongly recommended)
     */
    IAjaxRequestInspector.prototype.inspectRequest = function( request /*IAjaxRequest*/) { throw "not implemented"; }
})();