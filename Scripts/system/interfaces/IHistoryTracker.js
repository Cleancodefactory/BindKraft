/*
	The interface should be implemented by the BrowserHistoryTracker.

*/

function IHistoryTracker() {}
IHistoryTracker.Interface("IHistoryTracker");
IHistoryTracker.prototype.pushHistoryState = function(app, state)
{
	throw 'Not implemented';
}

	