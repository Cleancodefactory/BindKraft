/*
    File: registrators.js
    Contains various registrator declarations used in the OOP and advanced features implementations.

*/

//// REGISTRATORS //////////////////////////

// Registers a command in the global command processor (see: CommandProccessor in core.classes.js)
// DEPRECATED: Replaced by CL scripts. Will be kept for compatibility until a new major version
Function.prototype.registerShellCommand = function (commandName, alias, action, help) {
    if (Class.is(this, "BaseObject")) {
        if (CommandProccessor.registerCheckName.test(commandName)) {
            if (CommandProccessor.commandsRegister[commandName] == null) {
                CommandProccessor.register(commandName, alias, action, help);
            } else {
                throw 'registerShellCommand: Allready in use ' + commandName;
            }
        } else {
            throw 'registerShellCommand: Invalid name ' + commandName;
        }
    };
    return this;
}.Description("Registers a command in the global command processor")
 .Param("commandName","Name of the command, used for key")
 .Param("alias","Alias of the command")
 .Param("action","Method / callback for the command")
 .Param("help","Description of the intention of the command")
 .Returns("this - can be chained")
 .Deprecated("This is old feature. The new CL[S] (Command Line scripting) should be used. Yet this feature will be kept for backwards compatibility for a long time.");

// Registers a validation rule under alias name which can be used in the attribute syntax: data-validate-<alias>=
Function.prototype.registerValidator = function (validatorName) {
    if (Class.is(this, "ValidateValue")) {
        if (Validator.reRegistrationNameCheck.test(validatorName)) {
            if (Validator.validatorsRegistry[validatorName] == null) {
                Validator.validatorsRegistry[validatorName] = this.classType;
            } else {
                throw "registerValidator: the name is already used. name:" + validatorName + ", class: " + this.classType;
            }
        } else {
            throw "registerValidator: incorrect registration name:" + validatorName + ". Only small caps alphanumeric names are allowed";
        }
    } else {
        throw "registerValidator: Only descendants of ValidateValue can be registered. Class: " + this.classType;
    };
    return this;
}.Description("Registers a validation rule under alias name")
 .Param("validatorName","Name of the validator, used as key")
 .Remarks("usage in bindings: data-validate-<alias>= ")
 .Returns("this - canbe chained");

 
// Destruction helpers
Function.prototype.Obliterable = function (f) {
    this.$detachOnObliterate = ((f === false)?false:true);
    return this;
}.Description("If true detach the member on obliteration. This is rarely needed - e.g. in case of two way references that may prevent garbage collection because of indirect involvment of DOM reference")
 .Param("f","True causes the obliterate to delete this member.");
 
// Pseudoreg - attach a preferred this to a function
// +V: 2.12.0 DEPRECATED
// Not really needed and no usage is known ever
Function.prototype.BindThis = function(_this) {
	this.$boundThis = _this;
}
Function.prototype.Call = function(_this, a1, a2, a3, aN) {
	var args = Array.createCopyOf(arguments,1);
	if (this.$boundThis != null) {
		return this.apply(this.$boundThis, args);
	} else {
		return this.apply(_this, args);
	}
}
Function.prototype.Apply = function(_this, args) {
	if (this.$boundThis != null) {
		return this.apply(this.$boundThis, args);
	} else {
		return this.apply(_this, args);
	}
}
// -V: 2.12.0 DEPRECATED
 
// alternative way to create queries from bindings. parameterParser(bindingParam, hardParams) -> returns query
// The parameterPArser is called with this == Handler binding
Function.prototype.registerStructuralQueryAlias = function(palias, parameterParser, hardParams) {
	var r = BaseObject.queryRegistrations;
	if (r[palias] != null) {
		throw "Structural query alias " + palias + " is already registered.";
	}
	r[palias] = {
		parser: parameterParser,
		params: hardParams
	};
}.Description("Register queries")
 .Param("palias","Name of the query used as key")
 .Param("parameterParser","...")
 .Param("hardParams","...");

// +EXPERIMENTAL 
Function.prototype.registerDaemonInfo = function(alias, single) {
	this.daemonInfo = {
		alias: alias,
		single: single || false
	};
}
// -EXPERIMENTAL 