(function() {
    /**
     * This interface is implemented by hooks that want to be advised for http responses
     * Currently only error handling is implemented, others will be added.
     */
    function IAjaxHttpHook() { }
    IAjaxHttpHook.Interface("IAjaxHttpHook");

    /**
     * @param {object} responseData - the raw response data
     * @returns {bool} - exact false if handled and no further processing should be done,
     *                   true reserved
     *                   undefined if the processing should continue.
     */
    IAjaxHttpHook.prototype.onHttpError = function(httpStatus, responseData) { throw "not impl."; }

    //TODO: TO BE continued...
})();