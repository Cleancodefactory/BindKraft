(function() {
    var MemFSTools = Class("MemFSTools");

    function SysRouter() {
        BaseObject.apply(this, arguments);
        this.$loadRoutingData();
    }
    SysRouter.Inherit(BaseObject,"SysRouter");

    SysRouter.prototype.$root = null; // loaded from the settings (default in sysconfig.js)
    SysRouter.prototype.$apps = null; // loaded from the appfs:system/routes/apps directory (default in sysconfig.js)

    SysRouter.prototype.$loadRoutingData = function() {
        var register = {};
        fs = new MemFSTools();
        var pf = fs.openFile("appfs:/system/routes/settings");
        this.$root = pf.getProp("root");
        var dir = fs.openDir("appfs:/system/routes/apps");
        var _routes = dir.get_contents();
        var o, cls;
        for (var i = 0; i< _routes.length; i ++) {
            var routepf = _routes[i];
            if (BaseObject.is(routepf.value, "PropertySetMemoryFile")) {
                var pf = routepf.value; 
                o = pf.getProps();
                if (typeof o.alias != string) {
                    this.LASTERROR("Routing registration (" + routepf.key + ") has no alias entry");
                    continue;
                }
                if (typeof o["class"] != string || !Class.is(o["class"],"IAppRouter")) {
                    this.LASTERROR("Routing registration (" + +routepf.key + ") has no app class or it is not implementing IAppRouter");
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
    // Singleton
    SysRouter.Default = (function() {
        var rtr = null;
        return function() {
            if (rtr == null) {
                rtr = new SysRouter();
            }
            return rtr;
        }
    })();
})();

