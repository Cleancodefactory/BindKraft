(function() {

    var IAmbientDefaults = Interface("IAmbientDefaults"),
        AppElementBase = Class("AppElementBase"),
        LocalAPIClient = Class("LocalAPIClient"),
        IAppDataApi = Interface("IAppDataApi");

    function AppAmbientDefaults() {
        AppElementBase.apply(this, arguments);
        this.$loadConfiguration();
    }
    AppAmbientDefaults.Inherit(AppElementBase,"AppAmbientDefaults")
        .Implement(IAmbientDefaults);

    AppAmbientDefaults.prototype.$ambientDefaults = null;
    AppAmbientDefaults.prototype.$loadConfiguration = function() { 
        var app = this.get_approot();
        if (app != null) {
            var lapi = new LocalAPIClient();
            var appdata = lapi.getAPI(IAppDataApi);
            if (appdata != null) {
                var reader = appdata.getContentReader(app.classType());
                if (reader != null) {
                    var config = reader.content("ambientDefaults");
                    if (config != null) {
                        this.$ambientDefaults = config;
                    }
                }
            }
	        lapi.releaseAll();
        }
    }

    //#region IAmbientDefaults
    AppAmbientDefaults.prototype.getAmbientDefaultValue = function(obj_or_type, name) { 
        if (this.$ambientDefaults == null) return null;
        var type = null;
        if (BaseObject.is(obj_or_type, "BaseObject")) {
            type = obj_or_type.classType();
        } else if (obj_or_type != null) {
            type = Class.getTypeName(obj_or_type);
        }
        if (type == null) { return null; }
        if (typeof name == "string") { 
            var cls = this.$ambientDefaults[type];
            if (cls != null) { 
                if (cls[name] != null) return cls[name];
            }
        }
        return null;
    }
    //#endregion
})();