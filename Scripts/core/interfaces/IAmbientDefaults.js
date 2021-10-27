(function(){
    /**
     * This interface is typically provided as a service by an app, window or part of an app.
     * It should be available in some "local" manner for a part of an app (or the whole app) so
     * that consumers (usually through implementation of IAmbientDefaultsConsumer) can reach it and 
     * ask it for value defaults.
     */
    function IAmbientDefaults(){}
    IAmbientDefaults.Interface("IAmbientDefaults");

    IAmbientDefaults.prototype.getAmbientDefaultValue = function(obj_or_type, name) { throw "not impl" ;}
})();