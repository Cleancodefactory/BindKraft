

function IManagedDataProvider() {}
IManagedDataProvider.Interface("IManagedDataProvider","IManagedInterface");
/**
	See comments in the  IManagedDataSupplier
*/
IManagedDataProvider.prototype.GetSupplier = function(parameters, orders) { throw "not impl";}.ReturnType(IManagedDataSupplier);
