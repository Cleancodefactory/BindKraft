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
ChunkedOperation.prototype.chunk = function(callback,callbackfail) {
	if (callbackfail == null) callbackfail = callback;
	if (BaseObject.isCallback(callback)) {
		this.set_chunkroutine(function(success,data) {
			if (success) {
				return BaseObject.callCallback(callback,true,data);
			} else {
				if (BaseObject.isCallback(callbackfail)) {
					return BaseObject.callCallback(callbackfail,false,data);
				}
			}
		});
	}
	this.$invokeChunkHandling(); // Eat everything from the queue.
	return this;
}.Description("Should be used before then to avoid missing synchronously handled chunks. With one argument calls it only for successful chunks, with two - calls first for the successful and the other for unsuccessful.");



