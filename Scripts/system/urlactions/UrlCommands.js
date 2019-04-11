/*
	The code here is invoked through a CL command. Its task is to inspect the URL of the workspace when it 
	loads, extract, construct and execute any startup URL commands.
	
	This subsystem is distinct from the contentURI links although they share many common traits (because of their somewhat similar purposes)
	
	This code is not intended for application use!
	
	Details:
		The settings of the feature are in 
		appfs:system/urlcommands
		
		The particular settings UNDER that directory are as follows:
		/general -	property file with general settings (currently only 'prefix')
		/scripts -  CLScript or compatible files with pre-defined scripts, can be addressed in alias 'dependencies' as script:<filename>
		/aliases -  Registered aliases each has a property file.
					Currently supported properties:
					'dependencies' {list} - can contain string entries formed as:
						cl:<literal cl script> - in-place specified script
						script:<scriptname>	   - script name from scripts directory
					'app' {string} - the class name of the application for which is the alias - used in reverse lookup
					'id'  {string} - reserved for app usage (needed in case of multiple aliases regisered by the same app)
						
		When an URL is processed the following is done:
		1. Read all parameters that start with the specified prefix
		2. For each entry
			2.1. construct a CL script by concatenating in order
			2.2. All entries from dependencies property (single string is processed as single entry list)
			2.3. each dependency entry is resolved as stated above to literal script (cl:) or pre-defined script (script:) taking only the actual content
			2.4. this is appended with the value from the query parameter.
			
		example:
		(non-encoded for readability)
		http://somewhere.com/dir/dir2?$runA1=cmd1 param cmd2 param&x=123&y=humans&$runA2=cmdx
		if the prefix is $run
		we have two command entries:
		$runA1 and  $runA2
		... TODO ... complete the example
	
*/

function UrlCommandsProcessor() {
	BaseObject.apply(this, arguments);
	// Open the directories we need frequently
	this.scriptsdir = System.FS("appfs").cd("system/urlcommands/scripts");
	this.aliasdir = System.FS("appfs").cd("system/urlcommands/aliases");
	// General settings fileCreatedDate
	this.general = System.FS("appfs").cd("system/urlcommands").item("general");
	if (!BaseObject.is(this.general, "PropertySetMemoryFile")) {
		this.general = null;
	}
}
UrlCommandsProcessor.Inherit(BaseObject, "UrlCommandsProcessor");
UrlCommandsProcessor.StatementDelimiter = " ";
// Digging into the settings
UrlCommandsProcessor.prototype.getAlias = function(alias) {
	var a = this.aliasdir.item(alias);
	if (BaseObject.is(a,"PropertySetMemoryFile")) {
		return a;
	}
	return null; // Not found, not an alias
}
UrlCommandsProcessor.prototype.getScript = function(name) {
	var scr = this.scriptsdir.item(name);
	if (BaseObject.is(scr,"CLScript")) {
		return scr.get_script();
	}
	return null;
}
UrlCommandsProcessor.prototype.resolveAliasToScript = function(alias) {
	var a = this.getAlias(alias);
	var result = null;
	if (a != null) {
		result = ""; // The alias can be empty - its existence is enough
		// Currently supported
		var deps = a.getProp("dependencies");
		if (typeof deps == "string") deps = [deps];
		if (BaseObject.is(deps, "Array")) {
			/* 
				Each element can be 
					- CL script, starting with cl:
					- "variable" starting with script:
						these are pre-defined scripts from the scripts dir
			*/
			for (var i = 0; i < deps.length; i++) {
				var d = deps[i];
				var s;
				if (typeof d == "string") {
					if (d.indexOf("script:") == 0) {
						s = this.getScript(d.slice("script:".length));
						if (s == null) continue;
						if (result.length > 0) result += UrlCommandsProcessor.StatementDelimiter;
						result += s;
					} else if (d.indexOf("cl:") == 0) {
						s = d.slice("cl:".length);
						if (result.length > 0) result += UrlCommandsProcessor.StatementDelimiter;
						result += s;
					}
				}
			}
		}
		return result;	
	}
	
}
// Processing the URL
UrlCommandsProcessor.prototype.getURLCommands = function(url) {
	var qry = null;
	if (!BaseObject.is(url, "IBKUrlObject")) return null; // no commands
	if (url.is("BKUrl")) {
		if (BaseObject.is(url.get_query(), "BKUrlQuery")) {
			qry = url.get_query();
		}
	} else if (url.is("BKUrlQuery")) {
		qry = url;
	}
	if (qry == null) return null; // nothing to do here
	if (this.general == null) return null;
	var pref = this.general.getProp("prefix");
	if (typeof pref != "string" || pref.length == 0) return null;
	
	var keys = qry.keys(PatternChecker.StartsWith(pref));
	if (keys.length > 0) {
		var cmds = {};
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i].slice(pref.length); // The meaningful part - matches the alias
			var cmd = "";
			
			cmd = this.resolveAliasToScript(key);
			if (typeof cmd  == "string") { // TODO: Take care to really check this
				cmds[key] = cmd + UrlCommandsProcessor.StatementDelimiter + qry.get(pref+key,0);
			}
		}
		return cmds;
	}
	return null;
}