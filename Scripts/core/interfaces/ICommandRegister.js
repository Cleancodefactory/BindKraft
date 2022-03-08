(function() { 

    /**
     * Interface for the command registers. Command registers allow registration of commands by passing
     * command pieces (name, alias, action etc.) or by registering a CommandDescriptor object.
     */

    function ICommandRegister() {}
    ICommandRegister.Interface("ICommandRegister");

    /**
     * For tracing and debugging purposes. Returns a string identifying the "owner" of the command register
     */
    ICommandRegister.prototype.ownerString = function() {throw "not implemented";}
    /**
     * Checks if command is registered with this register.
     * 
     * @param {string|CommandDescriptor} cmd_or_name - command to check for. Alias or command name can be used.
     */
    ICommandRegister.prototype.exists = function(cmd_or_name) {throw "not implemented";}
    /**
     * Gets the command queried
     * 
     * @param {string|CommandDescriptor} cmd_or_name - command to get.
     */
    ICommandRegister.prototype.get = function(cmd_or_name) {throw "not implemented";}
    /**
     * Finds and if found returns the command
     * @param {string} token - the token to analyse or just command name/alias
     * @param {object} meta - options defining how to recognize the command (not all languages use this to the full extent)
     */
    ICommandRegister.prototype.find = function(token, meta) {throw "not implemented";}
    ICommandRegister.prototype.register = function(command, alias, regexp, action, help, bOverride) {throw "not implemented";}
    ICommandRegister.prototype.unregister = function(command) {throw "not implemented";}
})();