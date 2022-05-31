(function(){

    var IUpdateCommandUrl = Interface("IUpdateCommandUrl"),
        MemFSTools = Class("MemFSTools");

    /**
     * Implements the two sides of the Url actions2 feature:
     *  - URL generation (actually update)
     *  - Extraction and execution of detected commands in an URL
     */
    function UrlActionsService2() {
        BaseObject.apply(this, arguments);
        if (!this.$loadRunName()) {
            this.LASTERROR("No run name daclared for urlcommands2", "constructor");
        };
        if (!this.$loadRegistrations()) {
            this.LASTERROR("Cannot load runurlcommnds2 registrations", "constructor");
        };
    }
    UrlActionsService2.Inherit(BaseObject, "UrlActionsService2")
        .Implement(IUpdateCommandUrl);

    //#region Tools
    UrlActionsService2.prototype.$runname = null;
    UrlActionsService2.prototype.$loadRunName = function() { 
        var fsh = new MemFSTools();
        var pf = fsh.openFile("appfs:/system/urlcommands2/settings");
        if (BaseObject.is(pf, "PropertySetMemoryFile" )) {
            this.$runname = pf.getProp("run");
            return true;
        } else {
            return false;
        }
    }
    UrlActionsService2.prototype.$registrations = null;
    UrlActionsService2.prototype.$loadRegistrations = function() { 
        var fsh = new MemFSTools();
        var f = fsh.openFile("appfs:/system/urlcommands2/commands");
        if (BaseObject.is(f,"PropertySetMemoryFile")) {
            this.$registrations = f;
            return true;
        }
        return false;
    }
    /**
     * Gets the registration from the system property set file
     */
    UrlActionsService2.prototype.$getReg = function(alias) { 
        if (this.$registrations != null) { 
            return this.$registrations.getProp(alias);
        }
        return null;
    }
    //#endregion

    //#region IUpdateCommandUrl
    /**
     * Updates the given URL with the command and the specified parameters.
     * Will ignore any vars not specified in the registrations. This is silent because sometimes a registration
     * can be removed by upper module on purpose and the apps creating URL should not be forced to deal with that.
     * 
     * @param {BKUrl} inurl - The URL to update
     * @param {string} command - The command to add to the URL. A command can be added multiple times - this is useful sometimes, but
     *                          may be unexpected.
     * @param {object} vars - Values for the registered command parameters.
     * @returns 
     */
    UrlActionsService2.prototype.updateUrl = function(inurl, command, vars) { 
        var reg = this.$getReg(command);
        var mode = false;
        if (reg != null) {
            var url = inurl;
            if (typeof inurl == "string") {
                url = new BKUrl(inurl);
                mode = true;
            }
            if (!BaseObject.is(url, "BKUrl")) {
                url = BKUrl.getInitialBaseUrl();
            }
            var qry = url.get_query();
            var runlist = qry.get(this.$runname); // Array
            runlist.push(command);
            qry.set(this.$runname,runlist.toString());

            if (vars != null) {
                var qry = url.get_query();
                for (var k in vars) {
                    if (reg.indexOf(k) >= 0) {
                        qry.set(command + "." + k, vars[k]);
                    }
                    // Unmatched vars are ignored
                }
            }
        }
        if (mode) {
            return url.toString();
        } else {
            return url;
        }
    }
    UrlActionsService2.prototype.isRegistered = function(command) { 
        return (this.getReg(command) != null);
    }


    //#endregion

    //#region Command execution
    UrlActionsService2.prototype.runCommandsFromUrl = function(url) {
        var fsh = new MemFSTools();
        if (!BaseObject.is(url, "BKUrl")) {
            return Operation.Failed("BKUrl required");
        }
        var commands = fsh.openFile("appfs:/system/urlcommands2/commands");
        var op = new Operation("runCommandsFromUrl");
        if (BaseObject.is(commands, "PropertySetMemoryFile")) {
            // Get the list of scripts to execute
            var runScripts = url.get_query().get(this.$runname);
            if (runScripts.length > 0) {
                var s = runScripts.join(",");
                this.$runCommands(op, s.split(","), url);
            } else {
                op.CompleteOperation(true, null); // No scripts to execute
            }
        } else {
            op.CompleteOperation(false, "appfs:/system/urlcommands2/commands does not exist or does not contain registrations");
        }
        return op;
    }
    /**
     * Cycless through all the script executions
     * @param {*} op 
     * @param {*} arrScriptNames 
     */
    UrlActionsService2.prototype.$runCommands = function(op, arrScriptNames, url) {
        var fsh = new MemFSTools();
        var scripts = fsh.openDir("appfs:/system/urlcommands2/scripts");
        var me = this;
        var script; // script name
        
        function _step() {
            script = arrScriptNames.shift();
            if (script == null) {
                // Finished
                // TODO Consider failing the entire execution for some reasons.
                op.CompleteOperation(true, null);
                return;
            }
            _do();
        }
        function _do() {
            var f = scripts.item(script);
            me.$runCommand(script, url, f)
                .onsuccess(function(r) {
                    // TODO Log success - where?
                })
                .onfailure(function(e) {
                    // Log error
                    me.LASTERROR("Command " + script + " reported failure: " + e, "$runCommands");
                })
                .then(_step);
        }
        _step();

    }
    /**
     * Internal function running a single command (will not check the list of commands to run this must be done by the caller)
     * @param {BKUrl} url
     * @param {file} script
     */
    UrlActionsService2.prototype.$runCommand = function(command, url, script) {
        if (!BaseObject.is(script,"CLScript")) {
            return Operation.Failed("script is missing or is unsupported format");
        }
        var qry = url.get_query();
        var reg = this.$getReg(command);
        var v;
        if (reg != null) {
            if (BaseObject.is(url, "BKUrl")) {
                // Prepare constants for the script
                var consts = {};
                if (Array.isArray(reg)) {
                    for (var i = 0; i < reg.length; i++) {
                        if (typeof(reg[i] == "string")) {
                            v = qry.get(command + "." + reg[i]);
                            if (Array.isArray(v)) {
                                consts[reg[i]] = v.toString();
                            } else {
                                consts[reg[i]] = null;
                            }
                        }
                    }
                }
                // Prepare for execution
                return script.run(null, consts);
            } else {
                this.LASTERROR("No BKUrl was passed while calling for " + command, "runCommand");
                return Operation.Failed("No url (BKUrl) given to the runCommand");        
            }
        }
        return Operation.Failed("No registration for the command: " + command);
    }
    
    //#endregion

    //#region Local API registration
    UrlActionsService2.Default = (function() {
        var instance = null;
        var regCookie = null;
        return function() {
            if (instance == null) {
                instance = new UrlActionsService2();
                regCookie = LocalAPI.Default().registerAPI ("IUpdateCommandUrl", instance);
            }
            return instance;
        };
    })();
    //#endregion

})();