

function DummyInterfaceProxyBuilder(bStrict) {
	ProxyInterfaceBuilderBase.apply(this, arguments);
	if (bStrict == null) {
		bStrict = window.JBCoreConstants.StrictLocalProxies; // By default honor the core configuration
	}
	if (bStrict === true) {
		this.proxyMethodBody = DummyInterfaceProxyBuilder.$strictMethodBody;
	} else if (bStrict === false) {
		this.proxyMethodBody = DummyInterfaceProxyBuilder.$nonStrictMethodBody;
	}
	this.$strictMode = bStrict;
	// the Dummy ignores the transport
}
DummyInterfaceProxyBuilder.Inherit(ProxyInterfaceBuilderBase,"DummyInterfaceProxyBuilder");
DummyInterfaceProxyBuilder.Implement(IProxyInterfaceBuilder);
/* strict/nonstrict modes are deprecated during alpha development of the feature
DummyInterfaceProxyBuilder.prototype.$strictMode = false;
DummyInterfaceProxyBuilder.$strictMethodBody = function(key) { 
	return new Function('var r = this.$instance.' + 
						 key + 
						 '.apply(this.$instance, arguments); if (BaseObject.is(r,"BaseObject") && !BaseObject.is(r,"$Root_BaseProxy")) { throw "Returning BK class instances requires packing them in a proxy";}; return r;'
						); 
				};
DummyInterfaceProxyBuilder.$nonStrictMethodBody = function(key) { return new Function('return this.$instance.' + key + '.apply(this.$instance, arguments);'); };
DummyInterfaceProxyBuilder.prototype.proxyMethodBody = DummyInterfaceProxyBuilder.$strictMethodBody;
*/
DummyInterfaceProxyBuilder.prototype.buildProxy = function (instnce, interfaceDef,container) {
	this.LASTERROR().clear();
    if (BaseObject.is(instnce, interfaceDef)) {
		var instanceClass = Class.getClassDef(instnce);
		if (instanceClass == null) {
			this.LASTERROR(_Errors.compose(),"Instance class cannot be determined or is not BaseObject.");
		} else {
			var _ifaceDef = Class.getInterfaceDef(interfaceDef); // Make sure we have the definition and not the name
			if (this.$strictMode) {
				if (!Class.doesextend(interfaceDef, "IManagedInterface")) {
					this.LASTERROR(_Errors.compose(),"The interface does not extend IManagedInterface.");
					return null;
				}
			}
			var proxycls = null;
			proxycls = ProxyStubBuildingRoutines.buildProxyClass(null, instanceClass, _ifaceDef);
			/*
			// Select the proxy policy first by explicit requirement - a base interface and then by global policy
			if (Class.doesextend(_ifaceDef, "IManagedInterfaceStrict")) {
				proxycls = ProxyStubBuildingRoutines.buildProxyClass(null, instanceClass, _ifaceDef,DummyInterfaceProxyBuilder.$strictMethodBody);
			} else if (Class.doesextend(_ifaceDef, "IManagedInterfaceNonstrict")) {
				proxycls = ProxyStubBuildingRoutines.buildProxyClass(null, instanceClass, _ifaceDef,DummyInterfaceProxyBuilder.$nonStrictMethodBody);
			} else {
				
			}
			*/
			
			if (proxycls == null) {
				this.LASTERROR(_Errors.compose(),"Cannot create proxy class definition");
			} else {
				var prxy = new proxycls(instnce,null,this,container); // Null transport
				return prxy;
			}
		}
    } else {
		this.LASTERROR(_Errors.compose(),"The instance does not support the requested interface.");
    }
	return null;
};
DummyInterfaceProxyBuilder.Default = (function() {
	var pbinstance; 
	return function() {
		if (pbinstance == null) {
			pbinstance = new DummyInterfaceProxyBuilder();
		}
		return pbinstance;
	}
})();

DummyInterfaceProxyBuilder.Dereferece = function(p) {
	var result = p;
	while (BaseObject.is(result, "$Managed_BaseProxy")) {
		result = result.$instance;
	}
	return result;
}
DummyInterfaceProxyBuilder.isProxy = function(p) {
	return BaseObject.is(result, "$Managed_BaseProxy");
}