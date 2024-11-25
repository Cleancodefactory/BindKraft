function ChunkedOperation(taskproc,timeout){Operation.apply(this,arguments);}ChunkedOperation.Inherit(Operation,"ChunkedOperation");ChunkedOperation.Implement(IChunkedOperationHandlingCallbackImpl);ChunkedOperation.prototype.OperationReset=function(){Operation.prototype.OperationReset.apply(this,arguments);this.$chunks=[];return this;};ChunkedOperation.prototype.OperationClear=function(){Operation.prototype.OperationClear.apply(this,arguments);this.set_chunkroutine(null);return this;};ChunkedOperation.prototype.chunk=function(callback,callbackfail){if(BaseObject.isCallback(callback)){this.set_chunkroutine(function(success,data){if(success){return BaseObject.callCallback(callback,true,data);}else{if(BaseObject.isCallback(callbackfail)){return BaseObject.callCallback(callbackfail,false,data);}}});}this.$invokeChunkHandling();return this;}.Description("Should be used before then to avoid missing synchronously handled chunks. \
With one argument calls it only for successful chunks, \
with two - calls first for the successful and the other for unsuccessful.");ChunkedOperation.prototype.anychunk=function(callback){if(BaseObject.isCallback(callback)){this.set_chunkroutine(callback);}this.$invokeChunkHandling();return this;}.Description("Should be used before then/whencomplete to avoid missing synchronously handled chunks. The anychunk variant passes all chunks to the callback without regard to their success/fail state.");