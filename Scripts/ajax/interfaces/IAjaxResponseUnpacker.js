(function() {

    function IAjaxResponseUnpacker() {}
    IAjaxResponseUnpacker.Interface("IAjaxResponseUnpacker");

    /**
     * @param objdata {object} the object containing the decoded response (it can be partial decoding) internally created by LightFetchHttp.getResponse
     *                          This data has a specific structure, containing the various pieces of data from the response arranged in a plain
     *                          Javscript object.
     * //TODO determine if there will be return result and what it should be.
     */
    IAjaxResponseUnpacker.prototype.unpackResponse = function(packedrequests, objdata) { throw "not impl.";}

})();