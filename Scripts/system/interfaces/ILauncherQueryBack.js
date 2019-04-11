/**
	ILauncherQueryBack interface is supposed to be implemented by app launchers (SysShell being usually the one)
	An object implementing this interface is passed as first argument to the constructor of an app. The app can
	keep it during its lifecycle and use it to query the launcher for various things.
	
	
*/

function ILauncherQueryBack() {}
ILauncherQueryBack.Interface("ILauncherQueryBack");
ILauncherQueryBack.prototype.runningInstance = function() { throw "not implemented"; }.Description("Returns first found running instance of the same application");
ILauncherQueryBack.prototype.runningInstances = function() { throw "not implemented"; }.Description("Returns an array of all the other running instances of this app");