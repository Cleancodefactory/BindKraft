/** DEFAULT Global commands implementations
 * 
 * Some of the longer implementations are functions implemented in separate files in the globalcommands directory
 * 
 */

System.DefaultCommands = {
	"initframework": function(ctx, api){
		jb_initFramework(Shell);
	},
	"initculture": function(ctx, api){
		var culture = api.pullNextToken();
		if(typeof culture != "string"){
			throw "The culture name must be string";
		}
		if (culture == '' || culture == "*" || culture == "selected") {
			// Leave what we have - use syslang to set from parameters
		} else if (/^\w{2}(-.*)?$/.test(culture)) {
			System.Default().settings.CurrentLang = culture;
		}
		if (typeof window.g_UTCDate == "undefined") {
			window.g_UTCDate = false;//default UTC time
		}
		Globalize.Default = new Globalize(System.Default().settings.CurrentLang, g_UTCDate);
		Globalize.UTCMode = new Globalize(System.Default().settings.CurrentLang, true);
		Globalize.LocalMode = new Globalize(System.Default().settings.CurrentLang, false);
		return culture;
	},
	"createworkspace": function(ctx, api){
		var template = api.pullNextToken();
		if(typeof template != "string"){
			throw "The template name must be string";
		}
		if (template != "default") {
			WorkspaceWindow.useTemplateConnector = new TemplateConnector(template);
		}
		if (window.Shell) {
			Shell.workspaceWindow = WorkspaceWindow.Default();
		}
		WorkspaceWindow.Default().setFinalAuthority(true);
		Messenger.OnLoad();
	},
	"msgbox": function(ctx, api){
		var msg = api.pullNextToken();
		alert(msg);
	},
	"startshell": function(ctx, api){
		window.Shell = new SysShell();
		// Hard separation between creation of workspace and sysshell - we need this in order to make ws creation controlled by createworkspace command!
		//Shell.workspaceWindow = WorkspaceWindow.Default();
		
	},
	"customizeshell": function(ctx, api) {
		var iface = Class.getInterfaceDef(api.pullNextToken());
		var cls = Class.getClassDef(api.pullNextToken());
		if (iface != null && cls != null) {
			window.Shell.addCustomizer(iface, new cls());
		}
	},
	"enterapp": function(ctx, api) {
		// TODO: Resolve the app management mess at least to some degree and do this
	},
	"endcontext": function(ctx, api) {
		var ctx = api.pullContext();
		return api.completedOperation(true, ctx); // May be we should return something else?
	},
	"innewapp": function(ctx, api) {
		var appclassname = api.pullNextToken();
		var returnOp = new Operation(null, null); // 60000);
		if (typeof appclassname == "string" && Class.is(appclassname,"IApp")) {
			var op = Shell.launch(appclassname); // TODO: Complete this
			op.whencomplete().tell(function (operation) {
				if (!operation.isOperationSuccessful()) {
					returnOp.CompleteOperation(false, "starting app '" + appclassname + "' failed. Shell reported: " + operation.getOperationErrorInfo());
				}
				var app = operation.getOperationResult();
				var ctx = api.getContextFrom(app);
				if (BaseObject.is(ctx, "ICommandContext")) {
					api.pushContext(ctx);
					returnOp.CompleteOperation(true,app);
				} else {
					returnOp.CompleteOperation(false,"Failed to obtain command context from the new instance of " + appclassname);
				}

			});
		} else {
			returnOp.CompleteOperation(false, "appclassname '" + appclassname + "' is not specified or is not an application class");
		}
		return returnOp;
	},
	"inoneapp": function(ctx, api) {
		var appclassname = api.pullNextToken();
		var returnOp = new Operation(null, 60000); // 60000);
		if (typeof appclassname == "string" && Class.is(appclassname,"IApp")) {
			var op = Shell.launchOne(appclassname); // TODO: Complete this
			op.whencomplete().tell(function (operation) {
				if (!operation.isOperationSuccessful()) {
					returnOp.CompleteOperation(false, "starting/attaching app '" + appclassname + "' failed. Shell reported: " + operation.getOperationErrorInfo());
				}
				var app = operation.getOperationResult();
				var ctx = api.getContextFrom(app);
				if (BaseObject.is(ctx, "ICommandContext")) {
					api.pushContext(ctx);
					returnOp.CompleteOperation(true,app);
				} else {
					returnOp.CompleteOperation(false,"Failed to obtain command context from the instance of " + appclassname);
				}

			});
		} else {
			returnOp.CompleteOperation(false, "appclassname '" + appclassname + "' is not specified or is not an application class");
		}
		return returnOp;
	},
	"stopapp": function(ctx, api) {
		var appclass = api.pullNextToken();
		if (typeof appclass == "string" && appclass.length > 0) {
			var app = Shell.getAppByClassName(appclass);
			if (app != null) {
				return app.ExitApp();
			}
		}
	},	
	"gcallcript": function(ctx,api) {
		var scriptname = api.pullNextToken();
		var script = System.BootFS().readScript(scriptname);
		if (script != null) {
			return Commander.RunGlobal(script);
		}
		return false;
	},
	"grunscript": function(ctx,api) {
		Commander.RunGlobal(api.pullNextToken());
	},
	// +V 2.17.6
	"set": function(ctx, api) {
		var varname = api.pullNextToken();
		var varval = api.pullNextToken();
		if (typeof varname === "string") {
			var env = ctx.get_environment();
			if (env != null) {
				env.setEnv(varname,varval);
			}
		}
	},
	"unset": function(ctx, api) {
		var varname = api.pullNextToken();
		if (typeof varname === "string") {
			var env = ctx.get_environment();
			if (env != null) {
				env.unsetEnv(varname);
			}
		}
	},
	// -V 2.17.6
	"clean_boottime_environment": function(ctx,api) {
		var gc = CommandReg.Global();
		gc.unregister("initframework");
		gc.unregister("initculture");
		gc.unregister("createworkspace");
		gc.unregister("startshell");
		gc.unregister("clean_boottime_environment"); // unregister itself too ;)
	},
	"inithistory": function(ctx, api) {
		BrowserHistoryTracker.Default();
	},
	"runurlcommands": function(ctx, api) {
		var proc = new UrlCommandsProcessor();
		var url = new BKUrl();
		var surl = null;
		// Try to use the remembered initial full URL to guarantee we will not be affected by url changes (for instance made by history.pushState).
		if (typeof window.g_ApplicationStartFullUrl == "string" && window.g_ApplicationStartFullUrl.length > 0) {
			surl = window.g_ApplicationStartFullUrl;
		} else {
			surl = window.location.href;
		}
		if (url.readAsString(surl)) {
			var cmds = proc.getURLCommands(url);
			if (cmds != null) {
				var returnOp = new Operation(null, 60000); // 60000);
				var arr_cmds = [];
				for (var k in cmds) {
					if (cmds.hasOwnProperty(k)) {
						var cl = cmds[k];
						if (typeof cl == "string" && cl.length > 0) {
							arr_cmds.push(cl);
						}
					}
				}
				function runnext(op) {
					if (op != null) {
							// some logging may be
					}
					var scr  = arr_cmds.shift();
					if (scr != null) {
						Commander.RunGlobal(scr).whencomplete().tell(runnext);
					} else {
						returnOp.CompleteOperation(true, null);
					}
				}
				if (arr_cmds.length > 0) {
					runnext(null);
				} else {
					returnOp.CompleteOperation(true, null);
				}
				return returnOp;
			}
		}
		
	},
	"loadbearertoken": System.CommandLibs.TokenStorage,
	"loadtranslation": System.CommandLibs.LoadTranslation,
	"loadtranslations": System.CommandLibs.LoadTranslations,
	"syslang": function(ctx, api) {
		var paramname = api.pullNextToken();
		if (paramname == "default") paramname = "culture";
		if (window.g_ApplicationStartFullUrl != null) {
			var url = new BKUrl(window.g_ApplicationStartFullUrl);
			var culture = url.get_query().get(paramname) + "";
			if (culture != "" && /^\w{2}(-.+)?$/.test(culture)) {
				System.Default().settings.CurrentLang = culture;
				return;
			}
		}
		if (typeof window.g_ApplicationCulture == "string" && /^\w{2}(-.+)?$/.test(window.g_ApplicationCulture)) {
			System.Default().settings.CurrentLang = window.g_ApplicationCulture;
		}
	},
	"mediatracker": function(ctx, api) {
		var MediaQueryTracker = Class("MediaQueryTracker");
		MediaQueryTracker.Default();
	},
	"mediaquery": function(ctx, api) {
		var MediaQueryTracker = Class("MediaQueryTracker");
		var name = api.pullNextToken();
		var query = api.pullNextToken();
		MediaQueryTracker.Default().add(name, query);
	},
	"medianotify": function(ctx, api) {
		var MediaQueryTracker = Class("MediaQueryTracker");
		var name = api.pullNextToken();
		var expression = api.pullNextToken();
		MediaQueryTracker.Default().addNotificator(name, expression);
	},
	"mediamessenger": function(ctx, api) {
		var MediaQueryTracker = Class("MediaQueryTracker");
		var name = api.pullNextToken();
		var expression = api.pullNextToken();
		MediaQueryTracker.Default().addNotificator(name, expression, "MediaQueryNotificatorBroadcaster");
	},
	"externalscript": function(ctx, api) {
		var url = api.pullNextToken();
		return Class("ExternalScripts").Default().loadScript(url);
	}
};

// Register the default global commands here.
// Additional commands are registered from outside as:
// CommandReg.Global().register( ... command desc ...) // see above how the register method works
(function() {
	var gc = CommandReg.Global();
	var defs = System.DefaultCommands;
	
	gc.register("innewapp", "launchapp", null,
					defs.innewapp, "Launches new windowed app and changes to the app's command context");
	gc.register("inoneapp", "launchone", null,
					defs.inoneapp, "Launches new or uses the running instance of an windowed app and changes to the app's command context");
	gc.register("endcontext", "dropcontext", null,
					defs.innewapp, "Drops the top command context (if any exists)");
	gc.register("enterapp", "enterfirstapp", null,
					defs.innewapp, "Finds the first app of the given class and changes to the app's command context");
	gc.register("stopapp", "exitapp", null,
					defs.stopapp, "Finds the first app of the given class and stops it. If the app does not currently run, does nothing.");					
	gc.register("inithistory", "historystart", null,
					defs.inithistory, "Starts the history tracking");
	gc.register("alert", "msgbox", null,
							defs.msgbox, "Shows an alert.");

	//
	gc.register("initframework", null, null, defs.initframework, "");

	gc.register("initculture", null, null, defs.initculture, "");

	gc.register("createworkspace", null, null, defs.createworkspace, "");

	gc.register("startshell", null, null, defs.startshell, "");

	gc.register("customizeshell", null, null, defs.customizeshell, "Registers a specific customizer with SysShell. Parameters <interface> <implementation>")
	// gc.register("grunscript", "grun", null,
	//						 defs.gcallcript, "Runs a script read from the top result - runs uncontrollably, returns immediately without waiting");
	gc.register("gcallscript", "gcall", null,
							 defs.gcallcript, "Runs a script read from the top result - waits it to finish");
	// this.$Global.register("crunscript", "crun", null,
							// this.DefaultCommands.runscript, "Runs a script read from the top result - waits it to finish");
	// this.$Global.register("ccallscript", "ccall", null,
							// this.DefaultCommands.runscript, "Runs a script read from the top result - waits it to finish");
	// this.$Global.register("setenv", null, null,
							// this.DefaultCommands.runscript, "Runs a script read from the top result - waits it to finish");
	// this.$Global.register("unsetenv", null, null,
							// this.DefaultCommands.runscript, "Runs a script read from the top result - waits it to finish");
	// this.$Global.register("getenv", null, null,
							// this.DefaultCommands.runscript, "Runs a script read from the top result - waits it to finish");
	gc.register("clean_boottime_environment", null, null,
							 defs.clean_boottime_environment, "Unregisters commands and environment settings no longer needed after boot, but leaves the global context otherwise intact - other settings will remain there.");
	gc.register("runurlcommands", null, null, defs.runurlcommands, "Inspects the initial URL's query string for command lines according to the configured prefix and registerd aliases");
	// +V 2.17.6
	gc.register("set", null, null, defs["set"], "Sets a variable in the current environment context: set varname varvalue");
	gc.register("unset", null, null, defs["set"], "Unsets a variable in the current environment context: unset varname");
	// -V 2.17.6
	gc.register("loadbearertoken", null, null, defs["loadbearertoken"],"Registers bearer token(s) into the system token register from the specified URL. ex: registertoken '<modulename>' '<nodeset>/<node>'. Expects 2 arguments logicalurl, modulename ");
	gc.register("loadtranslation", "lt", null, defs["loadtranslation"], "Loads translation for a single language. A %locale% in the second parameter will be replaced with the selected system locale. usage: loadtranslation <appClass>/<locale> <modulename>:<nodeset>[/<node1>.<node2>...]");
	gc.register("loadtranslations", "lts", null, defs["loadtranslations"], "Loads all translations for an app. usage: loadtranslations <appClass> <modulename>:<nodeset>[/<node1>.<node2>...]");
	gc.register("syslang", "systemlocale", null, defs["syslang"], "Sets the system language from query parameter with specified name or the built-in name if default is specified. If the parameter is missing the g_ApplicationCulture is used. If that is missing too - en is set. usage: syslang <paramname>|default");
	
	// +V 2.23.8
	gc.register("mediatracker", null, null, defs["mediatracker"], "Ensures that the media tracker is running and registered with the LocalAPI. syntax: mediatracker");
	gc.register("mediaquery", null, null, defs["mediaquery"], "Registers a media query. syntax: mediaquery name query");
	gc.register("medianotify", null, null, defs["medianotify"], "Registers a basic media notificator. syntax: medianotify name expression");
	gc.register("mediamessenger", null, null, defs["mediamessenger"], "Registers a media notificator which also posts Messenger notification MediaChangedQuery. syntax: mediamessenger name expression");

	// -V 2.23.8

	// +V 2.24.0
	gc.register("externalscript", null, null, defs["externalscript"], "Loads additional javascripts from URL. syntax: externalscript 'url'");
	// -V 2.24.0
})();
