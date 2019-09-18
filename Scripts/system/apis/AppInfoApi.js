function AppInfoApi() {
	BaseObject.apply(this,arguments);
}
AppInfoApi.Inherit(BaseObject, "AppInfoApi");
AppInfoApi.ImplementEx(IAppInfoApi);

AppInfoApi.prototype.getContentReader = function(AppClass) {
	return new AppInfoApiContentReader(AppClass);
}
AppInfoApi.prototype.getAllApps = function() {
	var fs = Registers.Default().getRegister("infofs");
	var dir = fs.cd("appinfo");
	if (dir != null) {
		var dirs = dir.get_directories();
		if (BaseObject.is(dirs, "Array")) {
			return dirs.Select(function(idx, item) {
				return item.key;
			});
		}
	}
	return [];
}
AppInfoApi.Default = (function() {
	var instance;
	return function() {
		if (instance == null) {
			instance = new AppInfoApi();
			LocalAPI.Default().registerAPI(IAppInfoApi,instance);
		}
		return instance;
	}
})();
AppInfoApi.Default();