/**
 * Syntax sugar wrapper for event dispatcher. This wrapper is intended for use in place
 * of a single callback (where single function or Delegate callback is expected). When used this way
 * it "tells" calls multiple other handlers (the ones passed through the tell method) when invoked.
 * Because the internal dispatcher is set to advise all the newly registered handlers, it will
 * advise them even long after it was called - where the word "tell" sounds self explanatory - it tells
 * what happened to every interested party - now or later.
 *
 * The arguments with which this one is called (As callback) are transferred to the handlers to which
 * it tells about that. You have to determine what arguments are passed to the original callback this object replaces
 * in order to design handlers - the SugaryDispatcher just tranfers them and is agnostic toward them.
 */
function SugaryDispatcher() {
	BaseObject.apply(this, arguments);
	this.dispatcher.set_adviseNewComers(true);
	// this.sender = sender;
	// this.args = Array.createCopyOf(arguments,1);
}
SugaryDispatcher.Inherit(BaseObject, "SugaryDispatcher");
SugaryDispatcher.Implement(IInvocationWithArrayArgs);
SugaryDispatcher.Implement(IInvoke);
// For success/failure delegation
SugaryDispatcher.$tellsuccess = function (op,handler) {
	if (op.isOperationSuccessful()) {
		if (BaseObject.isCallback(handler)) {
			BaseObject.callCallback(handler, op.getOperationResult(), op);
		}
	}
}
SugaryDispatcher.$tellfailure = function (op,handler) {
	if (!op.isOperationSuccessful()) {
		if (BaseObject.isCallback(handler)) {
			BaseObject.callCallback(handler, op.getOperationErrorInfo(), op);
		}
	}
}
// The dispatcher
SugaryDispatcher.prototype.dispatcher = new InitializeEvent("The dispatcher to advise handlers");
// IInvoke*
SugaryDispatcher.prototype.invokeWithArgsArray = function(args) {
    this.dispatcher.invokeWithArgsArray(args);
};
SugaryDispatcher.prototype.invoke = function(args) {
	this.dispatcher.invokeWithArgsArray(Array.createCopyOf(arguments));
}

// Public chain methods
/**
 * Attach a hanler to the internal dispatcher 
 *	handler(operation) is called in the end (operation is complete)
 */
SugaryDispatcher.prototype.tell = function(handler,priority) {
	this.dispatcher.add(handler,priority);
	return this;
}
/**
	Same as tell
*/
SugaryDispatcher.prototype.then = function(handler,priority) {
	this.dispatcher.add(handler,priority);
	return this;
}
/**
	Attach a handler for success only
	handler(operation.getOperationResult(), operation) is called in the end
*/
SugaryDispatcher.prototype.onsuccess = function(handler,priority) { // alias
	this.dispatcher.add(new Delegate(null, SugaryDispatcher.$tellsuccess,[handler]),priority);
	return this;
}
SugaryDispatcher.prototype.success = SugaryDispatcher.prototype.onsuccess;
/**
	Attach a handler for failure only
	handler(operation.getOperationErrorInfo(), operation) is called in the end
*/
SugaryDispatcher.prototype.onfailure = function(handler,priority) { // alias
	this.dispatcher.add(new Delegate(null, SugaryDispatcher.$tellfailure,[handler]),priority);
	return this;
}
SugaryDispatcher.prototype.failure = SugaryDispatcher.prototype.onfailure;
/**
	Completes another operation with the specified result
*/
SugaryDispatcher.prototype.complete = function(anotherOp, result) { // alias
	this.dispatcher.add(new Delegate(this, this.$complete,[anotherOp, result]));
	return this;
}.Description("Completes another operation with the specified result if current operation is successful and with its error info if unsuccessful.");
SugaryDispatcher.prototype.$complete = function(op,anotherOp, result) { // alias
	if (BaseObject.is(anotherOp, "Operation")) {
		if (!anotherOp.isOperationComplete()) {
			anotherOp.CompleteOperation(op.isOperationSuccessful(), op.isOperationSuccessful()?result:op.getOperationErrorInfo());
		}
	}
}
SugaryDispatcher.prototype.transfer = function(anotherOp) { // alias
	this.dispatcher.add(new Delegate(this, this.$complete,[anotherOp]));
	return this;
}.Description("Completes another operation with the specified result if current operation is successful and with its error info if unsuccessful.");
SugaryDispatcher.prototype.$transfer = function(op,anotherOp) { // alias
	if (BaseObject.is(anotherOp, "Operation")) {
		if (!anotherOp.isOperationComplete()) {
			anotherOp.CompleteOperation(op.isOperationSuccessful(), op.isOperationSuccessful()?op.getOperationResult():op.getOperationErrorInfo());
		}
	}
}

SugaryDispatcher.prototype.succeed = function(anotherOp,result) { // alias
	this.dispatcher.add(new Delegate(this, this.$complete,[anotherOp, result]));
	return this;
}.Description("Completes another operation with the specified result if current operation is successful and with its error infoif unsuccessful.");
SugaryDispatcher.prototype.$succeed = function(op,anotherOp, result) { // alias
	if (BaseObject.is(anotherOp, "Operation")) {
		if (!anotherOp.isOperationComplete()) {
			anotherOp.CompleteOperation(true, result);
		}
	}
}
SugaryDispatcher.prototype.fail = function(anotherOp,errinfo) { // alias
	this.dispatcher.add(new Delegate(this, this.$complete,[anotherOp, errinfo]));
	return this;
}.Description("Completes another operation with the specified result if current operation is successful and with its error infoif unsuccessful.");
SugaryDispatcher.prototype.$fail = function(op,anotherOp, errinfo) { // alias
	if (BaseObject.is(anotherOp, "Operation")) {
		if (!anotherOp.isOperationComplete()) {
			anotherOp.CompleteOperation(false, errinfo);
		}
	}
}
/**
 * Clears everything and the object can be reused anew 
 */
SugaryDispatcher.prototype.clear = function() {
	this.dispatcher.reset();
	this.dispatcher.removeAll();
	return this;
}
