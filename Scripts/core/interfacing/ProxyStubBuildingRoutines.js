/*
	Contains low level routines for proxy and stub building. For better readability these are called by the classes that use them, leaving the bulk of the
	complicated code here.
*/

var ProxyStubBuildingRoutines = {
	
	// Check if proxy
	isProxy: function(inst) {
		return BaseObject.is(inst, "$Root_BaseProxy");
	},
	refMethod: function(key) {
		return new Function('if (this.$instance == null) throw "The proxy is no longer connected";\
							var r = this.$instance.' + key + '.apply(this.$instance, this.$wrapArguments(arguments,"' + key + '"));\
							return this.$wrapResult(r);');
	},
	// These are designed for local proxy generation first. The future implementation of remoting proxies may need separate implementation

	trivialMethodProxy: function(key) { return new Function('return this.$instance.' + key + '.apply(this.$instance, arguments);'); },
	buildProxyClass: function(_baseProxyDef, classDef, ifaceDef, _methodBody) {
		var baseProxyDef = _baseProxyDef || Class.getClassDef($Managed_BaseProxy);
		if (!Class.is(baseProxyDef, "$Managed_BaseProxy") ||
			!Class.is(classDef, Class.getInterfaceName(ifaceDef))) {
				throw "buildProxyClass requires all its parameters to be non null and of the correct types: $Managed_BaseProxy, class implementing the interface from the next parameter, requestable interface definition";
		}
		if (_methodBody != null && !BaseObject.isCallback(_methodBody)) {
			throw "A custom method body argument is passed to the buildProxyClass, but it is not a callback";
		}
		var methodBody = _methodBody || ProxyStubBuildingRoutines.refMethod;
		var className = classDef.classType;
		var proxyName = baseProxyDef.classType;
		var ifaceName = ifaceDef.classType;
		proxyClassName = proxyName + "_" + ifaceName + "_" + className;
		var cls = Class.getClassDef(proxyClassName);
		if (cls == null) {
			// Not created yet - create it now
			cls = new Function("instance","transport","builder","container",
			'$Managed_BaseProxy.call(this,instance,transport,builder,container); this.$initializeProxy();');
			cls.Inherit(baseProxyDef, proxyClassName);
			cls.ImplementEx(ifaceDef);
			cls.$proxiedInterface = ifaceDef;
			for (var key in ifaceDef.prototype) {
				// The exceptions:
				//	constructor - does not need changes
				//	Release and GetInterface are implemented in the base $Managed_BaseProxy class.
				if (key != "constructor" && key != "Release" && key != "GetInterface" && key != "Dereference" && key.charAt(0) != "$") {
					if (typeof ifaceDef.prototype[key] == "function") {
						if (typeof classDef.prototype[key] != "function") {
							throw "The " + ifaceName + "." + key + " is not implemented as function in " + className + " and a local proxy cannot be created.";
						}
						cls.prototype[key] = BaseObject.callCallback(methodBody,key); // Generate the proxy method
					} else if (BaseObject.is(ifaceDef.prototype[key], "InitializeEvent")) {
						if (!BaseObject.is(classDef.prototype[key],  "InitializeEvent")) {
							throw "The event " + ifaceName + "." + key + " is not implemented as event in " + className + " and a local proxy cannot be created.";
						}
						cls.prototype[key] = new InitializeEvent("autogenerated event proxy"); // Generate a new dispatcher that will be connected by the proxy when inetantiated
					}
				}
			}
		}
		return cls;
	}



/*
	The architecture plans are somewhat changed and this code is kept in comments mostly as reference for the people who worked and will work on this topic.
	TODO: Please remove these when this is no longer needed by anyone

	Helpers to use in the implementation of proxy/stub builders
	These methods provide one way to do this. One can implement proxy builders in a completely different manner without using any of these!
	
	The proxy is on the side where the actual object is, the stub is on the side of the client
	When both are on the same system the proxy and the stub can be one and the same.

// Not complete - a better performing approach is implemented below this code
IRequestInterface.buildProxy = function(instance, _ifacedef, transport) {
	var ifacedef = Class.getInterfaceDef(_ifacedef);
	if (!Class.isrequestable(ifacedef)) {
		throw "IRequestInterface.buildProxy: The specified interface (" + Class.getInterfaceName(ifacedef) + ") is not requestable.";
	}
	if (BaseObject.is(instance, ifacedef)) {
		//var proxy = new 
		for (var k in ifacedef.prototype) {
			var m = ifacedef[k]; // The members
			if (typeof m == "function") {
				
			} else {
				throw "IRequestInterface.buildProxy: Unsupported member (" + k + ") type in " + (typeof m) + "interface (" + Class.getInterfaceName(ifacedef) + ")";
			}
		}
	} else {
		if (instance == null) {
			throw "IRequestInterface.buildProxy: The instance is null";
		} else if (BaseObject.is(instance, "BaseObject")) {
			throw "IRequestInterface.buildProxy: The instance (" + instance.getFullTypeName() + ")specified interface (" + Class.getInterfaceName(ifacedef) + ") is not requestable.";
		} else {
			throw "IRequestInterface.buildProxy: The instance is not BaseObject derived (" + (typeof instance) + ")";
		}
	}
}
*/
	
	
/*
	Reminders for old ideas - will be removed

$CreateStub: function(iface, transmitter) { },
CreateDummyProxy: function(iface, instance) {
},
$CreateDummyProxy: function(ifacedef, iface_instance) {
	var proxy = new $Managed_BaseProxy();
	for (var k in ifacedef.prototype) {
	}
}
*/
	
	
};