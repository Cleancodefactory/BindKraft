/*
	Non-mandatory informational methods a daemon manager can implement to proivde various infos
	and lookup functionality,
*/

function IDaemonManagerInfo() {}
IDaemonManagerInfo.Interface("IDaemonManagerInfo");
IDaemonManagerInfo.RequiredTypes("IDaemonManager");
IDaemonManagerInfo.prototype.activeDaemons = function(namedOnly, runningOnly) {
	throw "Not implemented";
}
IDaemonManagerInfo.prototype.idFromAlias = function(name) {
	throw "Not implemented";
}
IDaemonManagerInfo.prototype.idFromName = function(name) {
	throw "Not implemented";
}