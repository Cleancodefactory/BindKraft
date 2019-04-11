


/*CLASS*/
// TODO: Finish this class
function ScheduledOperation(arg1, arg2, arg3) {
	BaseObject.apply(this, arguments);
	this.delegates = [];
	this.$ticker = Ticker.Default; // Use the default ticker if nothing else is said.
	for (var i = 0; i < arguments.length; i++) {
		if (BaseObject.is(arguments[i], "Ticker")) {
			this.$ticker = arguments[i];
		} else if (BaseObject.is(arguments[i], "IInvoke")) {
			this.delegates.push({ name: null, func: arguments[i] });
		} else if (i == arguments.length - 1 && typeof arguments[i] == "number") {
			this.timeout = arguments[i];
		}
	}
}
ScheduledOperation.Inherit(BaseObject, "ScheduledOperation");
ScheduledOperation.prototype.$ticker = null;
ScheduledOperation.prototype.timeout = 500;
ScheduledOperation.prototype.delegates = null;
ScheduledOperation.prototype.scheduledOperation = null;
ScheduledOperation.prototype.register = function(arg1, arg2, arg3) {
	var o = {};
	for (var i = 0; i < arguments.length; i++) {
		o = {};
		if (BaseObject.is(arguments[i], "IInvoke")) {
			o.func = arguments[i];
		} else if (BaseObject.is(arguments[i], "string")) {
			o.name = arguments[i];
		} else {
			throw "Unsupported arguments";
		}
		if (o.func) this.delegates.push(o);
	}
}.Description("Registers a command/operation as delegate with optional name.");

ScheduledOperation.prototype.tick = function(ticker) {
	if (this.scheduledOperation != null) {
		
	}
	this.scheduledOperation == null;
	
}