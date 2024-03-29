


// This file should take over the old card based UI shell functions gradually. Many of the supporting files (queries, messages will probably remain)

function SysShell(shellspace) {
    BaseObject.apply(this, arguments);
    if (shellspace != null) {
        if (shellspace.jquery != null) {
            if (shellspace.length > 0) {
                this.root = shellspace.get(0);
            }
        } else {
            this.root = shellspace;
        }
    } else {
		this.root = System.Default().getWorkspaceElement();
	}
	this.$dispatcherLeasing = new EventDispatchLeasing("IAppBase");
    $(document).bind("keydown", Delegate.createWrapper(this, this.$sysKeyBindings));
    System.Default().windowunloadevent.add(new Delegate(this, this.shutdown));
	this.shellLocalApi = new ShellLocalApi(this);
	LocalAPI.Default().registerAPI(IShellApi,this.shellLocalApi);
}
SysShell.Inherit(BaseObject, "SysShell");
SysShell.Implement(IAjaxContextParameters);
SysShell.Implement(IStructuralQueryProcessorImpl);
SysShell.Implement(IDOMConnectedObject);
SysShell.Implement(IStructuralQueryRouterImpl,"sysshell",function(){ return null;});

//#region Shell customizers
SysShell.prototype.$customizers = new InitializeObject("All the customizers.");
SysShell.prototype.addCustomizer = function(iface, cust) {
	var iface_name = Class.getInterfaceName(iface);
	if (iface_name == null || cust == null) return;
	var IShellCustomizer = Interface("IShellCustomizer");
	if (BaseObject.is(cust, iface) && Class.doesextend(iface, IShellCustomizer)) {
		this.$customizers[iface_name] = cust;
		cust.set_shell(this);
		cust.set_workspacewindow(this.get_workspacewindow());
		var op = cust.initialize();
		if (!BaseObject.is(op,"Operation")) {
			return Operation.From(op);
		}
		return op;
	} else {
		throw "Failed to add the shell customizer " + ((cust != null)?cust.classType():"null") + ", because it is not based on IShellCustomizer interface";
	}
}
SysShell.prototype.removeCustomizer = function(iface) {
	var iface_name = Class.getInterfaceName(iface);
	if (iface_name != null) {
		delete this.$customizers[iface_name];
	}
}
SysShell.prototype.getCustomizer = function(iface) {
	var iface_name = Class.getInterfaceName(iface);
	if (iface_name != null) {
		return this.$customizers[iface_name];
	}
	return null;
}
//#endregion
SysShell.prototype.shellLocalApi = null;
// BEGIN IAjaxContextParameters - implementation
SysShell.prototype.get_localajaxcontextparameter = function(param) {
    if (this.$ajaxcontextparameter != null && this.$ajaxcontextparameter["" + param] != null) return this.$ajaxcontextparameter["" + param];
    return null;
};
SysShell.prototype.get_ajaxcontextparameter = function(param) {
    var result = this.get_localajaxcontextparameter(param);
    if (result != null) return result;
    return null;
};
SysShell.prototype.set_localajaxcontextparameter = function(param, v) {
    if (this.$ajaxcontextparameter == null) this.$ajaxcontextparameter = { };
    this.$ajaxcontextparameter["" + param] = v;
};
SysShell.prototype.$isFinalAuthority = true;
SysShell.prototype.isFinalAuthority = function(param) { // Override this in Applet root classes to stop searching for parameters to the shell
    return this.$isFinalAuthority;
};


// END IAjaxContextParameters - implementation

SysShell.prototype.workspaceWindow = null;
SysShell.prototype.get_workspacewindow = function () {
    return this.workspaceWindow;
};

// BEGIN IDOMConnectedObject implementation

SysShell.prototype.get_connecteddomelement = function(key) {
	var w = this.get_workspacewindow();
	if (BaseObject.is(w,"Base")) {
		// TODO the change from raw seems ok, but look out for legacy issues anyway
		return new DOMUtilElement(w.root);
	}
}

// END IDOMConnectedObject implementation

// SHELL STARTUP AND SHUTDOWN
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// This one should be bound to the System.Default().shutdownevent - unconditional shutdown
SysShell.prototype.shutdown = function (sys, e) {
    this.killAll();
}

// BEGIN APP Routines for the new app mechanism
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SysShell.ImplementIndexedProperty("runningapps", new InitializeArray("The running apps register") );

SysShell.prototype.getAppByInstanceId = function(id) { 
	var apps = this.get_runningapps();
	if (BaseObject.is(apps, "Array")) {
		return apps.FirstOrDefault(function(idx, app) {
			if (app.get_instanceid() == id) {
				return app;
			}
			return null;
		});
	}
	return null;
}.Returns("app if the id exists");
SysShell.prototype.getAppsByInstanceName = function(name) {
	var apps = this.get_runningapps();
	if (BaseObject.is(apps, "Array")) {
		return apps.Select(function(idx, app) {
			if (app.get_instancename() == name) {
				return app;
			}
			return null;
		});
	}
	return null;
};
/**
 * Gets the app owning the window or null if the window is not owned by an app or app is a ghost (when bRunning is true)
 * @param {BaseWindow} wnd -the window to inspect
 * @param {boolean} bRunning - optional
 */
SysShell.prototype.getAppFromWindow = function(wnd,bRunning) {
	var t,currentWindow = wnd;
    do {
        if (BaseObject.is(currentWindow.get_approot(), 'IApp')) {
            break;
        } else {
			
            t = currentWindow.get_windowparent();
			if (t == currentWindow) {// Cycling - should not happen but just in case
				this.LASTERROR("A window that is parent of itself found");
				break;
			}

			currentWindow = t;
        }
    } while (currentWindow !== null);
	if (BaseObject.is(currentWindow,"BaseWindow") && BaseObject.is(currentWindow.get_approot(), 'IApp')) {
		var app = currentWindow.get_approot();
		if (bRunning) {
			var ra = this.get_runningapps();
			if (Array.isArray(ra) && ra.indexOf(app) < 0) return null;
		}
		return app;
	}
    return null;
}
// Candidates for the interface
SysShell.prototype.getAppsByFilter = function(/* null | f(app) -> bool */callback) {
	var apps = this.get_runningapps();
	if (BaseObject.is(apps, "Array")) {
		if (BaseObject.isCallback(callback)) {
			return apps.Select(function(idx, app) {
				if (BaseObject.callCallback(callback, app)) {
					return app;
				}
				return null;
			});
		} else {
			return Array.createCopyOf(apps);
		}
	}
	return null;
};
SysShell.prototype.getAppsByClassNames = function(clsNames) {
	var classes = Array.createCopyOf(arguments);
	if (classes.length > 0) {
		return this.getAppsByFilter(function(app) {
			if (!BaseObject.is(app, "IAppBase")) return false;
			return (classes.FirstOrDefault(function(idx, item) {
				if (app.is(item)) return item;
				return null;
				}) != null);
		});
	}
	return null;		
};
// Faster but limited
SysShell.prototype.getAppByClassName = function(clsName) {
	var apps = this.get_runningapps();
	if (BaseObject.is(apps, "Array")) {
		return apps.FirstOrDefault(function(idx, app) {
			if (BaseObject.is(app, clsName)) {
				return app;
			}
			return null;
		});
	}
	return null;
};
SysShell.prototype.getAppWindows = function(appinst) {
	var ws = this.get_workspacewindow();
	if (BaseObject.is(ws, "BaseWindow")) {
		return ws.children.Select(function(idx, wnd) {
			if (BaseObject.is(ws,"IAppElement")) {
				if (wnd.get_approot() == appinst) {
					return wnd;
				}
			}
			return null;
		});
	}
	return null;
};
SysShell.prototype.activateApp = function(appinst) {
	if (!BaseObject.is(appinst, "IApp")) return false;
	var bDone = false;
	var me = this;
	function _activateDefault() {
		var wnds = me.getAppWindows(appinst);
		if (BaseObject.is(wnds,"Array")) {
			// Activate all windows one after another. Really enough if it is one top window, otherwise it may be better to
			// create special method in your app to do this smartly
			wnds.Each(function(idx, wnd){
				bDone = true;
				wnd.setWindowStyles(WindowStyleFlags.visible, "set");
				wnd.activateWindow();
			});
		}
	}
	if (appinst != null) {
		if (BaseObject.is(appinst, "IAppActivation")) {
			switch (appinst.howToActivateTheApp()) {
				case "hidden":
					return false;
				case "custom":
					return appinst.customAppActivation(true);
				default:
					_activateDefault(appinst);
			}
		} else {
			_activateDefault(appinst);
		}
		
	}
	return bDone;
}
// END APP Routines for the new app mechanism

// BEGIN weak dispatcher API
SysShell.prototype.$dispatcherLeasing = null;
// END weak dispatcher API
/*
SysShell.prototype.launchApp = function (cls, params) {
    var appClass = cls;
    if (BaseObject.is(cls, "string")) {
        appClass = Function.classes[cls];
    }
    var app = new appClass();
    var args = Array.createCopyOf(arguments, 1);
    args.unshift(function (result) {
        // This method needs refactoring (a lot of it)
    });
	app.placeWindow = function (w, options) {
		if (window.Shell) {
			Shell.addAppWindow(w, options);
		}
	}
    if (app.appinitialize.apply(app, args)) {
        this.get_runningapps().push(app);
        args.shift();
        app.run.apply(app, args);
    }
    return app;
}.Deprecated();
SysShell.prototype.launchAppWindow = function (appClass, wndClassName, params) {
	var op = new Operation(null ,20000); // TODO: We should make this timeout configurable
	// TODO: There is a bug in after for the AsyncResult - correct it to make the timeout work
    var _shell = this;
    var _wndClassName = wndClassName || "BaseWindow";
    var app = null;
	var args = Array.createCopyOf(arguments, 2);
	var clean_args = Array.createCopyOf(arguments, 2);
    if (this.workspaceWindow != null) {
        if (!Class.is(Function.classes[appClass], "IApp")) {
            jbTrace.log("SysShell::launchAppWindow: The appClass is not registered or does not support IApp : " + appClass);
			op.CompleteOperation(false,"SysShell::launchAppWindow: The appClass is not registered or does not support IApp : " + appClass);
            return op;
        }
        if (Class.is(Function.classes[_wndClassName], "BaseWindow")) {
			var persister = new LocalStorageSettingsPersister(appClass);
			persister.set_allowmap("Pos,Size");
			persister.load();
            var w_approot = new Function.classes[_wndClassName](


				persister,
                this.workspaceWindow,
                WindowStyleFlags.draggable | WindowStyleFlags.sizable | WindowStyleFlags.adjustclient,
				// TODO: Implement defaults on the SysShell and put the fallback details there
				// TODO: We have to see which is the best way to specify prefered window template for an app. Things work
                new TemplateConnector("BindKraft/appwindowtemplate"), // The template can be overriden by the specific class and this one can be treated as fall-back
                // new TemplateConnector('BindKraftStyles/window-mainwindow'),
                //new DOMConnector(Function.classes[appClass].windowTemplate || "#appwindowtemplate"), // The template can be overriden by the specific class and this one can be treated as fall-back
                {
					on_Close: function () {
						if (app != null) {
							app.appshutdown(function (result) {
								_shell.get_runningapps().removeElement(app);
							});
						}
					},
					on_Create: new Delegate(this, this.onAViewHasBeenLoaded),
					on_Destroy: function() {
						persister.save();
					}
				},
                function (container) {
                    // Construct the app
                    app = new Function.classes[appClass]();
					container.set_approot(app);
					app.get_approotwindow = function() {
						return container;
					};
                    app.placeWindow = function(w, option) {
                        container.addChild(w);
                    };
					app.ExitApp = function() {
						w_approot.closeWindow();
					};
					container.get_iconpath = Delegate.createWrapper(app, app.get_iconpath);
					container.get_caption = Delegate.createWrapper(app, app.get_caption);
                    args.unshift(function (result) {
                        // After init
                        if (result) {
                            _shell.get_runningapps().push(app);
							app.callAsync(function() {
								if (!op.isOperationComplete()) {
									op.CompleteOperation(true,app);
								}
							});
                            app.run.apply(app, clean_args);
                        } else {
                            // Destroy window
                            container.closeWindow();
                        }
                    });

                    app.appinitialize.apply(app, args); // appinitialize(callback, arg1, arg2 ...)
					container.updateTargets();
                }
            );
        } else {
            jbTrace.log("SysShell::launchAppWindow: The wndClassName is not registered or is not a CWindoBase derived: " + wndClassName);
			op.CompleteOperation(false,"SysShell::launchAppWindow: The wndClassName is not registered or is not a CWindoBase derived: " + wndClassName);
        }
    }
	return op;
}.Description("starts an app with a single main window. Count this function deprecated. It could be reworked, but the need of that seems very limited.")
	.Deprecated();
*/
// IAppManager2 //////////////////////////////////////////////////
SysShell.prototype.launch = function(_appClass, /* callset of arguments */ appArgs) {
	var arr = [_appClass, {}];
	return this.launchEx.apply(this,arr.concat(Array.createCopyOf(arguments,1))); 
}
SysShell.prototype.launchOne = function(_appClass, /* callset of arguments */ appArgs) {
	var arr = [_appClass, {oneinstance: true}];
	return this.launchEx.apply(this,arr.concat(Array.createCopyOf(arguments,1))); 
}
/*
	_options: {
	  // Start only single instance focus existing (forced even if the app does not implement IOneInstanceApp)	
		oneinstance: true | false,
	  // LocalAPI client and server additional hubs	
		PriorityLocalAPI: <LocalAPI> | [<LocalAPI>*], // For mock APIs - checked first
		AdditionalLocalAPI: <LocalAPI> | [<LocalAPI>*], // LocalAPI available only for the lanched app - checked last
	  // LocalAPI server - register in single LocalAPI hub, but not in the LocalAPI.Default()
		RegisterInLocalAPIHub: <LocalAPI>
	}
	
	PriorityLocalAPI, AdditionalLocalAPI - Shell constructs a set of them putting the LocalAPI.Default() in the middle and initializes LocalAPIClient for
	the launched app with the list
	
	RegisterInLocalAPIHub - normaly shell registers exposed API in LocalAPI.Default(), but if this is specified and contains a LocalAPI API is registered
	there instead of the LocalAPI.Default(). Registration in multiple hubs is implemented in the code, but currently prevented (because it seems something 
	noone would want, if it proves to be a wrong assumption we will change that).
	
*/
SysShell.prototype.$launchExActive = false;
SysShell.prototype.$launchQueue = new InitializeArray("Launch requests");
SysShell.prototype.launchEx = function() {
	var args = Array.createCopyOf(arguments);
	var op = new Operation(null, 30000) // TODO make this configurable
	this.$launchQueue.push({
		args: args,
		operation: op
	});
	if (!this.$launchExActive) {
		this.$pickLaunchQueue();
	}
	return op;
}
SysShell.prototype.$pickLaunchQueue = function() {
	var me = this;
	this.$launchExActive = true;
	if (this.$launchQueue != null && this.$launchQueue.length > 0) {
		var entry = this.$launchQueue.pop();
		if (entry != null) {
			this.$launchEx.apply(this, entry.args).then(function() {
				me.$launchExActive = true;
				me.callAsync(me.$pickLaunchQueue);
			})
			.transfer(entry.operation); // TODO We should make user friendly policy for dealing with unmanageable timeouts.
			return;
		}
	}
	this.$launchExActive = false;
}
SysShell.prototype.$launchEx = function(_appClass, _options,/* callset of arguments */ appArgs) {
	var _shell = this;
	var options = _options || {};
	var op = new Operation(null , 20000); // TODO: We should make this timeout configurable
	var apiHubs = [LocalAPI.Default()]; // hubs for the api client
	var apiHubsServe = [LocalAPI.Default()]; // hubs to register in
	// TODO: (done?) There is a bug in after for the AsyncResult - correct it to make the timeout work
    
    //var _wndClassName = wndClassName || "BaseWindow";
    var app = null;
	var appClass = Class.getClassDef(_appClass);
	if (appClass == null) {
		op.CompleteOperation(false,"SysShell::launch: The appClass is not found : " + appClass);
        return op;
	}
	var args = Array.createCopyOf(arguments, 2);
	var clean_args = Array.createCopyOf(arguments, 2);
    if (this.workspaceWindow != null) {
		
		if (Class.is(appClass,"IOneInstanceApp") || options.oneinstance) {
			var oldInst = null;
			if (appClass){
				oldInst = this.getAppByClassName(appClass.classType);
			}
			if (oldInst != null) {
				if (BaseObject.is(oldInst,"IOneInstanceApp")) {
					if (oldInst.get_autoactivate()) {
						this.activateApp(oldInst);
					}
					var opOld = oldInst.newLaunchRequest.apply(oldInst,args); // Could be no args
					if (BaseObject.is(opOld,"Operation")) {
						opOld.whencomplete().complete(op, oldInst);
					} else {
						op.CompleteOperation(true, oldInst);
					}
					return op;
				} else {
					if (args.length > 0) {
						op.CompleteOperation(false, "You attempt to start an one instance app with arguments, but it does not support IOneInstanceApp and the arguments cannot be passed to the running instance");
					} else {
						this.activateApp(oldInst);
						op.CompleteOperation(true, oldInst);
					}
					return op;
				}
			}
			// If not running - just go on normally
		}
		
        if (!Class.is(appClass, "IApp")) {
			// TODO: This probably needs AppBase at least - check please!
            jbTrace.log("SysShell::launch: The appClass is not registered or does not support IApp: " + appClass);
			op.CompleteOperation(false,"SysShell::launch: The appClass is not registered or does not support IApp : " + appClass);
            return op;
        }
		prepareAPIHubs(); // Create the list of the API hubs - for API exposers
		
		var app, appgate, querybackiface;
		
		if (Class.is(appClass,"IRequiresQueryBack")) {
			// 2.18 - 2.20 (or a bit later) temporary backward compatibility
			querybackiface = new SysShellQueryBack(this,appClass);
			app = new appClass(querybackiface);
		} else {
			// Create a LocalAPIClient the new way (V: 2.18)
			appgate = new AppGate(this,createLocalAPIClient(),appClass, (apiHubsServe.length > 0)?apiHubsServe[0]:null);
			app = new appClass(appgate);
			// We need to $init the AppGate further
			//if (BaseObject.is(app,"I
		}
		
		
		
		
		
		var shuttingdownOp = null; // set to true when shutdown is first called to prevent recursion
		// Inner tools ===========
		// 1.Performs the right call to the app's windowDisplaced
		function displaceNotify(msg) {
			if (lastPlacedWindow == msg.target) lastPlacedWindow = null;
			msg.target.unregisterExternalHandler("Close",displaceNotify);
			app.windowDisplaced(msg.target);
		};
		// 2. Performs the shutdown process of an app
		function shutdownapp() {
			if (shuttingdownOp != null) {
				// shutdown in progress
				return shuttingdownOp;
			}
			// Create shutdown op
			var sop = new Operation();
			shuttingdownOp = sop;
			// call the app to revoke local API exposed by it - the app is responsible to record what it has exposed and revoke accordingly
			exposeLocalAPIs(true); // sync operation
			// Notify workspace for the shutting down
			if (_shell.shellLocalApi) _shell.shellLocalApi.appstop.invoke(app.$__instanceId, appClass);
			Messenger.Instance().post(new AppStartStopMessage(app,AppStartStopEventEnum.stop));
			// Call app's appshutdown
			var shutdownsuccess = app.appshutdown.call(app,function(success) {
				// Async return
				if (appgate != null) {
					appgate.releaseAll();
					appgate.revokeAllLocalAPI();
				}
				_shell.$dispatcherLeasing.clearInst(app); // Deprecated
				// no matter the success - remove this from the running apps
				// If we add a register for kranked zombies (apps) we can add it there n this step if it returns failure
			  _shell.get_runningapps().removeElement(app);
			  sop.CompleteOperation(true,null);
			});
			// Sync return - requires true or false explicitly
			if (shutdownsuccess === false) {
				if (appgate != null) {
					appgate.releaseAll();
					appgate.revokeAllLocalAPI();
				}
				_shell.$dispatcherLeasing.clearInst(app); // Deprecated
				// If we add a register for kranked zombies (apps) we can add it there in this step
				_shell.get_runningapps().removeElement(app);
				sop.CompleteOperation(false,"The app reported shutdown failure.");
			} else if (shutdownsuccess === true) {
				if (appgate != null) {
					appgate.releaseAll();
					appgate.revokeAllLocalAPI();
				}
				_shell.$dispatcherLeasing.clearInst(app); // Deprecated
				_shell.get_runningapps().removeElement(app);
				sop.CompleteOperation(true,null);
			}
			return sop;
		}
		// 3. Prepae local APIs
		function prepareAPIHubs() {
			var i,arr = null;
			// client hubs
			if (BaseObject.is(options.PriorityLocalAPI, "LocalAPI")) {
				arr = [options.PriorityLocalAPI];
			} else if (BaseObject.is(options.PriorityLocalAPI, "Array")) {
				arr = options.PriorityLocalAPI;
			}
			if (arr != null && arr.length > 0) {
				for (i = 0;i< arr.length;i++) {
					if (BaseObject.is(arr[i],"LocalAPI")) {
						apiHubs.unshift(arr[i]);
					}
				}
			}
			arr = null;
			if (BaseObject.is(options.AdditionalLocalAPI, "LocalAPI")) {
				arr = [options.AdditionalLocalAPI];
			} else if (BaseObject.is(options.AdditionalLocalAPI, "Array")) {
				arr = options.AdditionalLocalAPI;
			}
			if (arr != null && arr.length > 0) {
				for (i = 0;i< arr.length;i++) {
					if (BaseObject.is(arr[i],"LocalAPI")) {
						apiHubs.push(arr[i]);
					}
				}
			}
			// server hubs
			if (BaseObject.is(options.RegisterInLocalAPIHub, "LocalAPI")) {
				apiHubsServe = [options.RegisterInLocalAPIHub];
			}
		}
		// 4. acquire local APIs from the app (if supported by it)
		function exposeLocalAPIs(reg_unreg) { // exposeLocalAPIs() - register, plugLocalAPIs(true) - unregister
			var i;
			if (app.is("IImplementsLocalAPI")) {
				for (i = 0; i < apiHubsServe.length; i++) {
					if (!reg_unreg) {
						app.registerLocalAPI(apiHubsServe[i]);
					} else {
						app.revokeLocalAPI(apiHubsServe[i]);
					}
				}
			}			
		}
		// 5. DEPRECATED. Push local API client if requested (will be removed around V:2.20)
		// DEPRECATED - still supported, but you should use AppGate from BK 2.18
		// Having both will be confusing to say the least ...
		function plugLocalAPIs() {
			if (app.is("IUsingLocalAPI")) {
				var lapiclient = new LocalAPIClient(app.getLocalAPIImportDefinition(),apiHubs);
				app.setLocalAPIClient(lapiclient);
			}
		}
		// 6.Create LocalAPI for the AppGate - call after prepareAPIHubs
		function createLocalAPIClient() {
			var idata = Class.interfaceDataOf(appClass,ILocalAPIImports);
			var importTable = null;
			if (idata != null) importTable = idata.get();
			return new LocalAPIClient(importTable,apiHubs);
		}
		
		// Moving this up
		// Preparations for various actions that will be performed over the app
		// prepareAPIHubs(); // Create the list of the API hubs - for API exposers
		
		// Plug the procedures.
		args.unshift(function (result) { // Callback caled when appinitialize thinks it is finished (alternatively sync inits are handled immediately after the call - see later in this proc body)
			if (result) {
				_shell.get_runningapps().addElement(app);
				app.set_instanceid(app.$__instanceId);
				args.shift(); // restore original args - ref to this proc is no longer needed
				// call the app to expose API (only if everything else succeds)
				exposeLocalAPIs(); // sync operation
				op.CompleteOperation(true,app);
				// _shell.callAsync( function() {
					app.run.apply(app, args);
					if (_shell.shellLocalApi) _shell.shellLocalApi.appstart.invoke(app.$__instanceId, appClass);
					Messenger.Instance().post(new AppStartStopMessage(app,AppStartStopEventEnum.start));
				// });
			} else {
				op.CompleteOperation(false,"Application failed to initialize properly.");
				shutdownapp();
			}
		});
		var lastPlacedWindow = null;
		// For compatiility - does not work if the app has more than a single root window
		app.get_approotwindow = function() {
			return lastPlacedWindow;
		}
		
						
		app.placeWindow = function(w,options) {
			if (BaseObject.is(w, "BaseWindow")) {
				w.set_approot(app);
				var cust = _shell.getCustomizer("IShellCustomizerPlacer");
				if (cust != null) {
					// TODO: It will be better to relieve the apps from setting the options
					cust.placeWindow(w,options);
				} else {
					if (options != null && options.role == "shell") {
						if (typeof options.position == "string") {
							_shell.workspaceWindow.addChild(w,options.position);
						}
					} else {
						_shell.workspaceWindow.addChild(w);
					}
				}
				if (lastPlacedWindow == null) {
					lastPlacedWindow = w;
				}
				w.registerExternalHandler("Close", displaceNotify);
				w.updateTargets();
				w.activateWindow();
				_shell.workspaceWindow.updateTargets();
				
				// TODO: Set the approot!!!
				// Update?
				return true;
			} else {
				return false;
			}
		};
		app.displaceWindow = function (w, options) {
			if (BaseObject.is(w, "BaseWindow")) {
				w.unregisterExternalHandler("Close",displaceNotify);
				_shell.workspaceWindow.removeChild(w);
				return true;
			} else {
				return false;
			}
		}
		app.ExitApp = function() {
			return shutdownapp();
		}
		
		// Before initialization
		plugLocalAPIs();
		// Initiate app initialization - handled either here (sync) or in the callback unshifted in arges a bit above (async)
		var syncinitsuccess = app.appinitialize.apply(app, args);
		if (syncinitsuccess === true) {
			// If it returns synchronously : init SUCCESS
			_shell.get_runningapps().addElement(app);
			app.set_instanceid(app.$__instanceId);
			args.shift();
			// call the app to expose API (only if everything else succeds)
			exposeLocalAPIs(); // sync operation
			op.CompleteOperation(true,app);
			// this.callAsync( function() {
				app.run.apply(app, args);
				if (_shell.shellLocalApi) _shell.shellLocalApi.appstart.invoke(app.$__instanceId, appClass);
				Messenger.Instance().post(new AppStartStopMessage(app,AppStartStopEventEnum.start));
			// });
		} else if (syncinitsuccess === false) {
			op.CompleteOperation(false,app);
			shutdownapp();
		}
	} else {
		
		throw "Workspace window does not exist. Make sure you start UI applications after it is created.";
	}		
	return op;
}		
// HELPER for apps that want to accomplish this with less effort
/**
	Creates typical app main window (MainWindow) with its default template. These can be overwritten, but it is rarely needed -
	apps that use untypical main windows usually go farther than that and create them from scratch.
*/
SysShell.prototype.createStdAppWindow = function(_cls /*=MainWindo*/,_template /*=?*/,_persister /*=null*/) {
	var cls = _cls || "MainWindow";
	// TODO: Correct the default template
	var template = (BaseObject.is(_template, "Connector")?_template:null);
	var persister = _persister;
	var wnd = new Function.classes[cls](
		persister,
        WindowStyleFlags.draggable | WindowStyleFlags.sizable | WindowStyleFlags.adjustclient | WindowStyleFlags.visible,
        template,
		{
			on_Destroy: function() {
				if (persister != null) {
					persister.save();
				}
			}
		}
	);
	return wnd;
}.Description("Creates typical app main window (MainWindow) with its default template. Using the optional parameters the window class and template can be overwritten. Set unused parameters to null.")
	.Param("_cls","Window class name.Default: MainWindow")
	.Param("_template", "Connector to custom window template. By default the default template of MainWindow is used")
	.Param("_persister", "A persister for the window state - none by default")
	.Remarks("flags", "The window is created with draggable, sizable, adjustclient and visible flags.");

// This requires some fiddling...
SysShell.prototype.shutdownApp = function(appid) {
    var app = this.get_runningapps().FirstOrDefault(function(idx, item) {
        if (item.get_instanceid() == appid) return item;
        return null;
    });
    if (app != null) {
        return app.ExitApp();
	}
	return Operation.From(null);
};
SysShell.prototype.killAll = function () { // Shutdown everything
    var app, apps = Array.createCopyOf(this.get_runningapps());
    if (BaseObject.is(apps, "Array")) {
        for (var i = apps.length - 1; i >= 0; i--) {
            app = apps[i];
            if (BaseObject.is(app, "IApp")) {
				try {
                	app.appshutdown();
				} catch (e) {
					this.LASTERROR("Exception during app shutdown: " + e);
				}
            }
        }
    }
}
SysShell.prototype.addAppWindow = function(w, options) {
    if (this.workspaceWindow != null) {
        if (BaseObject.is(w, "BaseWindow")) {
            w.set_windowparent(this.workspaceWindow);
            w.setWindowStyles(WindowStyleFlags.draggable | WindowStyleFlags.visible, "set");
        } else {
            jbTrace.log("SysShell::addAppWindow: The passed object is null or not a window.");
        }
    }
};
// END APP routines for the new app mechanism
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//TODO: This does not work - revise it
SysShell.$traceconsoleview = '<div data-class="jbTrace" data-key="dbgRoot" style="height:100%;padding:0px;overflow-y:scroll;">'+
	'<pre data-key="logview" data-class="Repeater" data-bind-$items="{read}" style="margin:0px;height:100%;" data-on-dblclick="{bind source=dbgRoot path=OnClear}">' +
		'<div class="dbgEntry" data-bind-html="{read path=msg}" data-bind-jbtracecolor="{read path=msgtype}"></div>' +
	'</pre>'+
'</div>';
SysShell.prototype.console = null;
SysShell.prototype.showConsole = function() {
    if (this.console != null && this.console.get_destroyedwindow()) this.console = null;
    if (this.console == null) {
        //var wc = $("<div style=\"position:absolute;z-index:10000;border: 1px solid #FF4040;width:400px;height:400px;top:0px;left:0px;\"></div>");
        //$("#container").append(wc);
        //$("body").append(wc);
        var tmlconn = new RegisterTemplateConnector('bindkraftworkspace/window-mainwindow-app', 'module_templates');
        if (this.workspaceWindow != null) {
            this.console = new SimpleViewWindow(this.workspaceWindow, { caption: "Trace console" }, WindowStyleFlags.draggable | WindowStyleFlags.sizable | WindowStyleFlags.visible | WindowStyleFlags.adjustclient,tmlconn);
        } else {
            this.console = new SimpleViewWindow({ caption: "Trace console" }, WindowStyleFlags.draggable | WindowStyleFlags.sizable | WindowStyleFlags.visible | WindowStyleFlags.adjustclient, tmlconn);
            this.console.attachInDOM($("body"));
        }
        this.console.LoadView({ view: SysShell.$traceconsoleview, directData: {}});
        this.console.set_windowrect(new Rect(10, 10, 500, 400));
    } else {
        this.console.activateWindow();
        // Bring to top
        // this.console.
    }
};
SysShell.prototype.openAppWindow = function(className, params, closure) {
    if (this.workspaceWindow != null) {
        if (Class.is(Function.classes[className], "BaseWindow")) {
			
            var tmlconn = new RegisterTemplateConnector('bindkraftworkspace/window-mainwindow-app', 'module_templates');
            var w = new Function.classes[className](
				persister,
                this.workspaceWindow,
                WindowStyleFlags.draggable | WindowStyleFlags.sizable | WindowStyleFlags.adjustclient,
                tmlconn, // The template can be overriden by the specific class and this one can be treated as fall-back
                { 
					on_Create: new Delegate(this, this.onAViewHasBeenLoaded),
					launchParameters: params },
                closure
            );
        } else {
            jbTrace.log("SysShell::openAppWindow: The className is not registered or is not a CWindoBase derived");
        }
    }
};
SysShell.prototype.openWindowedView = function(viewParams, in_closure_or_rect) {
	var closure = Array.createCopyOf(arguments,1).FirstOrDefault(function(idx, itm) { 
		if (typeof itm == "function" || BaseObject.is(itm,"Delegate")) return itm;
		return null;
	});
	var rect = Array.createCopyOf(arguments,1).FirstOrDefault(function(idx, itm) { 
		if (BaseObject.is(itm,"Rect")) return itm;
		return null;
	});
    if (this.workspaceWindow != null) {
        var w = new SimpleViewWindow(this.workspaceWindow,
            WindowStyleFlags.draggable | WindowStyleFlags.sizable | WindowStyleFlags.adjustclient,
            new TemplateConnector('bindkraftworkspace/window-mainwindow-app'),
            BaseObject.CombineObjects(viewParams,{ on_Create: new Delegate(this, this.onAViewHasBeenLoaded) }),
            closure,
			rect
			
        );
        //w.LoadView(viewParams);
		if (rect!=null) {
			this.callAsync(function() {
				w.set_windowrect(rect);
			});
		}
        // w.set_windowrect(new Rect(10, 10, 500, 400));
    }
};
SysShell.prototype.openView = function(url, data, callback) {
    var _url, _data, _callback;
    if (typeof url == "object") {
        _url = url.url;
        _data = url.data;
        _callback = url.callback;
    } else {
        _url = url;
        _data = data;
        _callback = callback;
    }
    
	var params = { url: _url, data: _data };
	this.openWindowedView({ url: url, data: data }, _callback);
    
};
SysShell.prototype.$poscycler = 0;
SysShell.prototype.onAViewHasBeenLoaded = function(msg) {
    var rect = this.workspaceWindow.get_windowrect();
    rect.x = rect.x + rect.w * this.$poscycler/ 32;
    rect.y = rect.y + rect.h * this.$poscycler/ 32;
    rect.w = rect.w*3/4;
    rect.h = rect.h*3/4;
    msg.target.set_windowrect(rect);
    msg.target.setWindowStyles(WindowStyleFlags.visible, "set");
    WindowingMessage.fireOn(msg.target, WindowEventEnum.ActivateWindow, { });
	this.$poscycler ++;
	if (this.$poscycler > 7) this.$poscycler = 0;
};
SysShell.prototype.get_initialized = function() {
    if (this.root != null) return true;
    return false;
};
SysShell.prototype.$sysKeyBindings = function(e) {
    if (e.ctrlKey && e.altKey) {
		var fs = System.GetFS("shellfs");
		var ch = String.fromCharCode(e.which);
		var shk = fs.item("keylaunch/" + ch);
		if (shk != null) {
			var op = Commander.RunGlobal(shk.get_script());
			op.whencomplete().tell(function(_op) {
				if (!_op.isOperationSuccessful()) {
					console.log("Error executing shortcut" + ch);
				}
			});
			// alert("exists");
		}
		/*
        switch (e.which) {
        case 84:
            this.showConsole();
            break;
        case 83:
            CommandProccessor.Default.executeCommand("syslauncher");
            break;
        case 79:
            this.openWindowedView({ url: "/sbin/CardOpener.asp" });
            break;
        }
		*/
        // jbTrace.log(e.which);
    }
};

SysShell.MessageBox = function(message, title, callback, okBtn, cancelBtn,yesBtn,noBtn) {
	
}
SysShell.Alert = function (message, modaltitle, view, callback) {
    var initDialog =
        {
            url: "sbin/confirmdialog.asp", //(string, required) - the url of the data node on the server
            viewName: "normal", // (string, required) - the name of the view template to use (Normal, Minimized, Maximized)
            dialogHeight: 200, //(int, instance default if not specified) - the height of the dialog in pixels
            dialogWidth: 500, //(int, instance default if not specified) - the width of the dialog in pixels
            modal: true, // (bool, call default = true) - show as modal dialog
            resizable: false, // (bool, call default = true) - enable resizing
            title: "Warning", //(string, call default = "Loading ...") - the title of the dialog to be shown until the view loads
            directData: true, //(bool, instance default = false) - use the supplied data instead of loading data from the server
            view: view, // use client template
            data: {
                title: message,
                caption: ( modaltitle || "Warning" ),
                titleOK: "OK",
                titleCancel: "Cancel",
                isCancelVisible: false
            }
        };
        return Shell.confirmDialog(initDialog, callback);
};
