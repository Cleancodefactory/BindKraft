function IDaemonApp() { }
IDaemonApp.Interface("IDaemonApp","IAppBase");
// Replace existing methods:
IDaemonApp.prototype.run = function (args_optionally) { };
// New methods
IDaemonApp.prototype.isRunning = function() {
	throw "Not implemented";
}.Returns("State keyword: running, starting, stopping, unresponsive");
IDaemonApp.prototype.GetServiceFactory = function() { throw "Not implemented";};