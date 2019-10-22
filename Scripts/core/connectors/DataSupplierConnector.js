

//////
function DataSupplierConnector(arg, host) {
	Connector.apply(this,arguments);
	this.isAsync = true;
	this.set_orderExtractor(new DefaultDataSupplierOrderExtractor([["$order", "$direction"]]); // TODO: sync this with DA defaults
}
DataSupplierConnector.Inherit(Connector, "DataSupplierConnector");
DataSupplierConnector.ImplementProperty("orderExtractor", new Initialize("Order parameters translator", null));
DataSupplierConnector.prototype.resolve = function (callback) {
	if (this.host == null || this.$data == null || this.$data == "") {
		this.$reportResult(false, null, "Address or bind host empty", callback);
		return false;
	}
	
	var extractor = BaseObject.is(host, "ITranslatorProvider")) ? host.GetTranslator("ITranslateParamersToOrdersArray"):this.get_orderExtractor();
	
	// host["a.get_b().c"]
	var iface = BaseObject.getProperty(this.host,this.$data,null); // Resolve as address to a provider/supplier
	if (BaseObject.is(iface, "IManagedDataProvider")) {
		// Request the supplier with all the parameters
		iface = iface.GetSupplier(this.get_parameters(), extractor?extractor.PerformTranslation(this.get_parameters()): null);
	}
	///////
	if (!BaseObject.is(iface, "IManagedDataSupplier")) {
		this.$reportResult(false, null, "The address must point to managed data provider or directly to managed data supplier", callback);
		return false;
	}
	// iface is an usable IManagedDataSupplier
	var parameters = null;
	if (iface.get_supportsParameters()) {
		parameters = this.get_parameters();
	}
	var orders = null;
	if (iface.get_supportsOrdering()) {
		orders = extractor?extractor.PerformTranslation(this.get_parameters()): null;
	}
	///////////////
	





    var result = null;
	
	var f;
	var params = this.get_parameters();
	if (this.$data.indexOf(FastProcConnector.$lengthPropName) == (this.$data.length - FastProcConnector.$lengthPropName.length)) {
		f = this.host[this.$data.slice(0, this.$data.length - FastProcConnector.$lengthPropName.length)];
		this.$resource = f.call(this.host, "length", params);
		return true;
	}
	f = this.host[this.$data];
    if (typeof f != "function") {
		this.$resource = null;
		return false;
	}
	if (params != null) {
		this.$resource = f.call(this.host, 
								((params.startrowindex != null && params.startrowindex > 0)?params.startrowindex:1),
								params.numrows, 
								params); // Params are sent for potential filtering functionality
	} else {
		this.$resource = f.call(this.host);
	}
    return true; // as is
};