function BasicRegister(registername) {
	BaseObject.apply(this,arguments);
	this.$registername = registername;
	if (typeof registername != "string" || !/^[A-Za-z][A-Za-z0-9_\$]*$/.test(registername)) {
		throw "Invalid regiser name " + registername + " when creating register " + this.classType();
	}
	
}
BasicRegister.Inherit(BaseObject, "BasicRegister");
BasicRegister.Implement(IRegister);

BasicRegister.prototype.$collection = new InitializeObject("Stored items");
// The callback returns what needs to be set back and returned from this time on.
// actualitem callback(key, item);
// BasicRegister.prototype.$onfirstrequest = new InitializeObject("callback for an item at a key to be called when first requested");

// Overridables
BasicRegister.prototype.$allowOverrWrite = true;
BasicRegister.prototype.$checkKey = function(key) { 
	if (typeof key != "string" || key.length == 0) {
		this.LASTERROR(_Errors.compose(), "Items cannog have empty keys.");
		return false;
	}
	return true; 
}
BasicRegister.prototype.$checkItem = function(item) { return true; }
BasicRegister.prototype.$getItemAspect = function(item, aspect) {
	return item;
}.Description("Called by the item method to obtain the aspect if it is not null. Null aspect is considered item 'as is'");

// IRegister
BasicRegister.prototype.$registername = null;
BasicRegister.prototype.get_registername = function() { 
	return this.$registername;
}
BasicRegister.prototype.register = function(key, item) { 
	if (!this.$checkItem(item) || !this.$checkKey(key)) return false;
	if (this.$collection[key]  != null && !this.$allowOverrWrite) {
		this.LASTERROR(_Errors.compose(), "There is an item already registered with the same key " + key);
		return false;
	}
	this.$collection[key] = item;
};
BasicRegister.prototype.unregister = function(key, /*optional*/ item) { 
	if (this.$checkKey(key)) {
		if (this.$collection[key] != null) {
			var itm = this.$collection[key];
			this.$collection[key] = null;
			delete this.$collection[key];
			return itm;
		}
	}
	return null;
};
BasicRegister.prototype.item = function(key, /*optional*/ aspect) { 
	if (this.$checkKey(key)) {
		if (BaseObject.is(this.$collection[key],"Initialize")) {
			this.$collection[key] = this.$collection[key].produceDefaultValue(null, key);
		}
		if (aspect != null) {
			return this.$getItemAspect(this.$collection[key], aspect);
		} else {
			return this.$collection[key];
		}
	}
	return null;
};
BasicRegister.prototype.exists = function(key) { 
	if (this.$checkKey(key)) {
		return (this.$collection[key] != null);
	}
	return false;
};