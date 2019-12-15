/** Provides access to automatically fetched app service
	Intended to be created through an initializer:
	
	MyClass.prototype.someservice = new InitializeFetcher("SomeService", null, true); // Silent fetcher
	MyClass.prototype.someservice = new InitializeFetcher("SomeService"); // Typical fetcher - throwing exception if the service is not available when usage is attempted.
	
	Usage is mostly designed for classes deriving from Base and classes designed as app parts.
	In Base derived classes the usage should be done NOT earlier than in the init() method. 
	The recommended usage is in the normal methods that get called after initialization.
	Usage example (based on the above sample code)
	
	// in some method
	this.someservice().servicemethod(arg1, arg2, ...);
	// usage with refetch (fetch the service before performing the call)
	this.someservice(true).servicemethod(arg1, arg2, ...);
	// Save usage - when it is expected that the service may not yet be available. The fetcher MUST be silent.
	var service = this.someservice();
	if (service != null) service.servicemethod(arg1, arg2, ...);
	
	To ensure everything in the app is connected and service location can locate all the services, it is recommended to use the SimpleViewWindow'sample
	default behavior, which loads/creates views when they become visible for the first time. This cannot happen unless the window in which they are materialized
	is connected to the app's structure properly, hence the service location will be able to propagate through all app windows and to the app itself..

*/
function ServiceFetcher(target, iface, reason, silent) {
	this.$target = target;
	this.$interface = iface;
	this.$reason = reason;
	this.$silent = silent
	if (!BaseObject.is(target, "IStructuralQueryEmiter")) {
		var s = "null";
		if (target != null && target.classType) s = target.classType();
		throw "ServiceFetcher cannot function on an object that does not support IStructuralQueryEmiter. Target's class is: " + s;
	}
}
ServiceFetcher.Inherit(BaseObject, "ServiceFetcher");
ServiceFetcher.createFetcher = function(target, iface, reason) {
	var instance = new ServiceFetcher(target, iface, reason);
	var service = null;
	return function(refetch) {
		var silent = instance.$silent;
		if (arguments.length > 0 && arg0 == null) {
		}
		if (service == null || refetch) {
			service = instance.findService(instance.$interface, instance.$reason);
		}
		if (service == null) {
			if (silent) return null;
			throw "The service " + Class.getTypeName(instance.$interface) + " is not available at this moment";
		} else {
			return service;
		}
	}
}
ServiceFetcher.prototype.$service = null; // Fetched service
