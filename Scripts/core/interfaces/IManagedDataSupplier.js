/**
	Interface designed as a contract for raw data extraction through Managed API. (API for cross-app communication)
*/
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
IManagedDataSupplier.prototype.get_supportsParameters = function() { throw "not impl"; }
/**
	@return {boolean}	True if orders are supported
*/
IManagedDataSupplier.prototype.get_supportsOrdering = function() { throw "not impl"; }
/**
	returns integer with bits set to 1 for the supported actions:
		bit:
			0 - GetRecords
			1 - SetRecords
			2 - RemoveRecords
	So, for example a fully functional supplier will return 7, a read only will return 1
	
	@remarks Suppliers that support write, but not read actions are not really expected and may cause problems. In case you need such "black holes" it is recommended
		to implement at least fake GetRecords method. 
			
*/
IManagedDataSupplier.prototype.get_supportsActions = function() { throw "not impl"; }
/**
	Write/set records back to source.
	The implementation has to take care for performing the right operation (e.g. insert/update in a db), generate key(s) etc,
*/
IManagedDataSupplier.prototype.SetRecords = function(records) { throw "not impl"; }
IManagedDataSupplier.prototype.RemoveRecords = function(records) { throw "not impl"; }