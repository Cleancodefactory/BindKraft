(function(){

    var MemFSTools = Class("MemFSTools");

    /**
     */
    function BkInit_RouteApps() {
        BaseObject.apply(this, arguments);
        this.tools = new MemFSTools();
    }
    BkInit_RouteApps.Inherit(BaseObject, "BkInit_RouteApps");
    /**
     * Sets the class of the system serializer, it must be appropriate for URL generation
     * Each app can use for internal convenience a serializer and theoretically it is possible
     * to have some serializers implementing ITreeStatesSerializer, but generating representation 
     * incompatible or at least inconvenient for inclusion in URL path part that is fine for 
     * internal navigation in the app.
     * @param {string|def(ITreeStatesSerializer)} serializer - serializer class or class name to use 
     * to decode routes from/to URL. Recommended is class name as string. Defaultserializer is TreeStatesStringSerializer.
     * 
     * It is not a good idea to change the serializer of a deployed project, this will break any previously recorded URL
     */
    BkInit_RouteApps.prototype.setSerializer = function(serializer) {
        var pf = this.tools.openFile("appfs:/system/routes/settings");
        var serClassName = Class.getClassName(serializer);
        pf.setProp("serializer", serClassName);
        return this;
    }
    /**
     * Sets the name of the query string parameter containing the list of registered commands to run.
     * @param {string} name - the name
     */
    BkInit_RouteApps.prototype.setRootPart = function(name) { 
        var pf = this.tools.openFile("appfs:/system/routes/settings");
        pf.setProp("root", name);
        return this;
    }
    BkInit_RouteApps.prototype.registerHome = function(script) {
        var pf = this.tools.openFile("appfs:/system/routes/settings");
        pf.setProp("homescript", script);
        return this;
    }
    /**
     * /nav/<appalias>/<...app_state_route...> 
     * @param {string} appalias 
     * @param {string} appclass - name of the app class
     * @param {object} settings - an object with various settings one per property
     * Supported settings:
     * script - string, a script which is called each time the app needs to be started/focused, parameters:
     *      appclass - class name,routeObjects- array<object> object set to route to,route - as string with the system serializer
     * default - boolean, if true the default routing behavior is applied (script should be mmissing)
     * @returns 
     */
    BkInit_RouteApps.prototype.register = function(appalias, appclass,settings) {
        var pf = this.tools.openFile("appfs:/system/routes/settings");
        var dir = this.tools.openDir("appfs:/system/routes/apps/");
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