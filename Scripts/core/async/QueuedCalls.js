if (typeof Promise != "undefined" && Promise.toString().indexOf("[native code]") != -1) {

    function QueuedCalls(callback, timeout) {
        BaseObject.apply(this,arguments);
        if (BaseObject.isCallback(callback)) {
            this.$callback = callback;
        }
        if (typeof timeout == "number" && timeout > 0) {
            this.$timeout = timeout;
        }
    }
    QueuedCalls.Inherit(BaseObject, "QueuedCalls");

    QueuedCalls.prototype.$callback = null;
    QueuedCalls.prototype.$queuedCalls = new InitializeArray("Queued calls.");
    QueuedCalls.prototype.$timeout = null;
    QueuedCalls.prototype.$timeoutId = null;
    QueuedCalls.prototype.$currentCall = null; // Promise or null

    QueuedCalls.prototype.$executeQueuedCall = function(req) {
        var result = null;
        if (this.$timeout != null) {
            this.$timeoutId = setTimeout(() => {
                this.$timeoutId = null;
                req.rejector("The call timed out."); // This should invoke the picker
            },this.$timeout);
        }
        try {
            result = BaseObject.applyCallback(this.$callback, req.params);
        } catch (ex) { 
            // Non-promise based functions may throw an exception
            // And promise based too - but then they do not return a promise
            // So time for quick bail out
            req.promise.finally(this.$onTryQueue.getWrapper()); // This will execute after this js loop
            req.rejector(ex);
            return;
        }
        if (result instanceof Promise) {
            this.$currentCall = result;
            // Direct the promise to the external one and finally to the picker
            this.$currentCall
                .then(req.resolver)
                .catch(req.rejector)
                .finally(this.$onTryQueue.getWrapper());
        } else if (BaseObject.is(result, "Operation")) {
            this.$currentCall = new Promise((resolve, reject) => {
                result
                    .onsuccess(r => resolve(r))
                    .onfailure(err => reject(err));
            }).then(req.resolver)
              .catch(req.rejector)
              .finally(this.$onTryQueue.getWrapper());
        } else { // The call is complete
            // Schedule next pick
            req.promise.finally(this.$onTryQueue.getWrapper()); // This will execute after this js loop
            req.resolver(result);
            return;
        }
    }
    QueuedCalls.prototype.$onTryQueue = new InitializeMethodDelegate("Delegate calling the $tryQueue", function() {
        // Current call ended
        if (this.$timeoutId != null) clearTimeout(this.$timeoutId);
        this.$currentCall = null;
        this.$tryQueue();
    });
    QueuedCalls.prototype.$tryQueue = function() {
        if (this.$currentCall == null) {
            // No current call
            var req = this.$queuedCalls.shift();
            if (req != null) {
                this.$executeQueuedCall(req);
            } else {
                // Nothing more to call at this moment
            }
        } else if (this.$currentCall instanceof Promise) {
            // Assume we are already attached by $executeQueuedCall

        }
    }

    QueuedCalls.prototype.invoke = function() {
        var args = Array.createCopyOf(arguments);
        var req = {
            params: args
        };
        req.promise = new Promise(function(s,f) {req.resolver = s;req.rejector=f;});
        this.$queuedCalls.push(req);
        this.$tryQueue();
        return req.promise;
    }

}