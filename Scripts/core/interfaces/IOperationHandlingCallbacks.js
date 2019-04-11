
// Extends the operation abstraction with callback handlers

/*INTERFACE*/
function IOperationHandlingCallbacks() {}
IOperationHandlingCallbacks.Interface("IOperationHandlingCallbacks");
// IOperationHandlingCallbacks.RequiredTypes("IOperation,IOperationHandling");

IOperationHandlingCallbacks.prototype.get_completionroutine = function () { throw "not implemented"; }
IOperationHandlingCallbacks.prototype.set_completionroutine = function (v) { throw "not implemented"; }