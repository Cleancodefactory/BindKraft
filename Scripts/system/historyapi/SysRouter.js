(function() {
    var MemFSTools = Class("MemFSTools");

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
        fs = new MemFSTools();
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
    SysRouter.prototype.applyRoute = function(rt) {
        var appcfg = null;
        var appcls = null;
        var route = null; // in app route string
        if (typeof rt == "string") {
            var arr = rt.split("/");
            if (arr != null && arr.length > 1) {
                if (arr[0] == this.$root) {
                    appcfg = this.findByAlias(arr[1]);
                    if (appcfg != null) {
                        appcls = appcfg["class"];
                        if (typeof appcls != "string") {
                            this.LASTERROR("class is not given to the app alias" + arr[0]);
                            return; 
                        }
                        appcls = Class.getClassDef(appcls);
                        if (appcls == null || !Class.is("IAppRouter")) {
                            this.LASTERROR("App class is not found or not IAppRoter for alias " + arr[0]);
                            return; 
                        }
                        if (arr.length > 2) {
                            route = Array.createCopyOf(arr,2).join("/");
                        }
                        
                    }
                }
            }
        } else if (Array.isArray(rt)) {
            if (rt.length > 0) {
                if (rt[0] == this.$root) {
                    rt.shift();
                }
                if (rt.length > 0) {
                    appcfg = this.findByAlias(rt[0]);
                    if (appcfg != null) {
                        route = Array.createCopyOf(arr,1).join("/");
                        appcls = appcfg["class"];
                        if (typeof appcls != "string") {
                            this.LASTERROR("class is not given to the app alias" + arr[0]);
                            return; 
                        }
                        appcls = Class.getClassDef(appcls);
                        if (appcls == null || !Class.is("IAppRouter")) {
                            this.LASTERROR("App class is not found or not IAppRoter for alias " + arr[0]);
                            return; 
                        }
                    }
                }
            }
        } else if (BaseObject.is(rt,"BKUrl")) {
            var bkpath = rt.get_path();
            return this.applyRoute(bkpath);
        } else if (BaseObject.is(rt, "BKUrlPath")) {
            var segments = rt.get_allsegments();
            return this.applyRoute(segments);
        }
        if (appcfg != null && appcls != null) { // Something to do
            if (route == null || route.length == 0) { // no route - start or focus the app
                if (typeof appcfg.noroute == "string" && appcfg.noroute.length > 0) {
                    var run = new CLRun(appcfg.noroute);
                    return run.run();
                } else if (appcfg.noroute) {
                    Shell.launchOne(appcls);
                }
            } else {
                // There is route
                var linear = this.$seralizer.parseToLinear(route);
                if (linear && linear.length > 0) {
                    var objset = appcfg.__treeStates.delinearize(linear);
                    var app = Shell.getAppByClassName(appcls);
                    if (app != null) {// running
                        if (app.canOpenTreeState(objset)) {
                            app.routeTreeState(objset);
                            return Operation.From(true);
                        } else {
                            // Launch script or raw
                        }
                    }

                } else {
                    this.LASTERROR("parsing the route failed for " + appcls);
                }

            }

        }
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

