function IProcessingChain() { }
IProcessingChain.Interface("IProcessingChain");
IProcessingChain.DeclarationBlock({
	
	//name
	name: "r string * The name of the chain. This can be used as an identifier",
	
	//wares
    wares: "r array * The collection of chain wares.",
	/*first: "r any * A reference to the first chain ware.",
	last: "r any * A reference to the last chain ware.",*/
	
	//ware related methods
    append: function (els) {
        for (var i = 0; i < arguments.length; i++) {
            var el = arguments[i];
            if (BaseObject.is(el, "IProcessingChainWare")) {
                this.$wares.push(el);				
            } else {
                throw "Only IProcessingChainWare objects can be added to a processing chain";
            }
        }
        return this;
    },
	
    prepend: function (els) {
        for (var i = 0; i < arguments.length; i++) {
            var el = arguments[i];
            if (BaseObject.is(el, "IProcessingChainWare")) {
                this.$wares.unshift(el);
            } else {
                throw "Only IProcessingChainWare objects can be added to a processing chain";
            }
        }
        return this;
    },
	
    //context: "r any * The IProcessingChainContext based context",
    /*step: function (context, ar) { // The ar - AsyncResult is planned but not confirmed - do not use it for now
        throw "step must be implemented";
        // Implementation guidlines
        // The processing chain should make use of some default executor which may depend on the implementation
        // and some settings (probably set from outside) - again depending on the implementation

    }*/
});
