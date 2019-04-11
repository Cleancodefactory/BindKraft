/*
    Each (content) module in BindKraft should have an init.js file that is responsible to make all the registrations.
    This is an example file, containing (at least) one example for each kind of registration. Uncomment and modify those you need only.
    Make copies where you have more than one registration of the same kind and leave (or remove) all unneeded ones.

    See comments for details about each setting/registration

*/
(function (init) {
    // For better management - some defines
    // These are defined for the most typical cases, change or define more if needed.
    var modulename = "<your_module_name>";

    // The module may contain one or more than one app, or none - create more if needed
    var appclass = "<app1_class_name>";
    
    // The name of the app in memory file name compatible fashion
    var appname = "<app_name>";

    // Longer (100-300 characters recommended) description of the  (main) app
    var appdesc = "<app_description>";

    // The app icon file
    var iconfile = "appicon.svg";

    //

    // More variables can be defined and used below - variables for app name, icon file and some others should be most useful. 

	////////////////////////////////////////////////////////////////////////////
	// 1. BOOT
	////////////////////////////////////////////////////////////////////////////
	
    /* 1.1. Master boot
        This is the script that boots the system. You need it in your module if it is expected to boot the system.
        This is critically important for WorkSet_XXXX modules, pointless in library modules and potentially useful in modules
        that implement apps - when used to form a WorkSet with single app.
        A typical script for app module:
        ""
    */
    // init.MasterBoot("<your boot script>");
	/* example:
	init.MasterBoot("startshell \
        createworkspace 'bindkraftstyles/window-workspacewindow-withshell' \
        initculture 'en' \
        initframework \
        launchone NotchShellApp \
        launchone BindKraftComApp");
		
	// No specific additional boot scripts are called in the example.
	*/

    // Typical script for a module with one app.  Check if it is ok and see if you need to call some scripts supplied by modules on which this one depends.
    // init.MasterBoot("startshell createworkspace default initculture 'en' initframework launchone " + appclass);

    /* 1.2. Boot scripts (optional and mandatory)
    */
    // General
    init.ModuleScript(modulename, function(writer) {
        // General script
        // writer.write("<clscript_name>", "<script content>");

        // Script with special relation with app (for UI display purposes only)
        // writer.write("<clscript_name>", "<script content>",appclass);
    });

	/////////////////////////////////////////////////////////////////////////////
	// 2. Shortcuts
	/////////////////////////////////////////////////////////////////////////////
	
    /* 2.1. Start menu

    */
    init.StartMenu(function(menu) {
        // Typical entry
        /*
            menu.add(appname,"launchone " + appclass)
            .icon(modulename, iconfile) // optional
            .appclass(appclass) // optional
            .description(appdesc); // optional
        */
        
        // If the above is not good enough:
        // Syntax 1
        /*
        menu.add("<name>","<clscript content to execute>", "<optional display name used by extended UI only>")
            .icon(modulename, "<image_filename_from_Images_dir>") // optional
            .appclass("<class_name_of_the_app>") // optional
            .description("<longer description - shown in extended parts of the UI>"); // optional
        */

        // Syntax 2
        /*
        menu.add({
            name:"<name>",
            displayname: "<optional display name used by extended UI only>",
            cmdline: "<clscript content to execute>",
            iconmodule: "<module_name>",
            icon: "<image_filename_from_Images_dir>",
            appclass: "<class_name_of_the_app>,
			description: "<shortcut_or_app_description>"
        });
        */
		
        
    });

    /* 2.2. System  menu

    */
   init.SystemMenu(function(menu) {
    // Typical entry
    /*
            menu.add(appname,"launchone " + appclass)
            .icon(modulename, iconfile) // optional
            .appclass(appclass) // optional
            .description(appdesc); // optional
        */
        
        // If the above is not good enough:
        // Syntax 1
        /*
        menu.add("<name>","<clscript content to execute>", "<optional display name used by extended UI only>")
            .icon(modulename, "<image_filename_from_Images_dir>") // optional
            .appclass("<class_name_of_the_app>") // optional
            .description("<longer description - shown in extended parts of the UI>"); // optional
        */

        // Syntax 2
        /*
        menu.add({
            name:"<name>",
            displayname: "<optional display name used by extended UI only>",
            cmdline: "<clscript content to execute>",
            iconmodule: "<module_name>",
            icon: "<image_filename_from_Images_dir>",
            appclass: "<class_name_of_the_app>,
			description: "<shortcut_or_app_description>"
        });
    */
    
    });

    /* 2.3. Dev menu

    */
   init.DevMenu(function(menu) {
    // Typical entry
        /*
            menu.add(appname,"launchone " + appclass)
            .icon(modulename, iconfile) // optional
            .appclass(appclass) // optional
            .description(appdesc); // optional
        */
        
        // If the above is not good enough:
        // Syntax 1
        /*
        menu.add("<name>","<clscript content to execute>", "<optional display name used by extended UI only>")
            .icon(modulename, "<image_filename_from_Images_dir>") // optional
            .appclass("<class_name_of_the_app>") // optional
            .description("<longer description - shown in extended parts of the UI>"); // optional
        */

        // Syntax 2
        /*
        menu.add({
            name:"<name>",
            displayname: "<optional display name used by extended UI only>",
            cmdline: "<clscript content to execute>",
            iconmodule: "<module_name>",
            icon: "<image_filename_from_Images_dir>",
            appclass: "<class_name_of_the_app>,
			description: "<shortcut_or_app_description>"
        });
        */
        
    });

    /* 2.4. Apps menu
        AppMenu is like Programs in Windows - folders named after certain apps may contain shortcuts that start the app in special mode (with arguments),
        start companion apps which are not openly listed in start menu and so on.
    */
   init.AppMenu(appname,function(menu) {
        // Syntax 1
        /*
        menu.add("<name>","<clscript content to execute>", "<optional display name used by extended UI only>")
            .icon(modulename, "<image_filename_from_Images_dir>") // optional
            .appclass("<class_name_of_the_app>") // optional
            .description("<longer description - shown in extended parts of the UI>"); // optional
        */

        // Syntax 2
        /*
        menu.add({
            name:"<name>",
            displayname: "<optional display name used by extended UI only>",
            cmdline: "<clscript content to execute>",
            iconmodule: "<module_name>",
            icon: "<image_filename_from_Images_dir>",
            appclass: "<class_name_of_the_app>,
			description: "<shortcut_or_app_description>"
        });
        */
        
    });
	
	/* 2.5. Custom/Private menu(s)
		These are created in shellfs:private/<privatedirname>
	*/
	
	init.PrivateMenu("<privatedirname>",function(menu) { 
		// Syntax 1
        /*
        menu.add("<name>","<clscript content to execute>", "<optional display name used by extended UI only>")
            .icon(modulename, "<image_filename_from_Images_dir>") // optional
            .appclass("<class_name_of_the_app>") // optional
            .description("<longer description - shown in extended parts of the UI>"); // optional
        */

        // Syntax 2
        /*
        menu.add({
            name:"<name>",
            displayname: "<optional display name used by extended UI only>",
            cmdline: "<clscript content to execute>",
            iconmodule: "<module_name>",
            icon: "<image_filename_from_Images_dir>",
            appclass: "<class_name_of_the_app>",
			description: "<shortcut_or_app_description>"
        });
        */
	});
	
	/* 2.6. Resetting and refilling a shotcuts folder
	
	*/
	// init.StartMenu(function(menu) {
	// init.SystemMenu(function(menu) {
	// init.DevMenu(function(menu) {
	// ... any other menu ... 
		// If you want to clear and recreate a menu 
		/*
		menu.clear();
		// Below any of the syntax variants can be used. The important point is that you remove the shortcuts registered by the other modules and create them anew.
		// This is typically needed in "WorkSet" modules - modules that define which other modules will be loaded and forms the presentation.
		// One might want to redesign the shortcuts along some presentation idea/concept and put specific (for the case) icons, descroiptions and even names, so this is
		// the way to do it without changes to the original included modules.
		menu.add("<somename>","<script to execute>");
		menu.add("<somename2>","<script to execute>");
		menu.add("<somename3>","<script to execute>");
		*/
	// });

	///////////////////////////////////////////////////////////////////////////////////
	// 3. CL commands (gloal) registration
	///////////////////////////////////////////////////////////////////////////////////
	
	
    /* 3.1. CL commands

    */
    init.commands(function(reg) {
        // Simple command can be defined inline
        /*
        reg.register("<mycommand>", function(context, api) {
            // Implement the command
        },"<help information>");
        */

        // More advanced commands would be implemented as a class derived from  CommandBase and instance passed to the same function
        // CommandBase derived commands are self-describing (CommandBase inherits CommandDescriptor). Be aware that a command can use constructor
        // arguments to configure/adjust its function, thus passing an explicitly created instance is necessary.
        /*
            reg.register(new MyCommand());
        */


    });
	
	///////////////////////////////////////////////////////////////////////////////////
	// 4. Defaults - set default parameters for classes (mostly controls and windows)
	///////////////////////////////////////////////////////////////////////////////////

    /* 4.1. Various defaults
    */

    // General - set one or more default setting. Check the documents or source code to see what settings are supported by the class.
    /*
    Class.defaultsOf(<classdefinition>).set({
        <defsetting1>: <defvalue1>,
        <defsetting2>: <defvalue2>,
    });
    */
   /* example:
        Class.defaultsOf(ProgressBar).set({ templateName: "bindkraftstyles/control-progressbar" });
   */

   /* 4.2. Default templates
   
   */

   // Set the default template of a component/control or window class
   // The class has to support the templateName setting.
   // Class.defaultsOf(<theclass>).set("templateName", "<modulename>/<template_name_without_file_extension>");
   // or
   // Class.defaultsOf(<theclass>).set({ templateName:, "<modulename>/<template_name_without_file_extension>"});

   ///////////////////////////////////////////////////////////////////////////////////
   // 5. URL commands related
   ///////////////////////////////////////////////////////////////////////////////////
   
   /* 5.1. Typical alias registrations - most usual for app's modules */
   /*
	   //Example:
	   init.commandUrlAlias("Myalias",function(alias) {
		   alias.appclass("MyAppClass").clear().addscript("launchnotifications").addcommands("launchone MyAppClass");
	   });
	   
	   // appclass sets the name of the app's class, clear - empties the list of dependencies, addscript adds a dependency (a CL script piece from system level list of commonly used ones
	   // addcommands adds a CL script piece explicitly
	   // The whole idea is to minimize the command line carried by the URL and compose the actually needed CL command script by concatenating pre-configured pieces.
	   // See more info about BkInit in the documentation.
   */
   
   /* 5.2. Managing all the aliases - usually needed in workset/desktop forming modules */
   /*
		// Example:
		init.commandUrlAliases(function(aliases) {
			aliases.remove("somealias"); // removes an alias registration
			aliases.clear(); // REmoves all aliases
			aliases.alias("somename"); returns/creates and returns an alias file for direct management (as PropertySetMemoryFile)
		});
		// This one may be needed when a workset/desktop has to reconfigure everything related to the URL carried commands
   */
   /* 5.3. Global management - prefix and common scripts */
   /* example:
   init.commandUrlGlobal(function(g) {
		g.prefix("$run");
		g.script("systools","launchone SysToolsApp");
	});
   */


})(BkInit);