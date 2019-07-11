/*
	The interface should be implemented by the BrowserHistoryTracker.

*/

function IHistoryTracker() {}
IHistoryTracker.Interface("IHistoryTracker","IManagedInterface");
IHistoryTracker.prototype.pushHistoryState = function(app, state)
{
	throw 'Not implemented';
}.Arguments(IManagedInterface,null);

	