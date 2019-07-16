function AppDataApiContentReader(AppClass) {
	BaseObject.apply(this, arguments);
	this.$fs = Registers.Default().getRegister("appfs");
	var appname = Class.getClassName(AppClass);
	if (appname == null) throw "Cannot determine the app class name in AppDataApiContentReader";
	this.$dir = this.$fs.mkdir(appname);
}
AppDataApiContentReader.Inherit(BaseObject, "AppDataApiContentReader");
AppDataApiContentReader.ImplementEx(IAppDataApiContentReader);
AppDataApiContentReader.prototype.content = function(filename, requiredContentType) { 
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
AppDataApiContentReader.prototype.contentTypeOf = function(filename) { 
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

AppDataApiContentReader.prototype.isAvailable = function(filename) {
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

AppDataApiContentReader.prototype.restore = function(filename) {
	// TODO: Implement after persitence becomes available
}