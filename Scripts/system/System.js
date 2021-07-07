 


// System core functionality.
/* File conventions
    The system part of the client framework is split into 3 files: system, main and boot.
    The system part defines core services provided over the framework functionality which are independent of the way the particular system is constructed.
    This means that the system part is unlikely to change even if the visual appearance and behavior are drastically changed - different shells, even different
    layout mechanisms. On the other hand the shell part defines more specialized classes for a particular shell concept and the boot file implements the system construction.
    The boot is obviously application specific, while the shell is not necessarily and it is possible to create another system with a completely different shell.
*/
/* SPECIALIZATION
    The System class may and will vary from system to system. Additional methods and properties can be defined, but this
    SHOULD be done in the conf file where all the framework specialization is implemented. They SHOLD be grouped in a single place in that file
    to help keeping the track of the specializations and additions. For example the security architecture will differe among systems and
    any role/group/user specific additions on system level SHOULD be implemented in the conf file.
*/
/*CLASS*/
function System() {
    BaseObject.apply(this, arguments);
    if (window.addEventListener) {
        window.addEventListener("beforeunload", Delegate.createWrapper(this, this.$onbeforeunload));
        window.addEventListener("unload", Delegate.createWrapper(this, this.$onunload));
    } else {
        window.onbeforeunload = Delegate.createWrapper(this, this.$onbeforeunload);
        window.onunload = Delegate.createWrapper(this, this.$onunload);
    }
    this.loadSystemSettings();
};
System.Inherit(BaseObject, "System");
System.ImplementProperty('workspaceName', new InitializeStringParameter('', 'Unnamed Workspace - please set in init.js'));
System.Default = (function () {
	var $instance = null;
	return function() {
		if ($instance == null) {
			$instance = new System();
		}
		return $instance;
	}
})();
System.prototype.rejectwindowunload = false;
System.prototype.rejectwindowunloadmessages = null;
System.prototype.windowunloadevent = new InitializeEvent('It will combine the Browser beforeunload event');
System.prototype.shutdownevent = new InitializeEvent("Fired after windowunloadevent if the shutdown has not been cancelled by a handler. Unload/Uninit should be done here and NOT in handlers of windowunloadevent.");
System.prototype.$onbeforeunload = function (e) {
    this.rejectwindowunload = false;
    this.rejectwindowunloadmessages = [];
    SettingsPersister.disablePersistence(true);
    this.windowunloadevent.invoke(this, e);
    if (this.rejectwindowunload === true) {
        this.rejectwindowunload = false;
        var str = "";
        if (BaseObject.is(this.rejectwindowunloadmessages, "Array")) {
            for (var i = 0; i < this.rejectwindowunloadmessages.length; i++) {
                if (this.rejectwindowunloadmessages[i] != null && this.rejectwindowunloadmessages[i].length > 0) {
                    str += this.rejectwindowunloadmessages[i] + "\n";
                }
            }
        }
        if (str.length == 0) str = "Do you really want to close this browser window/tab?";
        SettingsPersister.disablePersistence(false);
        return str;
    }
    this.rejectwindowunload = false;
    // this.shutdownevent.invoke(this, e); // Last event in the browser window's lifecycle
    // $(document).Empty();
};
System.prototype.$onunload = function (e) {
    SettingsPersister.disablePersistence(true);
    this.shutdownevent.invoke(this, e); // Last event in the browser window's lifecycle
    $(document).Empty();
};
// System settings
System.prototype.settings = null;
System.prototype.get_settings = function (idx, defaultValue) {
    if (idx == null) return this.settings;
    return BaseObject.getProperty(this.settings, idx, defaultValue);
};
System.prototype.set_settings = function (idx, v) {
    if (arguments.length > 1) {
        BaseObject.setProperty(this.settings, idx, v);
    } else {
        this.settings = idx;
    }
};
System.showLoadingIndicator = function (domEl, kind) { System.Default().$showLoadingIndicator(domEl, kind); };
System.prototype.$showLoadingIndicator = function (domEl, kind) {
    var el = $(domEl);
    if (el != null && el.length > 0) {
        var hid = ((kind != null) ? kind : "default");
        var ind = this.get_settings("LoadingIndicator");
        if (ind != null && ind[hid] != null && ind[hid].length > 0) {
            ind = $(ind[hid]).html();
        }
        if (ind != null && ind.length > 0) {
            el.html(ind);
        }
    }
};
// Load system configuration - stub. Override in the conf (recommended) or the boot file to load the system settings as appropriate for the system.
// Preliminary defaults are loaded in sysconfig.js, this method is no longer used and is kept only to prevent failures of code that may still call it
/*virtual*/ System.prototype.loadSystemSettings = function () {
    this.settings = {
        workspaceElement: "#container"
    };
};
System.prototype.getWorkspaceElement = function() {
    return DOMUtil.findElement(document, this.settings.workspaceElement);
}
System.prototype.setWorkspaceElement = function(selector) {
    this.set_settings("workspaceElement", selector || "#container");
}

System.getCounterNames = function () {
	var elements = [], idx = 0;
	for ( var prop in DIAGNOSTICS )
	{
		elements.push ( {id:idx,value:prop} );
		idx++;
	}
	
	return elements;
};

System.showCounter = function ( name ) {
	if (typeof DIAGNOSTICS[name] === 'object') {
		return ( DIAGNOSTICS[name] || null );
	} else {
		var tmp = {};
		tmp [ name ] = DIAGNOSTICS[name];
		return tmp;
	}
};

System.prototype.$iframes = null;
System.prototype.$iframes_refs = 0;
System.prototype.hideIFrames = function () {
    if (!window.g_ie8) return;
    if (this.$iframes == null) {
        this.$iframes = $("iframe:visible");
        if (this.$iframes != null && this.$iframes.length > 0) {
            this.$iframes.hide();
            this.$iframes_refs = 1;
        } else {
            this.$iframes = null;
            this.$iframes_refs = 0;
        }
    } else {
        if (this.$iframes_refs > 0) {
            this.$iframes_refs++;
        } else {
            this.$iframes_refs = 1;
        }
    }
};
System.prototype.showIFrames = function (forceShow) {
    if (!window.g_ie8) return;
    if (forceShow) {
        if (this.$iframes != null) {
            this.$iframes.show();
        }
        this.$iframes = null;
        this.$iframes_refs = 0;
    } else {
        // Normal show
        if (this.$iframes != null) {
            if (this.$iframes_refs > 0) {
                this.$iframes_refs--;
            } else {
                this.$iframes_refs = 0;
            }
            if (this.$iframes_refs <= 0) {
                this.$iframes.show();
                this.$iframes = null;
                this.$iframes_refs = 0;
            }
        } else {
            this.$iframes_refs = 0;
        }
    }
};
System.prototype.warningViewTemplate = null;
System.prototype.closing = false;
System.CommandLibs = {};


// Accessor for file systems
System.FS = function(fsname) {
	if (!Registers.Default().registerExists(fsname)) {
		throw "The memory 'file system' " + fsname + " is not mounted";
	}
	var fs = Registers.Default().getRegister(fsname);
	return fs;
}

// Deprecated - these will be removed in the middle of 2019, use BKInit set of classes for init.js stuff
// Global static attachments for helpers and accessors
System.BootFS = function() {
	return new CLMemoryFSHelper(Registers.Default().getRegister("bootfs"));
}
System.GlobalCommands = function() {
	return new CLGlobalCmdHelper(CommandReg.Global());
}
System.GlobalEnvironment = function() {
	return new CLGlobalEnvHelper(EnvironmentContext.Global());
}
System.ShellShortcuts = function() {
	return new CLShortcutsHelper(Registers.Default().getRegister("shellfs"));
}
System.GetFS = function(_fs) {
	var fs = Registers.Default().getRegister(_fs);
	if (BaseObject.is(fs,"MemoryFSDirectory")) return fs;
	return null;
}
System.RecentShortcuts = function () {
	var fs = Registers.Default().getRegister("shellfs");
	var rc = fs.mkdir("recent");
	return new CLRecentShortcuts(rc);
}