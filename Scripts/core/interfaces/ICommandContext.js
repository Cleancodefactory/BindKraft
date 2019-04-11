function ICommandContext() {}
ICommandContext.Interface("ICommandContext");
/**
	If this returns true the executor will recognize commands by first checking here and then its root context.
*/
ICommandContext.prototype.get_prioritycommands = function() { return false; }
ICommandContext.prototype.get_commands = function() { throw "not implemented"; }
ICommandContext.prototype.get_environment = function() { throw "not implemented"; }
ICommandContext.prototype.get_application = function() { throw "not implemented"; }
ICommandContext.prototype.get_custom = function() { throw "not implemented"; }
ICommandContext.prototype.isFunctional = function() { throw "not implemented"; }