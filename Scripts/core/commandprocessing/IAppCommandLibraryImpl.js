(function(){

    var ICommandRegisterLibrary = Interface("ICommandRegisterLibrary"),
        CommandDescriptorInst = Class("CommandDescriptorInst");
    /**
     * Enables construction of static library
     * Libraries can be added, but no new commands can be registered in this one
     */
    function IAppCommandLibraryImpl() {}
    IAppCommandLibraryImpl.InterfaceImpl(ISupportsCommandRegister,"IAppCommandLibraryImpl");
    IAppCommandLibraryImpl.RequiredTypes("IAppElement");

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
    IAppCommandLibraryImpl.classInitialize = function(cls,commands) {
        cls.Implement(ICommandRegisterLibrary);

        var register = new CommandReg(cls.classType);
        
        for (i = 0; i < commands.length; i++) {
            var cmd = commands[i];
            if (cmd != null) {
                var cmdd = new CommandDescriptorInst(
                    cmd.name, 
                    cmd.alias, 
                    cmd.regexp, 
                    cmd.action,
                    cmd.help);
                register.register(cmdd);
            }
        }

        // Clone to instance
        cls.prototype.$getCommandReg = function() {
            if (this.$__commandRegister == null) {
                this.$__commandRegister = register.cloneObject();
                this.$__commandRegister.owner = this;
                this.$__commandRegister.set_instance(this);
            }
            return this.$__commandRegister;
        }

        cls.prototype.get_commandregister = function() { return this; }

        cls.prototype.ownerString = function() {
            return this.$getCommandReg().ownerString();
            
        }
        cls.prototype.exists = function(cmd_or_name) {
            return this.$getCommandReg.exists(cmd_or_name);
        }
        cls.prototype.get = function(cmdname) {
            return this.$getCommandReg().get(cmdname);
        }
        
        /**
            During execution this is the method used for finding the command in the register
        */
        cls.prototype.find = function(token,meta) {
            return this.$getCommandReg().find(token,meta);
        }
        
        /**
         * Registers command by pieces or as prepared CommandDescriptor
         * When registered by pieces the commands are thised over this instance
         * @param {*} command 
         * @param {*} alias 
         * @param {*} regexp 
         * @param {*} action 
         * @param {*} help 
         * @param {*} bOverwrite 
         */
        cls.prototype.register = function(command, alias, regexp, action, help, bOverwrite) {
            return this.$getCommandReg().register(command, alias, regexp, action, help, bOverwrite);
        }
        cls.prototype.unregister = function(command) {
            return this.$getCommandReg().unregister(command);
        }
        
        //#endregion ICommandRegister
        
        //#region ICommandRegisterLibrary
        
        
        cls.prototype.addLibrary = function(lib) { 
            return this.$getCommandReg().addLibrary(lib);
        }
        cls.prototype.removeLibrary = function(lib) { 
            return this.$getCommandReg().removeLibrary(lib);
        }
        cls.prototype.removeAllLibraries = function() { 
            return this.$getCommandReg().removeAllLibraries();
        }

    }

})();