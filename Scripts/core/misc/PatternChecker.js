function PatternChecker(patt, notnull, convandcheck) {
	BaseObject.apply(this, arguments);
	if (typeof patt == "string") {
		this.set_pattern(patt);
	} else if (patt instanceof RegExp) {
		this.set_pattern(patt);
	}
	this.set_notnull(notnull?true:false);
	this.set_convertandcheck(convandcheck?true:false);
	// Removed in pre-release - now assumed from convandcheck
	// this.set_allownonstrings(allownonstrings?true:false);
}
PatternChecker.Inherit(BaseObject, "PatternChecker");
PatternChecker.Implement(IValueChecker);
PatternChecker.ImplementProperty("pattern", new InitializeStringParameter("RegExp pattern the value needs to match", null), null, "OnPatternChanged");
PatternChecker.ImplementProperty("startswith", new InitializeStringParameter("A prefix string", null));
PatternChecker.ImplementProperty("notnull", new InitializeBooleanParameter("If true the value cannot be null", false));
//PatternChecker.ImplementProperty("allownonstrings", new InitializeBooleanParameter("If true nonstring values are considered correct.", false));
PatternChecker.ImplementProperty("convertandcheck", new InitializeBooleanParameter("If true nonstring values are toStringed and tested against the pattern to determine correcthess.", false));
PatternChecker.prototype.OnPatternChanged = function(propname, oldval,newval) {
	this.$repattern = null;
}
PatternChecker.prototype.$repattern = null;
PatternChecker.prototype.$getRepattern = function() {
	if (this.$repattern != null) return this.$repattern;
	if (this.get_pattern() != null) {
		if (typeof this.get_pattern() == "string" && this.get_pattern().length > 0) {
			this.$repattern = new RegExp(this.get_pattern());
		} else if (this.get_pattern() instanceof RegExp) {
			this.$repattern = new RegExp(this.get_pattern().source);
		} else if (typeof this.get_pattern() == "string" && this.get_pattern().length == 0) {
			this.$repattern = null;
		}
	}
	return this.$repattern;
}
PatternChecker.prototype.checkValue = function(v) {
	if (v == null) {
		return (this.get_notnull()?false:true);
	}
	var s = null;
	if (typeof v == "string") {
		s = v;
	} else if (this.get_convertandcheck()) {
		if (typeof v["toString"] == "function") {
			s = v.toString();
		}
	}
	if (s != null) {
		var re = this.$getRepattern();
		if (re != null) {
			return re.test(s);
		} 
		if (this.get_startswith() != null) {
			if (s.indexOf(this.get_startswith()) != 0) return false;
		}
		return true;
		
	} else {
		return false;
	}
}
// Built-in checkers
PatternChecker.IdentName = new PatternChecker(/^[A-Za-z][A-Za-z0-9_\$]*$/);
PatternChecker.FileName = new PatternChecker(/^[A-Za-z0-9_\-\.\$]*$/);
PatternChecker.UrlSchema = new PatternChecker(/^[A-Za-z][A-Za-z0-9_\-\.\$]*$/, true);
PatternChecker.RegisterName = new PatternChecker(/^[A-Za-z][A-Za-z0-9_\$]*$/, true);

PatternChecker.StartsWith = function(str) {
	var pc = new PatternChecker(null,true,true);
	pc.set_startswith(str);
	return pc;
}
