/**
 * @param 0 {boolean} Optional, if boolean specifies seal/left unsealed while creating (default seal)
 * @param # {Operation} Adds operation to the list
 * @param last {number} Optional, if last param is number this is timeout.
 * 
 * Sealed (default usage)
 * op = new OperationAll(op1,op2,op3)
 * op.onsuccess(...).onfailure(...)
 * 
 * Unsealed usage
 * op = new OperationAll(false, op1, op2)
 * op.attach(op3);
 * op.attach(op4);
 * // optionally the mode can be changed
 * op.successAll(); // will succeed if all succeed, otherwise will fail when any operation fails
 * op.seal();
 * op.onsuccess().onfailure()
 */

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