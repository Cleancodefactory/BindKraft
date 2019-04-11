/*
	The platform utility implementer enables classes that need to generate URL for operations with a standard BindKraft packet server(s)
	to do that regardless of the specifics of the platform.

*/
function IPlatformUtilityImpl() { }
IPlatformUtilityImpl.Description("Enables you to YourClass.implement(IPlatformUtilityImpl,'<your module name>'[,server]) and use over your this methods that perform for you certain actions in the correct platform dependent manner.");
IPlatformUtilityImpl.InterfaceImpl(IPlatformUtility);
IPlatformUtilityImpl.classInitialize = function(cls,moduleName,server) { // Server is not currently supported on production level.
	cls.prototype.$platformModuleName = moduleName;
	cls.prototype.$platformModuleServer = server;
	if (server != null) {
		if (!(server in IPlatformUtility.servers)) {
			throw "There is no URL generator registered for the server " + server + ". This server was addressed in " + Class.fullClassType(cls) + " when using  .Implement(IPlatformUtilityImpl).";
		}
		cls.prototype.moduleUrl = function (readWrite, pack, nodePath) {
			return IPlatformUtility.servers[server](this.$platformModuleName, readWrite, pack, nodePath);
		}
		cls.prototype.resourceUrl = function (restype, path) {
			return IPlatformUtility.resourceservers[server](this.$platformModuleName, "read", restype, path);
		}
	} else {
		cls.prototype.moduleUrl = function (readWrite, pack, nodePath) {
			return IPlatformUtility.moduleUrl(this.$platformModuleName, readWrite, pack, nodePath);
		}
		cls.prototype.resourceUrl = function (restype, path) {
			return IPlatformUtility.resourceUrl(this.$platformModuleName, "read", restype, path);
		}
	}
	
}