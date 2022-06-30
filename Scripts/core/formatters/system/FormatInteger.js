/*
	We have to write our code for formatting and parsing - Globalize dea;s fairly well with dates, but that is it
*/
function FormatInteger() {
	SystemFormatterBase.apply(this,arguments);
}
//FormatInteger.DoNotRegister = true;
FormatInteger.Inherit(SystemFormatterBase,"FormatInteger");
FormatInteger.Implement(IArgumentListParserStdImpl,"spaced",true);
FormatInteger.ImplementProperty("culture", new InitializeStringParameter("Culture name (must be loaded in order to use it), null means the system default - initialized with CL initculture", null));
FormatInteger.prototype.$getGlobalizer = function(args,o) { // o fillef, but not currently used
	// defaults
	var culture = this.get_culture();
	if (culture == null) culture = System.Default().settings.CurrentLang;
	for (var i = 0; i < args.length; i++) {
		var arg = args[i];
		if (/^\[\w{2}(-\w{2})?\]$/.test(arg)) {
			culture = arg.slice(1,-1);
		}
		if (arg != null && arg.length > 0) {
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
FormatInteger.prototype.Read = function(val, bind, args) {
	if (val == null) return null;
	var v = val;
	var o = { };
	if (typeof val == "number") {
		v = Math.round(val);
	} else {
		v = parseInt(val, 10);
	}
	if (isNaN(v)) return null;
	var g = this.$getGlobalizer(args,o);
	return g.format(v);
}
FormatInteger.prototype.Write = function(val, bind, args) {
	var v = val;
	var o = { };
	if (typeof val == "number") {
		return Math.round(val);
	} else if (val == null) {
		return null;
	}
	var g = this.$getGlobalizer(args,o);
	return g.parseInt(v + "");
}