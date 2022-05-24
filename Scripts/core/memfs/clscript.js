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

/**
 * 
 * @param {*} commandContext 
 * @param {*} additional_constants 
 */
CLScript.prototype.run = function(commandContext, additional_constants) {
	var CLRun = Class("CLRun");
	if (!BaseObject.is(this.$clrun, "CLRun")) {
		var clrun = new CLRun(this.get_script());
		if (clrun.get_recognized()) {
			this.$clrun = clrun;
		}
	}
	if (this.$clrun != null) {
		if (BaseObject.is(commandContext, "ICommandContext")) {
			return this.$clrun.runInContext(commandContext, additional_constants);
		} else {
			return this.$clrun.run(additional_constants);
		}
	} else {
		return Operation.Failed("Cannot execute script")
	}
}