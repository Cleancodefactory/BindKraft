/**
	Packs a set of properties which can be changed individually, read/written as JS object.
	The property set is plain, without nesting support - nothing but simple values or arrays of simple values are allowed. These files usually describe something using well-known property names.
	
	By default this runs in "silent" mode and setter methods return true/false to indicate success. If you set_silent(true) exceptions will be thrown instead (good for dev time mostly).
	
	v2.16 -> Future advancements will affect this class as well as other memory file classes - support for persistence and content load/store will be added.
*/
function PropertySetMemoryFile(objinit) {
	BaseObject.apply(this,arguments);
}
PropertySetMemoryFile.Inherit(BaseObject, "PropertySetMemoryFile");
PropertySetMemoryFile.Implement(IMemoryFileImpl);
PropertySetMemoryFile.Implement(IUsingValueCheckersImpl);
PropertySetMemoryFile.prototype.$props = new InitializeObject("The property store");
PropertySetMemoryFile.ImplementProperty("keycheck", new Initialize("Property name check can be assigned, by default IdentNames is assigned", PatternChecker.IdentName));
PropertySetMemoryFile.ImplementProperty("valuecheck", new Initialize("Value checker can be assigned here, by default ValueType is assigned", TypeChecker.ValueType));
PropertySetMemoryFile.ImplementProperty("silent", new InitializeBooleanParameter("Value checker can be assigned here, by default ValueType is assigned", true));

PropertySetMemoryFile.prototype.setProp = function(name, v) {
	if (this.get_silent()) {
		if (!this.checkValueWith(this.get_keycheck(), name)) return false;
		if (!this.$checkPropInternal(v)) return false;
	} else {
		if (!this.checkValueWith(this.get_keycheck(), name)) throw "Incorrect property name";
		if (!this.$checkPropInternal(v)) throw "Value not allowed (either the value or the list of values contains a value of non-allowed type)";
	}
	if (this.$props == null) this.$props = {};
	this.$props[name] = v;
	return true;
}
PropertySetMemoryFile.prototype.$checkPropInternal = function(name, v) {
	if (BaseObject.is(v,"Array")) {
		if (!v.All(this.thisCall(function(idx, val) {
			if (!this.checkValueWith(this.get_valuecheck(), val)) return false;
			return true;
		}))) {
			return false;
		}
	} else {
		if (!this.checkValueWith(this.get_valuecheck(), v)) return false;
	}
	return true;
}
PropertySetMemoryFile.prototype.removeProp = function(name) {
	if (this.$props != null) {
		if (!this.$props.hasOwnProperty(name)) return null;
		this.$props[name] = null;
		delete this.$props[name];
	}
}
PropertySetMemoryFile.prototype.getProp = function(name) {
	if (this.$props != null) {
		if (!this.$props.hasOwnProperty(name)) return null;
		return this.$props[name];
	}
	return null;
}
PropertySetMemoryFile.prototype.setProps = function(objinit) {
	if (objinit != null && TypeChecker.Object.checkType(objinit)) {
		var r = true;
		for (var k in objinit) {
			if (!this.setProp(k,objinit[k])) {
				r = false;
			}
		}
		return r;
	}
	return true; // doing nothing because we have nothing to do is a success (kind of)
}
PropertySetMemoryFile.prototype.getProps = function() {
	var r = {};
	if (this.$props != null) {
		for (var k in this.$props) {
			if (!this.$props.hasOwnProperty(k)) continue;
			if (BaseObject.is(this.$props[k], "Array")) {
				r[k] = Array.createCopyOf(this.$props[k]);
			} else {
				r[k] = this.$props[k];
			}
		}
	}
	return r;
}.Description("Extracts all the properties into a plain object.")
	.Returns("An object with all the properties, arrays are shallowly clonned.");
PropertySetMemoryFile.prototype.getPropNames = function() {
	var r = [];
	if (this.$props != null) {
		for (var k in this.$props) {
			if (!this.$props.hasOwnProperty(k)) continue;
			r.push(k);
		}
	}
	return r;
}

// Static helpers for easy collection of property settings from files
PropertySetMemoryFile.ReadPropertiesInto = function(_inobject,file,keycheck,valcheck) {
	if (!BaseObject.is(file,"PropertySetMemoryFile")) return false;
	var _keycheck = BaseObject.is(keycheck,"IValueChecker")?keycheck:null;
	var _valcheck = BaseObject.is(keycheck,"IValueChecker")?valcheck:null;
	var inobject = _inobject || {};
	if (inobject != null && typeof inobject == "object") {
		var props = file.getProps();
		return BaseObject.CombineObjects(inobject, props, function(key, left, right) {
			if (_keycheck == null || _keycheck.checkValue(key)) {
				if (_valcheck == null || _valcheck.checkValue(right)) {
					return true;
				}
			}
			return false;
		});
	}
	return inobject;
}