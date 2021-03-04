/*
	New version of onStructuralQuery implementation - relies on more basic features and makes possible handlers to be written 
	directly, skipping the onStructuralQuery without much trouble. Handling tables are no longer needed - save some space, more clear debugging etc.
*/
/*IMPL HELPER*/
// Usage: MyClass.Implement(IStructuralQueryProcessorImpl);
function IStructuralQueryProcessorImpl() { }
IStructuralQueryProcessorImpl.InterfaceImpl(IStructuralQueryProcessor, "IStructuralQueryProcessorImpl");
IStructuralQueryProcessorImpl.classInitialize = function(cls, precallback, postcallback) {
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
	if (typeof precallback != null || postcallback != null) {
		cls.prototype.processStructuralQuery = function(query, processInstructions) {
			if (BaseObject.is(query,"BaseObject")) {
				if (typeof precallback == "string" ) {
					if (this[precallback](query, processInstructions)) return true;
				} else if (typeof precallback == "function") {
					if (precallback.call(this, query, processInstructions)) return true;
				}
				var methodName = "onStructuralQuery_" + query.classType();
				if (typeof this[methodName] == "function") {
					if (this[methodName](query, processInstructions)) return true;
				}
				if (typeof postcallback == "string" ) {
					if (this[postcallback](query, processInstructions)) return true;
				} else if (typeof postcallback == "function") {
					if (postcallback.call(this, query, processInstructions)) return true;
				}
			}
			return false;
		};
	} else {
		cls.prototype.processStructuralQuery = function(query, processInstructions) {
			if (BaseObject.is(query,"BaseObject")) {
				var methodName = "onStructuralQuery_" + query.classType();
				if (typeof this[methodName] == "function") {
					return this[methodName](query, processInstructions);
				}
			}
			return false;
		};
	}

};