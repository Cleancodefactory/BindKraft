function ShellLocalApi(shell) {
	BaseObject.apply(this, arguments);
	this.$shell = shell;
}
ShellLocalApi.Inherit(BaseObject, "ShellLocalApi");
ShellLocalApi.Implement(IShellApi);
ShellLocalApi.prototype.bindAppByClassName = function(className) { 
	var app = this.$shell.getAppByClassName(className);
	if (BaseObject.is(app, "IManagedInterface")) {
		return app;
	}
	return null;
}
ShellLocalApi.prototype.bindAppByInstanceId = function(instanceId) { 
	var app = this.$shell.getAppByInstanceId(instanceId);
	if (BaseObject.is(app,"IManagedInterface")) {
		return app;
	}
	return null;
}
ShellLocalApi.prototype.activateApp = function(appproxy_orid) { 
	var app;
	if (typeof appproxy_orid == "string") {
		app = this.$shell.getAppByInstanceId(appproxy_orid);
		if (app != null) {
			return this.$shell.activateApp(app);
		}
	} else if (DummyInterfaceProxyBuilder.isProxy(appproxy_orid)) {
		app = DummyInterfaceProxyBuilder.Dereferece(appproxy_orid);
		if (app != null) {
			return this.$shell.activateApp(app);
		}
	}
	return false;
}
ShellLocalApi.prototype.bindAppsByClassNames = function(className1, className2, className3) { 
	var classNames = Array.createCopyOf(arguments,1);
	var apps = this.$shell.getAppsByFilter(function(app) {
		if (classNames.length > 0 && !classNames.Any(Predicates.TypeIs(app))) return false;
		if (BaseObject.is(app,"IManagedInterface")) return true;
		return false;
	});
	return new LocalProxyCollection(apps);
}

ShellLocalApi.prototype.getRunningAppsClassNames = function() { 
	return this.$shell.getAppsByFilter().Select(function(idx, app) {
		if (!this.indexOf(app.classType()) >= 0) return app.classType();
	});
}