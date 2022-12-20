function ConvertDateTime() {
	SystemFormatterBase.apply(this,arguments);
	if (typeof System.Default().settings.DefaultTransferDateEncoding == "string") {
		// This setting is put deep into system settings and not as defaults of this
		// class because it matters in more general sense (to other code as well)
		this.set_defaultencoding(System.Default().settings.DefaultTransferDateEncoding); 
	}
}
ConvertDateTime.Inherit(SystemFormatterBase,"ConvertDateTime");
ConvertDateTime.Implement(IArgumentListParserStdImpl,"trim");
ConvertDateTime.ImplementProperty("defaultencoding", new InitializeStringParameter("The default format if nothing is specified", "ISO"));
ConvertDateTime.$reMS = /\/Date\(([+-]?\d+)\)\//i;
ConvertDateTime.$reISODate = /^(\d{4}-\d{1,2}-\d{1,2})(T|\s)(\d{1,2}:\d{1,2}:\d{1,2}(?:\.\d+)?)(?:(Z)|(?:(\+|-)(\d{2})(?::?(\d{2}))?))$/;
ConvertDateTime.$reISOLocalDate = /^(\d{4}-\d{1,2}-\d{1,2})(T|\s)(\d{1,2}:\d{1,2}:\d{1,2}(?:\.\d+)?)$/;
ConvertDateTime.prototype.ToDate = {
	ISO: function(val) {
		// Limitator - intentionally limiting the syntax  to the one widely agreed upon.
		var done = false;
		var tSign = null,tMilliseconds = 0;
		if (typeof val == "string") {
			val = val.replace(ConvertDateTime.$reISODate, function(matched, y,sep,h,z,tzsign,tzH, tzM) {
				done = true;
				if (z != null && z.length > 0) {
					return y + "T" + h + "Z";
				} else {
					tSign = (tzsign == "+")?true:false;
					tMilliseconds = parseInt(tzH, 10) * 1000 * 3600;
					if (tzM != null && tzM.length > 0) {
						tMilliseconds += parseInt(tzM, 10) * 60 * 1000;
					}
					return y + "T" + h + "Z";
				}
				
			});
		}
		var rdate;
		if (!done) return null;
		rdate = new Date(val);
		if (tSign === true) {
			rdate.setTime(rdate.getTime() + tMilliseconds);
		} else if (tSign === false) {
			rdate.setTime(rdate.getTime() - tMilliseconds);
		}
		return rdate;
	},
	ISOLocal: function(val) {
		// Limitator - intentionally limiting the syntax  to the one widely agreed upon.
		var done = false;
		if (typeof val == "string") {
			val = val.replace(ConvertDateTime.$reISOLocalDate, function(matched, y,sep,h) {
				done = true;
				return y + "T" + h;
			});
		}
		if (done) return new Date(val);
		return null;
	},
	MS: function(val) { // \/Date(###)\/
		if (typeof val == "string") {
			var matches = ConvertDateTime.$reMS.exec(val);	
			if (matches != null) {
				var ms = parseInt(matches[1], 10);
				if (!isNaN(ms)) {
					return new Date(ms);
				}
			}
		}
		return null;
	},
	TICKS: function(val) {
		var v = null;
		if (typeof val == "string") {
			v = parseInt(val,10);
		} else if (typeof val == "number") {
			v = val;
		}
		if (v != null) {
			return new Date(v);
		} else {
			return null;
		}
	}
};
ConvertDateTime.prototype.FromDate = {
	ISO: function(val) {
		return val.toISOString();
	},
	ISOLocal: function(val) {
		var d = val, tMilliseconds = 0;
		tMilliseconds = (d.getHours() - d.getUTCHours()) * 3600 * 1000;
		tMilliseconds += (d.getMinutes() - d.getUTCMinutes()) * 60 * 1000;
		var d = new Date(val.getTime() + tMilliseconds);
		var s = d.toISOString();
		return s.slice(0,s.length - 1);

	},
	MS: function(val) {
		return "\\/Date(" + val.getTime().toString() + ")\\/";
	},
	TICKS: function(val) {
		if (BaseObject.is(val, "Date")) {
			return val.getTime();
		}
		return null; // TODO: This is extremely rare, but still -- is this the right behavior?
	}
	
};
ConvertDateTime.prototype.Read = function(val, bind, params) {
	if (BaseObject.is(val, "Date")) return val; // already date - pass through
	var conv = this.ToDate[this.get_defaultencoding()];
	if (typeof params == "string" && params.length > 0) {
		conv = this.ToDate[params];
	}
	if (typeof conv == "function") {
		return conv(val);
	}
	return null;
}
ConvertDateTime.prototype.Write = function(val, bind, params) {
	if (BaseObject.is(val,"Date")) {
		var conv = this.FromDate[this.get_defaultencoding()];
		if (typeof params == "string" && params.length > 0) {
			conv = this.FromDate[params];
		}
		if (typeof conv == "function") {
			return conv(val);
		}
		throw "ConvertDateTime cannot convert the date to raw transfer value - the conversion specified is not available";
	}
	return val;
}