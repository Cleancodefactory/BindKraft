# Operation

The base standard implementation of IOperation and the related interfaces.

The members reference below lists all methods, from all implemented interfaces no matter if they are implemented in the Operation class or in an implementor or parent class.

Interfaces implemented: [IOperation](IOperation.md) | [IOperationReset](IOperationReset.md) | [IOperationHandling](IOperationHandling.md) | [IOperationHandlingCallbacks](IOperationHandlingCallbacks.md)

## Members

**constructor**
Operation();
Operation(null, timeout);
Operation(taskproc, timeout[, taskproc argument list]);

**taskproc** - task function to execute. As the operations are designed differently from promises this argument is rarely used and works rather differently from what one would expect based on experience with Promise-s. See more information in the [Remarks](#Remarks) section.

**Static creators**

Operation.From(x)

Operation.Failed(description)

**Handling methods**

Operation.prototype.then(callback)

Operation.prototype.whencomplete(callback)

Operation.prototype.onsuccess(callback)
Operation.prototype.success(callback)

Operation.prototype.onfailure(callback)
Operation.prototype.failure(callback)

Operation.prototype.complete(anotherOperation, result)

Operation.prototype.succeed(anotherOp,result)

Operation.prototype.fail(anotherOp,result)


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

## Callbacks

### Operation callback

function(op) {}

This callback is used by `then` method and `whencomplete().tell` method. The callback receives the Operation instance and is responsible to check its state and extract result or error information by calling its methods.

### Success callback

function(result, operation) {}

This callback is used by methods reporting success only - `onsuccess`, `success` and `whencomplete().success`, `whencomplete().onsuccess`.

The callback receives the operation result (otherwise extractable in other scenarios by calling `operation.getOperationResult()`). It also receives the Operation instance as a second parameter, in case some additional information needs to be extracted from the operation itself.

### Failure callback

function(errinfo, operation) {}

This callback is used by methods reporting failure only - `onfailure`, `failure` and `whencomplete().failure`, `whencomplete().onfailure`.

The callback receives the operation error info (otherwise extractable in other scenarios by calling `operation.getOperationErrorInfo()`). It also receives the Operation instance as a second parameter, in case some additional information needs to be extracted from the operation itself.

## Remarks

The Operation and the classes derived from it (e.g. ChunkedOperation, OperatonAll etc.) are designed as shared synchronization objects used by the respective code segments to signal each other. It is not just expected, but a design goal to involve a single operation into synchronization between multiple parties. A Promise on the other hand is designed fro primary use by two parties - one that executes/performs the task/operation and another that waits for it to complete.

TODO: Write more

