/*
	The manager SHOULD use a default proxy builder if one is not passed to the GetDaemonServiceFactory.
	The default builder SHOULD be for local page usage.
	
	We need an admin interface also (do we?)
*/

function IDaemonManager() {
}
IDaemonManager.Interface("IDaemonManager");
IDaemonManager.prototype.$add_activedaemon = function (v) { throw "Not implemented"; }
    
IDaemonManager.prototype.startDaemon = function(alias, daemonClass, parameters) {
	throw "Not implemented";
}.Returns("Operation")
	.Description("Initializes the daemon and completes the operation after that. The data in the completed operation is the id of the daemon");
IDaemonManager.prototype.GetDaemonServiceFactory = function(daemon_id, /*optional*/ proxybuilder) {
		throw "Not implemented"
}.Returns("Returns the service factory of the specified daemon (if one is supported, if not null is returned)");
IDaemonManager.prototype.shutdownDaemon = function(daemon_id) {
	throw "Not implemented";
}.Returns("Operation with boolean result");
IDaemonManager.prototype.shutdownAllDaemons = function() {
	throw "Not implemented";
}