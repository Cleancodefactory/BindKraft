function ISupportsCommandRegisterExDefImpl() {
}
ISupportsCommandRegisterExDefImpl.InterfaceImpl(ISupportsCommandRegister);
// Static register by default
ISupportsCommandRegisterExDefImpl.prototype.$commandregister = null; //new CommandReg("Standard static app command register");
ISupportsCommandRegisterExDefImpl.prototype.get_commandregister = function() { 
	return this.$commandregister;
}
// wrapper
ISupportsCommandRegisterExDefImpl.$wrapcommandaction = function(action) {
	return function(ctx,api) {
		return action.call(ctx.get_application(), ctx,api);
	}
}
/**
	@param commands {[descriptors]} descriptor :==
		{ name: "", alias: "", regexp: "", action thisCall function(context,api), help: "" }
	@example myclass.Implement(ISupportsCommandRegisterExDefImpl,[
	{ name: "cmd1", alias: "c1",
		regexp: null,
		action: function(ctx, api) {
			some code, this is the app
		},
		help: "This command does something"
	},
	{ .... }
	]);
*/
ISupportsCommandRegisterExDefImpl.classInitialize = function(cls,commands) {
	cls.prototype.$commandregister = new CommandReg("Standard static app command register");
	if (BaseObject.is(commands,"Array")) {
		var register = cls.prototype.$commandregister;
		for (var i = 0; i < commands.length; i++) {
			var cmd = commands[i];
			if (cmd != null) {
				register.register(
					cmd.name, 
					cmd.alias, 
					cmd.regexp, 
					ISupportsCommandRegisterExDefImpl.$wrapcommandaction(cmd.action),
					cmd.help);
			}
		}
	}
}