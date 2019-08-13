

function OperationAll() {
	OperationAggregate.apply(this,arguments);
}
OperationAll.Inherit(OperationAggregate, "OperationAll");
OperationAll.prototype.mode = null;
OperationAll.prototype.successAll = function() {
	this.mode = "allsuccess";
	return this;
}
OperationAll.prototype.successAny = function() {
	this.mode = "anysuccess";
	return this;
}
OperationAll.prototype.finishedAll = function() {
	this.mode = "default";
	return this;
}
OperationAll.prototype.$operationFinished = function() {
	var res = { successful: 0, failed: 0, all:this.$operations.length, complete: 0, incomplete: 0}
	for (var i = 0; i < this.$operations.length; i++) {
		var op = this.$operations[i];
		if (op.isOperationComplete()) {
			res.complete++;
			if (op.isOperationSuccessful()) {
				res.successful++;
			} else {
				res.failed++;
			}
		} else {
			res.incomplete++;
		}
	}
	if (res.complete == res.all) {
		if (this.isOperationComplete()) return; // It is already complete
		switch (this.mode) {
			case "allsuccess":
				if (res.successful == res.all) {
					this.CompleteOperation(true,res);
				} else {
					this.CompleteOperation(false,res);
				}
			break;
			case "anysuccess":
				if (res.successful > 0) {
					this.CompleteOperation(true,res);
				} else {
					this.CompleteOperation(false,res);
				}
			break;
			default:
				this.CompleteOperation(true,res);
		}
		
	}
}







// Old code for dumping?
// function OperationAll() {
	// for (var i = 0;i < arguments.length; i++) {
		// var op = arguments[i];
		// if (BaseObject.is(op,"Operation")) {
			// this.$operations.push(op);
		// }
	// }
	
// }
// OperationAll.Inherit(Operation,"OperationAll");
// OperationAll.prototype.$operations = new InitializeArray("All operations");
// OperationAll.prototype.$processOp = function(op) {
// }