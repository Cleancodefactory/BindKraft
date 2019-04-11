// NOT currently loaded

/**
	A command line runner.
	USes the CommandExecutor to drive limited features execution
*/
function MiniCommandRunner(cmdline) {
	BaseObject.apply(this, arguments);
	this.$executor = new CommandExecutor("global",cmdline, true);
}
MiniCommandRunner.Inherit(BaseObject, "MiniCommandRunner");
MiniCommandRunner.prototype.$executor = null;