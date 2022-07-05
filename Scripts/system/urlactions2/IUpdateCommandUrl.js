(function() {


    /**
     * In contrast to the older url command support interface this one takes into account that the generation of an URL can
     * be multi step process and allows an input URL.
     */
    function IUpdateCommandUrl() {}
    IUpdateCommandUrl.Interface("IUpdateCommandUrl","IManagedInterface");

    /**
     * Updates or creates an URL with the parameters necessary for on load command execution. For multiple commands call this
     * method multiple times with the result of the previous call.
     * 
     * @param {BKUrl|string} inurl - optional url to update. If missing BKUrl.getBasePathAsUrl() is used as starting point.
     * @param {string} command - the name of the registered script to execute from this url.
     * @param {object} vars - object containing parameters for the command.
     */
    IUpdateCommandUrl.prototype.updateUrl = function(inurl, command, vars) { throw "not implemented"; }

    /**
     * It is cleaner to check for registration before generating URL, because this is usually part of generation of a UI or message
     * giving to an user URL that does something on open. If the registration does not exist it will not work and the user will be confused.
     * While the updating (updateUrl method) should be implemented to silently do nothing in that case, the lack of registration has consequences and
     * in many cases will lead to showing/sending misleading information to an user or even lists of users. It is strongly suggested to make such 
     * functionality dependent on the registration's existence.
     * 
     * @param {string} command - the name of the command to check.
     *
     * @return {boolean} - true if the command is registered.
     */
    IUpdateCommandUrl.prototype.isRegistered = function(command) { throw "not implemented"; }

    IUpdateCommandUrl.prototype.copyToRedirectUrl = function(url) { throw "not implemented"; }

})();