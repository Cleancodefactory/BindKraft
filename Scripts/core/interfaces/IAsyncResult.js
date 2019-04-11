


/*INTERFACE*/
function IAsyncResult() { }
IAsyncResult.Interface("IAsyncResult");
IAsyncResult.prototype.isCompleted = function () { };
IAsyncResult.prototype.isSingleCompleted = function () {};
// Fired when this async result and all its dependencies are completed
IAsyncResult.prototype.completedevent = null;  
// Fired when only the current async result is complete (not the dependencies).
IAsyncResult.prototype.singlecompletedevent = null;
IAsyncResult.prototype.then = function (handler_or_this, handler_or_nothing) { return this; }; // must return this
IAsyncResult.prototype.ownerObject = null; // If this is not null and is BaseObject it will be notified by calling $asyncResultWasScheduled(ar)/$asyncResultWasUnscheduled(ar) by the result
// IAsyncResult.prototype.failure = false; // Can be set if supported
// We are not putting this into the Interface for now - use the data for that purpose. 
// Control part
IAsyncResult.prototype.setComplete = function () { }; // Sets the current async result complete
IAsyncResult.prototype.chainResult = function (aresult) { }; // Chains another result.
IAsyncResult.prototype.unchainResult = function (aresult) { }; // Unchains result (optional implementation)
// Scheduler connection part
IAsyncResult.prototype.get_scheduler = function() {throw "not implemented";} // returns the scheduler (if any) for this result
IAsyncResult.prototype.set_scheduler = function(v) {throw "not implemented";} // returns the scheduler (if any) for this result
IAsyncResult.prototype.$task = null;
IAsyncResult.prototype.get_task = function() { return this.$task; }
IAsyncResult.prototype.set_task = function(t) {
    if (this.isSingleCompleted()) throw "The async result is done, nothing can be changed in it";
    if (t != null && !BaseObject.is(t, "IDispatchable")) {
        throw "The task must be IDispatchable";
    }
    this.$task = t;
};
IAsyncResult.prototype.get_key = function () {
    return this.$key;
}
IAsyncResult.prototype.set_key = function (v) {
    this.$key = v;
}
IAsyncResult.prototype.get_syncdata = function () {
    return this.$syncdata;
}
IAsyncResult.prototype.set_syncdata = function (v) {
    this.$syncdata = v;
}
// Schedules another task chaining it on this one

IAsyncResult.prototype.scheduleDependent = function (task /*[,specific args]*/) { } // Unlike IProcessScheduler.schedule the second argument is not needed here. The result passes itself as such to the scheduler
IAsyncResult.prototype.isScheduled = false;
IAsyncResult.prototype.scheduleOptions = 0; // Can contain combination of ProcessScheduleOptionsEnum flags - see below
IAsyncResult.prototype.set_scheduled = function (v) { throw "Not implemented"; }; // This needs to schdule/unschdedule dependent tasks when it happens.
IAsyncResult.prototype.get_scheduled = function () { return this.isScheduled; }; // This side is simple
IAsyncResult.prototype.$executing = false;
IAsyncResult.prototype.$set_executing = function(v) { this.$executing = v; } // Called by the schedulers only (should not be set from other code!)
IAsyncResult.prototype.get_executing = function () { return this.$executing; } // Check this to determine if the async result is currently executing
IAsyncResult.prototype.schedule = function () { throw "Not implemented"; };
IAsyncResult.prototype.unschedule = function () { throw "Not implemented"; };

/*INTERFACE*/
// This is often combined with async results
function ICancellable() {}
ICancellable.Interface("ICancellable");
ICancellable.prototype.cancel = function (bFull) {}; // bFull implies usually related objects - chained results etc.
ICancellable.prototype.isCancelled = function () {};
