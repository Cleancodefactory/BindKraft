function ISupportsCommandRegisterExDefImpl() {
}
ISupportsCommandRegisterExDefImpl.InterfaceImpl(ISupportsCommandRegister, "ISupportsCommandRegisterExDefImpl");
ISupportsCommandRegisterExDefImpl.RequiredTypes("IApp");
// Static register by default
ISupportsCommandRegisterExDefImpl.prototype.$commandregister = null; //new CommandReg("Standard static app command register");
ISupportsCommandRegisterExDefImpl.prototype.get_commandregister = function() { 
	var cr = this.$commandregister;
	if (cr != null) {
		cr.set_instance(this);
	}
	return cr;
}
// wrapper
ISupportsCommandRegisterExDefImpl.$wrapcommandaction = function(action) {
	return function(ctx,api) {
		if (Array.isArray(ctx)) { // New style
			return action.call(api.get_application(), ctx,api);
		} else { // Old style
			return action.call(ctx.get_application(), ctx,api);
		}
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
ISupportsCommandRegisterExDefImpl.classInitialize = function(cls,options_and_commands) {
	var CommandDescriptorInst = Class("CommandDescriptorInst");
	cls.prototype.$commandregister = new CommandReg("Standard static app command register");
	var nonwrapped = false;
	var i;
	for (var j = 1; j < arguments.length; j++) {
		var arg = arguments[j];
		if (BaseObject.is(arg,"Array")) {
			var commands = arg;
			var register = cls.prototype.$commandregister;
			if (!nonwrapped) {
				for (i = 0; i < commands.length; i++) {
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
			} else {
				for (i = 0; i < commands.length; i++) {
					var cmd = commands[i];
					if (cmd != null) {
						register.register(
							new CommandDescriptorInst(cmd.name, cmd.alias,cmd.regexp,cmd.action,cmd.help)
							);
					}
				}
			}
		} else if (arg === true) {
			nonwrapped = true;
		}
	}
	
}