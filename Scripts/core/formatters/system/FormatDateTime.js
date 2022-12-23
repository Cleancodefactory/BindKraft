/*
	Parameters:
	culture: "[xx]" | "[xx-YY]"
	zonemode: "default" | "utc" | "none" | "local"
	pattern: <anything else is treated as pattern>. Shorthands: d,D,t,T,f,F,M,n,N,Y,S,K,w,W
	
*/
function FormatDateTime() {
	SystemFormatterBase.apply(this,arguments);
}
FormatDateTime.Inherit(SystemFormatterBase,"FormatDateTime");
FormatDateTime.Implement(IArgumentListParserStdImpl,"spaced",true);
FormatDateTime.ImplementProperty("pattern", new InitializeStringParameter("default pattern", "N"));
FormatDateTime.ImplementProperty("culture", new InitializeStringParameter("Culture name (must be loaded in order to use it), null means the system default - initialized with CL initculture", null));
FormatDateTime.ImplementProperty("zonemode", new InitializeStringParameter("Zone mode - default, utc|none, local", "default"));

/**
 * The args can contain up to 3 components:
 * culture: "[xx]" | "[xx-YY]"
 * zonemode: "default" | "utc" | "none" | "local"
 *	pattern: <anything else is treated as pattern>. Shorthands: d,D,t,T,f,F,M,n,N,Y,S,K,w,W
 */
FormatDateTime.prototype.$getGlobalizer = function(args,o) {
	// defaults
	var zonemode  = this.get_zonemode();
	o.pattern = this.get_pattern();
	var culture = this.get_culture();
	if (culture == null) culture = System.Default().settings.CurrentLang;
	for (var i = 0; i < args.length; i++) {
		var arg = args[i];
		if (/^\[\w{2}(-\w{2})?\]$/.test(arg)) {
			culture = arg.slice(1,-1);
		} else if(/default|utc|none|local/.test(arg)) {
			zonemode = arg;
		} else if (arg != null && arg.length > 0) {
			o.pattern = arg;
		}
	}
	var globalizer = null;
	var utcdate = false;
	switch (zonemode) {
		case "utc":
		case "none":
			utcdate = true;
		break;
		case "local":
			utcdate = false
		break;
		default:
			utcdate = window.g_UTCDate;
	}
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
		globalizer = new Globalize(culture,utcdate);
	} else {
		if (zonemode == "default") {
			globalizer = Globalize.Default;
		} else if (zonemode == "utc" || zonemode == "none") {
			globalizer = Globalize.UTCMode;
		} else if (zonemode == "local") {
			globalizer = Globalize.LocalMode;
		}
	}
	return globalizer;
}
FormatDateTime.prototype.Read = function(val, bind, args) {
	var o = { pattern: "f" };
	var g = this.$getGlobalizer(args,o);
	return g.format(val,o.pattern);
}
FormatDateTime.prototype.Write = function(val, bind, args) {
	if (typeof val == "string") {
		var o = { pattern: "f" };
		var g = this.$getGlobalizer(args,o);
		var v = g.parseDate(val,o.pattern);
		if (v == null) {
			this.errorIfNeeded(bind, "Cannot parse date. Format: " + o.pattern + " value: " + val);
		}
		return v;
	} else {
		return val;
	}
	
}