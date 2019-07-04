/**
	Base class for proxies used for local stubbind.
*/
function $Managed_BaseProxy(instance, transport, builder, managedContainer) {
	$Root_BaseProxy.apply(this, arguments);
	this.$transport = transport;
	this.$instance = instance;
	this.$builder = builder;
	this.$container = managedContainer;
	// Proxy never calls the transport, the transport or any code that is using it calls the proxy (not true - dispatchers will call it)
	// TODO: Knowing the transport is not that important here - registering with the transport is the important part (interface for that purpose is not prototyped yet)
}
$Managed_BaseProxy.Inherit($Root_BaseProxy, "$Managed_BaseProxy");
$Managed_BaseProxy.Implement(IManagedInterface);
$Managed_BaseProxy.$maxRecursion = 10;
$Managed_BaseProxy.$notRef = function(arg, _level) {
	var level = _level || 1;
	if (level > this.$maxRecursion) return;
	var i;
	if (BaseObject.is(arg,"BaseObject")) {
		throw "References to BK objects not allowed. To enable references mark your interface method appropriately.";
	} else if (BaseObject.is(arg,"Array")) {
		for (i = 0; i < arg.length;i++) {
			this.$notRef(arg[i]);
		}
	} else if (BaseObject.is(arg, "object")) {
		for (i in arg) {
			this.$notRef(arg[i]);
		}
	}
}
$Managed_BaseProxy.$notRefs = function(args) {
	for (var i = 0; i < args; i++) {
		this.$notRef(args[i]);
	}
}
$Managed_BaseProxy.prototype.$wrapResult = function(r) {
	// Use ReturnType or if r is a proxy use it as a template
	// if (BaseObject.is(r,
}
$Managed_BaseProxy.prototype.$initializeProxy = function() { // Called by the constructor of the generated class inheriting the base proxy.
	// Connect to instance
	for (var key in this) {
		if (this.hasOwnProperty(key) && 
			BaseObject.is(this[key], "IEventDispatcher") &&
			BaseObject.is(this.$instance[key], "IEventDispatcher")
			) {
			this.$instance[key].add(this[key]); // Attach to the original dispatcher
		}
	}
}

$Managed_BaseProxy.prototype.GetInterface = function(iface) {
	if (this.__obliterated) return null;
	if (this.$instance == null) return null;
	var ifc = this.$instance.GetInterface(iface); // No more checks to save performance
	if (BaseObject.is(ifc, iface)) {
		// The implementations provide a referene to an instance implementing the interface being asked for.
		// If by chance we get another proxy it is not a critical problem, but it will slow hte performance a little bit (should be noticed in scenarios where this matters)
		if (BaseObject.is(this.$builder,"IProxyInterfaceBuilder")) {
			var proxiedInstance = this.$builder.buildProxy(ifc, iface, this.$container);
			return proxiedInstance;
		} else {
			throw "Cannot build a proxy for the queried interface becuase no proxy builder was supplied to the proxy marshalling the call";
		}
	}
	return null;
}
$Managed_BaseProxy.prototype.Release = function(nocontainer) { // Called with true from contaners only
	if (this.__obliterated) return;
	var instance = this.$instance;
	this.$instance = null;
	if (instance != null) {
		for (var key in this) {
			if (this.hasOwnProperty(key) && 
				BaseObject.is(this[key], "IEventDispatcher") &&
				BaseObject.is(instance[key], "IEventDispatcher")
				) {
				instance[key].remove(this[key]); // Detach from the original dispatcher.
			}
		}
	}
	var container = this.$container;
	this.$container = null; // Prevents cycling
	this.obliterate(); // TODO: Check if this is going too far (not critical, but checking will not hurt)
	if (container != null && !nocontainer) container.release(this);
}