(function() {
    var MemFSTools = Class("MemFSTools"),
            CLRun = Class("CLRun"),
            AppStdArgs = Enumeration("AppStdArgs");
    function derootpath(path) {
        if (typeof path != "string" || path.length == 0) return path;
        if (path.charAt(0) == "/") {
            return path.slice(1);
        }
        return path;
    }

    function SysRouter() {
        BaseObject.apply(this, arguments);
        this.$loadRoutingData();
    }
    SysRouter.Inherit(BaseObject,"SysRouter");

    SysRouter.prototype.$root = null; // loaded from the settings (default in sysconfig.js)
    SysRouter.prototype.$apps = null; // loaded from the appfs:system/routes/apps directory (default in sysconfig.js)
    SysRouter.prototype.$seralizer = null; // Serializer instance

    SysRouter.prototype.$loadRoutingData = function() {
        var register = {};
        var fs = new MemFSTools();
        var pf = fs.openFile("appfs:/system/routes/settings");
        this.$root = pf.getProp("root");
        var serClassName = pf.getProp("serializer");
        var serCls = Class.getClassDef(serClassName);
        if (!Class.is(serCls,"ITreeStatesSerializer")) {
            throw "System route serializer is misconfigured or the specified class is not available/not ITreeStatesSerializer:" + serClassName;
        }
        this.$seralizer = new serCls();
        var dir = fs.openDir("appfs:/system/routes/apps/");
        var _routes = dir.get_contents();
        var o, cls;
        for (var i = 0; i< _routes.length; i ++) {
            var routepf = _routes[i];
            if (BaseObject.is(routepf.value, "PropertySetMemoryFile")) {
                var pf = routepf.value; 
                o = pf.getProps();
                if (typeof o.alias != "string") {
                    this.LASTERROR("Routing registration (" + routepf.key + ") has no alias entry");
                    continue;
                }
                if (typeof o["class"] != "string" || !Class.is(o["class"],"IAppRouter")) {
                    this.LASTERROR("Routing registration (" + routepf.key + ") has no app class or it is not implementing IAppRouter");
                    continue;
                }
                // Load statemap
                cls = Class.getClassDef(o["class"]);
                o.__treeStates = cls.getStateMap();
                register[o.alias] = o;
            } else {
                this.LASTERROR("route file (" + routepf.key + ") is not a PropertySetMemoryFile");
            }
        }
        this.$apps = register;
    }
    SysRouter.prototype.getByAlias = function(alias) {
        return this.$apps[alias];
    }
    SysRouter.prototype.findByAppInstance = function(inst) {
        if (BaseObject.is(inst,"IApp")) {
            var def = inst.classDefinition(inst);
            return this.findByApp(def);
        }
        return null;        
    }
    SysRouter.prototype.findByApp = function(appClass) {
        var clsName = Class.getClassName(appClass);
        for( var k in this.$apps) {
            var o = this.$apps[k];
            if (o["class"] == clsName) {
                return o;
            }
        }
        return null;
    }
    /**
     * 
     * @param {*} app 
     * //TODO We will deal with proxies later or avoid it
     */
    SysRouter.prototype.getAppRoute = function(app) {
        if (BaseObject.is(app,"IApp") && BaseObject.is(app,"IAppRouter")) {
            var appCfg = this.findByAppInstance(app);
            if (appCfg != null) {
                var ts = appCfg.__treeStates;
                var objstate = app.currentTreeState();
                var linear = ts.linearize(objstate);
                return this.$seralizer.encodeFromLinear(this.$root + "/" + appCfg.alias, linear);
            }
        }
        return null;
    }
    SysRouter.prototype.getRouteFromURL = function(url) {
        var bkurl = null;
        if (BaseObject.is(url,"string")) {
            bkurl = new BKUrl(url);
        } else if (BaseObject.is(url,"BKUrl")) {
            bkurl = url;
        }
        if (bkurl != null && !bkurl.get_isempty()) {
            return derootpath(bkurl.get_path().composeAsString());
        }
        return null;
    }
    SysRouter.prototype.execRootScript = function() {
        var fs = new MemFSTools();
        var pf = fs.openFile("appfs:/system/routes/settings");
        var scr = pf.getProp("homescript");
        if (typeof scr == "string") {
            if (Class.is(scr,"IApp")) {
                return Shell.launchOne(scr,AppStdArgs.skipInitialRoute);
            } else {
                return CLRun.RunGlobal(scr);
            }
        }
        this.LASTERROR("Check yout registerHome in BKInit.Routing, homescript is not a script or app class.")
        return Operation.Failed("homescript is not a string");
    }
    /** /nav/appalias
     * 
     * @param {*} rt 
     * @returns 
     */
    SysRouter.prototype.applyRoute = function(rt) {
        var appcfg = null;
        var appcls = null;
        var route = null; // in app route string
        var runHome = false;
        if (typeof rt == "string") {
            var arr = rt.split("/");
            return this.applyRoute(arr);
        } else if (Array.isArray(rt)) {
            if (rt.length > 0) {
                if (rt[0] == this.$root) {
                    rt.shift();
                    if (rt.length == 0) runHome = true;
                }
                if (rt.length > 0) {
                    appcfg = this.getByAlias(rt[0]);
                    if (appcfg != null) {
                        route = Array.createCopyOf(rt,1).join("/");
                        appcls = appcfg["class"];
                        if (typeof appcls != "string") {
                            this.LASTERROR("class is not given to the app alias" + rt[0]);
                            return Operation.Failed(this.LASTERROR.text); 
                        }
                        appcls = Class.getClassDef(appcls);
                        if (appcls == null || !Class.is(appcls,"IAppRouter")) {
                            this.LASTERROR("App class is not found or not IAppRoter for alias " + rt[0]);
                            return Operation.Failed(this.LASTERROR.text); 
                        }
                    }
                }
            } else {
                runHome = true;
            }
        } else if (BaseObject.is(rt,"BKUrl")) {
            var bkpath = rt.get_path();
            return this.applyRoute(bkpath);
        } else if (BaseObject.is(rt, "BKUrlPath")) {
            var segments = rt.get_allsegments();
            return this.applyRoute(segments);
        }
        if (appcfg != null && appcls != null) { // Something to do
                // There is route
            var linear = this.$seralizer.parseToLinear(route);
            if (linear) {
                var objset = appcfg.__treeStates.delinearize(linear);
                if (objset == null && linear.length > 0) return Operation.Failed("route not found");
                if (typeof appcfg.script == "string") {
                    var runner = new CLRun(appcfg.script);
                    return runner.run({appclass: appcls,routeObjects: objset, route: route});
                } else if (appcfg.default) {
                    var app = Shell.getAppByClassName(appcls);
                    if (app != null) {// running
                        if (app.canOpenTreeState(objset)) {
                            app.routeTreeState(objset);
                            Shell.activateApp(app);
                            return Operation.From(true,route); // TODO check    
                        } else {
                            var op = new Operation("Routing");
                            Shell.launch(appcls,AppStdArgs.skipInitialRoute)
                                .onsuccess(function(a) {
                                    a.routeTreeState(objset);
                                    op.CompleteOperation(true,route);
                                });
                            return op;
                        }
                    } else {
                        var op1 = new Operation("Routing");
                        Shell.launchOne(appcls,AppStdArgs.skipInitialRoute)
                            .onsuccess(function(a) {
                                a.routeTreeState(objset);
                                op1.CompleteOperation(true,route);
                            });
                        return op1;
                    }
                } else {
                    this.LASTERROR("Routing configuration does not define script or default for " + appcls);    
                }
            } else {
                this.LASTERROR("parsing the route failed for " + appcls);
            }
        } else if (runHome) {
            return this.execRootScript();
        }
        return Operation.From(null);
    }

    //#region  Singleton
    SysRouter.Default = (function() {
        var rtr = null;
        return function() {
            if (rtr == null) {
                rtr = new SysRouter();
            }
            return rtr;
        }
    })();
    //#endregion
})();

