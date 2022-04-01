/*
	URL Commands global settings
	
*/
function BkInit_CommandUrlGlobal() {
	BaseObject.apply(this,arguments);
	this.$appfs = Registers.Default().getRegister("appfs");
	this.$global = this.$appfs.item("system/urlcommands/general");
	this.$scripts = this.$appfs.cd("system/urlcommands/scripts");
	if (!BaseObject.is(this.$global,"PropertySetMemoryFile")) {
		throw "appfs:system/urlcommands/general does not exist or is not a PropertySetMemoryFile. Probably system/sysconfig.js is corrupted.";
	}
}
BkInit_CommandUrlGlobal.Inherit(BaseObject,"BkInit_CommandUrlGlobal");
BkInit_CommandUrlGlobal.prototype.prefix = function(v) {
	this.$global.setProp("prefix", v);
	return this;
}
BkInit_CommandUrlGlobal.prototype.script = function(name, cl, app) {
	if (app != null && typeof app != "string") throw "3-d argument 'app' has to be string or null (omitted)";
	if (typeof cl != "string") throw "2-nd argument 'cl' has to be string";
	if (typeof name != "string") throw "1-st argument 'name' has to be string";
	var script = new CLScript(cl, "CLRun", app);
	this.$scripts.register(name,script);
	return this;
}