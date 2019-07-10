/* 
	This is a static hub for a variety of functions designed for use in the init.js files of BK content modules.
	None of the functionality covered here is accessible exclusively through the routines implemented here, everything here is
	designed with convenience in mind - easy writting and editing as if it is a configuration with occassional code.
*/

var BkInit = {
	// Shortcut locations
	StartMenu: function(fn) { fn(new BkInit_Shortcuts("shellfs","startmenu")); return this; },
	SystemMenu: function(fn) { fn(new BkInit_Shortcuts("shellfs","system")); return this; },
	DevMenu: function(fn) { fn(new BkInit_Shortcuts("shellfs","develop")); return this; },
	PrivateMenu: function(privatedir, fn) { fn(new BkInit_Shortcuts("shellfs","private/" + privatedir)); return this; },
	AppMenu: function(appname, fn) { fn(new BkInit_Shortcuts("shellfs","apps/" + appname)); return this; },
	KeylaunchMenu: function(appname, fn) { fn(new BkInit_Shortcuts("shellfs","keylaunch")); return this; },
	RecentMenu: function(fn) { fn(new BkInit_Shortcuts("shellfs","recent")); return this; },
	// Boot CLScript
	MasterBoot: function(cl) { 
		var memfs = Registers.Default().getRegister("bootfs");
		memfs.register("boot", new CLScript(cl,"Commander"));
		return this;
	},
	ModuleScript: function(modulename,fn) {
		fn(new BkInit_BootFS("bootfs", modulename));
		return this;
	},
	commands: function (fn) {
		fn (new BkInit_Cmd());
		return this;
	},
	commandUrlAliases: function(fn) {
		fn(new BkInit_CommandUrlAliases("appfs","system/urlcommands/aliases"));
		return this;
	},
	commandUrlAlias: function(aliasname,fn) {
		fn(new BkInit_CommandUrlAlias("appfs","system/urlcommands/aliases", aliasname));
		return this;
	},
	commandUrlGlobal: function(fn) {
		fn(new BkInit_CommandUrlGlobal());
		return this;
	},
	AppData: function(appClass, fn) {
		if (!Class.is(appClass, "IApp")) {
			throw "The class is not an app";
		}
		var appname = Class.getClassName(appClass);
		if (appname == null) throw "Cannot find class name";
		fn(new BkInit_AppData(appname));
		return this;
	}
};