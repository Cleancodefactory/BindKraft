function CommandDescriptor(obj_or_name, alias,regexp,action,help) {
	BaseObject.apply(this,arguments);
	var i,n;
	if (typeof obj_or_name == "string") {
		this.$name = obj_or_name;
		this.$alias = alias;
		this.$action = action;
		this.$help = help;
		this.$regexp = regexp;
	} else if (typeof obj_or_name == "object" && obj_or_name != null) {
		this.$name = obj_or_name.name;
		this.$alias = obj_or_name.alias;
		this.$action = obj_or_name.action;
		this.$help = obj_or_name.help;
		this.$regexp = obj_or_name.regexp;
	}
}
CommandDescriptor.Inherit(BaseObject,"CommandDescriptor");
CommandDescriptor.ImplementReadProperty("name",new InitializeStringParameter("The name of the command", null));
CommandDescriptor.ImplementReadProperty("alias", new InitializeStringParameter("Optional alias for the command", null));
CommandDescriptor.ImplementReadProperty("regexp", new InitializeParameter("Optional regular expression parameter - it has to match and also can be used to parse the commands token", null));
CommandDescriptor.ImplementReadProperty("action", new Initialize("The implementation as callback. If async it must return Operation.",null));
CommandDescriptor.ImplementReadProperty("help", new InitializeStringParameter("Little help - 2-3 lines recommended", null));
CommandDescriptor.prototype.equals = function (obj)  { // Note that the regexp is not compared!
    if (!BaseObject.is(obj, "CommandDescriptor")) return false;
    if (this == obj) return true;
	if (!BaseObject.compareObjectProperties(this, obj, ["$name","$alias","$action","$help"])) return false;
    return true;
};
