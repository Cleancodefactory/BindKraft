(function() {
    function IAjaxResponse() {}
    IAjaxResponse.Interface("IAjaxResponse");

    /**
     * @returns {object} The returned data - all the data
     */
    IAjaxResponse.prototype.get_data = function() { throw "not impl.";}

    /**
     * @returns {Boolean} true if the request was successful, false otherwise.
     */
    IAjaxResponse.prototype.get_success = function() { throw "not impl.";}

    /**
     * @returns {string} A status message about the request, can change during the request processing, will take final form when complete
     *                   This will be the error message if success is false.
     */
    IAjaxResponse.prototype.get_message = function() { throw "not impl.";}

    /**
     * The request to which this is a response.
     */
    IAjaxResponse.prototype.get_request = function() { throw "not impl.";}
})();