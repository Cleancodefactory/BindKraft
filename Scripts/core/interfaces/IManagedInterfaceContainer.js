/**
	The "other side" of the IManagedInterface. IManagedInterface enables creation of local proxies for references to
	objects that support interfaces extending it. They can be managed in an Ad Hoc manner, but it is also possible to
	use a container for them. This is the minimal interface of the container.
*/
function IManagedInterfaceContainer() {}
IManagedInterfaceContainer.Interface("IManagedInterfaceContainer");
IManagedInterfaceContainer.prototype.register = function(proxy) { throw "not impl"; }
/**
	if the proxy is indeed a proxy calls Release on it and then unregisters it if it is registered with the
	container. If the proxy is not in the container no error will occur and it will be released anyway.
*/
IManagedInterfaceContainer.prototype.release = function(proxy) { throw "not impl"; }
/**
	Unregister without releasing the proxy - useful when transferring the proxy from one comntainer to another
*/
IManagedInterfaceContainer.prototype.unregister = function(proxy) { throw "not impl"; }
IManagedInterfaceContainer.prototype.releaseAll = function() { throw "not impl"; }