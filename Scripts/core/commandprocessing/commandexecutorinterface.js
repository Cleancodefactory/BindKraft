/**
	A proxy to the command executor. This class and any inheritors are designed to serve as second parameters to the action methods
	of commands.
	
	This is temporary solution and will be replaced with autoenerated proxies for Requestable interfaces in future. The commands themselves
	should not notice the change, because the executor creates and passes the proxy and the decision what proxy to pass to a command is
	up to the executor.
*/
function CommandExecutorInterface() {
	InterfaceObjectTemplate.apply(this,arguments);
}
CommandExecutorInterface.Inherit(InterfaceObjectTemplate,"CommandExecutorInterface");
CommandExecutorInterface.Implement(ICommandExecutorInterface);
CommandExecutorInterface.prototype.completedOperation = function(success, data_or_error) {
	return this.completedOperation(success, data_or_error);
}
CommandExecutorInterface.prototype.pushContext = function(ctx) {
	return this.pushContext(ctx);
}
CommandExecutorInterface.prototype.pullContext = function() {
	return this.pullContext();
}
CommandExecutorInterface.prototype.get_currentcontext = function() {
	return this.get_currentcontext();
}
/**
	Intended for extracting a new context from apps or other sources. Usually done 
	in order to call pushContext and change the current context for the next command(s)
*/
CommandExecutorInterface.prototype.getContextFrom = function(source) {
	if (BaseObject.is(source,"ISupportsCommandContext")) {
		var ctx = source.get_commandcontext();
		if (ctx != null) return ctx;
	}
	return null;
}
CommandExecutorInterface.prototype.pullResult = function() {
	return this.pullResult();
}
CommandExecutorInterface.prototype.pushNextToken = function() {
	var r = this.pullNextToken(outmetacb);
	this.pushResult(r);
	return r;
}
/**
	Pulls the next token from the command line as a raw arg (see the more flexible alternatives)
	All traps found there are moved to the queued ones
*/
CommandExecutorInterface.prototype.pullNextToken = function(outmetacb) {
	return this.pullNextToken(outmetacb);
}
CommandExecutorInterface.prototype.pullNextTokenRaw = function() {
	return this.pullNextTokenRaw();
}
CommandExecutorInterface.prototype.pullNextParameter = function(outmetacb) {
	return this.pullNextToken(outmetacb);
}
CommandExecutorInterface.prototype.peekNext = function(n) {
	var cl = this.get_cmdline();
	if (BaseObject.is(cl, "CommandLine")) {
		return cl.peekrel(n?(n + 1):1); // Next means the default is the next pos
	}
	return null;
}
CommandExecutorInterface.prototype.peekAt = function(n) {
	var cl = this.get_cmdline();
	if (BaseObject.is(cl, "CommandLine")) {
		return cl.peekabs(n); // Next means the default is the next pos
	}
	return null;
}