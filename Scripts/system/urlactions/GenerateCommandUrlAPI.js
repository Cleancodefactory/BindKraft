function GenerateCommandUrlAPI() {
	BaseObject.apply(this,arguments);
}
GenerateCommandUrlAPI.Inherit(BaseObject,"GenerateCommandUrlAPI");
GenerateCommandUrlAPI.Implement(IGenerateCommandUrl);
// +Internals
GenerateCommandUrlAPI.prototype.$getGlobals = function() {
	var f = System.FS("appfs").item("system/urlcommands/general");
	if (BaseObject.is(f, "PropertySetMemoryFile")) {
		return f;
	}
	return null;
}.Description("Opens the URLCommands global settings");
GenerateCommandUrlAPI.prototype.$getAlias = function(name, appcls, id) {
	var f = System.FS("appfs").item("system/urlcommands/aliases/" + name);
	if (BaseObject.is(f, "PropertySetMemoryFile")) {
		var appclsname = Class.getClassName(appcls); // Will be null if appcls is null ot not a class
		// TODO: Additional checks may be? Is the class an app? There are arguments against that - the class may be used with a bit different intentions
		if (appclsname != null && f.getProp("app") != appclsname) return null; // Does not match a condition
		if (id != null && f.getProp("id") != id) return null; // Does not match a condition.
		return f;
	}
	return null;
}.Description("Opens the alias by name and returns it. If additional conditions are specified they have to be fulfilled.");

// -Internals
// +IGenerateCommandUrl
GenerateCommandUrlAPI.prototype.getAliasesForApp = function(appcls, id) {
	var classname = Class.getClassName(appcls);
	aliasdir = System.FS("appfs").cd("system/urlcommands/aliases");
	var aliases = aliasdir.get_files(); // [{ key: filename, value: file }]
	if (aliases != null) {
		var r = {};
		for (var i = 0; i < aliases.length; i++) {
			var alias = aliases[i];
			if (BaseObject.is(alias.value,"PropertySetMemoryFile") &&
				(id == null || alias.value.getProp("id") == id) && 
				(classname == null || alias.value.getProp("app") == classname) ) {
				r[alias.key] = alias.value.getProps();
			}
		}
		return r;
	}
	return null;
}
GenerateCommandUrlAPI.prototype.getCommandURLGenerator = function(aliasname, options) {
	
	// Get the alias
	var alias = this.$getAlias(aliasname,options && options.app, options && options.id);
	if (alias == null) {
		this.LASTERROR(-1,"alias not found or not a PropertySetMemoryFile");
		return null;
	}
	// Get the global settings
	var globals = this.$getGlobals();
	if (globals == null) {
		this.LASTERROR(-1,"general settings for URLCommands not found or not a PropertySetMemoryFile.");
		return null;
	}
	var generator = {
		aliasname: aliasname,
		globals: globals,
		prefix: globals.getProp("prefix")
	};
	var gen = new Delegate(generator, this.$genCommandURLProc); // Pass the needed settings as bound parameters (the alias file is not needed, only its name)
	return gen;
}
GenerateCommandUrlAPI.prototype.generateUrl = function(usealias, owncommands, options) {
	var gen = this.getCommandURLGenerator(usealias,options);
	return gen.invoke(owncommands);
}
// -IGenerateCommandUrl
GenerateCommandUrlAPI.prototype.$genCommandURLProc = function(cmds) { // This is the generator object defined in getCommandURLGenerator
	var url = new BKUrl(BKUrl.startURL());
	url.get_query().set(this.prefix + this.aliasname,cmds);
	return url.composeAsString();
}
// Instance - registered in LocalAPI
GenerateCommandUrlAPI.Default = (function() {
	var instance = null;
	var regCookie = null;
	return function() {
		if (instance == null) {
			instance = new GenerateCommandUrlAPI();
			regCookie = LocalAPI.Default().registerAPI ("IGenerateCommandUrl", instance);
		}
		return instance;
	};
})();
GenerateCommandUrlAPI.Default();