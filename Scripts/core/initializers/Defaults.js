// This is a helper class and does not follow the OOP rules in the framework. The name does not include the suffix "Helper", because it is intended for massive usage and
// the word "Defaults" best describes its function.

/*RAW CLASS*/
/**
 * Use in initializers instead of default value like: new Defaults("somedefaultsproperty") 
 * or pass to code and use it there like: Defaults.getValue(this, val) where this is this 
 * instance or another and val is wither the literal value or the Defaults instance passed (instead of the value)
 * About the translations: 
 * a) The defaults value is not translated! When the translation syntax is used it overrides 
 * the value specified in the defaults and attempts to resolve it from translations and proceeds normally only if
 * translation fails. Why: Different defaults can be used for different instances of the class that needs default 
 * value, this way without a new feature these can be given to use different translations.
 * b) The value picked from defaults or ambient defaults is fetched from translation. The value itself will appear 
 * as result if translation is missing.
 * 
 * Hint: When sub-classing and different defaults have to be specified for existing property - redefine it with the 
 * new defaults.
 * 
 * Hint: Both translation options can be used together. This rarely makes sense, but it can be useful when 
 * sometimes one wants to specify explicitly which translation is to be used and fall back to another if it is missing.
 * Usually so many fallbacks are not necessary, but the option exists if one needs it.
 * 
 * @param {string} name - The name of the parameter from the defaults of the class in which it is being used.
 * 						  If translation is needed use
 * 						  a) syntax "#name$AnchorClass.path0.path1 ... " as name.
 * 						  Anchor class is the class to which translations are anchored, then specify the path to the translation.
 * 						  b) name is specified normally, but if the value in the defaults/ambient defaults has the syntax:
 * 							"#$AnchorClass.path0.path1 ... " it will be replaced from that translation.
 * @param {*} hardDefault - if present, returned as last resort
 */
function Defaults(name, hardDefault) {
	this.name = name;
	if (typeof name == 'string') {
		var match = Defaults.reTrans.exec(name);
		if (match != null) {
			this.name = match[1];
			this.anchorClass = match[2];
			this.transPath = match[3];
			this.translate = true;
		}
	}
	this.hardDefault = hardDefault;
}
Defaults.reTrans = /^#([A-Za-z_][A-Za-z0-9_]*)\$([A-Za-z_][A-Za-z0-9_]*)\.(.*)$/g;
Defaults.reTransValue = /^#\$([A-Za-z_][A-Za-z0-9_]*)\.(.*)$/g;
Defaults.prototype.read = function(obj) {
	var x, me = this;
	if (typeof this.name != "string") return this.hardDefault;
	if (me.translate) {
		var loc = Class("Localization").get_translation(this.anchorClass);
		if (loc != null) {
			var t = BaseObject.getProperty(loc, this.transPath);
			if (t != null) { return t;}
		}
	}
	function _translate(v) {
		if (typeof v != "string") return v;
		var match = Defaults.reTransValue.exec(v);
		if (match != null) {
			var anchorClass = match[1];
			var transPath = match[2];
			var loc = Class("Localization").get_translation(anchorClass);
			if (loc != null) {
				var t = BaseObject.getProperty(loc, transPath);
				if (t != null) { return t;}
			}	
		}
		return v;
	}
	if (BaseObject.is(obj, "IAmbientDefaultsConsumer")) {
		// Try finding defaults service
		x = obj.readAmbientDefaultValue(this.name);
		if (x != null) return _translate(x);
	}
	var cls = Class.getClassDef(obj);
	if (cls != null && typeof cls.$defaults == "object" && typeof cls.$defaults[this.name] !== "undefined") {
		return _translate(cls.$defaults[this.name]);
	}
	return _translate(this.hardDefault);
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