
(function() {
    /**
     * 
     * @param {*} fetcher 
     */    
    function LightFetchHttpProcessorBase(fetcher) {
        BaseObject.apply(this, arguments);
        this.$fetcher = fetcher;
    }
    LightFetchHttpProcessorBase.Inherit(BaseObject, "LightFetchHttpProcessorBase");
    LightFetchHttpProcessorBase.prototype.$fetcher = null;

})();