(function(){
    var IAmbientDefaultsConsumer = Interface("IAmbientDefaultsConsumer");

    function IAmbientDefaultsConsumerImpl(){}
    IAmbientDefaultsConsumerImpl.InterfaceImpl(IAmbientDefaultsConsumer, "IAmbientDefaultsConsumerImpl");
    IAmbientDefaultsConsumerImpl.RequiredTypes("IStructuralQueryEmiter");

    IAmbientDefaultsConsumerImpl.classInitialize = function(cls) {

        cls.prototype.$__ambientDefaults = null;
        cls.prototype.readAmbientDefaultValue = function(name) { 
            if (this.$__ambientDefaults == null) {
                var p = new FindServiceQuery("IAmbientDefaults");
                if (this.throwStructuralQuery(p)) {
                    this.$__ambientDefaults = p.result;  
                }
            }
            if (this.$__ambientDefaults != null) {
                return this.$__ambientDefaults.getAmbientDefaultValue(this.classDefinition(), name);
            }
            return null;
        }

    }
})();