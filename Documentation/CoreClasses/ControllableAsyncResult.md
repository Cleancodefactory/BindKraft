# ControllableAsyncResult

A class inheriting AsyncResult which is more handy for management in code. One can use it quite efficiently without ever digging into the intricacies of AsyncResult and the async task scheduling provided by BindKraftJS.

The `ControllableAsyncResult` is designed to be easy to manage, but it is also designed for deep integration with your code. The [BaseObject](BaseObject.md)'s methods that deal with asynchronous/scheduled/delayed code execution all return or manage a ControllableAsyncResult.

In a nut shell ControllableAsyncResult represents a task (boils down to a function actually) that is prepared and registered with the system task scheduler for execution later. The wrapped task can be configured further with different priorities, maximum time to live (i.e, instruct the scheduler to discard it if the system is too busy), minimum time before being executed and so on.

## Integration with BaseObject

This integration is one of the reasons this class exists. The BaseObject maintains a "register" of all the ControllableAsyncResult objects created through its methods (the list is further below), with an options to mark them with some names (programmers decision).

Skipping for the moment the detailed management, this registration enables any instance of a BindKraftJS class to create a number of async tasks and manage them in groups if necessary. 

Most scenarios where this is needed include tasks created in response to a user request (directly or not) and as the async tasks can potentially take long time to complete (all of them), the user can do something else that makes them obsolete. Through the registration these tasks can be discarded by name tag.

## BaseObject methods producing ControllableAsyncResult

BaseObject.prototype.callAsync(method_or_function[, arguments])

>**method_or_function** - a reference to a method or inline function.

>**arguments** - list of arguments passed to the method_or_function when it is finally called by the scheduler at some point in the future.

>returns: `ControllableAsyncResult`

BaseObject.prototype.callAsyncIf(condition, method_or_function [, arguments])

    The same as callAsync, but the first argument is treated as boolean-like value. If it resolves to true the task is scheduled, if not the method_or_function is executed synchronously immediately.

>Remarks: It is not a good idea to count on the return result of the **method_or_function**. callAsyncIf will return it if the `condition` resolves to false-like value, but otherwise the result will be `ControllableAsyncResult`. This makes this method's practical usage rather limited, but in fact it is useful enough. The reason is the fact that the UI thread in the browser is also the home of your page's Javascript and delaying some work, even without much control over it, is useful quite often. For example the bindings in BindKraftJS support an `async` option and they use exactly this method internally. In an UI where the event handlers are way too many, possibly even the data bindings trigger additional heavy processing, setting them to perform as separate async tasks can keep the browser responsive during their execution, without that the browser will block until they are done and the user will experience UI stuttering or worse - longer tasks can lead the user to think the browser crashed. 

BaseObject.prototype.async(method_or_function[, ownerObject])

    The base method for callAsync and callAsyncIf. It creates the ControllableAsyncResult for the method/function you pass, but it does not schedule it with the system task scheduler (the other methods do).

    This is useful when you need to configure the task more thoroughly or you need to pass it through some more code (pass it to other methods to put their pieces of configuration) before it is scheduled.

>**method_or_function** - like in callASync a method reference or inline function - in both cases it will be called with the this of your object.

>**ownerObject** - optional. A BindKraftJS object with which to register the task. If omitted it will be this object (the most typical case)


BaseObject.prototype.discardAsync(key_callback)

BaseObject.prototype.afterAsync(asyncResult, method_or_function)

TODO: Continue


## ControllableAsyncResult members

    All methods return this and can be chained.

ControllableAsyncResult.prototype.key(namemark)

    Marks the task with the name mark

ControllableAsyncResult.prototype.condition(cond)

    Specifies a condition that has to be met in order to execute the task.

>**condition** - predicate function ot delegate. The scheduler will call it when it is about to execute the task and will reschedule if it returns `false`, or execute it if the condition returns `true`.

ControllableAsyncResult.prototype.chain(parentAsyncResult)

    Chains the task over another - the parentAsyncResult.

    The parentAsyncResult will complete when all chained tasks on it complete too. They can be nested multiple times - i.e. the chained tasks may have chained tasks on them and so on.

ControllableAsyncResult.prototype.chainIf(namemarks)

    Chains this task on the currently executing task (on the system scheduler) if:

>namemarks is omitted

>namemarsks is a string containing a namemark and the currently executing task has the same name mark.

>namemarks is an array of strings or a string with namemarks separated by commas (no spaces between them) and one of these matches the name mark of the currently executing one

    This is an difficult to use option with the purpose to make sure that the currently executing task will not be considered finished before this one is completed as well.

ControllableAsyncResult.prototype.maxAge(age)

    Maximum age of the task in milliseconds. If the scheduler gets the task from the scheduling queue too late it will automatically discard it.

ControllableAsyncResult.prototype.after(delay)

    The task should execute not earlier than the delay (in milliseconds). The actual time of execution will be greater than the delay and will depend on the amount of tasks scheduled at the moment.

ControllableAsyncResult.prototype.options(scheduleOptions)

    Set scheduler options - integer flags (see the next two methods for the two most often used)

ControllableAsyncResult.prototype.continuous(true_false);

    Called with true sets the continuous scheduling flag. This effectively tells the scheduler that the task is not heavy and one more can be executed immediately after this one without waiting for new time window.

ControllableAsyncResult.prototype.lowpriority(true_false);

    MArks the task as low priority and it will be executed by the scheduler only when all the normal tasks are done. On a loaded system this may delay the execution considerably. Using maxAge together with this option is most often a good idea.

ControllableAsyncResult.prototype.execute([arg1[, arg2[, arg3 ...]]])

    Defines the arguments that will be passed to the task (the method or function) and schedules it with the system task scheduler.

ControllableAsyncResult.prototype.apply(argsArray)

    Like execute, but uses array of arguments instead of argument list.
