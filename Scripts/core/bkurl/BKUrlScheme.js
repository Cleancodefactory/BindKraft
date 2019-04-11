/*


Implementation checklist
	
	
*/
function BKUrlScheme(urlstr, bdecode, bencode) {
	BKUrlObjectBase.apply(this, arguments);
	
}
BKUrlScheme.Inherit(BKUrlObjectBase,"BKUrlScheme");
BKUrlScheme.Implement(IUsingValueCheckersImpl);
BKUrlScheme.ImplementProperty("schemapattern", new Initialize("Pattern checker", PatternChecker.UrlSchema)); // ByRef

BKUrlScheme.prototype.$scheme = null;
BKUrlScheme.prototype.get_scheme = function() {
	return this.nullIfEmpty(this.$scheme);
}
BKUrlScheme.prototype.set_scheme = function(v) {
	if (v == null) {
		this.$scheme = null;
		return true;
	}
	if (typeof v != "string") v = v + "";
	if (this.checkValueWith("schemapattern", v)) {
		this.$scheme = this.nullIfEmpty(v);
		return true;
	} else {
		this.$schema = null;
		if (this.get_throwonerror()) {
			throw "Incorrect schema format";
		}
	}
	return false;
}
BKUrlScheme.prototype.set_protocol = function(v) {
	if (v != null) {
		v = v + "";
		v = v.replace(/:$/,"");
	}
	return this.set_scheme(v);	
}
// IBkUrlObject
BKUrlScheme.prototype.$combine = function(v) {
	this.$scheme = v.$scheme;
	return true;
}
BKUrlScheme.prototype.get_isempty = function() {
	return this.isempty(this.$scheme);
}
BKUrlScheme.prototype.readAsString = function(v) {
	if (this.isempty(v)) {
		this.clear();
		return true;
	}
	if (this.checkValueWith(this.get_schemapattern(), v)) { 
		this.$scheme = this.nullIfEmpty(v); // Can be null
		return true;
	}
	return false;
}
BKUrlScheme.prototype.composeAsString = function() {
	return this.nullIfEmpty(this.$scheme);
}
BKUrlScheme.prototype.clear = function() {
	this.$scheme = null;
}
