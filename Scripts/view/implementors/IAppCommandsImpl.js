/*INTERFACE*/
/**
	The interface's implementation is very simple, because its usage is mostly passive through bindings in window templates.
*/
function IAppCommandsImpl() {}
IAppCommandsImpl.InterfaceImpl(IAppCommands);
IAppCommandsImpl.RequiredTypes("IApp");
IAppCommandsImpl.prototype.$appcommands = null;
IAppCommandsImpl.prototype.get_appcommands = function() {
	return this.$appcommands;
}
IAppCommandsImpl.prototype.set_appcommands = function(v) {
	this.$appcommands = v;
}
IAppCommandsImpl.prototype.refreshAppCommands = function() {
	if (this.get_approotwindow() != null) {
		this.get_approotwindow().updateTargets();
	}
}

