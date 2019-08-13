/**
	Intended as a base class branching from operation to a set of classes implementing operations that work on other operations.
	
	These operations accept a number of operations as constructor parameters and a timeout as last parameter (if it is a number)
	Aggregate operations seal themselves once constructed unless otherwise specified (see below), but can be unsealed for adding 
	more elements (not recommended). 
	
	If you have a reason to fill the operation not (only) in the constructor, it is recommended to keep operation unsealed until full (pass false as first argument to the constructor, 
	fill it calling attach as many times as needed and seal it after that. Mixing both the constructor and attach can easilly lead to mistakes and should be avoided.
	
	Construction
	
	new OperationAggregate<Derived>( [bool seal],op1...,opN[,timeout]);
	or also
	new OperationAggregate<Derived>( [bool seal],op1,[op11,op12,..],...,opN[,timeout]);
	
	Arguments:
		seal - optional, boolean instructs the operation to seal or not seal itself while created.
		opX  - Operation or array of Operation instances. Each operation is attached, but aggregate would not complete until sealed.
		timeout - optional, integer, timeout in milliseconds
		
	Overriding
	
		Most of the functionality is here only the completion logic is left for the inheriting classes. 
		Implement the method $operationFinished which is called each time operation finishes or when the aggregate is sealed.
		The implementation has to check all the operations and determine what this means (this is what distingueshes the different aggregate operations from each other).
*/
function OperationAggregate(/* operations list */ /* if a number the last argument is a timeout*/) {
	var timeout = null;
	var doseal = true;
	
	for (var i = 0; i < arguments.length;i++) {
		// TODO: Probably we can recognize operations more liberaly - by interface (future refactoring may be necessary).
		if (BaseObject.is(arguments[i],"Operation")) {
			this.attach(arguments[i]);
		} else if (BaseObject.is(arguments[i],"Array")) { // Accept arrays of operations
			var arr = arguments[i];
			for (var j = 0; j < arr.length; j++) {
				if (BaseObject.is(arr[j], "Operation")) {
					this.attach(arr[j]);
				}
			}
		} else if (i == 0 && typeof arguments[0] == "boolean") {
			doseal = arguments[0];
		} else if (i == arguments.length - 1 && typeof arguments[i] == "number") {
			timeout = arguments[i];
		}
	}
	Operation.call(this,null,timeout);
	if (doseal) {
		this.set_sealed(true);
	}
}
OperationAggregate.Inherit(Operation, "OperationAggregate");
OperationAggregate.ImplementProperty("sealed", new InitializeBooleanParameter("",false), null, "onForceCheck");
OperationAggregate.prototype.$operations = new InitializeArray("Filled with the aggregated operaions");
// Overrides
OperationAggregate.prototype.OperationReset = function() {
	Operation.prototype.OperationReset.apply(this,arguments);
	this.$sealed = false;
	return this;
}
OperationAggregate.prototype.OperationClear = function() {
	Operation.prototype.OperationClear.apply(this,arguments);
	this.$sealed = false;
	this.$operations = [];
	return this;
}

// Alternative to get/set_seal - more convenient sometimes
OperationAggregate.prototype.seal = function() {
	this.set_sealed(true);
	return this;
}
OperationAggregate.prototype.unseal = function() {
	this.set_sealed(false);
	return this;
}
// Members for getting subsets of the operations
OperationAggregate.prototype.get_operation = function(idx) {
	if (idx >= 0 && idx < this.$operaions.length) {
		return this.$operaions[idx];
	}
	return null;
}
OperationAggregate.prototype.get_alloperations = function() {
	if (BaseObject.is(this.$operations,"Array")) {
		return Array.createCopyOf(this.$operaions);
	}
	return [];
}
OperationAggregate.prototype.getFiltered = function(callback) {
	if (BaseObject.is(this.$operations,"Array")) {
		if (BaseObject.isCallback(callback)) {
			return this.$operations.Select(function(idx, op) {
				if (BaseObject.callCallback(callback,idx,op)) {
					return op;
				}
				return null;
			});
		}
	}
	return [];
}
OperationAggregate.prototype.get_completed = function() {
	return this.getFiltered(function(idx,item) {
		return item.isOperationComplete();
	});		
}
OperationAggregate.prototype.get_incomplete = function() {
	return this.getFiltered(function(idx,item) {
		return !item.isOperationComplete();
	});		
}
OperationAggregate.prototype.get_successful = function() {
	return this.getFiltered(function(idx,item) {
		return (item.isOperationComplete() && item.isOperationSuccessful());
	});		
}
OperationAggregate.prototype.get_failed = function() {
	return this.getFiltered(function(idx,item) {
		return (item.isOperationComplete() && !item.isOperationSuccessful());
	});		
}
// Attach, check ...
OperationAggregate.prototype.attach = function(op) {
	if (!BaseObject.is(op,"Operation") || this.get_sealed()) return false;	
	if (!op.isOperationComplete()) {
		this.$operations.addElement(op);
		op.whencomplete().tell(new Delegate(this, this.onForceCheck));
	} else {
		this.$operations.addElement(op);
		// We can come here only if not sealed
		// Calling this may complete the operation prematurely
		// Do not call this.$operationFinished(op);
	}
	return true;
}
OperationAggregate.prototype.onForceCheck = function() {
	if (this.get_sealed()) {
		this.callAsync(this.$operationFinished);
	}
}
OperationAggregate.prototype.$operationFinished = function() {
	throw "not implemented - override $operationFinished and check the state of all the operations to determine what happens!";
}
