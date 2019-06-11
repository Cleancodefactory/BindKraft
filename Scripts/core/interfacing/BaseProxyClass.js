/**
	Base class for proxies used by remoting and local stubbind. While the name follows the remoting related interface (IRequestInterface) these are shared by
	both mechanisms, in the local case the transport is simply not used.
*/
function $Requestable_BaseProxy(instance, transport) {
	BaseObject.apply(this, arguments);
	this.$transport = transport;
	this.$instance = instance;
	// Proxy never calls the transport, the transport or any code that is using it calls the proxy (not true - dispatchers will call it)
	// TODO: Knowing the transport is not that important here - registering with the transport is the important part (interface for that purpose is not prototyped yet)
}
$Requestable_BaseProxy.Inherit(BaseObject, "$Requestable_BaseProxy");
$Requestable_BaseProxy.Implement(IManagedInterface);
$Requestable_BaseProxy.prototype.$initializeProxy = function() {
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
$Requestable_BaseProxy.prototype.Release = function() {
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