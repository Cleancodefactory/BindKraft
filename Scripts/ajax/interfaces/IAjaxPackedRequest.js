(function() {

    var IAjaxRequest = Interface("IAjaxRequest");

    /**
     * Packed request extends the normal request. Objects supporting this interface are returned from the IAjaxRequestPacker.packRequests. 
     * They contain the converted and ready to send form of the initial request(s) and keep reference to the original requests. The packer also 
     * saves a reference to itself in order to unpack the response when it returns.
     *
     */
    function IAjaxPackedRequest() {}
    IAjaxPackedRequest.Interface("IAjaxPackedRequest", IAjaxRequest);

    IAjaxPackedRequest.prototype.get_originalRequests = function() {throw "not impl.";}

    IAjaxPackedRequest.prototype.get_requestPacker = function() {throw "not impl.";}

    /**
     * Typically the request packers are implemented to support both packing and unpacking and for that reason
     * this property usually returns the same reference as requestPacker, but the unpacker MUST be obtained from 
     * this one in order to avoid problems if the packer and the unpacker happen to be separate.
     */
    IAjaxPackedRequest.prototype.get_responseUnpacker = function() {throw "not impl.";}
    IAjaxPackedRequest.prototype.set_responseUnpacker = function(v) {throw "not impl.";}

    /**
     * Reverse reference to the queue in which the request resides, can be null at some points.
     */
    IAjaxPackedRequest.prototype.get_progressQueue = function() {throw "not impl."; }
    IAjaxPackedRequest.prototype.set_progressQueue = function(v) {throw "not impl."; }

    /**
     * Holds the state of the request (unsent, waiting, complete)
     */
    IAjaxPackedRequest.prototype.get_progressState = function () { throw "not impl."; }
    IAjaxPackedRequest.prototype.set_progressState = function (v) { throw "not impl."; }

    /**
     * This is typically determined by the packer. It defines the data encoding for the posted data.
     * @type {string} The name of the encoding. The LightFetchHttp should be configured to support this encoding. This configuration
     *                  id usually made on workspace level. 
     */
    IAjaxPackedRequest.prototype.get_postencoding = function() { throw "not impl."; }
    IAjaxPackedRequest.prototype.set_postencoding = function(v) { throw "not impl."; }

    /**
     * Like the post encoding this is usually determined by the request packer, however the expectations are more often explicitly specified.
     */
    IAjaxPackedRequest.prototype.get_expectedtype = function() { throw "not impl."; }
    IAjaxPackedRequest.prototype.set_expectedtype = function(v) { throw "not impl."; }

})();