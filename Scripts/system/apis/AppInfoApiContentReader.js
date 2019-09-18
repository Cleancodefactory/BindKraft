function AppInfoApiContentReader(AppClass) {
	BaseObject.apply(this, arguments);
	this.$fs = Registers.Default().getRegister("infofs");
	var appname = Class.getClassName(AppClass);
	if (appname == null) throw "Cannot determine the app class name in AppInfoApiContentReader";
	this.$dir = this.$fs.mkdir("appinfo/" + appname);
}
AppInfoApiContentReader.Inherit(BaseObject, "AppInfoApiContentReader");
AppInfoApiContentReader.ImplementEx(IAppInfoApiContentReader);
AppInfoApiContentReader.prototype.content = function(filename, requiredContentType) { 
	var f;
	try {
		f = this.$dir.item(filename);
	} catch(err) {
		f = null;
	}
	if (f != null) {
		if (BaseObject.is(f, "IMemoryFileContent")) {
			// Ignores the availability
			if (requiredContentType == null || f.get_contenttype() == requiredContentType) {
				return f.get_content();
			}
		}
	}
	return null;
}
AppInfoApiContentReader.prototype.contentTypeOf = function(filename) { 
	var f;
	try {
		f = this.$dir.item(filename);
	} catch(err) {
		f = null;
	}
	if (f != null) {
		if (BaseObject.is(f, "IMemoryFileContent")) {
			return f.get_contenttype();
		}
	}
	return null;
}

AppInfoApiContentReader.prototype.isAvailable = function(filename) {
	var f;
	try {
		f = this.$dir.item(filename);
	} catch(err) {
		f = null;
	}
	if (BaseObject.is(f, "IMemoryFilePersistable")) {
		return f.get_available();
	}
	return false;
}

AppInfoApiContentReader.prototype.restore = function(filename) {
	// TODO: Implement after persitence becomes available
}