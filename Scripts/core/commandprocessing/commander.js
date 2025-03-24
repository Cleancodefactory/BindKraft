/**
	A general purpose command runner
*/
function Commander(cmdline,ctxoptional) {
	BaseObject.apply(this, arguments);
	this.$printoutDelegate = new Delegate(this,this.$opprintout);
	this.load(cmdline,ctxoptional);
}

Commander.Inherit(BaseObject, "Commander");
Commander.prototype.load = function(cmdline, ctxoptional) {
	this.clear();
	this.$executer = new CommandExecutor(ctxoptional || "global",cmdline);
	this.$stepdoneDelegate = new Delegate(this, this.$stepdone);
}
Commander.prototype.$printoutDelegate = null;
Commander.prototype.$opprintout = function(op) {
	if (op.isOperationSuccessful()) {
		var v = op.getOperationResult();
		if (v != null) {
			this.printout("" + v);
		} else {
			this.printout("null");
		}
	} else {
		var v = op.getOperationErrorInfo();
		if (v != null) {
			this.printout("ERROR: " + v);
		} else {
			this.printout("ERROR: null");
		}
	}
}
Commander.prototype.printout = function(s) {
	this.$outputtext = s;
	this.outputevent.invoke(this, s);
}
Commander.prototype.readOutputText = function() {
	var s = this.$outputtext;
	return s;
}
Commander.prototype.$outputtext = null;
Commander.prototype.outputevent = new InitializeEvent("Fired when output text is available");
Commander.prototype.$executer = null;
Commander.prototype.isrunning = function() {
	if (BaseObject.is(this.$runOp,"Operation") && !this.$runOp.isOperationComplete()) return true;
	return false;
}
Commander.prototype.iscancelled = function() {
	if (this.isrunning() && this.$cancelled) return true;
	return false;
}
Commander.prototype.clear = function() {
	this.$runOp = null;
	this.$cancelled = false;
}
Commander.prototype.cancel = function() {
	
}
Commander.prototype.run = function(timeout) {
	if (this.$runOp != null) return null;
	//Commander.prototype
	this.$runOp = new Operation(null, timeout);
	// this.$stepdone(this.$runOp);
	this.callAsync(function() {
		var newop = this.$executer.step();
		newop.whencomplete().tell(this.$stepdoneDelegate);
	});
	return this.$runOp;
}
Commander.prototype.$runOp = null;
Commander.prototype.$cancelled = false;
Commander.prototype.$stepdoneDelegate = null;
Commander.prototype.$stepdone = function(op) {
	if (BaseObject.is(op, "Operation")) {
		if (op.is("FinishOperation")) {
			if (BaseObject.is(this.$runOp,"Operation")) {
				this.$runOp.CompleteOperation(true,null);
				return;
			}
		} else {
			op.whencomplete().tell(this.$printoutDelegate);
		}
	}
	// This command line runner is not very intelligent so we allways leave asyncs in order to avoid overflowing the stack
	this.callAsync(function() {
		var newop = this.$executer.step();
		newop.whencomplete().tell(this.$stepdoneDelegate);
	});
}

// ======================
// Static members
Commander.defaultTimeout = 10000;

// Runs a command line globally
Commander.RunGlobal = function(cmdline) {
	var commander = new Commander(cmdline);
	var op = commander.run(Commander.defaultTimeout);
	op.whencomplete().tell(function(op) {
		if (op.isOperationSuccessful()) {
			console.log("success");
		} else {
			console.log("failure");
		}
	});
	return op;
}
Commander.RunInContext = function(cmdline, ctx) {
	var commander = new Commander(cmdline, ctx);
	var op = commander.run(Commander.defaultTimeout);
	op.whencomplete().tell(function(op) {
		if (op.isOperationSuccessful()) {
			//console.log("success");
		} else {
			//console.log("failure");
		}
	});
	return op;
}