function IFormatterAggregateImpl() {}
IFormatterAggregateImpl.InterfaceImpl(IFormatterAggregate);
IFormatterAggregateImpl.classInitialize = function(cls) {
	cls.prototype.$initialize = function() {
		var sysfmts = Registers.getRegister("systemformatters");
		var f; // a formatter
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (typeof arg == "string") { // System formatter
				f = sysfmts.item(arg);
				if (f != null) {
					this.$formatters.push(f);
				} else {
					throw "Cannot find the system formatter specified " + arg;
				}
			} else if (BaseObject.is(arg,"IFormatter")) { // Custom formatters
				this.$formatters.push(arg);
				this.$arguments.push(null); // Empty arguments by default
			} else {
				throw "Unsupported/incompatible argument";
			}
		}
	}
	cls.prototype.$formatters = new InitializeArray("Array of the aggregated formatters");
	cls.prototype.$arguments = new InitializeArray("Array of arguments for the formatters");
	cls.prototype.Arguments = function() {
		for (var i = 0; i < arguments.length; i++) {
			if (i >= 0 && i < this.$formatters.length) {
				this.$arguments[i] = arguments[i];
			} else {
				throw "Index out of range";
			}
		}
		return this;
	}
	cls.prototype.$Read = function(host, val, bind, params) {
		var v = val;
		var f, a; // formatter and its arguments
		for (var i = 0; i < this.$formatters.length; i++) {
			f = this.$formatters[i];
			a = this.$arguments[i];
			if (f != null) {
				v = f.ToTarget(v, bind, a);
			}
		}
		return v;
	}
	cls.prototype.$Write = function(host, val, bind, params) {
		var v = val;
		var f, a; // formatter and its arguments
		for (var i = this.$formatters.length - 1; i >= 0; i--) {
			f = this.$formatters[i];
			a = this.$arguments[i];
			if (f != null) {
				v = f.FromTarget(v, bind, a);
			}
		}
		return v;
	}
	if (Class.is(cls,"SystemFormatterBase")) {
		cls.prototype.Read = function(val,bind,params) {
			return this.$Read(null,val,bind,params);
		}
		cls.prototype.Write = function(val,bind,params) {
			return this.$Write(null,val,bind,params);
		}
	} else {
		cls.prototype.Read = cls.prototype.$Read;
		cls.prototype.Write = cls.prototype.$Write;
	}
}