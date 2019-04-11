/*
	New version of onStructuralQuery implementation - relies on more basic features and makes possible handlers to be written 
	directly, skipping the onStructuralQuery without much trouble. Handling tables are no longer needed - save some space, more clear debugging etc.
*/
/*IMPL HELPER*/
// Usage: MyClass.Implement(IStructuralQueryProcessorImpl);
function IStructuralQueryProcessorImpl() { }
IStructuralQueryProcessorImpl.InterfaceImpl(IStructuralQueryProcessor);
IStructuralQueryProcessorImpl.classInitialize = function(cls) {
    cls.onStructuralQuery = function(_stype, method) {
		var stype = _stype;
		if (typeof _stype == "string") {
			stype = Class.getClassDef(_stype);
		}
		if (!Class.is(stype, "BaseObject")) {
			CompileTime.err("Cannot find the structural query class while implementing handler for it. The handler will not be created.");
			if (JBCoreConstants.CompileTimeThrowOnErrors) {
				throw "Cannot find the structural query class while implementing handler for it. The handler will not be created.";
			}
		}
		// generate method name
		var qryClassName = stype.classType;
		var methodName = "onStructuralQuery_" + qryClassName;
		cls.prototype[methodName] = method;
    };
};
IStructuralQueryProcessorImpl.prototype.processStructuralQuery = function(query, processInstructions) {
	if (BaseObject.is(query,"BaseObject")) {
		var methodName = "onStructuralQuery_" + query.classType();
		if (typeof this[methodName] == "function") {
			return this[methodName](query, processInstructions);
		}
	}
	return false;
};