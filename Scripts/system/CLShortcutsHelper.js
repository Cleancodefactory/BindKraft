/**
	This class provides convenience for shell shortcuts registrations following the conventions.
	It is recommended to register all shortcuts through it (System.ShellShortcuts.<helpermethod>...)
	
*/
function CLShortcutsHelper(memfs) {
	BaseObject.apply(this,arguments);
	this.$fs = memfs;
	if (!BaseObject.is(memfs, "MemoryFSDirectory")) throw "CLShortcutsHelper must be initialized with a valid MemoryFSDirectory";
}
CLShortcutsHelper.Inherit(BaseObject,"CLShortcutsHelper");
/**
	Registers an app shortcut in shellfs:apps/<appname>
*/
CLShortcutsHelper.prototype.regAppShortcut = function(appname,shortcutname,cmdline /* args: (String)optional_description, icon, keyboard keys etc */) {
	var dir = this.$fs.mkdir("apps/" + appname); // Make sure the App's dir exists and changes to it.
	if (dir != null) {
		var sk = new ShellShortcut(cmdline, shortcutname);
		dir.register(shortcutname, sk);
		return sk;
	}	
}.Description("Registers shortcut in the shellfs:apps/<appname>");
CLShortcutsHelper.prototype.regStartShortcut = function(shortcutname, cmdline, displayname /* args: (String)optional_description, icon, keyboard keys etc */) {
	var dir = this.$fs.mkdir("startmenu"); // Make sure the App's dir exists and changes to it.
	if (dir != null) {
		var sk = new ShellShortcut(cmdline, (displayname != null)?displayname:shortcutname);
		dir.register(shortcutname, sk);
		return sk;
	}
}.Description("Registers a shortcut in the startmenu");
CLShortcutsHelper.prototype.regKeylaunchShortcut = function(letter, cmdline, displayname /* args: (String)optional_description, icon, keyboard keys etc */) {
	if (typeof letter == "string" && letter.length == 1) {
		var dir = this.$fs.mkdir("keylaunch"); // Make sure the App's dir exists and changes to it.
		if (dir != null) {
			var sk = new ShellShortcut(cmdline, (displayname != null)?displayname:letter);
			dir.register(letter, sk);
			return sk;
		}	
	} else {
		throw "regKeylaunchShortcut needs sinle letter name for the shortcut";
	}
}.Description("Registers a shortcut in the startmenu");


// May be needed, but we will try to live without them for now.

/*
CLShortcutsHelper.prototype.unregAppShortcut = function(appname, shortcutname) {
	var dir = this.$fs.cd("apps/" + appname);
	if (dir != null) {
		dir.unregister(shortcutname);
	}
}
*/

