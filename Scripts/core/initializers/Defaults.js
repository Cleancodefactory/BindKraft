// This is a helper class and does not follow the OOP rules in the framework. The name does not include the suffix "Helper", because it is intended for massive usage and
// the word "Defaults" best describes its function.

/*RAW CLASS*/
function Defaults(name, hardDefault) {
	this.name = name;
	this.hardDefault = hardDefault;
}
Defaults.prototype.read = function(obj) {
	if (typeof this.name != "string") return this.hardDefault;
	var cls = Class.getClassDef(obj);
	if (cls != null && typeof cls.$defaults == "object" && typeof cls.$defaults[this.name] !== "undefined") {
		return cls.$defaults[this.name];
	}
	return this.hardDefault;
}
Defaults.getValue = function(obj, v) {
	if (typeof v == "object" && v instanceof Defaults) {
		return v.read(obj);
	} else {
		return v;
	}
}


function DefaultsMgr(cls) {
	this.cls = cls;
}
DefaultsMgr.prototype.set = function(object_or_name, optvalue) {
	if (this.cls.$defaults == null) this.cls.$defaults = {};
	if (typeof object_or_name == "string") {
		this.cls.$defaults[object_or_name] = optvalue;
	} else if (typeof object_or_name == "object") {
		if (this.cls.$defaults == null) this.cls.$defaults = {};
		for (var k in object_or_name) {
			this.cls.$defaults[k] = object_or_name[k];
		}
	} else {
		throw "DefaultsMgr.set accepts only object or string in its first argument";
	}
	return this;
}
DefaultsMgr.prototype.unset = function(object_or_name) {
	if (this.cls.$defaults == null) return this;
	if (typeof object_or_name == "string") {
		delete this.cls.$defaults[object_or_name];
	} else if (typeof object_or_name == "object") {
		for (var k in object_or_name) {
			delete this.cls.$defaults[k];
		}
	} else {
		throw "DefaultsMgr.unset accepts only object or string in its first argument";
	}
	return this;
}

DefaultsMgr.prototype.get = function(object_or_name) {
	if (this.cls.$defaults == null) return null;
	if (object_or_name == null) {
		return this.cls.$defaults;
	} else if (typeof object_or_name == "string") {
		return this.cls.$defaults[object_or_name];
	} else if (typeof object_or_name == "object") {
		var r = {};
		for (var k in object_or_name) {
			r[k] = this.cls.$defaults[k];
		}
		return r;
	} else {
		throw "DefaultsMgr.get accepts only object, null or string in its first argument";
	}
}