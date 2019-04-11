/*
	The main purpose of this interface is NOT so much providing standard interface for open/close actions, but
	to serve as base for functionality implementation.
*/

function IOpenCloseFunctionality() {}
IOpenCloseFunctionality.Interface("IOpenCloseFunctionality");
IOpenCloseFunctionality.prototype.openevent = new InitializeEvent("Fired on open");
IOpenCloseFunctionality.prototype.closeevent = new InitializeEvent("Fired on close");

IOpenCloseFunctionality.prototype.$pendingOpenCloseOperationHandler = function () { throw "Not implemented. Implementer is available for this interface, use it if you want out of thebox solution."; }
//IOpenCloseFunctionality.prototype.$pendingOperationHandlerWrapper = null;
IOpenCloseFunctionality.prototype.$pendingOperation = null;

IOpenCloseFunctionality.prototype.$schedulePending = function (op, force) { throw "Not implemented."; }



