

/* Connectors general pattern
    addr - a string address of the resource
    host -      (optional), binding host over which the operation is performed (or on behalf of it). How the host is related to the communication depends on the connector type.
    options -   (optional), additional parameters which may or may not be supported by the particular connector type. No errors should be issued - ignore anything unsupported.
					Options supported by Connector and above: 
						single - single request can be made through the connector at any one time. If one is in progress all the new requests are ignored until the first one finishes
						last - All the requests are sent, but only the "last" is reported back (i.e. when a request finishes and there are others in progress it is cancelled until the last one).
						(in development)
						delay - a numeric value that specifies general purpose delay value used by options that need one. Default is 500 (milliseconds).
						singlelast - single request can be in progress, but the last requested is sent (after any currently executing finishes) and its result returned.
					Options supported by connectors using Kraft servers (old style BaseObject.ajax (XML packer comm.))
						contentFlags - numeric content flags override. These flags are always sent to the server to request the corresponding content. The bindhost and the cache manager can add more
										flags, but cannot remove these ones.
						packetMode - boolean, if true the packet root will be reported as result and not the data segment of the packet only.
						moduleName - The name of the module to which this operation belongs. If present mapping should be done (by those connectors that support it)
                    Options supported by connectors that deal with credentials, cookies and security tokens.
                        allheaders - send all headers/tokens whatever. Example are CORS where headers are restricted unless explicitly requested.
                    // Options for well-known operations (THE IDEA IS BAD - WE ARE GOING FOR HELPER OBJECTS) Nothing was implemented, this comment is here to remind you about the development process.
                    //    limitParameterName - the name of the parameter treated by the target of the connector as limit for returned records. The consumers of the connector can determine which parameter to use from this option.
    Optional features (in development - not ready for general use yet.)
    ~~~~~~~~~~~~~~~~~                    
    helpers - A ConnectorHelperBase inheriting classes that provide information and tools for an intialized connector.
            1) It is obtained from the Helper method of the connector
            2) The connector may return null if helper is not available
            3) The helper method should be called with a Interface type name and return a helper that supports it. 
            4) ?The helper method can be called without parameter and then it should return (if possible) a 'most general helper' if available.
            5) The helpers should be created on each call to the Helper() method (by it). The method can use a factory mechanism to choose the best helper for its current settings.  
                For example, there can be a register for helpers about paging parameters which depend on their server end point.
            6) A standard helper register is being built which will Implement factory approach dependent on connector type and connector parameters. 
                However using the register remains optional - each connector knows how to make the best choice for a helper.  
*/
function Connector(addr, host, options) {
    BaseObject.apply(this, arguments);
    this.$data = addr;
    this.host = host;
    this.$options = options;
	this.applyOptions(); // Distributes some of the options values to normal properties.
}
Connector.Inherit(BaseObject, "Connector")
	.Implement(IParameters);

Connector.prototype.obliterate = function(bFull) {
    BaseObject.prototype.obliterate.call(this, bFull);
};
Connector.Create = function(connectorType, address, host, options) {
	var conn = Function.createInstance(connectorType,address, host, options);
	if (BaseObject.is(conn, "Connector")) return conn;
	return null;
}.Description("Creates a connector of the given type with the parameters supplied (like doing so with new, but from the type supplied as string.). If there is no such class or if it is not a Connector returns null")
	.Param("connectorType","The type of the connector desired e.g. AjaxXmlConnector, FastProcConnector etc.")
	.Param("address","The address string for the new connector.")
	.Param("host","The bindhost for the new connector, must be an instance of a BaseObject derived class")
	.Param("options","plain object with options - see the information about Connector in the documentation or the comments in the source code.")
	.Returns("The new initialized connector or null if the class does not exist or it is not a connector");
Connector.prototype.createNewConnector = function() {
    return Function.createInstance(this.classType(),this.$data, this.host, this.$options);
}.Description("Creates a new connector with the same settings. A connector can be reused, but to do this safely one needs to be careful with its parameters, when in doubt - use a clone through this method.")
Connector.prototype.Helper = function(helperprotocol) {
    if (helperprotocol == null) return null;
    return ConnectorHelperRegister.Default().GetHelper(this,helperprotocol);
}
Connector.prototype.isAsync = false;
Connector.prototype.isBound = false;
Connector.prototype.hasFailed = false;
Connector.prototype.errorInfo = null;
// if (this.$options != null && this.$options.delay > 0) return this.$options.delay;
Connector.prototype.applyOptions = function(options) {
	if (options != null && typeof options == "object") {
		if (this.$options != null) {
			this.$options = BaseObject.CombineObjects(this.$options, options);
		} else {
			this.$options = options;
		}
		
	}
	if (this.$options != null) {
		if (this.$options.delay > 0) {
			this.$optiondelay = this.$options.delay;
		}
	}
}
Connector.prototype.resetState = function (newData) {
    this.isBound = false;
    this.hasFailed = false;
    this.errorInfo = null;
    if (arguments.length > 0) {
        this.set_address(newData);
    }
};
Connector.prototype.$data = null;
Connector.prototype.get_address = function () {
    return this.$data;
};
Connector.prototype.set_address = function (v) {
    this.$data = v;
	this.isBound = false;
};
Connector.prototype.$optiondelay = 500; // Default delay for operations that need to wait in order to optimize the behaviour they provide.
Connector.prototype.get_optiondelay = function () {
    return this.$optiondelay;
};
Connector.prototype.set_optiondelay = function (v) {
	if (typeof v == "number" && v >= 0) {
		this.$optiondelay = v;
	}
};
// The resource is the fetched data or whatever. It can also be stored back.
Connector.prototype.$resource = null;
Connector.prototype.get_resource = function (idx) {
    if (idx != null) {
        return this.$resource[idx];
    } else {
        return this.$resource;
    }
};
/**
	While this is implemented as indexed property using it with index is untypical and
	possible only for connectors that fetch/store a single dictionary. In most cases where
	no such a specific assumption for the data structure is possible set_resource is used 
	as a regular setter. The indexed behavior is provided as a convenience for (very) rare cases.
	
	@remarks: set_resource will not set isBound to true, because the other settings may be in any state
		including unusable (not really pointing to the resource in terms of address, parameters etc.)
*/
Connector.prototype.set_resource = function (idx, v) {
    if (arguments.length > 1) {
        if (idx != null) {
            this.$resource[idx] = v;
        } else {
            this.$resource = v;
        }
    } else {
        this.$resource = idx; // if called with a single arg we assume the caller calls this as normal (non-indexed property).
    }
};
// Parameters are used as arguments when binding to the resource
Connector.prototype.$parameters = null;
Connector.prototype.get_parameters = function (idx) {
    if (idx != null) {
        return this.$parameters[idx];
    } else {
        return this.$parameters;
    }
};
Connector.prototype.set_parameters = function (idx, v) {
	var newval = v;
    if (arguments.length > 1) {
        if (idx != null) {
            if (this.$parameters == null) {
                this.$parameters = {};
            }
            this.$parameters[idx] = v;
			this.isBound = false;
			return;
        } else {
            newval = v;
        }
    } else {
		newval = idx;
	}
	if (this.$parameters != null && (typeof this.$parameters == "object") && (typeof newval == "object")) {
		this.$parameters = BaseObject.CombineObjects(this.$parameters, newval);
	} else {
		this.$parameters = newval; // if called with a single arg we assume the caller calls this as normal (non-indexed property).
	}
	this.isBound = false;    
}.Description("The indexed parameters property setter has a specific behavior - when you set an object and there are some parameters (object already existing) it will combine the two objects, replace any values that come from the new parameters. When you set null, this will clear all the parameters. Additionally it supports the standard indexed property behavior.");
Connector.prototype.$cloneRequest = function() { // Clones the request address and parameters
	// Options are not preserved, because they are not part of the request, but an instruction how to perform it.
	return {
		$data: this.$data, // address
		$parameters: (this.$parameters != null)?BaseObject.DeepClone(this.$parameters):null,
		$host: this.host // Host is preserved by reference because it can be anything with any lifecycle.
	};
}
Connector.prototype.$compareRequests = function (req1, req2) { // if any of the reqs is null the current request loaded in the connector is used
	var r1 = req1 || { $data: this.$data, $parameters: this.$parameters, $host: this.host };
	var r2 = req2 || { $data: this.$data, $parameters: this.$parameters, $host: this.host };
	if (r1 != null && r2 != null) {
		if (r1 == r2) return true; // Reference equals - we skip any more complicated checking
		if (r1.$data != r2.$data) return false; // String comparison
		if (r1.$host != r2.$host) return false; // The host must be exactly the same.
		// Compare parameters
		
		// TODO: Finish me
	} else if (r1 == null && r2 == null) {
		return true; // Nulls are equal
	}
	return false;
}
Connector.prototype.$actionsInProgress = 0;
Connector.prototype.$reportResult = function (success, resource, errorInfo_optional, callback) { // Call this from the resolve method
    this.$actionsInProgress = ((this.$actionsInProgress > 0) ? this.$actionsInProgress - 1 : 0);
    if (this.$options != null && this.$options.last && this.$actionsInProgress > 0) {
        success = false;
        errorInfo_optional = "Multiple calls";
    }
    this.errorInfo = null;
    if (success) {
        this.$resource = resource;
        this.isBound = true;
        this.hasFailed = false;
        BaseObject.callCallback(callback, this.$resource);
    } else {
        this.$resource = null;
        this.isBound = false;
        this.hasFailed = true;
        this.errorInfo = errorInfo_optional;
        BaseObject.callCallback(callback, null, false, errorInfo_optional);
    }
};
Connector.prototype.resolve = function (callback) { // callback(resource (= null on error), error === false[, error_info]);
    // Override to Implement resource binding.
    // Synch connectors should just obtain a reference to a resource and return true or false on binding failure
    // Asynch connectors should send whatever request is needed (or run thread or whatever) and pass OWN callback for invocation later
    // For convenience the $reportResult method exists and can be passed as delegate to complete the work Or if impossible in raw form it can be wrapped
    // in a thin function that calls it in the end with the correct arguments.
    throw "Connector: not implemented! The Connector class is an abstract parent for all connectors, please use one of them.";

};
Connector.prototype.bind = function (callback) {
	if (this.$options != null) {
		if (this.$options.singlelast && this.$actionsInProgress > 0) {
		
		}
		if (this.$options.single && this.$actionsInProgress > 0) return false;
		
	}
    
    this.$actionsInProgress++;
    if (this.isAsync) {
        if (this.isBound) {
            BaseObject.callCallback(callback, this.$resource);
            return this.$resource;
        } else {
            if (this.hasFailed) {
                BaseObject.callCallback(callback, null, false, this.errorInfo);
                return null;
            } else {
                // Try to fetch
                this.resolve(callback);
                return true;
            }
        }
    } else { // Synch
        if (!this.isBound && !this.hasFailed) {
            if (!this.resolve()) {
                this.$reportResult(false, null, this.errorInfo, callback);
                return null;
            } else {
                this.$reportResult(true, this.$resource, null, callback);
                return this.$resource;
            }
        } else if (this.isBound) {
            BaseObject.callCallback(callback, this.$resource);
            return this.$resource;
        } else if (this.hasFailed) {
            BaseObject.callCallback(callback, null, false, this.errorInfo);
            return null;
        } else {
            throw "Connector: Impossible error!!! The one who made me is obvioulsy stupid!";
        }
        return null;
    }
};
Connector.prototype.update = function (callback) { // callback(resource (= null on error), error === false[, error_info]);
    // Override to Implement resource storing.
    // When finished (may be in an internal callback) call self.$reportResult(true/false, this.$resource, null or string errorinfo, callback);
    // Synch connectors should just obtain a reference to a resource and return true or false on binding failure
    // Asynch connectors should send whatever request is needed (or run thread or whatever) and pass OWN callback for invocation later
    // For convenience the $reportResult method exists and can be passed as delegate to complete the work Or if impossible in raw form it can be wrapped
    // in a thin function that calls it in the end with the correct arguments.
    throw "Connector: not implemented! This class does not Implement update!";

};
/**
	By default store ignores the isBound's value, it proceeds with updating the resource regardless of isBound and will not set the property 
	if successful update is done. As a result of that unlike in the case with bind and resolve (implemented by inheriting classes) in the implementation
	of update the isBound flag can be set if the implementation deems this appropriate.
	
	Rationale: Declaring the connector bound effectively declares that with the current settings the same data will be fetched, which is fine for bind 
		(still when settings are changed isBound is not auto-cleared in order to keep implementations simpler - resetState is necessary after changes).
		In case of store setting isBound declares symetry between read and write operations which is not a given - it depends on what the connector does, the
		source it connects etc. Thus isBound can be set by those connectors that work symetrically and should not be set by those that do not.
		
		If isBound is set by update if bind is called immediately after that, no connection will be made and the last known resource will be returned, which
		is obviously what will be really fetched if connection is made anew in some cases and something different in others (actually most cases).
	
	Safe bet: Don't rise isBound, the worst that can happen is an unneded request/connection.
*/
Connector.prototype.store = function (callback) { // Executes store resource operation (if supported)
    if (this.isAsync) {
        // Try to store
        this.update(callback);
        return true;
    } else { // Sync
        if (!this.update()) {
            // failure
            this.$reportResult(false, null, this.errorInfo);
            return null;
        } else {
            // success
            this.$reportResult(true, this.$resource, null, callback);
            return this.$resource;
        }
    }
};