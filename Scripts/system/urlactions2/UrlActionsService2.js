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
    UrlActionsService2.prototype.updateUrl = function(inurl, command, vars) { 
        var reg = this.$getReg(command);
        if (reg != null) {
            var url = inurl;
            if (!BaseObject.is(url, "BKUrl")) {
                url = BKUrl.getInitialBaseUrl();
            }
            if (vars != null) {
                var qry = url.get_query();
                for (var k in vars) {
                    qry.set(command + "." + k, vars[k]);
                }
            }
        }

        return null;
    }
    //#endregion

    //#region Command execution
    
    //#endregion

})();