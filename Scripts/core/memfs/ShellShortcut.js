/**
	Inherits CLScript to add UI oriented properties that can be used by shells to dispay it.
	There exists some ambiguity in some cases about the display name of a shortcut - what to use the name in the shortcut or its file name.
	Working convention: The name in the shortcut should be prefered.
	Suggestion: In shellfs:startmenu/ shortcuts can have good looking names, may be we should use them (for that directory only?)
*/
function ShellShortcut(script, name, desc) {
	CLScript.call(this,script, "Commander");
	this.$name = name;
	this.$description = desc;
}
ShellShortcut.Inherit(CLScript, "ShellShortcut");
ShellShortcut.Implement(IMemoryFileImpl);
// ShellShortcut.Implement(IUsingValueCheckers); // If this becomes needed - uncomment it
ShellShortcut.ImplementProperty("name", new InitializeStringParameter("The name of the shortcut", null));
ShellShortcut.ImplementProperty("description", new InitializeStringParameter("A longer optional description", null));
ShellShortcut.ImplementProperty("appclass", new InitializeStringParameter("The type name of the app class that runs as result of this shortcut", null));
ShellShortcut.ImplementProperty("icon", new Initialize("An IconSpec", null));
ShellShortcut.prototype.icon = function(iconspec_modulename, respath, restype, servername) {
	if (BaseObject.is(iconspec_modulename, "IconSpec")) {
		this.set_icon(iconspec_modulename);
	} else {
		var icn = new IconSpec(iconspec_modulename, respath, restype, servername);
		this.set_icon(icn);
	}
	return this;
}
ShellShortcut.prototype.appclass = function(v) {
	if (typeof v == "string") {
		this.set_appclass(v);
	}
	return this;
}
ShellShortcut.prototype.name = function(v) {
	if (typeof v == "string") {
		this.set_name(v);
	}
	return this;
}
ShellShortcut.prototype.description = function(v) {
	if (typeof v == "string") {
		this.set_description(v);
	}
	return this;
}

