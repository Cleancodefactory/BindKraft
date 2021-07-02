(function() {

    /**
     * This interface is mainly for use by the infrastructure and provides access to the raw data behind ajax library objects.
     */
    function IAjaxRawData() {}
    IAjaxRawData.Interface("IAjaxRawData");

    /**
     * Sets/gets the raw data backing the object (request, response, others ...)
     */
    IAjaxRawData.prototype.get_rawdata = function() { throw "not impl.";}
    IAjaxRawData.prototype.set_rawdata = function(v) { throw "not impl.";}
})();