(function(){

    function IAjaxRequestPacker() {}
    IAjaxRequestPacker.Interface("IAjaxRequestPacker");

    /**
     * The packer is responsible to convert the input request(s) into new ones where the data and other parameters are converted/encoded for sending through
     * the light http fetcher. It can also include additional headers, change the URL etc. The new request is IAjaxPackedRequest which extends IAjaxRequest, but also
     * keeps reference(s) to the original(s) and a reference to the unpacker to call when the response has to be decoded (usually the same as the packer).
     * 
     * @param requests {Array<IAjaxRequest>} Input requests.
     * @returns {Array<IAjaxPackedRequest>} The packed request(s). The returned number of requests can differ from the input if they are packed together
     *                                  in a batch request for example.
     */
    IAjaxRequestPacker.prototype.packRequests = function(requests) {throw "not impl."; }
})();