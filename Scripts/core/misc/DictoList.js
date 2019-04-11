/**
	A mashup of dictionary and array. To get everything working correctly you have to use only the methods and not skip them!
	
	TODO: keypattern and typecheck
*/
function DictoList() {
	BaseObject.apply(this,arguments);
	for (var i = 0;i <arguments.length; i++) {
		if (BaseObject.is(arguments[i],"TypeChecker")) {
			this.set_typecheck(arguments[i]);
		}
	}
}
DictoList.Inherit(BaseObject,"DictoList");
DictoList.ImplementProperty("allowkeyless", new InitializeBooleanParameter("Allow items without keys", true));
DictoList.ImplementProperty("keypattern", new InitializeStringParameter("Allow items only with keys matching the pattern", null), null);
DictoList.prototype.set_keypattern = function(v) {
	if (BaseObject.is(v,IValueChecker)) {
		this.$keypattern = v;
	} else if (typeof v == "string" && v.length > 0) {
		this.$keypattern = new PatternChecker(v);
	} else if (typeof v == "string" && v.length == 0) {
		this.$keypattern = null
	} else if (v == null) {
		this.$keypattern = null
	} else {
		throw "Unsupported keypattern value type";
	}
}
DictoList.ImplementProperty("typecheck", new InitializeParameter("Optional value type checker", null), null);
DictoList.prototype.set_typecheck = function(v) {
	if (BaseObject.is(v, "IValueChecker")) {
		this.$typecheck = v;
	} else if (typeof v == "string") {
		if (v.length > 0) {
			this.$typecheck = new TypeChecker(v);
		} else {
			this.$typecheck = null;
		}
	} else if (v == null ) {
		this.$typecheck = null;
	} else {
		throw "Unsupported typecheck value type";
	}
}
DictoList.prototype.items = new InitializeArray("The items");
DictoList.prototype.get_values = function() {
	var r = [];
	for (var i = 0; this.items != null && i < this.items.length; i++) {
		if (this.items[i] != null) {
			r.push(this.items[i].value);
		}
	}
	return r;
}
DictoList.prototype.get_keys = function() {
	var r = [];
	for (var i = 0; this.items != null && i < this.items.length; i++) {
		if (this.items[i] != null && this.items[i].key != null) {
			r.push(this.items[i].key);
		}
	}
	return r;
}
DictoList.prototype.get_keyvalues = function() { // returns the item;
	var r = [];
	for (var i = 0; this.items != null && i < this.items.length; i++) {
		if (this.items[i] != null) {
			r.push(this.items[i]);
		}
	}
	return r;
}
DictoList.prototype.$filterCallback = function(_callback) {
	var callback = _callback;
	if (typeof callback == "string") {
		callback = new PatternChecker(callback, true);
	}
	if (BaseObject.is(callback,"IValueChecker")) {
		if (BaseObject.is(callback,"PatternChecker")) {
			return function(index, item) {
				return callback.checkValue(item.key);
			}
		} else { // By default the value
			return function(index, item) {
				return callback.checkValue(item.value);
			}
		}
	}
	return callback;
}
DictoList.prototype.filterItems = function(_callback /* f(index,item) -> true/false */) {
	var r = [];
	var callback = this.$filterCallback(_callback);
	for (var i = 0; this.items != null && i < this.items.length; i++) {
		if (this.items[i] != null && (callback == null || BaseObject.callCallback(callback,i,this.items[i]))) {
			r.push(this.items[i]);
		}
	}
	return r;
}
DictoList.prototype.filterValues = function(_callback /* f(index, item) */) {
	var callback = this.$filterCallback(_callback);
	var r = [];
	for (var i = 0; this.items != null && i < this.items.length; i++) {
		var item = this.items[i];
		if (item != null && (callback == null || BaseObject.callCallback(callback,i,item))) {
			r.push(item.value);
		}
	}
	return r;
}

DictoList.prototype.$checkKey = function(key) {
	if (!this.get_allowkeyless()) {
		if (key == null || (typeof key == "string" && key.length == 0)) {
			return false;
		}
	}
	if (BaseObject.is(this.get_keypattern(), "IValueChecker")) { // == "string" && typeof key == "string") {
		if (typeof key == "string") {
			if (!this.get_keypattern().checkValue(key)) return false;
		} else {
			return false;
		}
	}
	return true;
}
DictoList.prototype.$checkVal = function(v) {
	if (this.get_typecheck() != null && v != null) {
		if (!this.get_typecheck().checkType(v)) return false;
	}
	return true;
}
// OnXXX overridables
DictoList.prototype.OnItemExcluded = function(/*Array*/item) {}
DictoList.prototype.OnItemIncluded = function(/*Array*/item) {}
DictoList.prototype.get = function(ik) {
	if (typeof ik == "number") {
		return this.at(ik);
	} else if (typeof ik == "string") {
		var idx = this.find(ik);
		return this.at(idx);
	}
	return null;
}
DictoList.prototype.find = function(k) {
	for (var i =0; i < this.items.length; i++) {
		if (this.items[i] != null) {
			if (this.items[i].key == k) return i;
		}
	}
	return -1;
}
DictoList.prototype.at = function(idx) {
	if (typeof idx == "number" && idx >= 0 && idx <= this.items.length) {
		var r = this.items[idx];
		if (r != null) return r.value;
		return null;
	}
	return null;
}
DictoList.prototype.removeAt = function(idx) {
	if (typeof idx == "number" && idx >= 0 && idx <= this.items.length) {
		var itm = this.items.splice(idx, 1);
		this.OnItemExcluded(itm);
		return itm;
	}
	return null;
}
DictoList.prototype.remove = function(ik) {
	if (typeof ik == "number") {
		return this.removeAt(ik);
	} else if (typeof ik == "string") {
		var idx = this.find(ik);
		return this.removeAt(idx);
	}
	return null;
}

DictoList.prototype.set = function(a,b,c) {
	var key = null;
	var idx = null;
	var v = null;
	var itm;
	if (arguments.length > 0) {
		for (var i = 0;i < arguments.length - 1; i++) {
			if (typeof arguments[i] == "number") {
				idx = arguments[i];
			} else if (typeof arguments[i] == "string") {
				key = arguments[i];
			}
		}
		v = arguments[arguments.length - 1];
		if (!this.$checkVal(v)) return;
		var x = null;
		if (!this.$checkKey(key)) throw "key not allowed: " + key;
		if (idx == null) {
			if (key != null) {
				itm = { key: key, value: v};
				x = this.find(key);
				if (x >= 0) {
					v = this.items[x];
					this.items[x] = itm;
					this.OnItemExcluded([v]);
				} else {
					this.items.push(itm);
				}
				this.OnItemIncluded([itm])
			} else {
				itm = { key: key, value: v};
				this.items.push(itm);
				this.OnItemIncluded([itm]);
			}
		} else {
			itm = { key:key, value: v };
			v = this.items[idx];
			this.items[idx] = itm;
			this.OnItemExcluded([v]);
			this.OnItemIncluded([itm]);
		}
	}
}
DictoList.prototype.add = function(a,b) {
	var key = null;
	var v = null;
	var itm;
	if (arguments.length > 1) {
		if (typeof arguments[0] == "string") {
			key = arguments[0] 
		}
		if (!this.$checkKey(key)) return -1;
		v = arguments[arguments.length - 1];
		if (!this.$checkVal(v)) return;
		itm = { key: key, value: v};
		this.items.push(itm);
		this.OnItemIncluded([itm]);
		return this.items.length - 1;
	} else if (arguments.length > 0) {
		if (!this.$checkKey(key)) return -1; // null key
		v = arguments[arguments.length - 1];
		if (!this.$checkVal(v)) return;
		itm = { key: key, value: v};
		this.items.push(itm);
		this.OnItemIncluded([itm]);
		return this.items.length - 1;
	}
	return -1;	
}
DictoList.prototype.count = function() {
	return this.items.length;
}
DictoList.prototype.clear = function(filter) {
	var itm;
	if (BaseObject.isCallback(filter)) {
		for (var i = this.items.length - 1; i >=0; i--) {
			if (this.items[i] != null) {
				if (BaseObject.callCallback(filter, i, this.items[i].key, this.items[i].value)) {
					itm = this.items.splice(i,1);
					this.OnItemExcluded(itm);
				}
			} else {
				if (BaseObject.callCallback(filter, i, null, null)) {
					itm = this.items.splice(i,1);
					this.OnItemExcluded(itm);
				}
			}
		}
	} else {
		var arr = Array.createCopyOf(this.items);
		this.items.splice(0);
		this.OnItemExcluded(arr);
	}
}