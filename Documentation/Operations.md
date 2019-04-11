Operations
==========

If you just want to check how to use typical `operations` skip to the **Operation class** section.

## Overview

The Operations aim at filling the niche usually associated with Promise objects. For a number of reasons (including supporting IE) we want to use own waiting/synchronization structures. Operations should not be confused with IAsyncResult/AsyncResult and the derived classes from them. The AsyncResult name is a misnomer, initially they were intended to serve both purposes - schedulable tasks and promise-like task synchronizations. However the scheduling functionality grew in time further than initially planned and needs its own supporting classes - the IAsyncResult grew and specialized to fill this niche and for this reason will not serve as good synchronization mechanism in other cases. This brought the IOperation and the other operation interfaces and classes into the platform. 

## Operations vs promises

I'll assume that the reader knows how promises work and will compare them with operations. Unlike `promises`, `operations` are designed over an extendable set of interfaces. Operations have very small core functionality shared by all operations and a number of interfaces (and corresponding implementations) that define more specialized operations in variety of directions. This inspiration comes from the different scenarios of synchronization where the operations aim at doing more than just synchronize the work of two or more sides/tasks, but also to provide simpler ways to exchange data, results and generally integrate deeper the synchronizing parties.

Because of the hierarchy of extendable interfaces operations share common features, but diverge when it comes to integration with the actual work done into directions more appropriate for the specific work. This still keeps integration between different operations, but adds additional benefits when parties specialized in specific work exchange operations that are better suited for them - such as easy exchange of data, much smaller code and many others.

The promises, on the other hand, are designed to be created with their work set and to be completed (rejected or resolved) from within this work code (usually just a function). The operations,  are designed to be signalled mostly from outside - by any code that has a reference to the operation. Thus operations are naturally designed as signalling objects usable by any number of parties that know about them, while the promises are stuck with their tasks from the moment of their creation. Work around is/are, of course, possible, but not the natural way to use them. This is the most important design difference and is especially useful for BindKraft, because of the concept - multiple independent or almost independent constructs running at the same time and sharing the desktop and the other resources. When they need to sync with each other, this is almost never an explicit implementation for the two parties, but an option that works when they poses the same signalling tool - some operation or another sync object. In more general terms this can be illustrated this way - with promise the work done by callee is always done in a promise and it is always returned to the caller (of course, tricks can do it differently, but we are talking about the normal usage). Operations will have different natural ways - they can be returned as promises, but the tasks which they track do not need to be enclosed in the operation, so the callee can implement then any way it wants and just provide reference to the operation so that the corresponding task can set that operation complete, another possible scenario may "tell" the callee that the task it performs continues elsewhere and completes there, then the operation can just be given to that code, counting on it to mark it complete - with a promise the right way to do it will be to use two promises one after another.



## Operation Basics

(_you can skip to **Operation class** below if you are not interested in the architecture details at the moment_)

_In actual code ready to use classes have to be used, e.g. Operation, ChunkedOperation. The usage is relatively simple, but in this part we are going to pass through the operation building interfaces. If you do not want to read such (mostly) theoretical details, please skip to the practical usage of the classes provided by the framework. You require the deeper info about the interfaces only if you want to create your own operation implementation._

On the simplest level an operation is something that can be marked for complete or incomplete, when completed, it can be successful or failed (similar to fulfilled and rejected in promise). It also serves as a container for result data xor error info (when successful or failed correspondingly) and this is not typical for a promise-like construct, but it enables self-containment for the operations without counting on closures or other outer (foreign for the construct) mechanisms. There is no internal function - it is just a class with objects that can be explicitly marked and set with the data required - a synchronization container where two or more parties impact the state of the object in a fashion well-known for all of them. This will be what you get from IOperation interface.

From this point on there comes the IOperationReset interface which adds ability to reuse the instance in new cycles of synchronization.

Then IOperationHandling adds a virtual method to call on completion or reset and finally IOperationHandlingCallbacks adds a handler attached from outside to be invoked through the virtual handler.

Further extensions can easily include events for multicasting and others.


## Core interfaces

### IOperation - the core most interface

```Javascript
/*INTERFACE*/
function IOperation() {}
IOperation.Interface("IOperation");
IOperation.prototype.isOperationComplete = function() {}; // Return true/false
IOperation.prototype.isOperationSuccessful = function() {}; // Return true/false or null if not complete
IOperation.prototype.getOperationErrorInfo = function() {}; // Return info (could be null) on failure, otherwise throw error
IOperation.prototype.getOperationResult = function(){}; // This must return the data only on success, throw error otherwise
    
IOperation.prototype.CompleteOperation = function(/*bool*/ success, errorinfo_or_data) {};
```

This shows the core features shared by all the operations no matter how they are extended futher:

- Any code can check if operations is complete
- Any code can check if operations is successful
- Any code can get bundled result data passed through the CompleteOperation
- Any code can get the error info (structure defined later in this document)
- Any code can complete the operation.

Up to this point the operation is just a simple hub shared by the parties that have to sync their work with the added ability to pass data or error info through. No handling is really provided up to here, the only option is the check the state.

### IOperationHandling - abstract handling prerequizites

```Javascript
/*INTERFACE*/
function IOperationHandling() {}
IOperationHandling.Interface("IOperationHandling");
IOperationHandling.prototype.onCompleteOperation = function () { };
```

This interface does not do anything specific, it only adds a focal point - onCompleteOperation which have to be called on completion to invoke the actual handling whatever it might be (as defined by further interfaces).

### IOperationHandlingCallbacks - handling with callbacks or delegates

```Javascript

/*INTERFACE*/
function IOperationHandlingCallbacks() {}
IOperationHandlingCallbacks.Interface("IOperationHandlingCallbacks");

IOperationHandlingCallbacks.prototype.get_completionroutine = function () { };
IOperationHandlingCallbacks.prototype.set_completionroutine = function (v) { };
```

This interface adds the concept for handling with provided callback routines/delegates and just provides a property for that callback. What is presumed is that __IOperationHandling.prototype.onCompleteOperation__ should call this callback.

The callback prototype is like this:

```Javascript
callback = function (operation) { ... };

```

The callback is called with a single argument - the operation itself. The callback can easilly check state and request any piece of information from it.

### IOperationReset - making operation recyclable for reuse.

This may or may not be desired in different scenarios - it will depend on design decisions. There is no good or bad way here - it is mosly a matter of choice and way of thinking involved.

```Javascript
/*INTERFACE*/
function IOperationReset() { }
IOperationReset.Interface("IOperationReset");
IOperationReset.prototype.OperationReset = function () { };
IOperationReset.prototype.OperationClear = function () { };

```
Here:

- OperationReset resets state, data and anything else added by other interfaces, but lefts handling related settings intact - callbacks, event handlers or other means used for this purpose.
- OperationClear resets everything - including handling settings.

As mentioned above - reuse of operation instances is a matter of choice. OOP developers more often prefer creation of new instances each time they do certain task, but there can be good architectures where reusing the instances can be prefered. A good example is an artchitecture with (very) long living huge structures of objects. In such architectures it may be more convenient to share references to instances of synchronization objects and let one of the sides participating in each synchronized task to manage the operation instance and re-initialize it each time the recurent task is performed.

## Operation class 

This is standard implementation for typical operation and a base class for the operation classes provided by BindKraft platform. There are some extended operation classes which we address further in this document, but all of them can be used just like `Operaton` if the code dealing with them does not know how to use the advanced features they implement.

`Operation` implements all the core interfaces with the addition of handling syntax.

Usage will look like this:

The requester calls the requestee to perform the operation.
Example code for a method of the Requestee - the method that will do something that is (or at least could be under som circumstances) asynchronous.

```Javascript
Requestee.prototype.doSomething = function(parameters) {
    var op = new Operation();
    call_something_asynchronous(function() {
        // Do whatever needs to be done
        // report completion and include some result composed from it.
        op.CompleteOperation(true, { a:"something", b:"something else", ... });
        // in case the work completes unsuccessfully instead of the above line we will complete it differently
        op.CompleteOperation(false, "Error message ...");
    });
    return op;
}
```

And the requester will call this method retain the operation and pass a handler to it

```Javascript
Requester.prototype.somemethod = function() {
    // some work leading to the need to call the requestee
    // Assume we have the reference to the requestee in a variable with the same name
    var operation = requestee.doSomething({ ... some parameters ...});
    operation.then(new Delegate(this, this.theHandler));
    // Of course the handler can be just inline function as well
    // In real code this will depend on what is more handy for the developer in the particular case
    // Other code
}
Requester.prototype.theHandler = function(operation) {
    if (operation.isOperationSuccessful()) {
        var theResultData = operation.getOperationResult();
        // Do something useful with the data
    } else {
        var theErrorInfo = operation.getOperationErrorInfo();
        // Handle the error or swallow it - whatever fits best your needs.
        // For example show alert
        alert("An error ocurred while doing my job ... ");
    }
}
```

Certainly, the scenario can differ, the task could be started in a more indirect manner, the methods can be designed differently - e.g. the requester can create and pass the operation object to the requestee to mark it complete later ... However it is a well-established convention in any language/environment that has something like operations or promises to expect the code that performs the task to return the operation/promise/wait-handle.

Inline functions can be used instead of instance methods, but being OOP BindKraft provides ways to avoid inline functions - it is recommended to use them, but there is no other reason to do so, except that it helps you to create code that is simpler to understand and less likely to cause human mistakes. The `this` in Javascript is often hard to manage and by using delegates pointing to instance methods this is mitigated.

operation.then(`handler`) is the simplest and somewhat familiar way to handle an operation. The handler is called _when the operation is completed_ and receives as an argument only the operation and can call methods on it in order to determine if it is successful or not and obtain the result or the error. Unlike promises both the success and failure are reported to the same handler. The limitation of this approach is that only one handler is informed for the operation completion.

Operation supports another syntax for handling that enables multiple handlers to be called when the operation completes. E.g:
```Javascript
    someoperation.whencomplete().tell(handler1).tell(handler2) ...
```
Here the `handler` is just like in `then` - a callback (funcltion, Delegate, EventDispatcher or any other callback that BaseObject.isCallback will recognize as such). Internally this just extends the `then` mechanism by attaching a configured appropriately an instance of a `SugaryDispatcher` class (the name hints at the fact that this is mostly a syntax sugar). Having a dispatcher, many handlers can be subscribed for it (done in this case with the `tell` method). Additionally if then was already used it is converted to the `whencomplete` mechanism internally. Yet it is recommended to avoid mixing both and the whencomplete is the recommended way to handle operations. The `then` technique usage should be preferred only in simple scenarios with only two parties involved (like in the first example in this section).

The handlers used with `wehncomplete().tell(handler)` are the same - they receive the operation and inspect it just like when they are specified with `then`.

As you can see in the example the Operation methods one needs the most in a handler are:

* _operation_.isOperationSuccessful() - returns true if the operation has completed successfuly and false otherwise.
* _operation_.getOperationResult() - if the operation is successful returns the result, otherwise it will throw exception. The result is whatever was passed as second argument to _operation_.CompleteOperation(**true**,`the_result`)
* _operation_.getOperationErrorInfo() - if the operation is non-successful will get the error info, otherwise will trow exception. The error info is whatever was passed as second argument to _operation_.CompleteOperation(**false**,`error info`). The error info should be string or at least with a meaningful toString() method implementation.

-> We recommend usage of plain strings for error info. In future BindKRaft will probably introduce dedicated error info interfaces for use not only with operations. Without such an unification and strict typing effort usage of application specific interfaces can complicate the error handling instead of simplifying it (Which will be the probable motivation).

-> As the above list implies the handler should first check if the operation is successful or not and then decide what to do. The practice shows that using two separate handlers for success anf failure (as is the case with Javascript promises) is inconvenient when multiple parties are interested in a single operation and we do not even provide such a version of the syntax.

### Additional features of the Operation class

The constructor has two optional parameters (place null if not used or simply pass none if both are not needed).

```Javascript
// Passing the task like in a Promise
var op = new Operation(taskproc, timeout, taskarg1, taskarg2, ....);
```

The `timeout` schedules an async task delayed the specified milliseconds which will fail the operation if it is not completed before that. Note that the timeout is the minimal time after which this will happen, in real world scenarios it will take more time because the system scheduler will have to deal with other tasks as well and may not have the opportunity to run this one at that time exactly.

When a given operation has to pass through many pieces of code, possibly written by many teams, it is recommended to use a timeout as an ultimate fall-back - something to complete the process even if it is not completed explicitly as it should. Even if this bubbles up to the end-user attention a "please wait" situation that ends up with some unnerving delay is better than one that never ends.

If you want only timeout:
```Javascript
var op = new Operation (null, 10000);
// Creates operation with 10 seconds expiration timeout.
```

The `taskproc` together with any `taskargs` is a callback that may receive parameters - the optional arguments after the timeout. The taskproc receives the operation itself as first argument and the taskargs after that. The taskproc is invoked immediately and must complete the operation one way or another. This option is supported to enable more promise-like usage of operation for those who have the habit.

These features are inherited by the inheriting operation classes like ChunkedOperation, OperationAggregate and so on.

## OperationAggregate class

The aggregate operations deal only with other operations. The `OperationAggegate` class is the base (abstract) class for the aggregates. At the moment of writing there is only one (the most needed) such class - `OperationAll`, capable of completing when all operations from a list of operations completes - continue to OperationAll section for usage details.

## OperationAll class

The basic usage pattern:
```Javascript
var op = new OperationAll( [bool seal],op1...,opN[,timeout]);
// or also
var op = new OperationAggregate<Derived>( [bool seal],op1,[op11,op12,..],...,opN[,timeout]);
```

And more realistic syntax of basic usage in real world:
```Javascript
var op = new OperationAll(true, op1, op2, op3, 10000);
// Will initialize operation that will wait for 3 other operations to complete. It will have a timeout of 10000 milliseconds (10s) and is sealed - further addition of more operations is not allowed
var arrop = [op4,op5,op6];
var op = new OperationAll(true, op1, arrop, op2,op3, 10000);
// Here the case is like before but we wait 6 operations - any arrays containing operations among the constructor arguments are flattened and the individual operations included in the wait list.

// And the above lines are actually equivalent to
var op = new OperationAll(op1, op2, op3, 10000);
// and
var op = new OperationAll(op1, arrop, op2,op3, 10000);
// respectively
// The 1-st boolean parameter if omitted - it is assumed to be true. Its meaning is "seal" - to seal operation and prevent adding new operations to track

```

The `OperationAll` can be completed explicitly with the CompleteOperation method, but this is, obviously, not its purpose. It is needed when certain code starts/schedules multiple tasks as part of its work and their completion is the actual outcome. A simple example scenario almost everybody will understand is sending multiple ajax requests in parallel where only the completion of all of them will finish the work.

The same effect can usually be achieved through more explicit approach, but having a special operation to aggregate the results is surely more convenient.

### OperationAll - dynamically add operations to the aggregate

In real scenarios it may or may not be convenient to pass all the operations you want aggregated to the constructor. So, it may be convenient to have code ordered like this:
```Javascript
var opall  = new OperationAll(false,10000);
var op1 = sometask(...);
opall.attach(op1);
//... do something else
var op2 = someothertask(... args ....);
opall.attach(op2);
// and so on, until
opall.seal();
```

The OperationAll will not complete until it has been sealed. In the above example we create it unsealed (the false in the constructor's first argument). We add operations to be tracked while doing some work and launch additional tasks, then when we have no more to add we seal the `OperationAll` object.

TODO: describe mode and methods for obtaining subsets of the aggregated operations.

## Chunked operations - ChunkedOperation class

In real life the operations are not always something you just start and wait to complete. There are quite a few cases in which the convenient abstraction for an operation is a process that may need to report back multiple resulting "chunks" before it completes. 

The real-life examples that can benefit of such an abstraction will vary from UI constructions (action palettes, dialogs with apply option etc.) to data management/filtering/composition, to communication appliances that need to collect whatever is requested from them in a lenghtly process consisting of multiple requestes for example. In each case it is convenient to stat the operation and hava handler called to process each chunk of data/response as they become available. The normal operation completion will mark the end of the whole process in such a case and will probably not cary useful information or the data included will not relate to the chunks individually, but to the whole operation.

There are different approaches to implement convenient solution for this kind of problems, but the most obvious distinction between the solutions will be how they represent chunks - a) as separate operations - one for each chunk, b) as phases part of the life-cycle of a single operation.