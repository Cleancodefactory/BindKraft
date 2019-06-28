/**
	This interface duplicates a couple of IAppBase properties in order to make them available through proxies
	IAppIntance must be implemented before IAppBase!
*/
function IAppInstance() {}
IAppInstance.Interface("IAppInstance","IManagedInterface");
IAppInstance.prototype.get_instanceid = function() { throw "not implemented"; }
IAppInstance.prototype.get_instancename = function() { throw "not implemented"; }