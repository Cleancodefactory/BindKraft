/**
	A connector designed to work over provided IManagedDataSupplier interface or over pair of IManagedDataProvider/IManagedDataSupplier interfaces
	
	Addressing:
		host - points to an object (usually Base derived in the view or app through service binding option)
		address - path to the property containing IManagedDataSupplier directly or IManagedDataProvider (if it is provider a supplier will be extracted from it)
					(extraction - currently on each call, caching may be in order)
	IoC: 
		host is asked for ITranslationProvider
			ITranslationProvider is asked for:
				ITranslateParamersToOrdersArray
				ITranslateParamersToLimitOffset
	
*/

//////
function DataSupplierConnector(arg, host) {
	Connector.apply(this,arguments);
	this.isAsync = true;
}
DataSupplierConnector.Inherit(Connector, "DataSupplierConnector");
DataSupplierConnector.ImplementProperty("orderExtractor", new Initialize("Order parameters translator", null));
DataSupplierConnector.ImplementProperty("pagingExtractor", new Initialize("Limit/offset parameters translator", null));
DataSupplierConnector.prototype.$getOrderExtractor = function() {
	var ext = this.get_orderExtractor(); // If set takes precedence
	if (BaseObject.is(ext, "ITranslateParamersToOrdersArray")) return ext;
	if (BaseObject.is(this.host, "ITranslatorProvider")) {
		ext = this.host.GetTranslator("ITranslateParamersToOrdersArray", this.get_adress());
		if (BaseObject.is(ext, "ITranslateParamersToOrdersArray")) return ext;
	}
	// create default
	return new DefaultDataSupplierOrderExtractor([["fieldtosort", "sortdirection"]]);
}
DataSupplierConnector.prototype.$getPagingExtractor = function() {
	var ext = this.get_pagingExtractor();
	if (BaseObject.is(ext, "ITranslateParamersToLimitOffset")) return ext;
	if (BaseObject.is(this.host, "ITranslatorProvider")) {
		ext = this.host.GetTranslator("ITranslateParamersToLimitOffset", this.get_adress());
		if (BaseObject.is(ext, "ITranslateParamersToLimitOffset")) return ext;
	}
	return new LimitOffsetParametersExtractor({limitName: "fieldtosort", offsetName: "sortdirection"});
}
DataSupplierConnector.prototype.resolve = function (callback) {
	if (this.host == null || this.$data == null || this.$data == "") {
		this.$reportResult(false, null, "Address or bind host empty", callback);
		return false;
	}
	
	var oext = this.$getOrderExtractor();
	
	var ordParams = oext.PerformTranslation(this.get_parameters());
	
	// host["a.get_b().c"]
	var iface = BaseObject.getProperty(this.host,this.$data,null); // Resolve as address to a provider/supplier
	if (BaseObject.is(iface, "IManagedDataProvider")) {
		// Request the supplier with all the parameters
		iface = iface.GetSupplier(this.get_parameters(), ordParams);
	}
	///////
	if (!BaseObject.is(iface, "IManagedDataSupplier")) {
		this.$reportResult(false, null, "The address must point to IManagedDataProvider or directly to IManagedDataSupplier", callback);
		return false;
	}
	// iface is an usable IManagedDataSupplier
	var pext = this.$getPagingExtractor(); // Limit offset extractor can now be used
	var pagParams = pext.PerformTranslation(this.get_parameters());
	
	var parameters = null;
	if (iface.get_supportsParameters()) {
		parameters = this.get_parameters();
	}
	if (!iface.get_supportsOrdering()) {
		ordParams = null;
	}
	// call the IManagedDataSupplier - expect [Raw results]
	var results = iface.GetRecords(pagParams.offset, ordParams.limit, parameters, orders);
	var self = this;
	if (BaseObject.is(results, "Operation")) {
		results.onsuccess(function(data) {
			self.$reportResult(true, data, null, callback);
		}).onfailure(function(err) {
			self.$reportResult(false, null, err, callback);
		});
		
	} else { // TODO: check results - May be using metatyping when ready
		self.$reportResult(true, results, null, callback);
	}
	return true;
};
// The data has to be set with set_resource before calling this.
DataSupplierConnector.prototype.update = function(callback) {
}