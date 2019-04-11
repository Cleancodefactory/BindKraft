function ISupportsCommandRegisterImpl() {
}
ISupportsCommandRegisterImpl.InterfaceImpl(ISupportsCommandRegister);
// Static register by default
ISupportsCommandRegisterImpl.prototype.$commandregister = new CommandReg("CmdsDemoTestApp");
ISupportsCommandRegisterImpl.prototype.get_commandregister = function() { 
	return this.$commandregister;
}
/**
	Typical usage in class declaration.
	@example
	// Assume $viewtate is an application method that does the transition to the desired state (the actual command's code can be anything)
	MyClass.ShowMain = function(context,api) {
				var app = context.get_application();
				app.$viewstate("main");
			};
	MyClass.Implement(ISupportsCommandRegisterImpl, function(reg) {
		reg.register("itemlist", null,null, function(context,api) {
			var app = context.get_application();
			app.$viewstate("list");
		},"switches to list view");
		reg.register("viewitem", null,null, function(context,api) {
				var app = context.get_application();
				app.$viewstate("item");
			},"switches to item view and selects the item specified in the arg");
		reg.register("main", null,null, MyClass.ShowMain,"switches to the main app view");
	});
	@returns {undefined}
*/
ISupportsCommandRegisterImpl.classInitialize = function(cls,initproc) {
	if (BaseObject.isCallback(initproc)) {
		BaseObject.callCallback(initproc,cls.prototype.$commandregister);
	}
}