/*
	This interface creates a convention for accumulated/predefined parameters/arguments usage where needed.
	The usage is based on this abstract procedure:
	1. Some parameters are possibly predefined
	2. Some parameters are possibly read at some early stage (can count as defaults for example).
	3. A procedure happens repeteadly or not that involves reading arguments every time from some source and their usage
		3.1. Each time these arguments are read and "mixed" in some fashion with the parameters from 1. and 2.
		3.2. The procudure is performed each time with the resulting parameters/arguments.
		
	This interface is designed to be used for the parameters in 1. and 2. for one or more parametrized procudures.
	If the procudure is only one and accset is not really needed one MUST still keep the argument purposed for its task, some
	it is strongly recommended to use null if you feel lazy to support a name for a single accumulated set.
	
	argument names used in the interface:
	accset - name of the accumulator - potentially many accumulators may be needed by the same instance. 
	params - the params to be remembered. No specific type is assumed here, only in specific implementations types can be defined for all or specific accsets
	
	The above implies that combineAccumulatedParameters cannot be mandatory method and MUST be implemented by default to do the same as setAccumulatedParameters (i.e. the only combaining is replacement).
	It is probably already obvious that the implementation of this interface mostly serves internal purposes and as interface serves certain integration and aggregation
	features for certain sets of classes covering specific functionality. So the interface usage may be needed for the integration, but will remain almost entirely hidden
	from any external users of these classes - only the developers of the classes will typically have to deal with the interface. This fact allows the interface to be fairly
	relaxed and count on the developers who create the series of classes that need it to add enough specialization to its function.
	
	
*/
function IParametersAccumulator() {}
IParametersAccumulator.Interface("IParametersAccumulator");
IParametersAccumulator.prototype.getAccumulatedParameters = function(accset) { throw "Not implemented"; }
IParametersAccumulator.prototype.setAccumulatedParameters = function(accset, params) { throw "Not implemented"; }
IParametersAccumulator.prototype.removeAccumulatedParameters = function(accset) { throw "Not implemented"; }
IParametersAccumulator.prototype.removeAllAccumulatedParameters = function() { throw "Not implemented"; }
IParametersAccumulator.prototype.combainAccumulatedParameters = function(accset, params) { throw "Not supported"; }
