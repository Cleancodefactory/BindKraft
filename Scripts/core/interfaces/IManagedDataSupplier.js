function IManagedDataSupplier() {}
IManagedDataSupplier.Interface("IManagedDataSupplier",IManagedInterface);
/**
	@offset
	@limit
	@parameters {object}	Optional. If not supported exception must be thrown (see the remarks)
	@orders		{Array<Array>}	Optional. The same behavior as parameters (see the remarks)
  @return {any}		{ count: { count: # }, list: [{},{}...] }
	
	@remarks Optionally IManagedDataSupplier can be obtained from IManagedDataProvider. If so the provider [should] accept parameters and set them as initial parameters
			of the generated and returned (provided) supplier. The supplier in turn [should] be able to change them on each call. However the implementation can skip
			a few ticks and do not support changing the parameters over the supplier. In this case the supplier [must] throw an excpetion if parameters are passed to the call to GetRecords.
			If IManagedDataProvider is implemented and used it [must] support parameters - it is not an optional feature. The provider can consume some of the parameters in order to determine 
			what/which supplier to return.
			Orders are given as an array containing arrays with 0-el the name of the field, 1-st el the direction (positive/negative number)
			[[fn1,1],[fn2,-1]]
			
*/
IManagedDataSupplier.prototype.GetRecords = function(offset, limit, parameters, orders) { throw "not impl";}; 
/**
	@return {boolean}	True if parameters are supported
*/
IManagedDataSupplier.prototype.supportsParametrs = function() { throw "not impl"; }
/**
	@return {boolean}	True if orders are supported
*/
IManagedDataSupplier.prototype.supportsOrdering = function() { throw "not impl"; }
