/**
	Base class for writting commands as classes. This is not mandatory way to define commands - they need a descriptor (can depend on implicit one as well), but all they need is a callback action that
	returns a value or Operation (if they are async). Still, in most cases it will probably be more convenient to imlement non-system commands as classes inheriting this one.
*/
function CommandBase() {
	CommandDescriptor.apply(this,arguments);
	// Replace some parameters with the stuff implemented here.
	this.$action = Delegate.createWrapper(this,this.action);
}
CommandBase.Inherit(CommandDescriptor,"CommandBase");
/**
	@param context {ICommandContext} - the current command context from which the command can access the environment, app and other stuff
		this will also give it access to the command register which may not be a good idea, but a proxy can be used to hide what we decide to hide in future
	@param executor {?} Not yet decided what will be set here, but it will give access to the executor ot part of it.
	@returns {Operation|any?|undefined} Returns Operation for async actions and result itself if synchronous. Returning undefined means no result.
*/
CommandBase.prototype.action = function(/*ICommandContext*/ context, executorinterface) {
	
}
