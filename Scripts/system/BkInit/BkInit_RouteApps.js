(function(){

    var MemFSTools = Class("MemFSTools");

    /**
     */
    function BkInit_RouteApps() {
        BaseObject.apply(this, arguments);
        this.tools = new MemFSTools();
    }
    BkInit_RunFromUrl.Inherit(BaseObject, "BkInit_RouteApps");

    /**
     * Sets the name of the query string parameter containing the list of registered commands to run.
     * @param {string} name - the name
     */
    BkInit_RouteApps.prototype.setRootPart = function(name) { 
        var pf = this.tools.openFile("appfs:/system/routes/settings");
        pf.setProp("root", name);
        return this;
    }
    BkInit_RouteApps.prototype.register = function(appalias, appclass,settings) {
        var pf = this.tools.openFile("appfs:/system/routes/settings");
        var dir = this.tools.openDir("appfs:/system/routes/apps");
        var appClassName = Class.getClassName(appclass);
        var appClass = Class.getClassDef(appclass);
        if (Class.is(appClass,"IAppRouter")) {
            if (typeof appClass.getStateMap != "function") {
                throw appClassName + " is registered for routing and supports IAppRouter interface, but does not implement getStateMap static method";
            }
            var tree = appClass.getStateMap();
            if (!BaseObject.is(tree, "TreeStates")) {
                throw appClassName + ".getStateMap does not return TreeStates instance";
            }
            // All ok
            var appf = new PropertySetMemoryFile();
            appf.setProp("alias",appalias);
            appf.setProp("class",appClassName);
            if (settings != null && typeof settings == "object") {
                for (var k in settings) {
                    if (k != "alias" && k != "class") {
                        appf.setProp(k, settings[k]);
                    }
                }
            }
            dir.register(appClassName, appf);
            return this;
        } else {
            throw "Cannot register for routing the app " + appClassName + ", it does not implement IAppRouter";
        }
    }
    BkInit_RouteApps.prototype.clear = function() {
        var dir = this.tools.openDir("appfs:/system/routes/apps");
        dir.clear();
        return this;

    }
})();