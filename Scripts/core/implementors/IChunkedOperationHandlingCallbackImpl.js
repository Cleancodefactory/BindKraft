
/*
	Implements chunked operation specifics
	
	Chunk callback = function (bool success, any data_or_errorinfo) returns anything or false
	Returning false will forcibly complete the operation with failure indication and error with description saying that a chunk processing caused cancellation of the operation.
	
	Returning false should not be done without the knowledge of the implementation of the operation executor.
	It should check isOperationComplete each time it reports a chunk to avoid exception or even worse - piling up chunks that are never processed
	
	Recommended use of this implementer - on top of the IOperationHandlingCallbackImpl or by inheriting a class that already used IOperationHandlingCallbackImpl.


	
	
	
	TODO: 1.Pump out all the remaining chunks on complete operation
		  2. Throw exception if op complete
	

	
*/
function IChunkedOperationHandlingCallbackImpl() {}
IChunkedOperationHandlingCallbackImpl.InterfaceImpl(IChunkedOperationHandlingCallbacks);
IChunkedOperationHandlingCallbackImpl.RequiredTypes("IOperation");
IChunkedOperationHandlingCallbackImpl.classInitialize = function(cls) {
	
	
	cls.Implement(IChunkedOperation);
	cls.Implement(IChunkedOperationHandling);
	
	cls.prototype.$chunkroutine
	cls.prototype.get_chunkroutine = function () { return this.$chunkroutine; }
	cls.prototype.set_chunkroutine = function (v) { 
		if (BaseObject.isCallback(v)) {
			this.$chunkroutine = v;
		} else if (v == null) {
			this.$chunkroutine = null;
		} else {
			throw "Chunk routine must be a valid callback (function, delegate, etc.) or null";
		}
	}
	cls.prototype.$chunks = new InitializeArray("Chunks for processing"); // { succes:, data: } All chunks are added to the queue and remoced when processed.
	cls.prototype.ReportOperationChunk = function(/*bool*/ success, errorinfo_or_data) { 
		if (this.isOperationComplete()) { 
			throw "The operation is already comlete. Chunks can be reported only on incomplete operation.";
		}
		this.$chunks.push({	
			success: success, 
			data: ((success)?errorinfo_or_data:null), 
			error: ((success)?null:errorinfo_or_data) 
		});
		this.onOperationChunk();
	}
	cls.prototype.onOperationChunk = function () { 
		this.$invokeChunkHandling();
	}
	
	cls.prototype.$invokeChunkHandling = function() {
		var cr = this.get_chunkroutine();
		if (cr != null) {
			var cnk;
			var r;
			while (this.$chunks.length > 0) {
				cnk = this.$chunks.shift();
				r = BaseObject.callCallback(cr,cnk.success,(cnk.success?cnk.data:cnk.error));
				if (r === false) { // Force stop from the handler
					this.CompleteOperation(false, { description: "Operation forcibly rejected by chunk handler." });
					return;
				}
			}
		}
	}
}	

