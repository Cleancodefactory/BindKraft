/*
	This one is intended for massive usage, additional derivatives with separate methods for success/failure, evnets and others may be added later.
	
	Operation is basically a promise-like construct.
	
	Operation class is for non-foreign operations, ForeignOperation inherits it and is used internally by Proxy/stubs and transports
	
	Usage of then():
		the callback is called with a single parameter - the operation itself, named op below:
		in the callback you usually:
			op.isOperationComplete() - to determine if the operaiton is complete (it should be - usually this is not needed)
			op.isOperationSuccessful() - to determine if the operation was successful
				not successful:
					op.getOperationErrorInfo()
				successful:
					op.getOperationResult()
				// Prepare for reuse - not typical, needs the code perfoming the operation to support it and provide appropriate interface routines
					For instance - routine for starting operation accepting and using optional existing Opration object and producing a new one if non is supplied.
					This is only one example, many approaches are possible, but this is rarely convenient, thus most APIs that use operation - produce a new one each time they are called.
				op.OperationReset() - to reset the operation for reuse with the same callback
				op.Clear() - to reset operation and clear the callback as well
				
	Usage of the callback argument in the constructor:
		The purpose of Operation is to avoid passing callbacks back and forth, but sometimes the interface may have a dual approach - allow clients to use operations directly or just 
		pass callbacks the old way. Ability to easilly pass a callback to a new operation makes it easy to serve both approaches through operation based implementation.

	Usage of whencomplete():
		IF you need to advise multiple handlers then() is notenough because it will work only once - if you
		chain more then() calls, none of them (except the first one) will do anything.
		In this case you need something to spread the call to many handlers and you can use:
		var sd = new SugaryDispatcher()
		op.then(sd)
		sd.tell(handler1).tell(handler2) .... and so on.
		This is not pretty enough syntactically, so there comes the whencomplete method which creates a
		SugaryDispatcher object itselg, passes it as a callback to the operation and returns it. So the syntax
		to advise multiple handlers for the operation completion will be:
		op.whencomplete().tell(handler1).tell(handler2) .... and so on.
		Each handler is like the handler for then - see details about it above.

*/

/*Class*/
/* V: 2.10 - this has been changed and the completion callback previously supported as constructor argument is no longer supported (it can hardly do any good)
	Motives: There is only one scenario in which this can be better than then(completioncallback) - when a code prepares an operation configured with completion handler only to
	pass the so constructed object to a routine/code supposed to use that operation to singnal completion and pass result. This is good, but very limited use and a source of human mistakes in all other cases.
	
	Instead the constructor is redesigned in a different manner and can accept a callback when someone wants to use the Operation in Promise-like manner - not as signaling and synchronization tool shared among
	several parties, but as task one would want to complete and be notified when this happens. In the taskproc(operation, optionalargument1, optionalargumen2,...) you have access to the operation and you MUST complete it one way or another -
	using operation.completeOperation(true/false, result or error info); The task is always started as a scheduled asynchronous task with normal priority and default options.
*/
function Operation(taskproc /*args*/, timeout) {
	BaseObject.apply(this, arguments);
	if (BaseObject.isCallback(taskproc)) {
		
		// V: 2.10 this.set_completionroutine(callback);
		// new usage: V: 2.10
		//
		//
		// TODO: This call seems wrong! This should be a callback behavior
		var taskargs = [this].concat(Array.createCopyOf(arguments,2));
		this.async(function() { BaseObject.applyCallback(taskproc,taskargs); });
	}
	// Corrected bug on 2018-09-12: timeout not honoured when no task procedure is passed to the constructor (which is the main case)
	if (typeof timeout == "number" && timeout > 0) {
		this.expire(timeout);
	}
}
Operation.Inherit(BaseObject, "Operation");
Operation.Implement(IOperationHandlingCallbackImpl);
Operation.prototype.$expiration = function() {
	if (!this.isOperationComplete()) {
		this.CompleteOperation(false,"Operation timed out");
		this.LATERROR("An operation timed out (" + this.$__instanceId + IOperationDescription.Dump(this.getOperationDescription()) + ")", "$expiration");
		jbTrace.log("An operation timed out");
	}
}
/**
 * Can be called multiple times to prolong the life of the operation.
 */
Operation.prototype.expire = function(milliseconds) {
	this.discardAsync("OperationTimeOut"); // Remove any previous timeout tracker.
	this.async(this.$expiration).after(milliseconds).key("OperationTimeOut").apply(this);
}

Operation.prototype.onBeforeOperationCompleted = function() {
	this.discardAsync("OperationTimeOut"); // Unschedule the time out tracker
}
// Operation.CompletedOperation = function (ture/false, result/error-string,object) {}

// Methods for wider usage

/**
 * 	Called when the operation completes (regardless of success). The operation is passed
 * as argument and can be checked for details.
 * 
 *	@param callback callback(op: Operation)
 */
Operation.prototype.then = function(callback) {
	if (BaseObject.isCallback(callback)) {
		var old = this.get_completionroutine();
		if (BaseObject.is(old,"SugaryDispatcher")) {
			old.tell(callback);
		} else if (BaseObject.isCallback(old)) {
			var wrapper = new SugaryDispatcher(this);
			this.set_completionroutine(wrapper);
			if (!this.$handlingdone) {
				wrapper.tell(old);
			}
			wrapper.tell(callback);
			if (this.$handlingdone && this.isOperationComplete()) {
				// Ivoke it forcibly because we missed the completion and wrapper did not exist then
				wrapper.invoke(this);
			}
		} else {
			this.set_completionroutine(callback);
		}
	}
	if (!this.$handlingdone && this.isOperationComplete()) {
		this.$invokeHandling();
	}
	return this;
}.Description("Handles both success and failure through inspectionof the passed operation");

/**
 * Returns a SugaryDispatcher wrapper that supports the same methods. Most of the methods below
 * will use the wrapper internally. Sometimes it may be more convenient to obtain the wrapper.
 */
Operation.prototype.whencomplete = function() {
	if (arguments.length != 0) throw "oncomplete takes 0 arguments and returns SugarryDispatcher that can notify multiple handlers by calling tell(handler) on it";
	var wrapper = this.get_completionroutine();
	if (BaseObject.is(wrapper,"SugaryDispatcher")) {
		// All is fine in this case
	} else {
		wrapper = new SugaryDispatcher(this); // new one
		var oldhandler = this.get_completionroutine();
		this.set_completionroutine(wrapper);
		if (this.$handlingdone && this.isOperationComplete()) {
			// Ivoke it forcibly because we missed the completion and wrapper did not exist then
			wrapper.invoke(this);
		}
		if (BaseObject.isCallback(oldhandler) && !this.$handlingdone) {
			// Attach it to the wrapper
			wrapper.tell(oldhandler);
		}
	}
	if (!this.$handlingdone && this.isOperationComplete()) {
		this.$invokeHandling();
	}
	return wrapper;
}.Description("Creates an event dispatcher tuned to advise newcomers and returns it - multiple handlers can be advised - see");
/**
 * Called id the operation succeeds with its result callback(result)
 */
Operation.prototype.onsuccess = function(callback) {
	return this.whencomplete().onsuccess(callback);
}
/**
 * The same as onsuccess - called id the operation succeeds with its result callback(result) 
 */
Operation.prototype.success = Operation.prototype.onsuccess;
/**
 * Called if the operation fails with its error info callback(error)
 */
Operation.prototype.onfailure = function(callback) {
	return this.whencomplete().onfailure(callback);
}
/**
 * Called if the operation fails with its error info callback(error)
 */
Operation.prototype.failure = Operation.prototype.onfailure;
/**
 * Completes another operation successfully or not (the same as this one)
 * with the specified result (and not with the result of this one).
 * On failure transfers the error info from this operation.
 */
Operation.prototype.complete = function(anotherOp,result) {
	return this.whencomplete().complete(anotherOp, result);
}
/**
 * Completes another operation the same as this one, transfers result or error info
 * as necessary
 */
Operation.prototype.transfer = function(anotherOp) {
	return this.whencomplete().transfer(anotherOp);
}
/**
 * When this operation completes (no matter how), completes successfully another with
 * the specified result.
 */
Operation.prototype.succeed = function(anotherOp,result) {
	return this.whencomplete().succeed(anotherOp, result);
}
/**
 * When this operation completes (no matter how), completes unsuccessfully another with
 * the specified error info.
 */
Operation.prototype.fail = function(anotherOp,errinfo) {
	return this.whencomplete().fail(anotherOp, errinfo);
}

// HELPERS ////////////////////////////////////////////////////
/**
	Packs the argument in an Operation if it isn't an Operation itself. If the argument is an Operation it is directly returned.
	@param x {any} - the argument
*/
Operation.From = function(x) {
	if (BaseObject.is(x, "Operation")) {
		return x;
	} else {
		var op = new Operation();
		op.CompleteOperation(true, x);
		return op;
	}
}
Operation.Failed = function(desc) {
	var op = new Operation();
	op.CompleteOperation(false, desc);
	return op;
}
