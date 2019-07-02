function ClassDataMgr(cls,dataType) {
	this.cls = cls;
	this.dataType = dataType;
	if (this.cls.$classdata == null) this.cls.$classdata = {};
}
ClassDataMgr.prototype.set = function(object_or_name, optvalue) {
	if (this.cls.$classdata[this.dataType] == null) {
		this.cls.$classdata[dataType] == {};
	}
	if (typeof object_or_name == "string") {
		this.cls.$classdata[dataType][object_or_name] = optvalue;
	} else if (typeof object_or_name == "object") {
		this.cls.$classdata[dataType] = BaseObject.CombineObjects(this.cls.$classdata[dataType],object_or_name);
	} else {
		throw "ClassDataMgr.set accepts only object or string in its first argument";
	}
	return this;
}
ClassDataMgr.prototype.unset = function(object_or_name) {
	if (this.cls.$classdata[dataType] == null) return this;
	if (typeof object_or_name == "string") {
		delete this.cls.$classdata[dataType][object_or_name];
	} else if (typeof object_or_name == "object") {
		for (var k in object_or_name) {
			if (object_or_name.hasOwnProperty(k)) {
				delete this.cls.$classdata[dataType][k];
			}
		}
	} else {
		throw "ClassDataMgr.unset accepts only object or string in its first argument";
	}
	return this;
}
ClassDataMgr.prototype.get = function(object_or_name) {
	if (this.cls.$classdata[dataType] == null) return null;
	if (object_or_name == null) {
		return this.cls.$classdata[dataType];
	} else if (typeof object_or_name == "string") {
		return this.cls.$classdata[dataType][object_or_name];
	} else if (typeof object_or_name == "object") {
		var r = {};
		for (var k in object_or_name) {
			if (object_or_name.hasOwnProperty(k)) {
				r[k] = this.cls.$classdata[dataType][k];
			}
		}
		return r;
	} else {
		throw "DefaultsMgr.get accepts only object, null or string in its first argument";
	}
}