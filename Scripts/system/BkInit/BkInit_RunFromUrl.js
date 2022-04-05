(function(){

    var MemFSTools = Class("MemFSTools");


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
    BkInit_RunFromUrl.prototype.addRunScript = function(name, script) { 
        var pf = this.tools.openFile("appfs:/system/urlcommands2/commands");
        pf.setProp(name,[]);
        
    }


})();