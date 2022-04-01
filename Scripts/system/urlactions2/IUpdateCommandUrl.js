(function() {


    /**
     * In contrast to the older url command support interface this one takes into account that the generation of an URL can
     * be multi step process and allows an input URL.
     */
    function IUpdateCommandUrl() {}
    IUpdateCommandUrl.Interface("IUpdateCommandUrl");

    /**
     * Updates or creates an URL with the parameters necessary for on load command execution. For multiple commands call this
     * method multiple times with the result of the previous call.
     * 
     * @param {BKUrl|string} inurl - optional url to update. If missing BKUrl.getBasePathAsUrl() is used as starting point.
     * @param {string} command - the name of the registered script to execute from this url.
     * @param {object} vars - object containing parameters for the command.
     */
    IUpdateCommandUrl.prototype.updateUrl = function(inurl, command, vars) { throw "not implemented"; }

})();