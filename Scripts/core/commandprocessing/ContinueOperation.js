/**
	Signals that the caller can continue, but the task issuing the operation is not complete.
	This was introduced with the command executor, to signal that execution can continue nad expect completion later.
	The actual completion most often has to be signaled with another operation, but it is stored elsewhere for later use.
	
	Except introducing a new class Continue Operation does not add anything to the Operation class.
	
	It is recommended to pass the actual task completion operation as result - check if the scenario requires that, yet passing it is never a mistake.
*/
function ContinueOperation() {
	Operation.apply(this, arguments);
}
ContinueOperation.Inherit(Operation, "ContinueOperation");
ContinueOperation.Completed = function(success, data_err) {
	var op = new ContinueOperation();
	op.CompleteOperation(success, data_err);
	return op;
}