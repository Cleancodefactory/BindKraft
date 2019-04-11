


// BEGIN ASYNC RESULT
// Async results enable the applications to wait and check when one or more asynchrnous operations are completed.
// Async results are single use! They should be discarded once used!
// This measure aims at preventing mix ups and prolonged reference hold up.
function AsyncResult(/*scheduler, dispatchable */) {
    BaseObject.apply(this, arguments);
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (BaseObject.is(arg, "IProcessScheduler")) {
            this.$scheduler = arg;
        } else if (BaseObject.is(arg, "IDispatchable")) {
            this.set_task(arg);
        } else if (BaseObject.is(arg, "IInvoke") || typeof arg == "function") { // handlers for completion (it is recommended to use then method, or direct attachment to events)
            this.completedevent.add(arg);
        }
    }
}
AsyncResult.Inherit(BaseObject, "AsyncResult");
AsyncResult.Implement(IAsyncResult);
AsyncResult.prototype.traceOn = false;
AsyncResult.prototype.obliterate = function (bFull) {
    if (this.isScheduled) this.unschedule();
    BaseObject.prototype.obliterate.call(this, bFull);
};
AsyncResult.prototype.$set_executing = function (v) {
    if (this.traceOn) {
        if (v) {
            jbTrace.log("Entering executing state - async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
        } else {
            jbTrace.log("Leaving executing state - async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
        }
    }
    this.$executing = v;
};
// Called by the schedulers only (should not be set from other code!)
AsyncResult.prototype.isCompleted = function () {
    if (this.$chainedResults != null && this.$chainedResults.length > 0) return false;
    if (!this.$isThisCompleted) return false;
    return true;
};
AsyncResult.prototype.$isThisCompleted = false;
AsyncResult.prototype.isSingleCompleted = function () { 
    return this.$isThisCompleted;
};
AsyncResult.prototype.completedevent = new InitializeEvent("Fired when the operation completes. This will include child operations if the result is chained");
AsyncResult.prototype.singlecompletedevent = new InitializeEvent("Fired when this operation completes. Does not include chained operation (if the result is chained)");
AsyncResult.prototype.then = function (handler_or_this, handler_or_nothing) {
    if (this.traceOn) jbTrace.log("Adding completion handler to async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
    if (typeof handler_or_nothing == "function" && BaseObject.is(handler_or_this, "BaseObject")) {
        this.completedevent.add(new Delegate(handler_or_this, handler_or_nothing));
    } else {
        this.completedevent.add(handler_or_this);
    }
    return this;
};
// Control part
AsyncResult.prototype.setComplete = function (data) { // Sets the current async result complete
    if (this.traceOn) jbTrace.log("Set complete invoked on Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks() + " current state is " + ((this.$isThisCompleted) ? "COMPLETED" : "not completed"), 0xFFF404);
    if (!this.$isThisCompleted) {
        if (this.traceOn) jbTrace.log("Completed Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
        this.$isThisCompleted = true;
        this.singlecompletedevent.invoke(this, data);
        this.singlecompletedevent.removeAll();
        if (this.$chainedResults.length == 0) {
            // Everything is also completed
            if (this.traceOn) jbTrace.log("* Everything completed on Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
            this.completedevent.invoke(this, data);
            this.completedevent.removeAll();
        }
    }
    this.$isThisCompleted = true;
    this.isScheduled = false; // This is completion, not uncheduling! The dependents must stay, so this is the only case in which we do not call this.set_scheduled which deals with them.
    this.$adviseOwner(this.isScheduled);
};     
AsyncResult.prototype.$chainedResultComplete = function(sender, data) { // Internal handler for completion of chjained results.
    this.$chainedResults.removeElement(sender);
    if (this.traceOn) jbTrace.log("chained result reported in on Async result: " + this.$__instanceId, 0xFFF404);
    if (this.traceOn) jbTrace.log("Unchaining result #" + (this.$chainedResults.length + 1) + " on Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
    if (this.$chainedResults.length == 0) {
        // Chained results fully completed
        if (this.$isThisCompleted) {
            // Everything is completed!
            if (this.traceOn) jbTrace.log("* Everything completed on Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
            this.completedevent.invoke(this, data);
            this.completedevent.removeAll();
        }
    }
};
AsyncResult.prototype.$chainedResults = new InitializeArray();
AsyncResult.prototype.chainResult = function (aresult) {
    if (BaseObject.is(aresult, "IAsyncResult")) {
        if (this.$chainedResults.addElement(aresult)) {
            if (this.traceOn) jbTrace.log("Chaining result #" + this.$chainedResults.length + " on Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
            aresult.completedevent.add(new Delegate(this, this.$chainedResultComplete));
        }
    }
}; // Chains another result.
AsyncResult.prototype.unchainResult = function (aresult) {
    if (BaseObject.is(aresult, "IAsyncResult")) {
        if (this.$chainedResults.removeElement(aresult)) {
            if (this.traceOn) jbTrace.log("Unchaining result #" + (this.$chainedResults.length + 1) + " on Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
            aresult.completedevent.remove(new Delegate(this, this.$chainedResultComplete));
        }
    }
};
AsyncResult.prototype.get_scheduler = function() {
    return this.$scheduler;
};
AsyncResult.prototype.set_scheduler = function (v) {
    if (v != null && !BaseObject.is(v, "IProcessScheduler")) throw "Invalid argument";
    this.$scheduler = v;
};
AsyncResult.prototype.$scheduleDependentPending = function () {
    if (this.$scheduler != null && this.$pendingScheduleTasks != null) {
        for (var i = 0; i < this.$pendingScheduleTasks.length; i++) {
            var _args = this.$pendingScheduleTasks[i];
            if (BaseObject.is(_args, "Array")) {
                var args = Array.createCopyOf(_args, 1);
                args.unshift(_args[0], this);
                var ar = this.$scheduler.schedule.apply(this.$scheduler, args); // schedule immediatelly
            }
        }
        this.$pendingScheduleTasks = null;
    }
};
AsyncResult.prototype.$unscheduleDependent = function () {
    if (this.$chainedResults != null && this.$chainedResults.length > 0) {
        for (var i = 0; i < this.$chainedResults.length; i++) {
            var task = this.$chainedResults[i];
            if (BaseObject.is(task, "IAsyncResult")) {
                if (this.traceOn) jbTrace.log("Unscheduling chained result #" + (i + 1) + " on Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
                // Detach from the event
                task.completedevent.remove(new Delegate(this, this.$chainedResultComplete));
                task.unschedule();
            }
        }
        this.$chainedResults.length = 0; // Clear them all
    }
};
AsyncResult.prototype.scheduleDependent = function (task) {
    var ar = null;
    if (this.$pendingScheduleTasks == null) this.$pendingScheduleTasks = [];
    this.$pendingScheduleTasks.push(Array.createCopyOf(arguments));
    if (this.$scheduler != null && this.isScheduled) {
        // Do it now
        this.$scheduleDependentPending();
    }
    return this;
};
AsyncResult.prototype.$adviseOwner = function (bScheduled) {
    if (bScheduled) {
        if (BaseObject.is(this.ownerObject, "BaseObject")) this.ownerObject.$asyncResultWasScheduled(this);
    } else {
        if (BaseObject.is(this.ownerObject, "BaseObject")) this.ownerObject.$asyncResultWasUnscheduled(this);
    }
};
AsyncResult.prototype.set_scheduled = function (v) {
    this.isScheduled = v;
	this.$adviseOwner(this.isScheduled);
    if (v) {
        this.$scheduleDependentPending();
    } else {
        this.$unscheduleDependent();
    }
};
// Adapters
AsyncResult.prototype.notify = function () {
    var self = this;
    return function () {
        self.setComplete.apply(self, arguments);
    };
};
// Self scheduling
AsyncResult.prototype.schedule = function () {
    if (!this.isScheduled) {
        if (this.$scheduler != null) {
            if (this.traceOn) jbTrace.log("(self) Scheduling Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
            var args = Array.createCopyOf(arguments);
            if (args.length > 0 && !BaseObject.is(args[0], "IAsyncResult")) {
                args.unshift(null);
            }
            args.unshift(this);
            this.$scheduler.schedule.apply(this.$scheduler, args); // schedule immediatelly - the only option here. It seems too risky to leave such an async to wait on its own.
            // The scheduler calls us back to set_scheduled(true) where we deal with the pending tasks
        }
    } else {
        // May be we need to throw?
        // throw "Already scheduled";
    }
};
AsyncResult.prototype.unschedule = function () {
    if (this.isScheduled) {
        if (this.$scheduler != null) {
            if (this.traceOn) jbTrace.log("(self) Unscheduling Async result: " + this.$__instanceId + " system tick:" + Ticker.Default.get_totalticks(), 0xFFF404);
            this.$scheduler.unschedule(this);
            this.completedevent.removeAll();
            this.singlecompletedevent.removeAll();
        }
    }
};