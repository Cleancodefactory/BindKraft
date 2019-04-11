/**
	This interface and common use classes/implementers are introduced so that they can replace the ISimpleAppManager
*/
/*INTERFACE*/
function IAppManager() {}
IAppManager.Interface("IAppManager", "IAppElement");
/**
	The implementation has to maintain the internal storage - usually an array.
	The property should create a copy and return it in order to prevent changes.
*/
IAppManager.prototype.get_runningapps = function() { throw "not implemented"; }
/**
	Intended for internal use by implementations. Most often the registration is not changed by new implementations based on another -
	thus this gives them a way to register launched apps...
*/
IAppManager.prototype.$add_runningapps = function(app) { throw "not implemented"; }

IAppManager.prototype.getAppByInstanceId = function() { throw "not implemented"; }.Returns("app if the id exists");
IAppManager.prototype.getAppsByInstanceName = function(name) {throw "not implemented"; }.Returns("An array of app(s)");

/**
	Compatibility with very old stuff may be lost here!
	Launches the appCls and assigns the callbacks to the new app, everything after arg4 and on is sent as app arguments
	Both return Operation.
*/
IAppManager.prototype.launchAppEx = function(appCls, placeCallback, displaceCallback, exitCallback, args) { throw "not implemented"; }
/**
	Can be used with apps that know what to do and can create the callbacks on their own. Some defaults exist.
*/
IAppManager.prototype.shutdownApp = function(app) { throw "not implemented"; }.Returns("Operatiion");

IAppManager.prototype.shutdownAllApps = function() { throw "not implemented"; }.Returns("Operation"); 

