function IParametersAccumulatorImpl() {}
IParametersAccumulatorImpl.InterfaceImpl(IParametersAccumulator, "IParametersAccumulatorImpl");
IParametersAccumulatorImpl.classInitialize = function(cls,_accsets) {// accsets - zero or more named sets, default (null) is always supported
	cls.prototype.$__parametersAccumulatorDefault = null;
	var accsets = Array.createCopyOf(arguments, 1); // empty if none specified
	if (accsets.length > 0) {
		var accumulatorsTemplate = {};
		cls.prototype.$__parametersAccumulators = new InitializeCloneObject("The object holding all the accumulators except the default.",accumulatorsTemplate);
		for (var i = 0; i < accsets.length; i++) {
			if (typeof accsets[i] == "string" && accsets[i].length > 0) {
				accumulatorsTemplate[accsets[i]] = null;
			} else {
				CompileTime.err("Usage of IParametersAccumulatorImpl while declaring " + cls.classType + " has incorrect parameter(s) - all specified accumulator sets have to be named with non-empty names.");
			}
		}
	}
	cls.prototype.getAccumulatedParameters = function(accset) { 
		if (accset == null) {
			return this.$__parametersAccumulatorDefault;
		} else {
			if (accset in this.$__parametersAccumulators) {
				return this.$__parametersAccumulators[accset];
			} else {
				return null;
			}
		}
	}
	cls.prototype.setAccumulatedParameters = function(accset, params) { 
		if (accset == null) {
			this.$__parametersAccumulatorDefault = params;
		} else {
			if (accset in this.$__parametersAccumulators) {
				this.$__parametersAccumulators[accset] = params;
			}
		}
	}
	cls.prototype.removeAccumulatedParameters = function(accset) { 
		if (accset == null) {
			this.$__parametersAccumulatorDefault = null;
		} else {
			if (accset in this.$__parametersAccumulators) {
				this.$__parametersAccumulators[accset] = null;
			}
		}
	}
	cls.prototype.removeAllAccumulatedParameters = function() { 
		this.$__parametersAccumulatorDefault = null;
		for (var i = 0; i < accsets.length; i++) {
			if (typeof accsets[i] == "string" && accsets[i].length > 0) { // Tomake the error not fatal.
				this.$__parametersAccumulators[accsets[i]] = null;
			}
		}
	}
	cls.prototype.combineAccumulatedParameters = function(accset, params) { 
		return this.setAccumulatedParameters(accset, params);
	}
	
	
}