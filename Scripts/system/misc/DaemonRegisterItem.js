function DaemonRegisterItem(daemonClass, /*null takes the $daemonInfo*/ alias, single, startParameters) {
	BaseObject.apply(this,arguments);
	var c = Class.getClassDef(daemonClass);
	if (c == null) {
		if (typeof daemonClass == "string") {
			throw "Daemon class not found (" +daemonClass + ")";
		} else {
			throw "Daemon class fails to be identified as a class";
		}
	}
	this.$daemonClass = daemonClass;
	var a = alias;
	if (a == null) {
		a = BaseObject.getProperty(c, "daemonInfo.alias", null);
	}
	this.set_alias(a);
	a = single;
	if (a == null) {
		a = BaseObject.getProperty(c, "daemonInfo.single", false);
	}
	this.set_single(a);
	// If no alias is found it is still valid registration, but the daemon cannot be easilly accessed
	this.set_startParameters(startParameters);
}
DaemonRegisterItem.Inherit(BaseObject,"DaemonRegisterItem");
DaemonRegisterItem.ImplementReadProperty("daemonClass", new InitializeStringParameter("The root class of the daemon, must be IDaemonApp", null));
DaemonRegisterItem.ImplementProperty("startParameters", new InitializeStringParameter("The registered parameters for launching the daemon app. For now these must be a string, bindings are not allowed currently.", null));
DaemonRegisterItem.ImplementProperty("alias", new InitializeStringParameter("Registered alias for the daemon (usually obtained from the IDaemonApp, but can be forcibly changed).", null));
DaemonRegisterItem.ImplementProperty("single", new InitializeBooleanParameter("If true a single instance of the daemon can be started. Alias must be set, otherwise the register will refuse registration.", null));
