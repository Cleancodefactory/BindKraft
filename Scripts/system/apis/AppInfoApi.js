function AppInfoApi() {
	BaseObject.apply(this,arguments);
}
AppInfoApi.Inherit(BaseObject, "AppInfoApi");
AppInfoApi.ImplementEx(IAppInfoApi);

AppInfoApi.prototype.getContentReader = function(AppClass) {
	return new AppInfoApiContentReader(AppClass);
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