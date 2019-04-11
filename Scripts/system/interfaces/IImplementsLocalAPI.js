/*
	Declares that the app registers Local API.
	The implementer is responsible to preserve the information needed for revokation associated with the specific hub.
	It is recommended to use the LocalAPI.get_name() as identificator of the hub and not the reference (to avoid keeping it in memory if it is a temporary one).
	
	Use the implementer to make this easier.
	
	The launcher MUST check for the interface and call it accordingly - the app does not need to meddle with its initialization and shutdown process.
*/
function IImplementsLocalAPI() {}
IImplementsLocalAPI.Interface("IImplementsLocalAPI");
IImplementsLocalAPI.RequiredTypes("AppBase");
// Async - operation
IImplementsLocalAPI.prototype.registerLocalAPI = function(hub) { throw "not impl"; }
// Sync
IImplementsLocalAPI.prototype.revokeLocalAPI = function(hub) { throw "not impl"; }