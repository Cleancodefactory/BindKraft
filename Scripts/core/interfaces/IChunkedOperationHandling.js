/*
	Upgrades the operation with the concept for chunked result - multiple reports for chunk of the work done, and final completion reported the normal way/
*/

/*CLASS*/
function IChunkedOperationHandling() {}
IChunkedOperationHandling.Interface("IChunkedOperationHandling");
IChunkedOperationHandling.RequiredTypes("IChunkedOperation");


IChunkedOperationHandling.prototype.onOperationChunk = function () { 
	throw "Not implmented";
}.Description("Performs the handling - it can differ depending on what extension interfaces are also implemented - callbacks, events etc.");


