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
 * in order to design handlers - the SugaryChunksDispatcher just tranfers them and is agnostic toward them.
 */
function SugaryChunksDispatcher(op) {
	this.$operation = op;
	BaseObject.apply(this, arguments);
	this.dispatcher.set_adviseNewComers(true);
	
	// this.sender = sender;
	// this.args = Array.createCopyOf(arguments,1);
}
SugaryChunksDispatcher.Inherit(BaseObject, "SugaryChunksDispatcher");
SugaryChunksDispatcher.Implement(IInvocationWithArrayArgs);
SugaryChunksDispatcher.Implement(IInvoke);

SugaryChunksDispatcher.prototype.$operation = null;
// The dispatcher
SugaryChunksDispatcher.prototype.dispatcher = new InitializeEvent("The dispatcher to advise handlers");
// IInvoke* - must look that way to be seen as something dispatcher like
SugaryChunksDispatcher.prototype.invokeWithArgsArray = function(args) {
    this.dispatcher.invokeWithArgsArray(args);
};
SugaryChunksDispatcher.prototype.invoke = function(args) {
	this.dispatcher.invokeWithArgsArray(Array.createCopyOf(arguments));
}

//#region chainable methods
SugaryChunksDispatcher.prototype.chunk = function(callback, failcallback) {
	if (typeof failcallback == "function") { // two arguments - split between handlers
		this.dispatcher.add(new Delegate(null, SugaryChunksDispatcher.$tellsuccess,[callback]));
		this.dispatcher.add(new Delegate(null, SugaryChunksDispatcher.$tellfailure,[failcallback]));
	} else { // single argument - everything to the handler
		this.dispatcher.add(new Delegate(null, SugaryChunksDispatcher.$tell,[callback]));
	}
	return this;
}
SugaryChunksDispatcher.prototype.onchunk = SugaryChunksDispatcher.prototype.chunk;
SugaryChunksDispatcher.prototype.okchunk = function(callback) {
	this.dispatcher.add(new Delegate(null, SugaryChunksDispatcher.$tellsuccess,[callback]));
	return this;
}
SugaryChunksDispatcher.prototype.onokchunk = SugaryChunksDispatcher.prototype.okchunk;
SugaryChunksDispatcher.prototype.failchunk = function(callback) {
	this.dispatcher.add(new Delegate(null, SugaryChunksDispatcher.$tellfailure,[callback]));
	return this;
}
SugaryChunksDispatcher.prototype.onfailchunk = SugaryChunksDispatcher.prototype.failchunk;

SugaryChunksDispatcher.prototype.routechunkto = function(anotherop) {
	this.dispatcher.add(new Delegate(null, SugaryChunksDispatcher.$routetoanother,[anotherop]));
}
//#endregion


//#region Delegators

// For success/failure delegation
SugaryChunksDispatcher.$tell = function (success, data,handler) {
	if (BaseObject.isCallback(handler)) {
		BaseObject.callCallback(handler, success, data);
	}
}
SugaryChunksDispatcher.$tellsuccess = function (success, data, handler) {
		if (BaseObject.isCallback(handler) && success) {
			BaseObject.callCallback(handler, data);
		}
}
SugaryChunksDispatcher.$tellfailure = function (success, errinfo, handler) {
	if (BaseObject.isCallback(handler) && !success) {
		BaseObject.callCallback(handler, errinfo);
	}
}
SugaryChunksDispatcher.$routetoanother = function(success, data_or_err, anotherOp) { // alias
	if (BaseObject.is(anotherOp, "IChunkedOperation")) {
		if (!anotherOp.isOperationComplete()) {
			anotherOp.ReportOperationChunk(success, data_or_err);
		}
	}
}

//#endregion delegators


/**
 * Clears everything and the object can be reused anew 
 */
SugaryChunksDispatcher.prototype.clear = function() {
	this.dispatcher.reset();
	this.dispatcher.removeAll();
	return this;
}
