/*
	Handles the path part of an URL.
	TODO: remove, set_segment, truncate and removal of the scheme from the whole URL will change the validation rules for the first segment for non-explicitly absolute paths
			It is checked on set_segmen, add, readAsString, but not if suddenly the first segment changes or the scheme is removed. Should be done.

*/
function BKUrlPath(pathstr, bdecode, bencode) {
	BKUrlObjectBaseChild.apply(this, arguments);
	this.set_source(pathstr); // Silent for now
	if (bencode === true || bencode === false) { this.set_encode(bencode); }
}
BKUrlPath.Inherit(BKUrlObjectBaseChild,"BKUrlPath");

BKUrlPath.prototype.$pathparts = new InitializeArray("All path parts - segments");
BKUrlPath.prototype.$abs = false; // Absolute path (empty paths can be absolute if other parts of hte whole URL exist)
BKUrlPath.prototype.$hasfilepart = false; // No trailing slash - the last segment is "file"

BKUrlPath.prototype.get_hasfilepart = function() {
	if (this.$pathparts != null && this.$pathparts.length > 0) {
		return this.$hasfilepart;
	}
	return false;
}
BKUrlPath.prototype.get_absolute = function() {
	if (this.get_parent() != null && this.get_parent().get_authority() != null && !this.get_parent().get_authority().get_isempty()) {
		// effectively absolute
		return true;
	}
	return this.$abs;
}
BKUrlPath.prototype.set_absolute = function(v) {
	this.$abs = v?true:false;
}

// IIBKUrlObject
BKUrlPath.prototype.get_isempty = function() {
	if (this.$pathparts == null || this.$pathparts.length == 0) {
		if (!this.$abs) return true;
	}
	return false;
}
BKUrlPath.prototype.$combine = function(v) {
	if (v.get_isempty()) return true;
	if (v.get_absolute()) {
		this.$pathparts = Array.createCopyOf(v.$pathparts);
		this.$abs = v.$abs;
		this.$hasfilepart = v.$hasfilepart;
		return true;
	} else {
		if (this.$hasfilepart && this.$pathparts.length > 0) {
			this.$pathparts.pop();
			this.$hasfilepart = false;
		}
		this.$pathparts.push.apply(this.$pathparts,v.$pathparts);
		this.$hasfilepart = v.$hasfilepart;
		return true;
	}
}
BKUrlPath.prototype.clear = function() {
	this.$pathparts.splice(0,this.$pathparts.length);
	this.$abs = false;
	this.$hasfilepart = false;
}
// +Scrap
//BKUrlPath.$reBreaker = /^(?:(\/)|((?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\@]|\:)+))?/gi;
//BKUrlPath.$reBreaker = /(?:^\/?|\/)(.+?)(?=\/|$|\?|#)/gi;
//BKUrlPath.$reParsePath = /(?:^|(\/+))((?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\@]|\:)+)?/gi;
//BKUrlPath.$rePath = /(?:^\/?|\/)(.+?)(?=\/|$|\?|#)/gi;
// -Scrap

// Rough breaker - assuming the path is already separated (which it should be)
BKUrlPath.$reParsePath = /(?:(?:^(\/*)([^\/]*))|(?:(\/+)([^\/]*)))/gi; // Simplified (should check on second phase or extend it)
/*
	1 - abs slash
	2 - first segment
	3 - intermediate slash
	4 - non-first segment
*/
// Segment patterns - checked when assigned or parsed
BKUrlPath.$reSegment = /^(?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\:\@])*$/;
BKUrlPath.$reSegmentNZ = /^(?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\:\@])+$/;
BKUrlPath.$reSegmentNZNC = /^(?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\@])+$/;


BKUrlPath.prototype.readAsString = function(v) {
	if (v == null) {
		this.clear();
		return true;
	} else {
		var str = v || "";
		if (this.isempty(str)) {
			this.clear();
			return true;
		}
		var arr = String.reGroups2(str,BKUrlPath.$reParsePath,"abs","segment1","slash","segment");
		var parts = [];
		var abs = false;
		var hasfilepart = false;
		if (arr.hasmatches > 0) {
			var m;
			for (var i = 0; i < arr.length; i++) {
				m = arr[i];
				if (i == 0) { // First part only
					if (!this.isempty(m.abs)) {
						abs = true;
						if (!this.isempty(m.segment1)) { // Segment1
							if (!BKUrlPath.$reSegmentNZ.test(m.segment1)) {
								// Wrong
								if (this.get_throwonerror()) {
									throw "Incorrect syntax (characters) in the first segment of an non empty absolute URL";
								}
								return false;
							}
							parts.push(this.deCode(m.segment1));
							hasfilepart = true; // for now
						} else {
							// That's all - skip the rest
							break;
						}
					} else {
						// Not absolute
						this.$abs = false;
						hasfilepart = false;
						if (!this.isempty(m.segment1)) { // Segment1
							var re = BKUrlPath.$reSegmentNZ;
							if (this.get_parent() != null && this.get_parent().get_scheme() != null && this.get_parent().get_scheme().get_isempty()) {
								re = BKUrlPath.$reSegmentNZNC; // test for NC (no :) if the parent URL does not have scheme at this time
							}
						
							if (!re.test(m.segment1)) {
								// Wrong
								if (this.get_throwonerror()) {
									throw "Incorrect syntax (characters) in the first segment of an non empty absolute URL";
								}
								return false;
							}
							parts.push(this.deCode(m.segment1));
							hasfilepart = true; // for now
						} else {
							// That's all - skip the rest
							break; // empty URL - it is absolute only if parent has filled authority and scheme
						}
					}
					
				} else {
					// Not the first part
					if (this.isempty(m.segment)) {
						// Slash should be always present if we catch anything - so this is a last step
						// and it is no file part
						hasfilepart = false;
					} else {
						if (BKUrlPath.$reSegment.test(m.segment)) {
							parts.push(this.deCode(m.segment));
							hasfilepart = true;
						} else { // Error - wrong segment content
							if (this.get_throwonerror()) {
								throw "Incorrect syntax (characters) in the " + i + " path segment";
							}
							return false;
						}
					}
				}
			}
			this.clear();
			this.$abs = abs;
			this.$hasfilepart = hasfilepart;
			this.$pathparts = parts;
			return true;
		} else {
			// no matches and non-empty string - error, just return false
		}
	}
	return false;
}
BKUrlPath.prototype.composeAsString = function() { // TODO
	var s = "";
	if (this.$abs) s += "/";
	if (this.$pathparts.length > 0) {
		var p;
		for (var i = 0;i < this.$pathparts.length;i++) {
			p = this.enCode(this.$pathparts[i]);
			s += p;
			if (i < this.$pathparts.length - 1) {
				s += "/";
			}
		}
		if (!this.get_hasfilepart()) {
			s += "/";
		}
	}
	return s;
}

// Path specific management
/**
	Adding a part will add it 
	- if non-empty and non-null - as last non-terminated part - a file part
	- if empty/null - no part will be added, but the path will be marked as terminated (no file part - trailing slash).
*/
BKUrlPath.prototype.add = function(s, bterminate) {
	if (this.isempty(s)) {
		this.$hasfilepart = false;
	} else {
		if (this.$pathparts.length == 0) { // First segment
			if (this.$abs) {
				if (!this.validateNotEncoded(BKUrlPath.$reSegmentNZ,s)) {
					if (this.get_throwonerror()) {
						throw "Inocrrect path segment";
					}
					return false;
				}
			} else { // Not absolute
				if (this.get_parent() && this.get_parent().get_scheme() && this.get_parent().get_scheme().get_isempty()) {
					if (!this.validateNotEncoded(BKUrlPath.$reSegmentNZNC,s)) {
						if (this.get_throwonerror()) {
							throw "Inocrrect path segment";
						}
						return false;
					}
				} else {
					if (!this.validateNotEncoded(BKUrlPath.$reSegmentNZ,s)) {
						if (this.get_throwonerror()) {
							throw "Inocrrect path segment";
						}
						return false;
					}
				}
			}
		} else { // N-the segment and non-empty
			if (!this.validateNotEncoded(BKUrlPath.$reSegment,s)) {
				if (this.get_throwonerror()) {
					throw "Inocrrect path segment";
				}
				return false;
			}
		}
		this.$pathparts.push(s + "");
		if (bterminate) {
			this.$hasfilepart = false; // effectively terminates the url with a trailing slash
		} else {
			this.$hasfilepart = true;
		}
	}
	return true;
}
/**
	- n == 0/null - removes trailing slash - if there are parts hasfilepart becomes true, if no parts exist removes the absolute status (but path can still be absempty).
	- n > 0 - removes n parts and if no parts remain sets has hasfilepart to false.
*/
BKUrlPath.prototype.truncate = function(_n) {
	var n;
	if (typeof _n == "number") {
		if (isNaN(_n)) return false;
		n = _n;
	} else if (_n == null) {
		n = 0;
	} else {
		n = parseInt(_n+"");
		if (isNan(_n)) return false;
	}
	if (n <= 0) {
		if (!this.$hasfilepart && this.$pathparts.length > 0) {
			this.$hasfilepart = true; // effectively removing the trailing slash
		} else if (this.$abs && this.$pathparts.length == 0) {
			this.$abs = false; // removing the autonomous absolute status of the path
		}
	} else {
		if (n <= this.$pathparts.length) {
			this.$pathparts.splice(n - 1); // remove n parts
		} else { // all parts
			this.$pathparts = []; // no parts left
		}
		if (this.$pathparts.length == 0) {
			this.hasfilepart = false; // impossible to have file part if no parts exist
		}
	}
	return true;
}
BKUrlPath.prototype.get_segment = function(idx) {
	if(idx >= 0 && idx < this.$pathparts.length) {
		return this.$pathparts[idx];
	}
}
BKUrlPath.prototype.set_segment = function(idx,v) {
	if (this.isempty(v)) {
		// Setting empty segment removes it
		return this.remove(idx);
	}
	if (idx > 0 && idx < this.$pathparts.length) {
		if (typeof v != "string") v = v + ""; // unintentional empty values do not remove the segment (TODO: is this fine?)
		// Non-initial
		if (this.validateNotEncoded(BKUrlPath.$reSegment,v)) {
			this.$pathparts[idx] = v
			return true;
		} else {
			if (this.get_throwonerror()) {
				throw "Inocrrect path segment";
			}
			return false;
		}
	} else if (idx == 0 && this.$pathparts.length > 0) {
		// First part - validation is different if the whole URL does not have schema
		if (typeof v != "string") v = v + ""; // unintentional empty values do not remove the segment (TODO: is this fine?)
		if (this.$abs) {
			if (!this.validateNotEncoded(BKUrlPath.$reSegmentNZ,v)) {
				if (this.get_throwonerror()) {
					throw "Inocrrect path segment";
				}
				return false;
			}
		} else {
			if (this.get_parent() && this.get_parent().get_scheme() && this.get_parent().get_scheme().get_isempty()) {
				if (!this.validateNotEncoded(BKUrlPath.$reSegmentNZNC,v)) {
					if (this.get_throwonerror()) {
						throw "Inocrrect path segment";
					}
					return false;
				}
			} else {
				if (!this.validateNotEncoded(BKUrlPath.$reSegmentNZ,v)) {
					if (this.get_throwonerror()) {
						throw "Inocrrect path segment";
					}
					return false;
				}
			}
		}
		this.$pathparts[0] = v;
		return true;
	}
}
BKUrlPath.prototype.push = function() {
	throw "not implemented. Reserved for further version";
}
BKUrlPath.prototype.pull = function() {
	throw "not implemented. Reserved for further version";
}
BKUrlPath.prototype.remove = function(idx) {
	if(idx >= 0 && idx < this.$pathparts.length) {
		if (idx == (this.$pathparts.length - 1)) { // removing the file part (if there was one) - after this action there is definitely no file part there.
			this.$hasfilepart = false;
		}
		this.$pathparts.splice(idx,1);
		return true;
	} else {
		return false;
	}
}
BKUrlPath.prototype.get_pathname = function() {
	var s = "";
	if (this.$abs) s+="/";
	for (var i = 0; i <this.$pathparts.length;i++) {
		if (i == this.$pathparts.length-1) {
			if (!this.$hasfilepart) {
				s += this.$pathparts[i] + "/";
			}				
		} else {
			s += this.$pathparts[i] + "/";
		}
	}
	return s;
}.Description("Gets the current path only. Will leave out any file part. Not very useful on relative paths")
// Mapped getter/setter
/**
 * (unfinished)
 * The path map is a tree of objects that contains names of the possible values at each level of the map - each level is the index. Leaves end with true..
 * Example:
 * { 
 *	alpha: {
			$value: true,
 *			beta: true,
 *	 		beta1: {
 *				gamma: {
 *					delta: true
 *				}	 
 *			}
 *  }
 * }
 * There is no cheme checking, this is just helper for setting path parts by name.
 */
BKUrlPath.ImplementProperty("pathmap",  new InitializeObject("Map object - names to indices"));


/* Begin under construction */
BKUrlPath.prototype.mapGet = function(path) {
}
BKUrlPath.prototype.mapSet = function(path,v) {
}
BKUrlPath.prototype.$mapnode = function(_patharray) {
	if (_patharray == null) return null;
	var patharray = _patharray;
	if (typeof _patharray == "string") {
		patharray =_patharray.split(/\./);
	}
	if (!BaseObject.is(patharray,"Array")) {
		return null;
	}
	if (typeof this.get_pathmap() == "object") {
		var o = this.get_pathmap();
		for (var i = 0; i < patharray.length; i++) {
			if (typeof o == "object") {
				o = o[patharray];
				continue;
			}
			else {
				return null;
			}
		}
		// if (o === true
	} else {
		return null;
	}
}
/* End under construction */

/*
// We can extend this some day to dynamic navigation
BKUrlPath.prototype.$mappath = null;
BKUrlPath.prototype.$mappos = function() {
	if (BaseObject.is(this.$mappath, "Array")) {
		return (this.$mappath.length - 1);
	}
}
BKUrlPath.prototype.mapGo = function(path) {
	var p = path + "";
	var base = [];
	if (BaseObject.is(this.$mappath,"Array")) {
		base = Array.createCopyOf(this.$mappath);
	}
	if (path.charAt(0) == "/") {
		base = [];
	}
	p = p.Replace(/(?:^\/+)|(?:\/+$))/,"");
	var arr = p.split(/\//);
	
	if (arr != null && arr.length > 0) {
		for (var i = 0; i < arr.length; i++) {
			
		}
	}
}
BKUrlPath.prototype.mapIsCorrect = function()
*/