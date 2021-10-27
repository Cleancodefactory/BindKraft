
(function(){

    /**
     * A marking interface that is used by Defaults to fetch ambient defaults.
     * The interface can fetch only some values - Defaults will call readAmbientDefaultValue
     * and if it returns null will disregard it.
     */
    function IAmbientDefaultsConsumer() {}
    IAmbientDefaultsConsumer.Interface("IAmbientDefaultsConsumer");
    IAmbientDefaultsConsumer.RequiredTypes("IStructuralQueryEmiter");

    IAmbientDefaultsConsumer.prototype.readAmbientDefaultValue = function(name) { 
        throw "not implemented";
    }
})();