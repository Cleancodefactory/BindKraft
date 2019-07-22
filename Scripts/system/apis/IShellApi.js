function IShellApi() {}
IShellApi.Interface("IShellApi","IManagedInterface");
/**
	event(appId, appClassName);
*/
IShellApi.prototype.appstart = new InitializeEvent("Application started and initialized").Arguments(null);
/**
	event(appId, appClassName);
*/
IShellApi.prototype.appstop = new InitializeEvent("Application shutdown");

IShellApi.prototype.bindAppByClassName = function(className) { throw "not impl"; }.ReturnType(IManagedInterface);
IShellApi.prototype.bindAppByInstanceId = function(instanceId) { throw "not impl"; }.ReturnType(IManagedInterface);
IShellApi.prototype.activateApp = function(appproxy_orid) { throw "not impl"; }
IShellApi.prototype.bindAppsByClassNames = function(className1, className2, className3) { throw "not impl"; }.ReturnType(ILocalProxyCollection);