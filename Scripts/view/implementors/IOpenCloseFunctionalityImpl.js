
function IOpenCloseFunctionalityImpl() {}
IOpenCloseFunctionalityImpl.InterfaceImpl(IOpenCloseFunctionality);
IOpenCloseFunctionalityImpl.RequiredTypes("Base");
IOpenCloseFunctionalityImpl.classInitialize = function(cls, _delay, goActive, goInactive) {
	
	var delay = _delay || 100;
	
	if (goActive == null || goInactive == null) throw "IOpenCloseFunctionalityImpl requires _delay: integer,goActive: method, goInactive:method parameters in the Implement statement.";
	
	function _callOnMe(obj, func) {
		var _f = func;
		if (typeof _f == "string") {
			_f = obj[_f];
		} else if (typeof _f == "function") {
			// Ok as is
		} else {
			// TODO: should we throw an exception instead?
			return;
		}
		return _f.apply(obj, Array.createCopyOf(arguments,2));
	}
		
	cls.prototype.$pendingOpenCloseOperationHandler = function () {
		var op = this.$pendingOperation;
		this.$pendingOperation = null;
		if (op != null) {
			switch (op) {
				case "open":
					_callOnMe(this,goActive);
					this.openevent.invoke(this,null);
					break;
				case "close":
				case "forceclose":
					_callOnMe(this,goInactive);
					this.closeevent.invoke(this,null);
					break;
			}
		}
	};
	cls.prototype.$pendingOperationHandlerTrigger = new InitializeMethodTrigger("Command queue handler","$pendingOpenCloseOperationHandler", delay);
	cls.prototype.$schedulePending = function (op, force) {
		if (op != null) {
			if (op == "open" && this.$pendingOperation != "forceclose") {
				this.$pendingOperation = "open";
			} else if (op == "close" && this.$pendingOperation != "open") {
				this.$pendingOperation = op;
			} else if (op == "close" && force) {
				this.$pendingOperation = "forceclose";
			}
		}
		this.$pendingOperationHandlerTrigger.windup();
	};
	
};

