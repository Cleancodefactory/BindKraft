# Operation

The base standard implementation of IOperation and the related interfaces.

The members reference below lists all methods, from all implemented interfaces no matter if they are implemented in the Operation class or in an implementor or parent class.

Interfaces implemented: [IOperation](IOperation.md) | [IOperationReset](IOperationReset.md) | [IOperationHandling](IOperationHandling.md) | [IOperationHandlingCallbacks](IOperationHandlingCallbacks.md)

## Members

**constructor**
Operation();
Operation(null, timeout);
Operation(taskproc, timeout[, taskproc argument list]);

**Static creators**

Operation.From(x)

Operation.Failed(description)

**Handling methods**

Operation.prototype.then(callback)

Operation.prototype.whencomplete(callback)

**public methods**

Operation.prototype.expire(milliseconds)

Operation.prototype.isOperationComplete()

Operation.prototype.isOperationSuccessful()

Operation.prototype.getOperationErrorInfo()

Operation.prototype.getOperationResult()

Operation.prototype.CompleteOperation(success, errorinfo_or_data);

Operation.prototype.OperationReset();

Operation.prototype.OperationClear();

**properties**

Operation.prototype.get_completionroutine()

Operation.prototype.set_completionroutine(v)

**protected methods (for override only)**

Operation.prototype.onBeforeOperationCompleted()

Operation.prototype.onAfterOperationCompleted()

Operation.prototype.onCompleteOperation()



