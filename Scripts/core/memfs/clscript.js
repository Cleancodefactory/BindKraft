/**
	Packs a script for execution (like a saved batch file)
	Carries the script and some additional info, preparing for forthcoming features that will check the script requirements before running it
*/
function CLScript(script,type, app) {
	BaseObject.apply(this,arguments);
	if (typeof script == "string") {
		this.set_script(script);
	}
	if (typeof type == "string") {
		this.set_type(type);
	}
	if (typeof app == "string") {
		this.set_app(app);
	}
	
}
CLScript.Inherit(BaseObject, "CLScript");
CLScript.Implement(IMemoryFileImpl);
CLScript.ImplementProperty("script", new InitializeStringParameter("The packed script", null));
CLScript.ImplementProperty("type", new InitializeStringParameter("Kind of script - runner class. E.g. Commander", null));
CLScript.ImplementProperty("app", new InitializeStringParameter("Optional app Class name for which this script is intended - i.e. needs its context", null));