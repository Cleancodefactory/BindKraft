//// TODO: Finish or kill me later

//function ISequentialOperationImpl() {}
//ISequentialOperationImpl.InterfaceImpl(ISequentialOperation);
//ISequentialOperationImpl.RequiredTypes("IOperationHandling,IOperationHandlingCallbacks");
//cls.prototype.CompleteOperation = function(success, errorinfo_or_data) {


/////////
///*
//This implementer will also implement IOperation and IOperationHandling - if they are already implemented it will throw exception unless called
//as .Implement("force");

//	Why should we have implementer and not just implementation?
	
//	We have a separate class used everywhere, but sometimes it is convenient to make an operation certain class that does single specific work (usually asynchronously)
//	No it is not an everyday thing, only sometimes this is convenient - fo not overuse it, identify the functionality of your class and the pattern of its usage - if
	
//*/
//function IOperationHandlingCallbackImpl() {}
//IOperationHandlingCallbackImpl.InterfaceImpl(IOperationHandling);
//IOperationHandlingCallbackImpl.classInitialize = function(cls, force) {
//	if (force != "force") {
//		if (Class.is(cls,"IOperation") || Class.is(cls,"IOperationHandling") || Class.is(cls,"IOperationReset")) {
//			throw "IOperation or/and IOperationHandling are already implemented and this implementer would replace their implementation if it continues, use force if this is intended";
//		}
//	}
	
//	cls.Implement(IOperation);
//	cls.Implement(IOperationReset);
//	cls.Implement(IOperationHandling);
//	cls.Implement(IOperationHandlingCallbacks);
	
//	cls.prototype.$operationCompleted = false; // not completed initial state
//	cls.prototype.$operationSuccess = false;
//	cls.prototype.$operationErrorInfo = null;
//	cls.prototype.$operationResult = null;
	
//    cls.prototype.isOperationComplete = function () { return this.$operationCompleted; };
//    cls.prototype.isOperationSuccessful = function () {
//        if (!this.$operationCompleted) return null;
//        return (this.$operationSuccess == true);
//    };
//    cls.prototype.getOperationErrorInfo = function () {
//        if (this.$operationCompleted) {
//            if (!this.$operationSuccess) {
//                return this.$operationErrorInfo;
//            } else {
//                throw "The operation is successful, errorInfo cannot be requested in that state";
//            }
//        } else {
//            throw "The operation is not completed."
//        }
//    }; // Return info (could be null) on failure, otherwise throw error
//    cls.prototype.getOperationResult = function () {
//        if (this.$operationCompleted) {
//            if (this.$operationSuccess) {
//                return this.$operationResult;
//            } else {
//                throw "The operation has failed, result cannot be requested in that state";
//            }
//        } else {
//            throw "The operation is not completed."
//        }
//    };
//	// Must invoke handler synchronously
//    cls.prototype.CompleteOperation = function (success, errorinfo_or_data) {
//        if (this.isOperationComplete()) {
//            throw "The operation is already comlete";
//        }
//        this.$operationCompleted = true;
//        if (success) {
//            this.$operationSuccess = true;
//            this.$operationResult = errorinfo_or_data;
//        } else {
//            this.$operationSuccess = false;
//            this.$operationErrorInfo = errorinfo_or_data;
//        }
//        this.onCompleteOperation();
//    };
//	// IOperationReset
//	/* Actual operation cancellation may or may not be possible. To be able to cancell the operation itself this implementation will require
//		special abilities and they can be made available in some specialimplementation.
//	*/
//    cls.prototype.OperationReset = function () {
//        this.CompleteOperation(false, { description: "Operation forcibly reset" });

//        this.$operationCompleted = false;
//        this.$operationErrorInfo = null;
//        this.$operationResult = null;
//        this.$operationSuccess = false;
//        this.$handlingdone = false;
//        return this;
//    };
//    cls.prototype.OperationClear = function () {
//        this.OperationReset();
//        this.$completionroutine = null;
//        return this;
//    };
//	// IOperationHandling
	
//	cls.prototype.$handlingdone = false; // consult this if needed in implementations (it is set to true and reset, but never respected here).
//    cls.prototype.$invokeHandling = function () {
//        var cr = this.get_completionroutine();
//        if (cr != null) {
//            var r = BaseObject.callCallback(cr, this);
//            this.$handlingdone = true;
//            return r;
//        }
//    };
//    cls.prototype.onCompleteOperation = function () {
//        this.$invokeHandling();
//    };
	
//	// IOperationHandlingCallbacks.js
//	cls.prototype.$completionroutine = null;
//    cls.prototype.get_completionroutine = function () {
//        return this.$completionroutine;
//    };
//    cls.prototype.set_completionroutine = function (v) {
//        if (BaseObject.isCallback(v)) {
//            this.$completionroutine = v;
//        } else if (v == null) {
//            this.$completionroutine = null;
//        } else {
//            throw "Completion routine must be a valid callback (function, delegate, etc.) or null";
//        }
//    };
//}
