(function(){

    var IUpdateCommandUrl = Interface("IUpdateCommandUrl");

    /**
     * Implements the two sides of the Url actions2 feature:
     *  - URL generation (actually update)
     *  - Extraction and execution of detected commands in an URL
     */
    function UrlActions2Service() {
        BaseObject.apply(this, arguments);
        this.$loadRegistrations();
    }
    UrlActions2Service.Inherit(BaseObject, "UrlActions2Service")
        .Implement(IUpdateCommandUrl);

    //#region Tools
    UrlActions2Service.prototype.$registrations = null;
    UrlActions2Service.prototype.$loadRegistrations = function() { 
        var fsh = new MemFSTools();
        var f = fsh.openFile("appfs:/system/urlcommands2/commands");
        if (BaseObject.is(f,"PropertySetMemoryFile")) {
            this.$registrations = f;
            return true;
        }
        return false;
    }
    UrlActions2Service.prototype.$getReg = function(alias) { 
        if (this.$registrations != null) { 
            return this.$registrations.getProp(alias);
        }
        return null;
    }
    //#endregion

    //#region IUpdateCommandUrl
    UrlActions2Service.prototype.updateUrl = function(inurl, command, vars) { 

    }
    //#endregion

})();