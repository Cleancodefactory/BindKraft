


/*INTERFACE*/
function ICustomParameterization() { }
ICustomParameterization.Interface("ICustomParameterization");
ICustomParameterization.prototype.setObjectParameter = function (name, value) {
    throw "Not implemented";
};

// Helpers
// Must be called
ICustomParameterization.registerStdParamNames = function(cls, names) {
	var list = Array.createCopyOf(arguments,1);
	// if (Class.is(cls,"ICustomParameterization")) { // TODO: This makes it inconvenient - one must pay attention to the order of implementation. Better idea?
		if (BaseObject.is(cls.prototype.$customParameterizationAllowedParamsList, "Array")) {
			cls.prototype.$customParameterizationAllowedParamsList = cls.prototype.$customParameterizationAllowedParamsList.concat(list);
		} else {
			cls.prototype.$customParameterizationAllowedParamsList = list;
		}
	// }
}