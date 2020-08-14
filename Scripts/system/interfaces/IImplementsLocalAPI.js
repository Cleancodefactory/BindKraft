/*
	Declares that the app registers Local API.
	The implementer is responsible to preserve the information needed for revokation associated with the specific hub.
	It is recommended to use the LocalAPI.get_name() as identificator of the hub and not the reference (to avoid keeping it in memory if it is a temporary one).
	
	Do not use the implementer! It will be deprecated soon.
	
	The launcher MUST check for the interface and call it accordingly - the app does not need to meddle with its initialization and shutdown process.

	Implementation:

	in registerLocalAPI use
	var cookie = hub.registerAPI(interface, instance);

	@param interface - name or the interface itself
	@param instance - the instance that implements it (can be the app's class or any other managed by it.)

	in revokeLocalAPI
	hub.revokeAPI(interface, cookie)

	@param cookie - the cookie returned by the first method.

	The need of the cookie becomes obvious if you notice that hub.registerAPI supports additional optional parameters:
	.registerAPI(interface, instance[, variation[, default]])

	They allow versions/variations of the same interface to be registered and one of them proclaimed a "default". The need of this is relatively rare, but
	arises during longer projects when interfaces evolve and backwards compatibility has to be preserved even when the new interface version has to break it.

*/
function IImplementsLocalAPI() {}
IImplementsLocalAPI.Interface("IImplementsLocalAPI");
IImplementsLocalAPI.RequiredTypes("AppBase");
// Async - operation
IImplementsLocalAPI.prototype.registerLocalAPI = function(hub) { throw "not impl"; }
// Sync
IImplementsLocalAPI.prototype.revokeLocalAPI = function(hub) { throw "not impl"; }