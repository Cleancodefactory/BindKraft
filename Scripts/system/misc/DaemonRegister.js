/*
	This register holds the system registered daemons (services). They can be autostart or manually requestable.
	
	Although daemons can be started without registration, they have to be launched explicitly by some app and we also consider forbidding
		the execution of unregistered daemons.

*/
function DaemonRegister() {
	BaseObject.apply(this,arguments);
}
DaemonRegister.Inherit(BaseObject, "DaemonRegister");
DaemonRegister.Implement(IRegister);
DaemonRegister.Implement(IDaemonRegister);

DaemonRegister.prototype.$daemonClasses = new InitializeObject("The registered classes - full names (if BK version with namespacing is used)");
DaemonRegister.prototype.$aliases = new InitializeObject("alias to class mapping");

DaemonRegister.prototype.get_registername = function() { 
	return "daemonRegister";
}
DaemonRegister.prototype.$reParseKey = /^(?:([a-zA-Z0-9_]+)\/)?([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)$/i;
DaemonRegister.prototype.$splitKey = function(key) {
	var r = {alias: null, className: null, isvalid: function() { return (typeof this.className == "string" && this.className.length > 0);} };
	if (typeof key == "string") {
		var arr = this.$reParseKey.exec(key);
		if (arr != null) {
			if (arr[1] != null && arr[1].length > 0) {
				r.alias = arr[1];
			}
			if (arr[2] != null && arr[2].length > 0) {
				r.className = arr[2];
			}
		}
	}
	return r;
}

DaemonRegister.prototype.register = function(key, item) { 
	if (!BaseObject.is(item, "DaemonRegisterItem")) throw "The item must be DaemonRegisterItem";
	var k = this.$splitKey(key);
	if (k.isvalid()) {
		if (this.$daemonClasses[k.className] != null) {
			throw "Daemon class " + k.className + " is already registered";
		} else {
			this.$daemonClasses[k.className] = item;
		}
		if (typeof k.alias == "string" && k.alias.length > 0) {
			if (this.$aliases[k.alias] != null) {
				throw "Alias " + k.alias + " is already registered and points to class " + this.$aliases[k.alias];
			} else {
				this.$aliases[k.alias] = k.className;
			}
		}
	} else {
		throw "The key [" + (key || "NULL") + "] is not valid daemon registration key in " + this.fullClassType() + ".regiser";
	}
};
DaemonRegister.prototype.unregister = function(key, /*optional*/ item) { 
	var k = this.$splitKey(key);
	if (k.isvalid()) {
		if (this.$daemonClasses[k.className] != null) {
			delete this.$daemonClasses[k.className];
			for (alias in this.$aliases) {
				if (this.$aliases[alias] == k.className) {
					delete this.$aliases[alias];
				}
			}
		} else {
			throw "Daemon class " + k.className + " is not registered";
		}
	} else {
		throw "The key [" + (key || "NULL") + "] is not valid daemon registration key in " + this.fullClassType() + ".regiser";
	}
}.Description("Removes a daemon registration from the register. Running instance(s) are not affected - they can be still managed through the daemon manager")
	.Param("key","The className part is enough, the alias is currently ignored, but the allias of the class is unregistered automatically");
DaemonRegister.prototype.item = function(key, /*optional*/ aspect) { 
	if (aspect == "alias") {
		// The key is treated as an alias name only
		var alias = key;
		if (alias in this.$aliases) {
			var cls = this.$aliases[alias];
			if (cls != null && cls.length > 0 && BaseObject.is(this.$daemonClasses[cls], "DaemonRegisterItem")) {
				return this.$daemonClasses[cls];
			}
		} else {
			return null; // not found
		}
	} else { // if (aspect == "class" or omitted) {
		// The key is parsed normaly and the className part is used only
		var k = this.$splitKey(key);
		if (k.isvalid()) {
			if (BaseObject.is(this.$daemonClasses[k.className], "DaemonRegisterItem")) {
				return this.$daemonClasses[k.className];
			} else {
				throw "No class or class which is not DaemonRegisterItem is registered.";
			}
		} else {
			throw "Key is invalid: " + key;
		}
		return null;
	}
};
DaemonRegister.prototype.exists = function(key, /*optional*/ aspect) { 
	var i = this.item(key,aspect);
	return (i != null);
};