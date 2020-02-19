function IValidatable() {}
IValidatable.Interface("IValidatable");
IValidatable.RequiredTypes("Base");

/**
	Returns the last known validity.
	
	@returns {ValidationResultEnum} of the last calculated value
*/
IValidatable.prototype.get_knownvalidity = function() { throw "not impl."; }
IValidatable.prototype.resetknownvalidity = function() {throw "not impl."; }

/**
	The default implementations should check if validation was made and perform it
	if not. The simplest way to do so is to check the knownvalidity and if it is 
	uninitialized, call performValidation and return the result. However, other 
	techniques are permitted.

	@reuturns {Operation} an operation
*/
IValidatable.prototype.get_checkvalidity = function() { throw "not impl."; }
/**
	Performs the validation and records the result in the data/field returned by get_knownvalidity();
	If it is synchronous the result is still packed in an operation for consistency (a completed one)
	
	@returns {Operation} with result the validation result.
*/
IValidatable.prototype.performValidation = function() { throw "not impl."; }

