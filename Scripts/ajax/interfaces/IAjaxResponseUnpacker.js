(function() {

    /**
     * The unpackers are intended to convert from the response returned in LightFetchHttp object format to the 
     * response required by the request. The request may be one that demands all the data or only part of it. In 
     * other cases multiple requests can be packed into a single batch request and the unpacker ...
     * 
     */
    function IAjaxResponseUnpacker() {}
    IAjaxResponseUnpacker.Interface("IAjaxResponseUnpacker");

    /**
     * This method receives the packed request and the fetcher data. The unpackResponse has to:
     * - unpack the response or responses (from the main response)
     * - apply them to each original request held by the packed request. (can be one or many)
     * 
     * @param packedrequest {IAjaxPackedRequest} The request to which this response belongs. It may contain one or many original requests (IAjaxRequest).
     *                          The unpacker may need some information from the original request in order to unpack the data into a response or responses.
     *                          See the detailed description above.
     * @param objdata {object} the object containing the decoded response (it can be partial decoding) internally created by LightFetchHttp.getResponse
     *                          This data has a specific structure, containing the various pieces of data from the response arranged in a plain
     *                          Javscript object.
     * @returns {IAjaxResponse} The unpacked response. (for potential additional use - the most important action is described above)
     * 
     * 
     * (// DONE What about multiple requests in a packed one) - direct completion of each of them through the packed request
     * (// DONE determine if there will be return result and what it should be) - No need of return result. 
     */
    IAjaxResponseUnpacker.prototype.unpackResponse = function(packedrequest, objdata) { throw "not impl.";}

})();