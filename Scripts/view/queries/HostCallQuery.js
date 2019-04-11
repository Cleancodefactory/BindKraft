


// Containment standard query
/*CLASS*/ /*QUERY*/
function HostCallQuery(cmd, args) {
    BaseObject.apply(this, arguments);
    this.command = cmd;
    this.parameters = args;
};
HostCallQuery.Inherit(BaseObject, "HostCallQuery");
HostCallQuery.prototype.command = null;
HostCallQuery.prototype.clearCommandFlag = function (flag) { this.command &= (0xFFFF ^ flag); };
HostCallQuery.prototype.isComplete = function () { if (this.command == 0) return true; return false; };
HostCallQuery.prototype.parameters = null;
HostCallQuery.prototype.roleid = null; // Only for queryrole This function has been deprecated!
HostCallQuery.prototype.host = null; // Only for gethost

HostCallQuery.registerStructuralQueryAlias("hostcommand", function(param,data) {
	if (param != null) {
		var arr = param.split(",");
		var cmds = 0;
		for (var i = 0; i < arr.length; i++) {
			if (HostCallCommandEnum[arr[i]] != null) {
				cmds |= HostCallCommandEnum[arr[i]];
			} else {
				throw "Unsupported or wrong command has been specified for hostcommand";
			}
		}
		return new HostCallQuery(cmd);
	} else {
		throw "hostcommand needs a binding parameter!";
	}
});