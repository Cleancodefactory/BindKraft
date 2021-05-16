(function() {

    var LightFetchHttpProcessorBase = Class("LightFetchHttpProcessorBase");
    function LightFetchHttpResponseBase(fetcher) {
        LightFetchHttpProcessorBase.apply(this, arguments);
    }
    LightFetchHttpResponseBase.Inherit(LightFetchHttpProcessorBase, "LightFetchHttpResponseBase");



    LightFetchHttpResponseBase.prototype.adjustRequest = function(xhr) {
        throw "not implemented";
    }
    LightFetchHttpResponseBase.prototype.processResponse = function(xhr, result) {
        throw "not implemented";
    }


})();