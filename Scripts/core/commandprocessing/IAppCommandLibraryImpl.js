(function(){
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

        function __getDef(name) {
            for (var i = 0; i < commands.length; i++) {
                var def = commands[i];
                if (def.name == name || def.alias == name) {
                    return def;
                }
            }
            return null;
        }


        cls.prototype.get_commandregister = function() { return this; }
        cls.prototype.$cachedcommands = new InitializeArray("Cached instance commands");

        cls.prototype.ownerString = function() {
            return this.$__instanceId + "(" + this.classType() + ")";
        }
        cls.prototype.exists = function(cmd_or_name) {
            if (this.get(cmd_or_name) != null) return true;
            return false;
        }
        cls.prototype.get = function(cmdname) {
            var cmd = this.$get(cmdname);
            if (cmd != null) {
                return cmd;
            }
            cmd = __getDef(cmdname);
            if (cmd != null) {
                return this.$createCommand(cmd);
            }
            for (var i = this.$libraries.length - 1; i >= 0; i--) {
                cmd = this.$libraries[i].get(cmdname);
                if (cmd != null) return cmd;
            }
            return null;
        }
        /**
         * Creates and caches a command from definition object (see comment for classInitialize)
         */
        cls.prototype.$createCommand = function(obj) {
            var me = this;
            var cmd = new CommandDescriptor(obj.name, obj.alias,obj.regexp, 
                function (args,api) {
                    return obj.action.call(this,args,api);
                },
                obj.help
            );
            this.$cachedcommands.push(cmd);
            return cmd;
        }
        /**
         * Searches the cached commands only
         */
        cls.prototype.$get = function(cmdname) {
            if (typeof cmdname == "string") {
                return this.$cachedcommands.FirstOrDefault(function(idx, item) {
                    if (item.name == cmdname || item.alias == cmdname) {
                        return item;
                    }
                    return null;
                });
            } else if (BaseObject.is(cmdname, "CommandDescriptor")) {
                var cmd = cmdname;
                var r = this.$cachedcommands.FirstOrDefault(function(idx,item) {
                    if (
                        item.get_name() == cmd.get_name() ||
                        item.get_name() == cmd.get_alias() ||
                        (item.get_alias() != null && item.get_alias() == cmd.get_name()) ||
                        (item.get_alias() != null && item.get_alias() == cmd.get_alias())
                    ) return item;
                    return null;
                });
                return r;
            } else {
                return null;
            }
        }
        /**
            During execution this is the method used for finding the command in the register
        */
        CommandReg.prototype.find = function(token,meta) {
            var cmd = this.$find(token,meta);
            if (cmd != null) {
                return cmd;
            }
            for (var i = this.$libraries.length - 1; i >= 0; i--) {
                cmd = this.$libraries[i].find(token, meta);
                if (cmd != null) {
                    return cmd;
                } 
            }
            return null;
        }
        cls.prototype.$find = function(token,meta) {
            var cmd = null; // The result - found command
            var subtype = BaseObject.getProperty(meta,"subtype",null);
            if (typeof token == "string" && subtype == "identifier") {
                // Search by regexp - the commands registered with one have to be found that way. If they do not match null is returned and the search would not go further
                if (this.$regexps != null) {
                    cmd = this.$regexps.FirstOrDefault(function(idx, item) {
                        var r = item.get_regexp();
                        if (r != null) {
                            if (r.test(token)) return item;
                        }
                        return null;
                    });
                    if (cmd != null) { // found as regexp
                        return cmd;
                    }
                }
                // if not regexp - by name
                cmd = this.get(token);
                if (cmd != null && cmd.get_action() != null) {
                    return cmd;
                }
                return null;
            }
            return null;
        }
        cmd.prototype.$index = function(cmd) {
            if (cmd.get_regexp() != null) {
                this.$regexps.addElement(cmd);
            }
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
            var cmd;
            if (typeof command == "string") {
                cmd = new CommandDescriptor(command, alias, regexp, action,help);
            } else if (BaseObject.is(command, "CommandDescriptor")) {
                cmd = command;
            } else if (typeof command == "object") {
                cmd = new CommandDescriptor(command.command, command.alias, command.regexp, command.action, command.help);
            } else {
                throw "Unusable arguments - check documentation";
            }
            var existing = this.get(cmd);
            if (existing != null && !bOverwrite) throw "Command with the same name or alias already exists - name:" + existing.get_name() + " alias:" + (existing.get_alias()|| "(no alias)") + "in command register with an owner " + this.ownerString();
            // If we are here any existing command with the same name or alias is doomed - remove it
            if (existing != null) {
                this.$commands.removeElement(existing);
                this.$regexps.removeElement(existing);
            }
            this.$commands.addElement(cmd);
            this.$index(cmd);
        }
        CommandReg.prototype.unregister = function(command) {
            var existing = this.get(command);
            if (existing != null) {
                this.$commands.removeElement(existing);
                this.$regexps.removeElement(existing);
                return true;
            }
            return false;
        }
        
        //#endregion ICommandRegister
        
        //#region ICommandRegisterLibrary
        
        CommandReg.prototype.$libraries = new InitializeArray("All the linked libraries");
        CommandReg.prototype.addLibrary = function(lib) { 
            if (BaseObject.is(lib, "ICommandRegister")) {
                if (this.$libraries.indexOf(lib) < 0) {
                    this.$libraries.push(lib);
                }
            } 
        }
        CommandReg.prototype.removeLibrary = function(lib) { 
            if (BaseObject.is(lib, "ICommandRegister")) {
                var index = this.$libraries.indexOf(lib);
                if (index >= 0) {
                    this.$libraries.splice(index,1);
                }
            } 
        }
        CommandReg.prototype.removeAllLibraries = function() { 
            this.$libraries.splice(0);
        }

    }

})();