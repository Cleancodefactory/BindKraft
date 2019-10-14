

function IManagedDataProvider() {}
IManagedDataProvider.Interface("IManagedDataProvider","IManagedInterface");
/**
	See comments in the  IManagedDataSupplier
*/
IManagedDataProvider.prototype.GetSupplier = function(parameters) { throw "not impl";}.ReturnType(IManagedDataSupplier);
