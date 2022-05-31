function CommandReg(owner) {
	BaseObject.apply(this,arguments);
	this.owner = owner;
}
CommandReg.Inherit(BaseObject,"CommandReg");
CommandReg.Implement(Interface("ICommandRegisterLibrary"));
CommandReg.prototype.$commands = new InitializeArray("Commands register");
CommandReg.prototype.$regexps = new InitializeArray("Array of the commands that have regexps ");

//#region ICommandRegister
CommandReg.prototype.ownerString = function() {
	if (typeof this.owner == "string") return this.owner;
	if (BaseObject.is(owner, "BaseObject")) return owner.fullClassType();
	return "(owner not determined)";
}
CommandReg.prototype.exists = function(cmd_or_name) {
	if (this.get(cmd_or_name) != null) return true;
	return false;
}
CommandReg.prototype.get = function(cmdname) {
	var cmd = this.$get(cmdname);
	if (cmd != null) return cmd;
	for (var i = this.$libraries.length - 1; i >= 0; i--) {
		cmd = this.$libraries[i].get(cmdname);
		if (cmd!= null) return cmd;
	}
}
CommandReg.prototype.$get = function(cmdname) {
	if (typeof cmdname == "string") {
		return this.$commands.FirstOrDefault(function(idx, item) {
			if (item.get_name() == cmdname || item.get_alias() == cmdname) return item;
			return null;
		});
	} else if (BaseObject.is(cmdname, "CommandDescriptor")) {
		var cmd = cmdname;
		return this.$commands.FirstOrDefault(function(idx,item) {
			if (
				item.get_name() == cmd.get_name() ||
				item.get_name() == cmd.get_alias() ||
				(item.get_alias() != null && item.get_alias() == cmd.get_name()) ||
				(item.get_alias() != null && item.get_alias() == cmd.get_alias())
			) return item;

			return null;
		});
	} else {
		return null;
	}
}
/**
	During execution this is the method used for finding the command in the register
*/
CommandReg.prototype.find = function(token,meta) {
	var cmd = this.$find(token,meta);
	if (cmd != null) return cmd;
	for (var i = this.$libraries.length - 1; i >= 0; i--) {
		cmd = this.$libraries[i].find(token, meta);
		if (cmd!= null) return cmd;
	}
}
CommandReg.prototype.$find = function(token,meta) {
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
CommandReg.prototype.$index = function(cmd) {
	if (cmd.get_regexp() != null) {
		this.$regexps.addElement(cmd);
	}
}
CommandReg.prototype.register = function(command, alias, regexp, action, help, bOverwrite) {
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

//#endregion



// STATIC global ========================
CommandReg.$Global = null;
CommandReg.Global = function() {
	if (this.$Global == null) {
		// The owner is the global command executor singleton
		this.$Global = new CommandReg("$SYSTEM");
	}
	return this.$Global;
}
// The global commands definitions are moved to system/globalcommands.js
