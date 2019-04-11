/*
	URL Command aliases management
	Each alias file is a PropertySetMemoryFile
	It may contain these properties
	app - class name of the app
	id  - id of the alias (very optional)
	contains this property
	dependencies - list of strings (starting either with script: or cl: each)
	
*/
function BkInit_CommandUrlAliases(fs, dir) {
	BkInit_FSBase.apply(this,arguments);
}
BkInit_CommandUrlAliases.Inherit(BkInit_FSBase,"BkInit_CommandUrlAliases");
BkInit_CommandUrlAliases.prototype.get = function(name) {
	var a = this.$dir.item(name);
	if (!BaseObject.is(a,"PropertySetMemoryFile")) return null
	return a;
}
BkInit_CommandUrlAliases.prototype.remove = function(name) {
	this.$dir.unregister(name);
}
BkInit_CommandUrlAliases.prototype.clear = function() {
	this.$dir.clear(name);
}
BkInit_CommandUrlAliases.prototype.alias = function(name) {
	var a = this.$dir.item(name);
	if (!BaseObject.is(a, "PropertySetMemoryFile")) {
		this.$dir.register(name, new PropertySetMemoryFile());
	}
	return this.$dir.item(name);
}