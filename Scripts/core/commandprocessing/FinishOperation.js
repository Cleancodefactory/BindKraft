/**
	Similarly to ContinueOperation this does not extend Operation, but signals specific usage:
	
	This operation is returned by task that consists (in some way - doesn't matter how) of multiple other tasks (process - can be only logically according to the abstraction used with the particular API).
	It must resolve when everything is finsihed.
	This may look unneeded, but it is useful when the caller keeps track of the subtasks as well and has to be informed when there is nothing else to do anymore, but wait them to
	finish. What finishing the tasks actually does not concern the operation - the task that controls them decides this and completes the FinishedOperation.
	
	
*/
function FinishOperation() {
	Operation.apply(this, arguments);
}
FinishOperation.Inherit(Operation, "FinishOperation");