/** DEPRECATED version - see the new one


	Implements the most popular key=value query string pattern, but can be used as base object for other parts too
	Does not implement IBKUrlPart, because by default the query's behavior does not depend on the state of the whole URL. If 
	this is needed in any of hte inherited class it will have to be implemented there
*/
function BKUrlQuery() {
	MultiDict.apply(this,arguments);
}
BKUrlQuery.Inherit(MultiDict,"BKUrlQuery");
BKUrlQuery.Implement(IBKUrlObject);
BKUrlQuery.FromMultiDict = function(v) {
	
}
// BKUrlQuery (for inheritors)
BKUrlQuery.prototype.$urlkeychar = "?";

// IBKUriObject ========================================================
BKUrlQuery.prototype.$encode = true;
BKUrlQuery.prototype.get_encode = function() { return this.$encode; }
BKUrlQuery.prototype.set_encode = function(v) {this.$encode = v; }
BKUrlQuery.prototype.get_source = function() {
	// var str = "";
	// for (var k in this.$keys) {
		// var arr = this.key
		// for (var i =0; i < 
	// }
}
BKUrlQuery.prototype.set_source = function() {
	// var str = "";
	// for (var k in this.$keys) {
		// var arr = this.key
		// for (var i =0; i < 
	// }
}

BKUrlQuery.prototype.clear = function() {
	this.$keys = {};
	this.$source = "";
	return this;
}

// Internals ===========================================================

/**
 * Splits the string into pairs separated with & sign and processes each pair. The data is added to the existing data.
 * @des The & signs have to be unencoded, Any occurence of & symvol in values or keys has to be URL escaped (%26)
 *		 The = symbol between key and value has to be unencoded, if it occurs in key or value  it has to be URL encoded (%3D).
 *		All keys and values are URL decoded before further processing.
 *	@param str {string} The string to parse - must contain only key=value pairs separated with &. If it needs to be optained from URL
 *		It should be extracted beforepassing it to this method.
 */
BKUrlQuery.prototype.$parseFromString = function(str, bTrim) {
	if (typeof str == "string") {
		var arr = str.split(/\&/);
		if (arr != null) {
			for (var i = 0; i < arr.length; this.$parsePairFromString(arr[i++], bTrim));
			return i; // return the number of pairs
		}
	}
	return null;
}
/**
 *  This one parses a single key=value pair, for more information look into the $parseFromString's docs
 */
BKUrlQuery.prototype.$parsePairFromString = function(_str, bTrim) {
	if (typeof _str == "string") {
		var str = _str;
		if (bTrim) {
			str = str.replace(/^\s+/,"").replace(/\s+$/,"");
		}
		var arr = str.split(/=/);
		if (arr != null && arr.length == 2) {
			var key = decodeURIComponent(arr[0]);
			var val = decodeURIComponent(arr[1]);
			this.add(key,val);
		}
	}
	return null;
}

// Questionable? =========================================
// Methods (instance and static for feeding a MultiDict with stuff)
BKUrlQuery.prototype.addFromString = function(str, bTrim) {
	this.$parseFromString(str,bTrim);
	return this;
}
BKUrlQuery.prototype.createFromString = function(str, bTrim) {
	var md = new MultiDict();
	return md.addFromString(str, bTrim);
}

