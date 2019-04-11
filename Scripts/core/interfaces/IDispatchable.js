


/* ASYNCHRONOUS PROCESSING IMPORTANT GUIDELINES */
/*
    To enable both economic and complex solutions the functionality is split between several interfaces. 
    In short:
    - The schedulers (IProcessScheduler) enqueue tasks
    - The tasks are executed as dispatchables (IDispatchable)
    - The schedulers return async results (IAsyncResult) which may or may not be cancellable (ICancellable)
    - The async results exercise control over the scheduling by keeping reference to the scheduler.
    - In theory async results and dispatchables can be combined together in the same class, but this should be avoided because:
        = IDispatchable implements ways of execution and will burden the developer with unrelated work which can be unfamiliar to her/him
        = IAsyncResult can differ for different schedulers while dispatchables can differ for different targets - this implies different hierarchies or multi-inheritance
            which still cannot save us from proliferation of classes for every kind of combined purpose.
    - The schedulers SHOULD Implement scheduling internally with the capability to keep together async result and the corresponding dispatchable, then manage these
        according to the async result commands. I.e. the role of the dispatchable should be kept simple and limited to execution.
    JUSTIFICATIONS: Schedulers and async results are built by framework designers and it is very unlikely to expect that a developer working on applied tasks will work in that area ever.
        The complexity is thus moved as much as possible in these areas because they will remain hidden for the developers working on the business logic of the applications.
*/

/*INTERFACE*/
// Abstract dispatch declaration. Dispatchable objects are objects intended for some message-like usage over targets recorded in them.
// The dispatch method should perform the operation needed over the target. This usually looks like visitor pattern - a method of the target
// is called with the object (message). The concrete implementation depends on the nature of the dispatchable object. Windows messages got
// dispatched to their target (or source for some) windows, other dispatchables will do otherwise.
// Example: The window messages cannot be cancelled. This may seem strange, but the ordering is important in them and it is better to ignore them on the target when received instead
// of cancelling their scheduling - which may cause discrepancies in the UI behavior. On the contrary long running tasks split into chunks can be cancelled without too much risk and dispatchables
// dealing with such will typically pass along the async result while the window message dispatchable (the message itself) will ignore it.
function IDispatchable() { };
IDispatchable.Interface("IDispatchable");
IDispatchable.prototype.dispatch = function () { }; // Dispatchables may support arguments for convenience only! I.e. it may combine internally callArguments and normal dispatch if it is called with any arguments, but only for explicit calling in thightly integrated code - do not depend on that!
IDispatchable.prototype.compareDispatchTarget = function (obj) { } .Description("Compares with the given object and returns true if they are considered equal");
IDispatchable.prototype.get_target = function () { return null; }
// Silently ignore these
IDispatchable.prototype.callArguments = function (/*argument list*/) { }; // from arguments
IDispatchable.prototype.applyArguments = function (argsArray) { }; // from array
// USe this one to determine if the above feature works
IDispatchable.prototype.supportsArguments = function () { return false; };

