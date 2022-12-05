/*
	We have to write our code for formatting and parsing - Globalize dea;s fairly well with dates, but that is it
*/
function FormatFloat() {
	SystemFormatterBase.apply(this,arguments);
}
//FormatFloat.DoNotRegister = true;
FormatFloat.Inherit(SystemFormatterBase,"FormatFloat");
FormatFloat.Implement(IArgumentListParserStdImpl,"spaced",true);
FormatFloat.ImplementProperty("culture", new InitializeStringParameter("Culture name (must be loaded in order to use it), null means the system default - initialized with CL initculture", null));
FormatFloat.prototype.$getGlobalizer = function(args,o) { // o fillef, but not currently used
	// defaults
	var culture = this.get_culture();
	if (culture == null) culture = System.Default().settings.CurrentLang;
	for (var i = 0; i < args.length; i++) {
		var arg = args[i];
		if (/^\[[a-zA-Z]{2}(-[a-zA-Z]{2})?\]$/.test(arg)) {
			culture = arg.slice(1,-1);
			continue;
		}
		if (/^[DNCP]\d*$/.test(arg)) {
			o.pattern = arg;
		}
	}
	var globalizer = null;
	
	if (culture != System.Default().settings.CurrentLang) {
		if (Globalize.cultures[culture] == null) {
			// Try to strip
			if (culture.length > 0 && Globalize.cultures[culture.slice(0,2)] != null) {
				culture = culture.slice(0,2);
			} else {
				// Remains system default
				culture = System.Default().settings.CurrentLang; // Reset the requested one
				// TODO: Introduce other policies
			}
		}
		globalizer = new Globalize(culture);
	} else {
		globalizer = Globalize.Default;
	}
	return globalizer;
}
FormatFloat.prototype.Read = function(val, bind, args) {
	if (val == null) return null;
	var v = val;
	var o = { };
	if (typeof val != "number")	val = parseFloat(val);
	if (isNaN(v)) return null;
	var g = this.$getGlobalizer(args,o);
	if (o.pattern != null) {
		return g.format(v,o.pattern);
	} else {
		return g.format(v);
	}
	
}
FormatFloat.prototype.Write = function(val, bind, args) {
	var v = val;
	var o = { };
	if (typeof val == "number") {
		return val;
	} else if (val == null) {
		return null;
	}
	var g = this.$getGlobalizer(args,o);
	if (o.pattern != null) {
		return g.parseFloat(v + "", o.pattern);
	} else {
		return g.parseFloat(v + "");
	}
	
}