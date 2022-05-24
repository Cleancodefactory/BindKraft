/**
	This file containes global code that adds/configues some aspects of the system in order to prepare it to boot
*/
(function(g) {
	// Register the standard filesystems
	var fs;
	// Boot FS - modules write here boot scripts
	// bootfs: boot - the master boot script
	// bootfs: <modulename>/*scripts
	if (!Registers.Default().registerExists("bootfs")) {
		Registers.Default().addRegister( new MemoryFSDirectory("bootfs"));
	}
	// Shell FS - start menus etc. All launch CLS are global Commander type
	// shellfs: apps/		- each app can create shortcuts here under a folder named after the app
	// shellfs: startmenu/	- design a startmenu here (apps are usually incoluded visualy by shell UIs)
	// shellfs: keylaunch/	- special place where the shortcuts have to be named with a single letter for launch with Ctrl-Alt-<theletter>
	// Shellfs: recent/		- A limited number is cycled here through reporting a shortcut to the Shell
	// Shellfs: system/		- System tool shortcuts should be put here instead of the start menu
	// Shellfs: develop/	- System tool for developers - shortcuts should be put here instead of the start menu or system
	// Shellfs: private/	- Subdirectories can be created for specific purposes. USe this one to avoid mixing up the others by mistake.
	// - other folders may be created, but it should be backed by support (expectation) provided by special UI shell app that knows to look there
	if (!Registers.Default().registerExists("shellfs")) {
		Registers.Default().addRegister( new MemoryFSDirectory("shellfs"));
		fs = Registers.Default().getRegister("shellfs");
		var rc = fs.mkdir("recent");
		fs.mkdir("apps");
		fs.mkdir("startmenu");
		fs.mkdir("keylaunch");
		fs.mkdir("recent");
		fs.mkdir("system");
		fs.mkdir("develop");
		fs.mkdir("private");
	}
	
	// Info FS - no executable code, only information texts, runtime values and other similar static or run-time info data.
	// 		Info FS is an alternative to logging and aims at giving an overview of the system (potentially including apps) state.
	// infofs: modules\  - Each module should put an entry with some info about itself in file named as the module name is (ModlueInfo entries must be used)
	// infofs: appinfo\ - Each app can publish here files following certain conventions/contracts for use by others in certain well-known way
	// ?infofs: msgspool\ - subdirs with different kinds are created, further subdirs may be sometimes desired.
	//						Writing here should be through APIs or a side result of usage of APIs with different direct purpose
	if (!Registers.Default().registerExists("infofs")) {
		Registers.Default().addRegister( new MemoryFSDirectory("infofs"));
		fs = Registers.Default().getRegister("infofs");
		
		fs.mkdir("appinfo"); // here go one dir per app - each named after its class.
	}
	
	// AppData-like, 
	// AppFS - Globally executable code should be avoided, but in-app CL scripts are welcome. 
	//			This FS is for application data, EACH APP SHOULD create a folder and can put in it whatever data it needs stored.
	//			Persistence mechanisms for this FS may be implemented in future. This FS is somewhat similar to the appdata in Windows or user directory in unix.
	//		All data is stored per app (app class name), a dir with the class name is created and files stored in it and subdirs (if necessary).
	//		system directory is reserved for system data, some conventions apply to both apps and system
	// appfs: system\ - reserved for system data
	if (!Registers.Default().registerExists("appfs")) {
		Registers.Default().addRegister( new MemoryFSDirectory("appfs"));
		fs = Registers.Default().getRegister("appfs");
		// Some system entries (more to come in the future)
		var system = fs.mkdir("system"); // TODO Implement protection with read-only marking and use it here		
		
		// Built in system data files - create them with defaults that can be changed/reloaded a bit later (in module init.js files mostly
		var f, dir;
		// General settings for url commands
		// Old version - will be phased out gradually
		/*
			file: system/urlcommands/general 		- property bag file general settings, for the moment only prefix is defined there as $run
			dir:  system/urlcommands/scripts		- CLScript files used as dependency variables
			dir:  system/urlcommands/aliases		- aliases (TODO: list files)
		*/
		dir = system.mkdir("urlcommands");
		f = new PropertySetMemoryFile();
		dir.register("general", f);
		f.setProps({
			prefix: "$run",
			
		});
		dir.mkdir("scripts");
		dir.mkdir("aliases");

		// General settings for url commands 2
		// Read details on how they work in BKInit_RunFromUrl
		dir = system.mkdir("urlcommands2");
		f = new PropertySetMemoryFile();
		// appfs:/system/urlmmands2/commands
		dir.register("commands", f); // Property file where each script name is registered with an array (empty for the moment)
		f = new PropertySetMemoryFile();
		dir.register("settings", f);
		f.setProp("run","run"); // Default param name for the commands to run
		// appfs:/system/urlmmands2/scripts
		dir.mkdir("scripts"); // All the runnable scripts, each must be also registered in the commands prop file in order to be executable by url
		


	// appfs: <app>\localization - subdirectory for localization files. Each file is named after the locale it represents.
	//			API supporting this exists
		
		
	}
	
	// System settings preliminary defaults
	var settings = System.Default().settings;
	settings.CurrentLang = "en";
	settings.DefaultTransferDateEncoding = "ISO";
	settings.UltimateFallBackLocale = "en";
	
	
	function ReportError(message, source, lineno, colno, error) {
		alert("Error:" + message + "\n" + source + "\n" + lineno);// HideProgressAfterAjax();
		return true;
	}
	
	//If no other error handler attached, use the ReportError
	if (window.JBCoreConstants.ParseTimeErrorHandler == null)
	{ 
		window.onerror = ReportError;
	}
	
	document.addEventListener("DOMContentLoaded", function (event) {
		//window.removeEventListener('error', window.JBCoreConstants.ParseTimeErrorHandler);
		window.onerror = ReportError;
		// Run any delayed initializations
		BkInit.$execDelayed();
		// Before boot complete compilation phase
		CompileTime.Tasks.run("completion");
		// No more compile time tasks - forget them.
		CompileTime.finish();
		CompileTime.Tasks = null;
		// Run the boot script.
		var bootfs = Registers.Default().getRegister("bootfs");
		if (bootfs != null) {
			var bootscript = bootfs.item("boot");
			if (bootscript != null) {
				bootscript.run(null,{});
				// V:2.26.0- switching to the new way
				// var op = Commander.RunGlobal(bootscript.get_script());
				// op.whencomplete().tell(function(_op) {
				// 	console.log("Boot finished " + (_op.isOperationSuccessful()?"successfuly":"unsuccessfuly"));
				// });
			} else {
				alert("the boot script is not found.");
			}
		} else {
			alert("bootfs is not mounted");
		}
	});
})(window);
