


/*CLASS Parse and execute command, syntax opencard params...*/
function CommandProccessor() {
    // this.$registerDefaults();
};
CommandProccessor.commandsRegister = [];
CommandProccessor.registerCheckName = /([a-zA-Z0-9-_\\\/]+)/;
// CommandProccessor.prototype.$re = /(?:\s*(?:(?:\'((?:\'\'|.)+)\')|(\S+)))/g;
// Old expr: /(?:\s*(?:(?:(?:\'(.+?)\')|([a-zA-Z0-9-_=\\\/]+))))/g;
CommandProccessor.prototype.$parseExpression = function (expression) {
    var result, result1;
    var tokens = [];
    // var $re = /(?:\s*(?:(?:\'((?:\'\'|[^\'])*)\')|(\S+)))/g;
	var $re = /(?:\s*(?:(?:\{((?:\\\{|\\\}|[^\}])*)\})|(?:\'((?:\'\'|[^\'])*)\')|(\S+)))/g;
    while (result = $re.exec(expression)) {
		if (result[1] != null) {
			var s = result[1].replace("\\{", "{").replace("\\}", "}");
			var $re1 = /\s*(?:(?:\'((?:\'\'|[^\'])+)\')|(\S+))\s*:\s*(?:\'((?:\'\'|[^\'])*)\'|(\S+))\s*,?/g;
			var o = {};
			while (result1 = $re1.exec(s)) {
				var n = null;
				var v = null;
				if (result1[1] != null) {
					n = result1[1].replace("''","'");
				} else if (result1[2] != null) {
					n = result1[2];
				}
				if (result1[3] != null) {
					v = result1[3].replace("''","'");
				} else if (result1[4] != null) {
					v = result1[4];
				}
				if (n != null) o[n] = v;
			}
			tokens.push(o);
        } else if (result[2] != null) {
            tokens.push(result[2].replace("''", "'"));
        } else {
            tokens.push(result[3]);
        }
    };
    return tokens;
};
CommandProccessor.objectToParamArray = function(a) {
	var arr = [];
	for (var k in a) {
		arr.push({ name: k, value: a[k]});
	}
	return arr;
}
CommandProccessor.objectToParameter = function(o) {
	var s = "{";
	for (var k in o) {
		if (s.length > 1) s += ",";
		s += "'" + k.replace("'","''") + "': '" + ("" + o[k]).replace("'","''") + "'";
	}
	s += "}";
	return s;
}
CommandProccessor.$getCommandDescription = function (commandName) {
    return CommandProccessor.commandsRegister.FirstOrDefault(function (i, el) {
        if (el.commandName == commandName || el.alias == commandName) return el;
        return null;
    });
};
// This function is glued to the array objects passed for processing to the registered commands
// It MUST be used inside the action functions of the commands, but it SHOULD NOT be used by other routines.
CommandProccessor.$_eatToken = function (n) {
    if (arguments.length == 0) {
        this.splice(0, 1);
    } else {
        this.splice(0, n);
    }
    return this;
};
CommandProccessor.$_consumeToken = function () {
    if (this.length == 0) return null;
    return this.splice(0, 1);
};
CommandProccessor.$_consumeParam = function () {
    if (this.length == 0) return null;
    var arr = this.splice(0, 1);
    if (arr != null && arr.length > 0) {
        return arr[0];
    }
    return null;
};
// cmd arg1 arg2 cmd2 'arg 1' arg3 'O''Neill'
CommandProccessor.prototype.executeCommand = function (expression) {
    if (typeof expression == "string") {
        var tokens = this.$parseExpression(expression);
        return CommandProccessor.$executeCommand(tokens);
    } else if (BaseObject.is(expression, "Array")) {
        if (expression.eatToken == null) {
            expression.eatToken = CommandProccessor.$_eatToken;
            expression.consumeToken = CommandProccessor.$_consumeToken;
            expression.consumeParam = CommandProccessor.$_consumeParam;
        }
        return CommandProccessor.$executeCommand(expression);
    }
};
CommandProccessor.prototype.parseUrlHashCommands = function(hash) {
	var result = {};
	if (BaseObject.is(hash, "string")) {
		var re = /^#?([a-zA-Z0-9_\-]+)\=(.*?)?(?=\&|$)/g;
		var arr;
		while (arr = re.exec(hash)) {
			if (arr[1] != null) {
				var v = (arr[2] != null)?arr[2].trim():null;
				result[arr[1].trim()] = v;
			}
        }
	}
	return result;
}
CommandProccessor.prototype.executeUrlHash = function(cmdkeys) {
	var hash = document.location.hash;
	var executed = 0;
	if (hash != null && hash.length > 0) {
		var cmds = this.parseUrlHashCommands(hash);
		for (var i = 0; i < arguments.length; i++) {
			var k = arguments[i];
			if (k in cmds) {
				this.executeCommand(cmds[k])
				executed ++;
			}
		}
	}
	return executed;
}
CommandProccessor.$executeCommand = function (params) {
    if (params == null || !BaseObject.is(params, "Array")) {
        jbTrace.log("CommandProccessor: $execute command called with invalid token array");
        return null; // TODO: May be throw exception here ???
    }
    if (params.length == 0) {
        jbTrace.log("CommandProccessor: $execute command called with empty token array");
        return null; // TODO: May be throw exception here ???
    }
    if (params.eatToken == null) {
        params.eatToken = CommandProccessor.$_eatToken;
        params.consumeToken = CommandProccessor.$_consumeToken;
        params.consumeParam = CommandProccessor.$_consumeParam;
    }
    var commandName = params[0];
    var command = CommandProccessor.$getCommandDescription(commandName);
    if (!IsNull(command)) {
        return command.execute(params.eatToken());
    }
    return null;
};
CommandProccessor.$_commandExecute = function (tokens) {
    if (BaseObject.is(this.action, "Delegate")) {
        return this.action.invoke(tokens);
    } else if (typeof this.action == "function") {
        return this.action.call(null, tokens);
    }

};
CommandProccessor.register = function (commandName, commandAlias, action, help) {
    var commandObject = {
        commandName: commandName,
        alias: commandAlias,
        action: action,
		help: help
    };
    CommandProccessor.commandsRegister.addElement(commandObject);
    commandObject.execute = CommandProccessor.$_commandExecute;
};
CommandProccessor.Default = new CommandProccessor();
CommandProccessor.register("all",null, function(tokens) {
	var v = "", n = 1;
	while (tokens != null && tokens.length > 0) {
		var r = CommandProccessor.Default.executeCommand(tokens);
		if (r != null) {
			v += r + "\n";
		} 		
	}
	return v;
},"Executes multiple commands");