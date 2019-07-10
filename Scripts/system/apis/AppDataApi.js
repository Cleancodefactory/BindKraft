function AppDataApi() {
	BaseObject.apply(this,arguments);
}
AppDataApi.Inherit(BaseObject, "AppDataApi");
AppDataApi.ImplementEx(IAppDataApi);

AppDataApi.prototype.getContentReader = function(AppClass) {
	return new AppDataApiContentReader(AppClass);
}
AppDataApi.Default = (function() {
	var instance;
	return function() {
		if (instance == null) {
			instance = new AppDataApi();
			LocalAPI.Default().registerAPI(IAppDataApi,instance);
		}
		return instance;
	}
})();
AppDataApi.Default();