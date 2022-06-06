function BkInit_Cmd(reg) {
	BaseObject.apply(this,arguments);
	if (reg != null) {
		if (BaseObject.is(reg, "CommandReg")) {
            this.$reg = reg;
		} else {
			throw "A CommandReg parameter is only accepted";
		}
	} else {
		this.$reg = CommandReg.Global();
	}
};
BkInit_Cmd.Inherit(BaseObject, "BkInit_Cmd");
BkInit_Cmd.prototype.register = function (cmdname, action, help) {
    this.$reg.register(cmdname, null, null, action, help);
};
BkInit_Cmd.prototype.registerPatterned = function (cmdname, pattern, action, help) {
    this.$reg.register(cmdname, null, pattern, action, help);
};
BkInit_Cmd.prototype.exists = function (cmdname) {
    return this.$reg.exists(cmdname);
};
BkInit_Cmd.prototype.addLibrary = function (libname) {
	var CLLibraries = Class("CLLibraries");
    var lib = CLLibraries.$libraries[libname];
	if (lib == null) throw "Library does not exist";
	this.$reg.addLibrary(lib);
};