/*
	For a number of reasons IAsyncResult became mostly schedulable feature too integrated with task schedulers
	structural features etc. This makes it too heavy for usage in places where one will probably want to see something
	like Promise. IOperation is a clean start which will be integrated with IAsyncResult implementations as soon as its
	experimental usage finishes. Instead of trying to emulate promises where they are not supported we are going to
	use our own approach - somewhat similar to them.
	
	To keep possible to easilly combine this with IAsyncResult the member names will be a bit longer.
	
	Unlike promises this is consructed in levels - simple interface for marking fulfilment or failure
	Then Interface that adds clients .... etc.
	
	See next: IOperationHandling
*/

/*INTERFACE*/
function IOperation() {}
IOperation.Interface("IOperation");
IOperation.prototype.isOperationComplete = function() { throw "not implemented";}  // Return true/false
IOperation.prototype.isOperationSuccessful = function() { throw "not implemented";} // Return true/false or null if not complete
IOperation.prototype.getOperationErrorInfo = function() { throw "not implemented";} // Return info (could be null) on failure, otherwise throw error
IOperation.prototype.getOperationResult = function() { throw "not implemented";} // This must return the data only on success, throw error otherwise
IOperation.prototype.getOperationDescription = function() { throw "not implemented"; } // When not available an empty object implementing IOperationDescription should be created and returned
	
IOperation.prototype.CompleteOperation = function(/*bool*/ success, errorinfo_or_data) { throw "not implemented";}

// Static utilities:
IOperation.error = function(description, code, moreparams, severity) {
	var err = {
		severity: severity || "error", // Can be error, warning, information
		code: code || -1, // Any code agreed among parties, the value should be defined the specific service/executor. Codes <0 are reserved for system usage
		description: description || "Unspecified"
	};
	if (moreparams != null) {
		err = BaseObject.CombineObjects(err,moreparams);
	}
	return err;
}
IOperation.warning = function(description, code, moreparams, severity) {
	return IOperation.error(description, code, moreparams,severity || "warning");
}

// Helper for error reporting
// TODO: This did not catch - we should probably deprecate it?
//  Example: operation.CompleteOperation(
IOperation.errorname = function(/*In any order*/ _severity, _name, _moreparams) {
	var err = {
		severity: "error",
		code: -1,
		description: "Unspecified error"
	};
    var more = null;
    var severity = null;
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		if (typeof arg == "string") {
			if (arg.inSet(["error","warning","information"])) {
				severity = arg;
			} else {// error name
				var obj = OperationStandardErrorsEnum[arg];
				if (obj != null && typeof obj == "object") {
					err.code = obj.code;
					err.description = obj.description;
				}
			}
		} else if (typeof arg == "object" && arg != null) {
			more = arg;
		}
	}
	if (more != null) {
		return BaseObject.CombineObjects(err, more);
	} else {
		return err;
	}
}
