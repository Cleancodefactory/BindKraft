/**
	Objects of this class carry the context in which commands are executed.
*/
function CommandContext(args) {
	BaseObject.apply(this,arguments);
	var arg;
	for (var i = 0; i <arguments.length; i++) {
		arg = arguments[i];
		if (BaseObject.is(arg,"CommandReg")) {
			this.$commands = arg;
		} else if (BaseObject.is(arg, "IAppBase")) {
			this.$application = arg;
		} else if (BaseObject.is(arg, "IEnvironmentContext")) {
			this.$environment = arg;
		} else if (typeof arg == "object") {
			this.$custom = arg;
		}
	}
}
CommandContext.Inherit(BaseObject, "CommandContext");
CommandContext.Implement(ICommandContext);
/**
	Creates a new global context. 
	@desc This is needed for executions of command line(s) when it is desired to not change the permanent global context
			returned by CommandContext.Global()
*/
// TODO: Do we want the global to be only a singleton (in which case it is better to remove this method) or not.
CommandContext.createGlobal = function() { // Global context does not have an application set
	var ctx = new CommandContext(CommandReg.Global(), EnvironmentContext.Global());
	return ctx;
}

CommandContext.ImplementReadProperty("commands", new Initialize("Command register",null));
CommandContext.ImplementReadProperty("environment", new Initialize("Environment context", null));
CommandContext.ImplementReadProperty("application", new Initialize("current application",null)); // This is IAppBase, but can be some further interface
CommandContext.ImplementReadProperty("custom", new Initialize("Object that provides other APIs (as needed for the specific purpose)",null)); // This is still unused for the moment.
CommandContext.prototype.isFunctional = function() {
	if (BaseObject.is(this.$commands, "CommandReg") && BaseObject.is(this.$environment,"IEnvironmentContext")) { // Everything else is optional
		return true;
	}
	return false;
}

// Is the place for this here?
CommandContext.$Global = null;
CommandContext.Global = function() {
	if (this.$Global == null) {
		// Global context does not have an application set
		this.$Global = new CommandContext(CommandReg.Global(), EnvironmentContext.Global());
	}
	return this.$Global;
}