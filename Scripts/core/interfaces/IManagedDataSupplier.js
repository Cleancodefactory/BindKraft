function IManagedDataSupplier() {}
IManagedDataSupplier.Interface("IManagedDataSupplier",IManagedInterface);
/**
	@offset
	@limit
	@parameters {object}	Optional. If not supported exception must be thrown (see the remarks)
  @return {any}		{ count: { count: # }, list: [{},{}...] }
	
	@remarks Optionally IManagedDataSupplier can be obtained from IManagedDataProvider. If so the provider [should] accept parameters and set them as initial parameters
			of the generated and returned (provided) supplier. The supplier in turn [should] be able to change them on each call. However the implementation can skip
			a few ticks and do not support changing the parameters over the supplier. In this case the supplier [must] throw an excpetion if parameters are passed to the call to GetRecords.
			If IManagedDataProvider is implemented and used it [must] support parameters - it is not an optional feature. The provider can consume some of the parameters in order to determine 
			what/which supplier to return.
*/
IManagedDataSupplier.prototype.GetRecords = function(offset, limit, parameters) { throw "not impl";}; 
