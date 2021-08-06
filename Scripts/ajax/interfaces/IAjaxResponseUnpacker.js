(function() {

    function IAjaxResponseUnpacker() {}
    IAjaxResponseUnpacker.Interface("IAjaxResponseUnpacker");

    /**
     * @param packedrequest {IAjaxPackedRequest} The request to which this response belongs. It may contain one or many original requests (IAjaxRequest).
     *                          The unpacker may need some information from the original request in order to unpack the data into a response or responses.
     * @param objdata {object} the object containing the decoded response (it can be partial decoding) internally created by LightFetchHttp.getResponse
     *                          This data has a specific structure, containing the various pieces of data from the response arranged in a plain
     *                          Javscript object.
     * @returns {IAjaxResponse} The unpacked response. (// TODO What about multiple requests in a packed one).
     * //TODO determine if there will be return result and what it should be.
     */
    IAjaxResponseUnpacker.prototype.unpackResponse = function(packedrequest, objdata) { throw "not impl.";}

})();