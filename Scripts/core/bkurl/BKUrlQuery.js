/**
	Implements the most popular key=value query string pattern, but can be used as base object for other parts too
	Does not implement IBKUrlPart, because by default the query's behavior does not depend on the state of the whole URL. If 
	this is needed in any of hte inherited class it will have to be implemented there
*/
function BKUrlQuery(str, bdecode, bencode) {
	BKUrlObjectBase.apply(this,arguments);
}
BKUrlQuery.Inherit(BKUrlObjectBase,"BKUrlQuery");
BKUrlQuery.prototype.$store = new InitializeObject("The actual MultiDict store", "MultiDict");

BKUrlQuery.FromMultiDict = function(v) {
	
}
// TODO: This is probably not needed anymore?
// BKUrlQuery (for inheritors)
BKUrlQuery.prototype.$urlkeychar = "?";

// MultiDict bridge
BKUrlQuery.prototype.remove = function(k, o) { return this.$store.remove(k, o); };
BKUrlQuery.prototype.add = function(k, o) { return this.$store.add(k, o); };
BKUrlQuery.prototype.set = function(k, o) { return this.$store.set(k, o); };
BKUrlQuery.prototype.get = function(k, idx) { return this.$store.get(k, idx); };
BKUrlQuery.prototype.keys = function(pat) { return this.$store.keys(pat); };

// IBKUriObject ========================================================

BKUrlQuery.prototype.$combine = function(v) {
	this.$store = new MultiDict(v.$store);
	return true;
}
BKUrlQuery.prototype.get_isempty = function() {
	return this.$store.isempty();
}
BKUrlQuery.prototype.readAsString = function(_str) {
	if (_str == null) {
		this.clear();
		return true;
	}
	var str = _str + "";
	if (str.length == 0) {
		this.clear();
		return true;
	}
	var arr = str.split(/\&/);
	if (arr != null) {
		this.$store.clear();
		for (var i = 0; i < arr.length; i++) {
			var arrPair = arr[i].split(/=/);
			if (arrPair != null && arrPair.length >= 1 && arrPair.length <= 2) {
				// TODO: Check keys before going forward (values too)
				if (arrPair.length == 1) {
					this.$store.add(this.deCode(arrPair[0]),""); // Empty value even if "=" is omitted
				} else {
					var key = this.deCode(arrPair[0]);
					var val = this.deCode(arrPair[1]);
					this.$store.add(key,val);
				}
			}
		}
		return true;
	} else {
		return false; // Should never happen
	}
}
BKUrlQuery.prototype.composeAsString = function() {
	var r = "";
	var me = this;
	this.$store.enumKeys(function(key, content) {
		if (BaseObject.is(content, "Array")) {
			for (var i = 0;i < content.length; i++) {
				if (r.length > 0) r += "&";
				r += me.enCode(key) + "=" + me.enCode(content[i]);
			}
		}
	});
	return this.nullIfEmpty(r);
}
BKUrlQuery.prototype.clear = function() {
	this.$store.clear();
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
// BKUrlQuery.prototype.$parseFromString = function(str, bTrim) {
	// if (typeof str == "string") {
		// var arr = str.split(/\&/);
		// if (arr != null) {
			// for (var i = 0; i < arr.length; this.$parsePairFromString(arr[i++], bTrim));
			// return i; // return the number of pairs
		// }
	// }
	// return null;
// }
// /**
 // *  This one parses a single key=value pair, for more information look into the $parseFromString's docs
 // */
// BKUrlQuery.prototype.$parsePairFromString = function(_str, bTrim) {
	// if (typeof _str == "string") {
		// var str = _str;
		// if (bTrim) {
			// str = str.replace(/^\s+/,"").replace(/\s+$/,"");
		// }
		// var arr = str.split(/=/);
		// if (arr != null && arr.length == 2) {
			// var key = decodeURIComponent(arr[0]);
			// var val = decodeURIComponent(arr[1]);
			// this.add(key,val);
		// }
	// }
	// return null;
// }

// Questionable? =========================================
// Methods (instance and static for feeding a MultiDict with stuff)
// BKUrlQuery.prototype.addFromString = function(str, bTrim) {
	// this.$parseFromString(str,bTrim);
	// return this;
// }
// BKUrlQuery.prototype.createFromString = function(str, bTrim) {
	// var md = new MultiDict();
	// return md.addFromString(str, bTrim);
// }

