function SequentialOperation(callback) {
	// ??
	Operation.apply(this, arguments);
	if (BaseObject.isCallback(callback)) {
		this.set_completionroutine(callback);
	}
}
SequentialOperation.Inherit(Operation, "SequentialOperation");
SequentialOperation.Implement(ISequentialOperation);
SequentialOperation.prototype.$nextoperation = null;
SequentialOperation.prototype.get_nextoperation = function() {
	return this.$nextoperation;
}
SequentialOperation.prototype.OperationClear = function() {
	this.$nextoperation = null;
	Operation.prototype.OperationClear.apply(this,arguments);
}
SequentialOperation.prototype.CompleteOperation = function(success, errorinfo_or_data, nextoperation) {
	this.$nextoperation = nextoperation;
	Operation.prototype.CompleteOperation.apply(this,arguments);
}
SequentialOperation.prototype.next = function(handler, /*optional*/ done) {
	if (BaseObject.isCallback(handler)) {
		this.set_completionroutine(function (op) {
			BaseObject.callCallback(handler,op);
			var no = op.get_nextoperation();
			if (no != null) {
				no.next(handler, done);
			} else {
				BaseObject.callCallback(done,op);
			}
		});
		if (!this.$handlingdone && this.isOperationComplete()) {
			this.$invokeHandling();
		}
	} else {
		throw "the handler argument is required - it must be a callback handler for the operation completion";
	}
	return this;
}
SequentialOperation.prototype.then = SequentialOperation.prototype.next;