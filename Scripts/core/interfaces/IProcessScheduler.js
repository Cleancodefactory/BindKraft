


/*INTERFACE*/
function IProcessScheduler() {}
IProcessScheduler.Interface("IProcessScheduler");
IProcessScheduler.prototype.generateTaskId = function() { return (IProcessScheduler.$taskId != null)?(IProcessScheduler.$taskId++): (IProcessScheduler.$taskId = 0); }; // Generates unique id to be used for identification of the managed shunks of action
IProcessScheduler.prototype.schedule = function(/*IDispatchable|IAsyncResult[|Delegate|function]*/ task, /*[IAsyncResult] parentASync*/ chainResult, /*callback*/ condition,/*millisecs*/maxAge,/*milliseconds*/ after) { throw "schedule is not implemented"; };
IProcessScheduler.prototype.unschedule = function (/*PDispatcable|IAsyncResult|task_id*/) {}; // Cancels the scheduling
IProcessScheduler.prototype.unscheduleByTarget = function (target, customCallback) { }; // Unschedules tasks by target (if supported and if supplied) and optionally calls a customCallback (returns true for confirmation) proto: function(task, asyncResult):bool.
IProcessScheduler.prototype.currentAsyncResult = function () { return null; } // Return the currently executed async result (if any is assigned to the task and it executes)
// As the unscheduling is most often partitioned by target this function is designed for most convenient use with a target param, but it should support null for target and call the callback for everything.
// Schedule is REQUIRED to support scheduling of naked dispatchables and async results (which provide access to dispatachables through get_task). For the rest of the options the support is optional
//      and is defined exclusively as syntax sugar - autopack delegate or function. It may or may not be possible to autopack the optional argument types - it all depends on the scheduler's ability
//      to assume default class for packing which depends on on the scheduler's goals and coverage. This means one should call schedule with such arguments only if he/she knows the class
//      with which he/she is working and if that class supports those. In more abstract scenarios this SHOULD NOT be done.
