(function() {
    var LightFetchHttpProcessorBase = Class("LightFetchHttpProcessorBase");

    function LightFetchHttpRequestBase(fetcher) {
        LightFetchHttpProcessorBase.apply(this, arguments);
    }
    LightFetchHttpRequestBase.Inherit(LightFetchHttpProcessorBase, "LightFetchHttpRequestBase");


    LightFetchHttpRequestBase.prototype.encodeBodyData = function(xhr, data) {
        throw "not implemented";
        // Encode data and return it in a form in which it can be send with xmlHttpRequest
        // see MDN XMLHttpRequest.send
        // Currently according to specs: Document, Blob, BufferSource, FormData, URLSearchParams, string, null
        // If any adjustments are needed to xmlHttpRequest they can be applied to xhr argument.
    }


})();