/*
	The interface should be implemented by the BrowserHistoryTracker.

*/

function IHistoryTracker2() {}
IHistoryTracker2.Interface("IHistoryTracker2","IManagedInterface");
/**
 * Dual (proxied /direct) implemetation is recommended
 * @param {IAppRouter|IManagedInterface} app
 */
IHistoryTracker2.prototype.routeStateChanged = function(app)
{
	throw 'Not implemented';
}.Arguments(IManagedInterface, null, null);

	