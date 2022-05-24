(function(){

    var MemFSTools = Class("MemFSTools");

    /**
     * init.js tool for second version of URL commands - commands executed from URL query parameters.
     * 
     * BASICS
     * 
     * All settings and scripts are saved in appfs:/system/urlcommands2
     * Property file: settings
     *      "run" - the name of the query string parameter specifying the list of commands to execute
     * Property file: commands
     *      A property with the name of the file (see below) is registered with an array of the names of the 
     *      parameters it needs. No type conversion - they come as strings the script has to deal with this.
     * The script file itself is CLScript saved int the appfs:/system/urlcommands2 directory under the same 
     * name under which it is registered.
     * 
     * When the workspace is loading runfromurl command will invoke all the scripts found in the run parameter
     * (see setRunName) in the order specified, each command will receive the registered parameters additional_constants.
     * Their values will be extracted from query string parameters named name.parameter where the name is the name
     * of the script and parameter is one of the registered parameter names. Any missing parameters will be null.
     * Each script will start in the global context.
     */
    function BkInit_RunFromUrl() {
        BaseObject.apply(this, arguments);
        this.tools = new MemFSTools();
    }
    BkInit_RunFromUrl.Inherit(BaseObject, "BkInit_RunFromUrl");

    /**
     * Sets the name of the query string parameter containing the list of registered commands to run.
     * @param {string} name - the name
     */
    BkInit_RunFromUrl.prototype.setRunName = function(name) { 
        var pf = this.tools.openFile("appfs:/system/urlcommands2/settings");
        pf.setProp("run", name);
        return this;
    }
    /**
     * Registers a script for running from URL. It both registers the script and creates the script file.
     * 
     * @param {string} name - the name of the script in the appfs:/system/urlcommands2/scripts directory
     * @param {Array<string>|string} params - the names of the parameters the script consumes. Can be a single string if the parameter is just one
     * @param {string} script - the script itself
     * 
     * @return {BkInit_RunFromUrl} - this
     */
    BkInit_RunFromUrl.prototype.addRunScript = function(name, params, script) { 
        var pf = this.tools.openFile("appfs:/system/urlcommands2/commands");
        if (typeof params == "string") {
            params = [params];
        } else if (!Array.isArray(params)) {
            params = [];
        }
        pf.setProp(name,params);
        var dir = this.tools.openDir("appfs:/system/urlcommands2/scripts");
        var script = new CLScript(script);
        if (!dir.register(name, script)) {
            throw new Error("BkInit_RunFromUrl: Cannot save script " + name + " in appfs:/system/urlcommands2/scripts");
        };
        return this;
    }
    /**
     * Clears all URL script registrations. Useful if one wants to override all the settings coming from various modules
     * and register everything anew.
     *  @return {BkInit_RunFromUrl} - this
     */
    BkInit_RunFromUrl.prototype.clearAllScripts = function() {
        var dir = this.tools.openDir("appfs:/system/urlcommands2");
        f = new PropertySetMemoryFile();
		// appfs:/system/urlmmands2/commands
		dir.register("commands", f); // Overwrite with an empty file.
        dir = this.tools.openDir("appfs:/system/urlcommands2/scripts");
        // Remove everything in the directory
        dir.clear();
        return this;

    }
})();