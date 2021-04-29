(function() {


    function LightFetchHttpResponseBase(fetcher) {
        BaseObject.apply(this, arguments);
    }
    LightFetchHttpResponseBase.Inherit(BaseObject, "LightFetchHttpResponseBase");



    LightFetchHttpResponseBase.prototype.adjustRequest = function(xhr) {
        throw "not implemented";
    }
    LightFetchHttpResponseBase.prototype.processResponse = function(xhr, result) {
        throw "not implemented";
    }


})();