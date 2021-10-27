


// TODO Deprecate this
/*INTERFACE*/ /*IMPL*/
function IAppletStorage() { }
IAppletStorage.Interface("IAppletStorage");
IAppletStorage.prototype.$appletstorage = new InitializeObject("The underlying storage for applet data");
IAppletStorage.prototype.get_appletstorage = function (proppath, defVal) {
    if (proppath == null || proppath.length == 0) return this.$appletstorage;
    var r = BaseObject.getProperty(this.$appletstorage, proppath, null);
	if (r == null && arguments.length > 1 && defVal != null) {
		BaseObject.setProperty(this.$appletstorage, proppath, defVal);
		return BaseObject.getProperty(this.$appletstorage, proppath, null);
	}
	return r;
}
IAppletStorage.prototype.set_appletstorage = function (proppath, v) {
    if (arguments.length > 1) {
        if (proppath == null || proppath.length == 0) {
            this.$appletstorage = v;
        } else {
            BaseObject.setProperty(this.$appletstorage, proppath, v);
        }
    } else if (arguments.length == 1) {
        this.$appletstorage = proppath; // treat as input value
    }
}