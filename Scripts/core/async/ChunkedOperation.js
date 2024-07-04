/*
	Derives a chunked operation from the normal Operation class (one that relies on callback handling)
	
	How to use: 
	
	var op = callSomethingThatReturnsOperation( ... );
	if (BaseObject.is(op, "Operation")) {
		if (op.is("ChunkedOperation")) op.chunk(function(success,data_or_err) { ... });
		op.then(function(operation) { ... });
	}
	
	chunk() should be called before then(), because in some cases the handlers may not have the chance to run otherwise. E.g. The
		callee returns the operation after reporitng all the chunks and completes it. Future versions may take care for this, but for now keep the recommended order.
		
	When you know what operation is returned you do not need to check and the code may look like this:
	callSomethingThatReturnsOperation(...).chunk(function(success,data_or_err) { ... }).then(function(operation) { ... });
	

*/

/*Class*/
function ChunkedOperation(taskproc, timeout) {
	Operation.apply(this, arguments);
}
ChunkedOperation.Inherit(Operation, "ChunkedOperation");
ChunkedOperation.Implement(IChunkedOperationHandlingCallbackImpl);
ChunkedOperation.prototype.OperationReset = function() {
	Operation.prototype.OperationReset.apply(this,arguments);
	this.$chunks = []; // Clear the chunks queue
	return this;
}
ChunkedOperation.prototype.OperationClear = function() {
	Operation.prototype.OperationClear.apply(this,arguments);
	this.set_chunkroutine(null);
	return this;
}
/**
 * Turns explicitly the handling into a dispatcher. This happens automatically in case of usage of onchunk or other methods more than once on the same operation
 * @returns {SugaryChinkDispatcher} on which multiple handlers can be registered for variety of cases
 */
ChunkedOperation.prototype.dispatchchunks = function() {
	var old = this.get_chunkroutine();
	if (BaseObject.is(old,"SugaryChunksDispatcher")) {
			// Already dispatched
			this.$invokeChunkHandling(); // Eat everything from the queue.
			return old;
	} else {
		var wrapper = new SugaryChunksDispatcher(this);
		this.set_chunkroutine(wrapper);
		if (BaseObject.isCallback(old)) {
			wrapper.onchunk(old);
		}
		this.$invokeChunkHandling(); // Eat everything from the queue.
		return wrapper;
	}
}
/**
 * @param {Function|IInvoke|IInvokeWithArrayArgs} callback - if second argument is not specified
 * 			a callback receiving all chunks - both successful and unsuccessful, otherwise only the successful.
 * @param {Function|IInvoke|IInvokeWithArrayArgs} callbackfail - Optional, a callback receiving the unsuccessful chunks.
 * callbacks in both cases are proc(success, data_or_error). Success is set to true or false even if separate handlers are specified.
 */
ChunkedOperation.prototype.onchunk = function(callback, failcallback) {
	if (BaseObject.isCallback(callback)) {
		var old = this.get_chunkroutine();
		if (BaseObject.is(old,"SugaryChunksDispatcher")) {
			old.onchunk(callback, failcallback);
		} else if (BaseObject.isCallback(old)) {
			var wrapper = new SugaryChunksDispatcher(this);
			this.set_chunkroutine(wrapper);
			wrapper.onchunk(old);
			wrapper.onchunk(callback, failcallback);
		} else {
			this.set_chunkroutine(function(success,data) {
				if (success) {
					return BaseObject.callCallback(callback,true,data);
				} else {
					if (BaseObject.isCallback(failcallback)) {
						return BaseObject.callCallback(failcallback,false,data);
					}
				}
			});
		}
	}
	this.$invokeChunkHandling(); // Eat everything from the queue.
	return this;
}.Description("Handles both success and failure through inspectionof the passed operation");
/**
 * @param {Function|IInvoke|IInvokeWithArrayArgs} callback - if second argument is not specified
 * 			a callback receiving all chunks - both successful and unsuccessful, otherwise only the successful.
 * @param {Function|IInvoke|IInvokeWithArrayArgs} callbackfail - Optional, a callback receiving the unsuccessful chunks.
 * callbacks in both cases are proc(success, data_or_error). Success is set to true or false even if separate handlers are specified.
 */
ChunkedOperation.prototype.chunk = ChunkedOperation.prototype.onchunk;
	
ChunkedOperation.prototype.anychunk = function(callback) {
	this.onchunk(callback);
	return this;
}.Description("Should be used before then/whencomplete to avoid missing synchronously handled chunks. The anychunk variant passes all chunks to the callback without regard to their success/fail state.");

ChunkedOperation.prototype.onokchunk = function(callback) {
	return this.dispatchchunks().onokchunk(callback);
}
ChunkedOperation.prototype.okchunk = function(callback) {
	return this.dispatchchunks().okchunk(callback);
}
ChunkedOperation.prototype.failchunk = function(callback) {
	return this.dispatchchunks().failchunk(callback);
}
ChunkedOperation.prototype.onfailchunk = function(callback) {
	return this.dispatchchunks().onfailchunk(callback);
}
ChunkedOperation.prototype.routechunkto = function(op) {
	return this.dispatchchunks().routechunkto(op);
}

