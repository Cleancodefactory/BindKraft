/*
	Implementer for typical safe implementation of parameterization of view components.
	As parameters only the listed parameters are allowed.
	Usage:
	XXX.Implement(ICustomParameterizationStdImpl,"param1","param2");
	
*/
function ICustomParameterizationStdImpl() {}
ICustomParameterizationStdImpl.InterfaceImpl(ICustomParameterization, "ICustomParameterizationStdImpl");
ICustomParameterizationStdImpl.classInitialize = function(cls, params) {
	var list = Array.createCopyOf(arguments,1);
	if (BaseObject.is(cls.prototype.$customParameterizationAllowedParamsList, "Array")) {
		cls.prototype.$customParameterizationAllowedParamsList = cls.prototype.$customParameterizationAllowedParamsList.concat(list);
	} else {
		cls.prototype.$customParameterizationAllowedParamsList = list;
	}
	
	cls.prototype.setObjectParameter = function(name, value, type) {
		var allowed = this.$customParameterizationAllowedParamsList;
		if (this.$customParameterizationAllowedParamsList.indexOf(name) >= 0) return true;
		this.LASTERROR(_Errors.compose(), "Trying to set parameter " + name + " to " + this.classType() + ", but it is not allowed by ICustomParameterization");
		return false;
		/*for (var i = 0; i < allowed.length; i++) {
			if (name == allowed[i]) {
				return true;
			}
		}
		return false;*/
	}
}
// Helper methods for adding/removing parameters to declarations
// Mostly useful for implementers, but classes can use it too - especially removeParameters when
// they want to forbid a parameter usage which is by default allowed.
ICustomParameterizationStdImpl.addParameters = function(inst, parameters) {
	var arr = Array.createCopyOf(arguments, 1);
	if (arr.length > 0) {
		if (inst != null && BaseObject.is(inst.prototype.$customParameterizationAllowedParamsList,"Array")) {
			for (var i = 0; i < arr.length; i++) {
				if (typeof arr[i] == "string" && 
					arr[i].length > 0 && 
					inst.prototype.$customParameterizationAllowedParamsList.indexOf(arr[i]) < 0) {
						inst.prototype.$customParameterizationAllowedParamsList.push(arr[i]);
					}
			}
		}
	}
}
ICustomParameterizationStdImpl.removeParameters = function(inst, parameters) {
	var n, arr = Array.createCopyOf(arguments, 1);
	if (arr.length > 0) {
		if (inst != null && BaseObject.is(inst.prototype.$customParameterizationAllowedParamsList,"Array")) {
			for (var i = 0; i < arr.length; i++) {
				if (typeof arr[i] == "string" && 
					arr[i].length > 0) {
						n = inst.prototype.$customParameterizationAllowedParamsList.indexOf(arr[i]);
						if (n >= 0) {
							inst.prototype.$customParameterizationAllowedParamsList.splice(n,1);
						}
						
					}
			}
		}
	}
}
