/**
	Base class for proxies used by remoting and local stubbind. While the name follows the remoting related interface (IRequestInterface) these are shared by
	both mechanisms, in the local case the transport is simply not used.
*/
function $Managed_BaseProxy(instance, transport, builder) {
	$Root_BaseProxy.apply(this, arguments);
	this.$transport = transport;
	this.$instance = instance;
	this.$builder = builder;
	// Proxy never calls the transport, the transport or any code that is using it calls the proxy (not true - dispatchers will call it)
	// TODO: Knowing the transport is not that important here - registering with the transport is the important part (interface for that purpose is not prototyped yet)
}
$Managed_BaseProxy.Inherit($Root_BaseProxy, "$Managed_BaseProxy");
$Managed_BaseProxy.Implement(IManagedInterface);
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
	var ifc = this.$instance.GetInterface(iface);
	if (BaseObject,is(ifc, iface)) {
		// The implementations provide a referene to an instance implementing the interface being asked for.
		// If by chance we get another proxy it is not a critical problem, but it will slow hte performance a little bit (should be noticed in scenarios where this matters)
		if (BaseObject.is(this.$builder,"IProxyInterfaceBuilder")) {
			var proxiedInstance = this.$builder.buildProxy(ifc, iface);
			return proxiedInstance;
		} else {
			throw "Cannot build a proxy for the queried interface becuase no proxy builder ws supplied to the proxy marshalling the call";
		}
	}
	return null;
}
$Managed_BaseProxy.prototype.Release = function() {
	var instance = this.$instance;
	this.$instance = null;
	for (var key in this) {
		if (this.hasOwnProperty(key) && 
			BaseObject.is(this[key], "IEventDispatcher") &&
			BaseObject.is(instance[key], "IEventDispatcher")
			) {
			instance[key].remove(this[key]); // Detach from the original dispatcher.
		}
	}
	this.obliterate(); // TODO: Check if this is going too far (not critical, but checking will not hurt)
}