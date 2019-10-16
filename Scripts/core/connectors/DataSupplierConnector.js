function DefaultDataSupplierOrderExtractor(conf) {
	BaseObject.apply(this, arguments);
	this.conf = conf;
	this.order = ordefieldname;
	this.orderDir = orderdirname;
}
DefaultDataSupplierOrderExtractor.Inherit(BaseObject, "DefaultDataSupplierOrderExtractor");
DefaultDataSupplierOrderExtractor.Implement(ITranslateParamersToOrdersArray);
DefaultDataSupplierOrderExtractor.prototype.configureOrderParameters = function(conf) { 
	this.conf = conf;
}

DefaultDataSupplierOrderExtractor.prototype.PerformTranslation = function(/*IParameters*/ parameters) {
	if (BaseObject.is(this.conf,"Array")) {
		var arrResult = null;
		for (var i = 0;i < this.conf.length; i++) {
			var order = this.conf[i];
			if (!BaseObject.is(order,"Array")) continue;
			
			var _orderField = order[0]?order[0] + "" || null;
			var _orderDir = order[1]?order[1] + "" || null;
			if (_orderField == null || /^\s*$/.test(_orderField)) continue;
			var ord, dir;
			
			if (BaseObject.is(parameters, "IParameters")) {
				ord = parameters.get_parameters(_orderField);
				if (ord == null || /^\s*$/.test(ord)) continue;
				if (arrResult == null) arrResult = [];
				dir = parameters.get_parameters(_orderDir);
				if ((/^desc$/i).test(dir)) {
					arrResult.push([ord,-1]);
				} else {
					arrResult.push([ord,1]);
				}
			} else if (typeof parameters == "object") {
				ord = parameters[_orderField];
				if (ord == null || /^\s*$/.test(ord)) continue;
				if (arrResult == null) arrResult = [];
				dir = parameters[_orderDir];
				if ((/^desc$/i).test(dir)) {
					arrResult.push([ord,-1]);
				} else {
					arrResult.push([ord,1]);
				}
			}
		}
		return arrResult;
	} else {
		return null;
	}
}

//////
function DataSupplierConnector(arg, host) {
	Connector.apply(this,arguments);
	this.isAsync = true;
	this.set_orderExtractor(new DefaultDataSupplierOrderExtractor([["$order", "$direction"]]); // Temp initialization
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
	var iface = BaseObject.getProperty(this.host,this.$data,null);
	if (BaseObject.is(iface, "IManagedDataProvider")) {
		iface = iface.GetSupplier(this.get_parameters(), extractor?extractor.PerformTranslation(this.get_parameters()): null);
	}
	///////
	if (!BaseObject.is(iface, "IManagedDataSupplier")) {
		this.$reportResult(false, null, "The address must point to managed data provider or directly to managed data supplier", callback);
		return false;
	}






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