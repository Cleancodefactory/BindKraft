/** Provides access to automatically fetched app service
*/
function ServiceFetcher(target, iface, reason) {
	this.$target = target;
	this.$interface = iface;
	this.$reason = reason;
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
	return function(refetch, silent) {
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
