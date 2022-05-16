(function(){

    var IUpdateCommandUrl = Interface("IUpdateCommandUrl");

    /**
     * Implements the two sides of the Url actions2 feature:
     *  - URL generation (actually update)
     *  - Extraction and execution of detected commands in an URL
     */
    function UrlActionsService2() {
        BaseObject.apply(this, arguments);
        this.$loadRegistrations();
    }
    UrlActionsService2.Inherit(BaseObject, "UrlActionsService2")
        .Implement(IUpdateCommandUrl);

    //#region Tools
    UrlActionsService2.prototype.$registrations = null;
    UrlActionsService2.prototype.$loadRunName = function() { 
        var fsh = new MemFSTools();
        var pf = fsh.openFile("appfs:/system/urlcommands2/settings");
        if (BaseObject.is(pf, "PropertySetMemoryFile" )) {
            this.$runname = pf.getProp("run");
        } else {
            return false;
        }
    }
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
        if (reg != null) {
            var url = inurl;
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
        
        return url;
    }
    UrlActionsService2.prototype.isRegistered = function(command) { 
        return (this.getReg(command) != null);
    }


    //#endregion

    //#region Command execution
    UrlActionsService2.prototype.runCommand = function(url, command) {
        var reg = this.getReg(command);
        if (reg != null) {
            if (BaseObject.is(url, "BKUrl")) {
                ///////////////////////

            } else {
                this.LASTERROR("No BKUrl was passed while calling for " + command, "runCommand");
                return Operation.Failed("No url (BKUrl) given to the runCommand");        
            }
        }
        return Operation.Failed("No registration for the command: " + command);
    }
    
    //#endregion

})();