/*
	Simplest case for a part - raw string
	Mostly used when we do not want to understand the syntax of a part (applies mostly to the query and fragment)
	

*/
function BKUrlString(partstr, bdecode, bencode) {
	BKUrlObjectBase.apply(this, arguments);
}
BKUrlString.Inherit(BKUrlObjectBase, "BKUrlString");
BKUrlString.prototype.$part = null;
// + Parts
BKUrlString.prototype.get_part = function() {
	return this.nullIfEmpty(this.$part);
}
BKUrlString.prototype.set_part = function(v) {
	this.$part = this.nullIfEmpty(v);
	return true;
}
// - Parts
BKUrlString.prototype.$combine = function(v) {
	this.$part = v.$part;
	return true;
}
BKUrlString.prototype.clear = function() {
	this.$part = null;
}
BKUrlString.prototype.get_isempty = function() {
	if (this.$part == null) return true;
	if (typeof this.$part == "string" && this.$part.length == 0) return true;
	return false;
}
// BKUrlString.prototype.set_nav = function() {} // defaults to set_source
BKUrlString.prototype.readAsString = function(v) {
	if (this.isempty(v)) {
		this.clear();
		return true;
	}
	if (typeof v != "string") {
		v = v + "";
		if (this.isempty(v)) {
			this.clear();
			return true;
		}
	}
	this.$part = this.nullIfEmpty(this.deCode(v));
	return true;
}
BKUrlString.prototype.composeAsString = function() {
	return this.nullIfEmpty(this.enCode(this.$part));
}
