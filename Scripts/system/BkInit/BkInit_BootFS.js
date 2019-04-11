function BkInit_BootFS() {
	BkInit_FSBase.apply(this,arguments);
}
BkInit_BootFS.Inherit(BkInit_FSBase,"BkInit_BootFS");
BkInit_BootFS.prototype.write = function(name, cl, app) {
	var p;
	if (typeof name == "string") {
		p = {
			name: name,
			script: cl,
			app: app
		}
	}
	if (PatternChecker.FileName.checkValue(p.name)) {
		if (this.$dir != null) {
			var s = new CLScript(p.script,"Commander", p.app);
			this.$dir.register(p.name, s);
			return s;
		} else {
			throw "Cannot access the memory directory";
		}
	} else {
		throw "CL script name is not correct/allowed: " + name;
	}
	return null;
}