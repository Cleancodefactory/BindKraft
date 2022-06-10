


/*CLASS*/
function AppBase(appGate) {
    DataHolder.apply(this, arguments);
	if (BaseObject.is(appGate,"IHasManagedInterfaceContainer")) {
		this.$managed_container = appGate.get_managedinterfacecontainer();
	}
    var AppAmbientDefaults = Class("AppAmbientDefaults");
	this.$__appAmbientDefaults = new AppAmbientDefaults(this);
    this.set_instancename("AppBase derived application");
}
AppBase.Inherit(DataHolder, "AppBase");
AppBase.Implement(IAppInstance); // Extends IManagedInterface
AppBase.Implement(IApp); // TODO: move code from IApp here
AppBase.Implement(IStructuralQueryProcessorImpl );
AppBase.Implement(IStructuralQueryRouterImpl, "app", function () { return this.get_approot(); });
// AppBase.Implement(IStructuralQueryEmiterImpl, "app", function () { return (this.get_approot() || window.Shell); });
// 2.20 + No longer proceed to the Shell!
AppBase.Implement(IStructuralQueryEmiterImpl, "app", function () { return (this.get_approot()); });
AppBase.Implement(IAppletStorage); // Self implementing Interface
AppBase.Implement(IAjaxContextParameters); // See: IAjaxContextParameters implementation 
AppBase.Implement(IAjaxReportSinkImpl); // See: IAjaxReportSinkImpl implementation
AppBase.Implement(IAppElementImpl); // Being an app element enables the application to be part of other applications - no need to declare explicitly a parent application
AppBase.Implement(IHasManagedInterfaceContainer);
AppBase.Implement(IServiceLocator);

// Service providing
AppBase.prototype.provideAsServices = new InitializeArray("Assign an array of strings - names of supported interfaces by your class to enable those to be provided as services", ["IAppletStorage"]);
AppBase.onStructuralQuery("FindServiceQuery", function (query, opts) {
    if (FindServiceQuery.handle(this, query, this.provideAsServices)) return true;
});
// IHasManagedInterfaceContainer
AppBase.prototype.get_managedinterfacecontainer = function() {
	return this.$managed_container;
}
// IManagedInterface
AppBase.prototype.GetInterface = function(iface) {
	var ifname = Class.getInterfaceName(iface);
	switch (ifname) {
		case "IAppInstance":
		case "IManagedInterface":
			return this;
	}
	return null;
}

AppBase.prototype.locateService = function (type, reason) { 
    var typename = Class.getTypeName(type);
    switch (type) {
        case "IAmbientDefaults":
            return this.$__appAmbientDefaults;
    }
    return null;
}

AppBase.prototype.appinitialize = function(callback, args) {
	alert("appinitialize is not implemented in " + this.classType());
	BaseObject.callCallback(callback, true); // Async shutdown by default
}
AppBase.prototype.run = function(/* [] */ args) { /* no mandatory content */ }
AppBase.prototype.appshutdown = function(callback) {
	BaseObject.callCallback(callback, true); // Async shutdown by default
}
AppBase.prototype.windowDisplaced = function(w) {
	throw "windowDisplaced is not implemented by " + this.fullClassType();
}
	
/**
	Deprecated
	Override this, call parent implementation and when it returns null add code for more interfaces.
*/
AppBase.prototype.GetAppInterface = function(iface /* name or def */) { 
	if (this.is(iface)) return this;
	return null;
}

// ------------ IAjaxContextParameters implementation -------------------------------
AppBase.prototype.get_localajaxcontextparameter = function (param) {
    if (this.$ajaxcontextparameter != null && this.$ajaxcontextparameter["" + param] != null) return this.$ajaxcontextparameter["" + param];
    return null;
};
AppBase.prototype.get_ajaxcontextparameter = function (param) {
    var result = this.get_localajaxcontextparameter(param);
    if (result != null || this.isFinalAuthority(param)) return result;
    // Call the hierarchy
    var query = new AjaxContextParameterQuery(param);
    if (this.throwDownStructuralQuery(query)) {
        return query.result;
    }
    return null;
};
AppBase.prototype.set_localajaxcontextparameter = function (param, v) {
    if (this.$ajaxcontextparameter == null) this.$ajaxcontextparameter = {};
    this.$ajaxcontextparameter["" + param] = v;
};
// Final authority for certain context parameters. This is prepared to handle this on parameter specific basis one day, but for now it works in general manner.
AppBase.prototype.$isFinalAuthority = false;
AppBase.prototype.isFinalAuthority = function (param) { // Override this in Applet root classes to stop searching for parameters to the shell
    if (this.$isFinalAuthority === false || this.$isFinalAuthority === true) return this.$isFinalAuthority;
    if (typeof this.$isFinalAuthority == "object" && param != null) {
        if (this.$isFinalAuthority["" + param]) return true;
    }
    return false;
};
AppBase.prototype.setFinalAuthority = function (param, v) {
    if (arguments.length == 1) {
        this.$isFinalAuthority = param;
    } else if (arguments.length > 1) {
        if (typeof this.$isFinalAuthority != "object") this.$isFinalAuthority = {};
        this.$isFinalAuthority[param] = v;
    }
};
AppBase.onStructuralQuery("AjaxContextParameterQuery", function (query, processInstructions) {
    if (this.is("IAjaxContextParameters")) {
        var result = this.get_localajaxcontextparameter(query.requestedParameter);
        if (result != null || this.isFinalAuthority(query.requestedParameter)) {
            query.result = result;
            return true;
        }
    }
    return null;
});
// App helpers
// AppBase.prototype.launchApp


// ------------ IAjaxReportSinkImpl implementation -------------------------------
AppBase.prototype.ajaxOnStartOperation = function(settings) {
};
AppBase.prototype.ajaxOnEndOperation = function(settings, result, status) {
};
AppBase.prototype.ajaxOnError = function(settings, result, status) {
};