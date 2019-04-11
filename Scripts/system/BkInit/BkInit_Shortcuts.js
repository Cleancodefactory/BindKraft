function BkInit_Shortcuts(fs, path) {
	BkInit_FSBase.apply(this,arguments);
}
BkInit_Shortcuts.Inherit(BkInit_FSBase,"BkInit_Shortcuts");
BkInit_Shortcuts.prototype.add = function(shortcutname, cmdline, displayname) {
	if (typeof shortcutname == "object") {
		var p = shortcutname;
		shk = new ShellShortcut(p.cmdline, (p.displayname != null)?p.displayname:p.name);
		if (p.icon != null && p.iconmodule != null) shk.icon(p.iconmodule,p.icon);
		if (p.description) shk.description(p.description);
		if (p.appclass) shk.appclass(p.appclass);
		this.$dir.register(p.name, shk);
		return shk;
	} else {
		var sk = new ShellShortcut(cmdline, (displayname != null)?displayname:shortcutname);
		this.$dir.register(shortcutname, sk);
		return sk;
	}
}
BkInit_Shortcuts.prototype.clear = function () {
    this.$dir.clear();
}