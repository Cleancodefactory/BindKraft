function OperationQueuedCalls(callback, timeout) {
    BaseObject.apply(this,arguments);
    BaseObject.apply(this,arguments);
    if (BaseObject.isCallback(callback)) {
        this.$callback = callback;
    }
    if (typeof timeout == "number" && timeout > 0) {
        this.$timeout = timeout;
    }
}
OperationQueuedCalls.Inherit(BaseObject, "OperationQueuedCalls");

OperationQueuedCalls.prototype.$callback = null;
OperationQueuedCalls.prototype.$queuedCalls = new InitializeArray("Queued calls.");
OperationQueuedCalls.prototype.$timeout = null;
OperationQueuedCalls.prototype.$timeoutId = null;
OperationQueuedCalls.prototype.$currentCall = null; // Operation or null

OperationQueuedCalls.prototype.$executeQueuedCall = function(req) {
    var op,result = null;
    try {
        result = BaseObject.applyCallback(this.$callback, req.params);
    } catch (ex) { 
        // Non-promise based functions may throw an exception
        // And promise based too - but then they do not return a promise
        // So time for quick bail out
        req.operation.whencomplete().tell(this.$onTryQueue.getWrapper()); // This will execute after this js loop
        req.operation.CompleteOperation(false, ex);
        return;
    }
    if (typeof Promise != "undefined" && result instanceof Promise) {
        this.$currentCall = req.operation;
        req.operation.whencomplete.tell(this.$onTryQueue);
        // Direct the promise to the operation returned to the invoker
        result
            .then(r => req.operation.CompleteOperation(true,r))
            .catch(err => req.operation.CompleteOperation(false,err));
            
    } else if (BaseObject.is(result, "Operation")) {
        this.$currentCall = result;
        result.whencomplete().tell(this.$onTryQueue);
        result
            .onsuccess(r => req.operation.CompleteOperation(true,r))
            .onfailure(err => req.operation.CompleteOperation(false, err));
    } else { // The call is complete
        // Schedule next pick
        req.operation.whencomplete().tell(this.$onTryQueue);
        req.operation.CompleteOperation(true, result);
        return;
    }
}
OperationQueuedCalls.prototype.$onTryQueue = new InitializeMethodDelegate("Delegate calling the $tryQueue", function() {
    // Current call ended
    this.$currentCall = null;
    this.$tryQueue();
});
OperationQueuedCalls.prototype.$tryQueue = function() {
    if (this.$currentCall == null) {
        // No current call
        var req = this.$queuedCalls.shift();
        if (req != null) {
            this.$executeQueuedCall(req);
        } else {
            // Nothing more to call at this moment
        }
    } else if (BaseObject.is(this.$currentCall, "Operation")) {
        // Assume we are already attached by $executeQueuedCall

    }
}

OperationQueuedCalls.prototype.invoke = function() {
    var args = Array.createCopyOf(arguments);
    var req = {
        params: args
    };
    req.operation = new Operation(null, this.$timeout);
    this.$queuedCalls.push(req);
    this.$tryQueue();
    return req.operation;
}