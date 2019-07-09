function AppDataApi() {
	BaseObject.apply(this,arguments);
}
AppDataApi.Inherit(BaseObject, "AppDataApi");
AppDataApi.ImplementEx(IAppDataApi);

AppDataApi.prototype.getContentReader = function(AppClass) {
	
}