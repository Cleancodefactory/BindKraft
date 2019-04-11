/*
	URL Command aliases management
	Each alias file is a PropertySetMemoryFile
	It may contain these properties
	app - class name of the app
	id  - id of the alias (very optional)
	contains this property
	dependencies - list of strings (starting either with script: or cl: each)
	
*/
function BkInit_CommandUrlAlias(fs, dir, aliasname) {
	BkInit_FSBase.apply(this,arguments);
	if (typeof aliasname != "string" || aliasname.length == 0) throw "aliasname cannot be empty";
	this.alias = this.$dir.item(aliasname);
	if (this.alias == null) {
		// Create new
		this.alias = new PropertySetMemoryFile();
		this.$dir.register(aliasname, this.alias);
	}
	this.$dependencies = this.alias.getProp("dependencies");
	if (this.$dependencies == null) {
		this.$dependencies = [];
		this.alias.setProp("dependencies",this.$dependencies);
	}
}
BkInit_CommandUrlAlias.Inherit(BkInit_FSBase,"BkInit_CommandUrlAlias");
BkInit_CommandUrlAlias.prototype.appclass = function(clsname) {
	if (clsname == null) {
		this.alias.removeProp("app");
		return this;
	}
	var name = Class.getClassName(clsname);
	if (name != null) {
		this.alias.setProp("app", name);
	} else {
		throw "Cannot find class name " + clsname;
	}
	return this;
}
BkInit_CommandUrlAlias.prototype.id = function(v) {
	if (v == null) {
		this.alias.removeProp("id");
		return this;
	}
	this.alias.setProp("id", v);
	return this;
}
BkInit_CommandUrlAlias.prototype.clear = function() {
	this.$dependencies.splice(0);
	return this;
}
BkInit_CommandUrlAlias.prototype.addscript = function(name) {
	this.$dependencies.push("script:" + name);
	return this;
}
BkInit_CommandUrlAlias.prototype.addcommands = function(cmds) {
	this.$dependencies.push("cl:" + cmds);
	return this;
}
