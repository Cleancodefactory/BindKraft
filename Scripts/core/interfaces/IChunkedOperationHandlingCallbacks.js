
// Extends the operation abstraction with callback handlers

function IChunkedOperationHandlingCallbacks() {}
IChunkedOperationHandlingCallbacks.Interface("IChunkedOperationHandlingCallbacks");
IChunkedOperationHandlingCallbacks.RequiredTypes("IChunkedOperationHandling");

IChunkedOperationHandlingCallbacks.prototype.get_chunkroutine = function () { throw "not implemented"; }
IChunkedOperationHandlingCallbacks.prototype.set_chunkroutine = function (v) { throw "not implemented"; }