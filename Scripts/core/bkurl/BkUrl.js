/*

	Work notes over (too) stict url regex:
	// gen-delims  = ":" / "/" / "?" / "#" / "[" / "]" / "@"
	// fragment, query = (?:pchar|/|?)*
	// pchar = <unreserved> | <pct-encoded> | <sub-delim> | : | @
	// segment = pchar*
	// segment-nz = pchar+
	// segment-nc = (pchar - @)+ // Why?
	<sub-delim> := [!$&'()*+,;=]
	<unreserved> := [A-Za-z0-9\-\._~]
	<pct-encoded> := %[A-Za-z0-9]{2}		// We will ignore that in the host name for now
	
	<segment> := (?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\:\@])*
	<segment-nz> := (?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\:\@])+
	<segment-nz-nc> := (?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\@])+
	---------------
	^(?:(<schema>):)?
		<schema> := [A-Za-z][A-Za-z0-9\-\+\.]*
	(?://(<authority>)(?=/|$|\?|\#))?
		<authority> := empty | [userinfo]host[:port]
			<host>
			// All applicable for unescaped strings
				<ip6> := ^\[[0-9a-fA-F\:]+(?:%[a-zA-Z0-9\_\-]+)?\]$
				<ip4> := ^[0-9]{1,3}\.0-9]{1,3}\.0-9]{1,3}\.0-9]{1,3}$
				// Future IP version
				<ipvf> := ^\[v[0-9a-zA-Z]\.(?:[A-Za-z0-9\-\._~]|[!$&'()*+,;=]|\:){1,}\]$
				// reg-name - stripped down because no support is apparent for the stated sub-delims and pct-encoded and even ~
				// Old dns standard requirements were very strict and it seems everybody adheres to that
				<qdn> := [a-zA-Z0-9][A-Za-z0-9\-\._]*
			<userinfo>
				^(?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=]|\:)*@$
			<port>
				// Should we extend this (hope this wont break anything)? Usage of named ports was observed in IR based schemas
				^[0-9]*$
			>breaker<
			>breaker-host<
				((\[\.]+\])|([^\:]+))
			breaker := /^(([^@:]+)@)?((?:\[\.]+\])|(?:[^\:]+))(?:\:(.+))/;
	(?:(?:(<abspath>)|(relpath))<>)
		<abspath> := (
						(?:\/(?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\:\@])*) 
						|
						(?:\/(?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\:\@])+(?:\/(?:[A-Za-z0-9\-\._~]|%[A-Za-z0-9]{2}|[!$&'()*+,;=\:\@])+)*) 
		)
*/

function BKUrl(urlstr, settings, bdecode, bencode) {
	// Parent called after reading the settings inorder to be able to know how to try parse the URL
	this.$settings = {
		scheme: ["BKUrlScheme"],
		authority: ["BKUrlAuthority"],
		path: ["BKUrlPath"],
		query: ["BKUrlQuery","BKUrlString"],
		fragment: ["BKUrlFragmentQuery","BKUrlString"]
		
		
		
	}
	//this.$settings = BaseObject.CombineObjects(this.$settings, settings);
	//for (var k in this.$settings)
	if (settings != null && typeof settings == "object") {
		this.$settings = BaseObject.CombineObjects(this.$settings, settings, function(key,ov,_nv) {
			var nv = null;
			if (typeof _nv == "string") {
				nv = [_nv];
			} else if (BaseObject.is(_nv,"Array")) {
				nv = _nv;
			} else {
				return false; // Nothing to mix or don't know how
			}
			if (BaseObject.is(nv, "Array")) {
				var ok = true;
				for (var j = 0; j < nv.length; j++) {
					if (!Class.is(nv[j], "IBKUrlObject")) {
						throw "Unsupported type specified for " + key;
						return false;
					} 
				}
				return true;
			}
			return false;
		});
	}
	this.clear(); // Initialize empty
	// Call the parent
	if (typeof settings != "object") {
		BKUrlObjectBase.apply(this, arguments); // A little reordering to make space for settings
	} else {
		BKUrlObjectBase.call(this, urlstr, bdecode, bencode); // A little reordering to make space for settings
	}
}
BKUrl.Inherit(BKUrlObjectBase,"BKUrl");



// +Static

// RegExp From RFC3986
// Break URL in parts but does not validate it
// 1>2 scheme, 3>4 authority, 5 path, 6>7 querystring, 8>9 fragment
BKUrl.reURLBreaker = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
BKUrl.breakUrlString = function(_url, busearray) {
	var url = _url + "";
	BKUrl.reURLBreaker.lastIndex = 0;
	var arr = BKUrl.reURLBreaker.exec(url);
	if (arr != null) {
		var r;
		if (busearray) {
			r = [];
			BKUrl.$parts.Each(function(idx, item) {
				var cnt = arr[BKUrl.$beakerIndices[idx]];
				if (typeof cnt == "string" && cnt.length > 0) {
					r.push(cnt);
				} else {
					r.push(null);
				}
			});
		} else {
			r = { scheme: arr[2], authority: arr[4], path: arr[5], query: arr[7], fragment: arr[9] };
		}
		return r;
	} else {
		return null;
	}
}.Description("Breaks an url into component parts (unparsed further) and returns and object with them")
	.Returns("Object with the parts as fields { schema:,authority:,path:,query:,fragment: } or null if cna't be parsed");
	
BKUrl.$parts = ["scheme","authority","path","query","fragment"];
BKUrl.$beakerIndices = [2,4,5,7,9];
// -Static

// +Internals and settings
BKUrl.prototype.$settings = null;
// Creates an empty part according to settings (takes first class for each part)
// used by clear() for example
BKUrl.prototype.$createPart = function(part) {
	if (typeof part == "string" && part.inSet(BKUrl.$parts)) {
		var cpart = this.$settings[part];
		if (cpart.length > 0) {
			var piece = cpart[0]; // The first one for direct init
			if (Class.is(piece, "IBKUrlObject")) {
				var cls = Class.getClassDef(piece);
				var v = new cls();
				this.$setPart(part, v);
				return v;
			} else {
				this["$" + part] = null; // Skip some unneeded processing
			}
		}
		return null;
	} 
	throw 'Unsupported BKUrl part ' + part + ', only "query","fragment","authority","path", "scheme" are allowed.';
}
BKUrl.prototype.$releasePart = function(part) {
	if (part.inSet(BKUrl.$parts)) {
		var p = this["$" + part];
		this["$" + part] = null;
		if (BaseObject.is(p,"IBKUrlPart")) p.set_parent(null);
		return;
	}
	throw 'Unsupported BKUrl part ' + part + ', only "query","fragment","authority","path", "scheme" are allowed.';
}
// This only puts an instance there - no analysis - internal use only
BKUrl.prototype.$setPart = function(part, v) {
	if (part.inSet(BKUrl.$parts)) {
		this.$releasePart(part);
		this["$" + part] = v;
		if (BaseObject.is(v,"IBKUrlObject")) {
			// put encoding in synchronized
			v.set_encode(this.$encode);
			v.set_decode(this.$decode);
			if (BaseObject.is(v,"IBKUrlPart")) v.set_parent(this);
		}
		return;
	}
	throw 'Unsupported BKUrl part ' + part + ', only "query","fragment","authority","path", "scheme" are allowed.';
}
BKUrl.prototype.$getPart = function(part) {
	if (part.inSet(BKUrl.$parts)) {
		var v = this["$" + part];
		if (BaseObject.is(v, "IBKUrlObject")) return v;
		return null;
	}
	throw 'Unsupported BKUrl part ' + part + ', only "query","fragment","authority","path", "scheme" are allowed.';
}
// If parsed successfuly the part will be set with the new object, 
// otherwise it will be left intact, leaving to the caller to decide 
// what to do with the old one.
// Only if set to empty the default will be created with $createPart
// Therefore, when you call this method, returned null needs choosing
BKUrl.prototype.$parsePart = function(part,_v) {
	if (part.inSet(BKUrl.$parts)) {
		var v = _v;
		if (v != null && typeof v != "string") v = v + "";
		// Get settings
		var cpart = this.$settings[part]; // config for part
		if (cpart.length > 0) { // Array
			if (this.isempty(v)) {
				// Create default
				this.$releasePart(part);
				return this.$createPart(part);
			} else {
				for (var i = 0; i < cpart.length; i++) {
					var c = cpart[i];
					if (Class.is(c,"IBKUrlObject")) {
						var cls = Class.getClassDef(c);
						var inst = new cls();
						// Configure it
						inst.set_encode(this.$encode);
						inst.set_decode(this.$decode);
						if (inst.is("IBKUrlPart")) inst.set_parent(this);
						if (inst.readAsString(v)) {
							this.$setPart(part,inst);
							return inst; // We are done with it
						} else {
							if (inst.is("IBKUrlPart")) inst.set_parent(null);
						}
					}
				}
			}
		}
		// what to do with empty config?
		return null; // Part is not parsed
		
	}
	throw 'Unsupported BKUrl part ' + part + ', only "query","fragment","authority","path", "scheme" are allowed.';
}
// Not sure if we would want different policy for failed parsing, so this is what otherwise will go into the set_xxx properties
// with little variations in some
BKUrl.prototype.$set_part = function(part, v) {
	if (BaseObject.is(v,"IBKUrlObject")) {
		this.$setPart(part,v);
		return true;
	} else {
		if (this.$parsePart("scheme",v) == null) {
			return false; // old scheme stays
		}
		return true;
	}
}

BKUrl.prototype.$query = new Initialize("The query string",null);
BKUrl.prototype.$fragment = new Initialize("The fragment", null);
BKUrl.prototype.$authority = new Initialize("The authority part", null);
BKUrl.prototype.$path = new Initialize("The path part", null);
BKUrl.prototype.$scheme = new Initialize("The scheme part",null);

// -Internals and settings

// Parts properties

// Scheme
BKUrl.prototype.get_scheme = function() {
	return this.$scheme;
}
BKUrl.prototype.set_scheme = function(v) {
	return this.$set_part("scheme", v);
}
// Authority
BKUrl.prototype.get_authority = function() {
	return this.$authority;
}
BKUrl.prototype.set_authority = function(v) {
	return this.$set_part("authority", v);
}
// Query
BKUrl.prototype.get_query = function() {
	return this.$query;
}
BKUrl.prototype.get_querystring = function() {
	if (BaseObject.is(this.$query, "IBKUrlObject")) {
		return this.$query.composeAsString();
	}
	return null;
}
BKUrl.prototype.set_query = function(v) {
	return this.$set_part("query", v);
}
// Fragment
BKUrl.prototype.get_fragment = function() {
	return this.$fragment;
}
BKUrl.prototype.set_fragment = function(v) {
	return this.$set_part("fragment", v);
}
BKUrl.prototype.get_fragmentstring = function() {
	if (BaseObject.is(this.$fragment, "IBKUrlObject")) {
		return this.$fragment.composeAsString();
	}
	return null;
}
// Path
BKUrl.prototype.get_path = function() {
	return this.$path;
}
BKUrl.prototype.set_path = function(v) {
	return this.$set_part("path",v);
}
// IBKUrlObject
BKUrl.prototype.set_encode = function(v) {
	BKUrlObjectBase.prototype.set_encode.call(this,v);
	var me = this;
	BKUrl.$parts.Each(this.thisCall(function(idx, part) {
		if (BaseObject.is(this["$" + part], "IBKUrlObject")) {
			this["$" + part].set_encode(v);
		}
	}));
}
BKUrl.prototype.set_decode = function(v) {
	BKUrlObjectBase.prototype.set_decode.call(this,v);
	var me = this;
	BKUrl.$parts.Each(this.thisCall(function(idx, part) {
		if (BaseObject.is(this["$" + part], "IBKUrlObject")) {
			this["$" + part].set_decode(v);
		}
	}));
}

BKUrl.prototype.composeAsString = function() {
	var r = "";
	var part,spart;
	// Manually pass through all parts (can be optimize, but for now ...)
	// scheme
	part = this.get_scheme();
	if (BaseObject.is(part,"IBKUrlObject")) {
		spart = part.composeAsString();
		if (!this.isempty(spart)) {
			r += spart + ":";
		}
	}
	// authority
	part = this.get_authority();
	if (BaseObject.is(part,"IBKUrlObject")) {
		spart = part.composeAsString();
		if (!this.isempty(spart)) {
			r += "//" + spart;
		}
	}
	// path
	part = this.get_path();
	if (BaseObject.is(part,"IBKUrlObject")) {
		spart = part.composeAsString();
		if (!this.isempty(spart)) {
			if (r.slice(-1) != "/" && spart.charAt(0) != "/") r += "/";
			r += spart;
		}
	}
	// query
	part = this.get_query();
	if (BaseObject.is(part,"IBKUrlObject")) {
		spart = part.composeAsString();
		if (!this.isempty(spart)) {
			r += "?" + spart;
		}
	}
	// fragment
	part = this.get_fragment();
	if (BaseObject.is(part,"IBKUrlObject")) {
		spart = part.composeAsString();
		if (!this.isempty(spart)) {
			r += "#" + spart;
		}
	}
	return this.nullIfEmpty(r);
}

BKUrl.prototype.readAsString = function(_str) {
	var str = null;
	var t; // temp var
	if (typeof _str == "string") {
		str = _str;
	} else if (_str != null && _str["toString"]) {
		str = _str.toString();
	}
	var parts = BKUrl.breakUrlString(str, true);
	if (parts != null) {
		this.clear(); // Read takes new url - so everything is cleared
		// Redoing this with an array in order to be able to track holes (could be needed)
		var bFail = false;
		var me = this;
		BKUrl.$parts.Each(function(idx, part) {
			var v = parts[idx];
			if (!me.isempty(v)) {
				t = me.$parsePart(part,parts[idx]);
				if (t == null) {
					// Can't parse that part
					bFail = true;
				}
			}
		});
		if (bFail) {
			// TODO: something more here?
			return false;
		}
		return true;
	}
	return false;
}
BKUrl.prototype.clear = function() {
	var me = this;
	BKUrl.$parts.Each(function(idx, item) {
		me.$releasePart(item);
		me.$createPart(item);
	});
}
BKUrl.prototype.get_isempty = function() {
	var me = this;
	return BKUrl.$parts.Aggregate(function(idx, part, result) {
		var p = me.$getPart(part);
		if (result == null) result = true;
		if (BaseObject.is(p, "IBKUrlObject") && !p.get_isempty()) {
			result = false;
		}
		return result;
	});
}
// BKUrlObjectBase
BKUrl.prototype.$combine = function(v) {
	var me = this;
	var success = true;
	BKUrl.$parts.Each(function(idx, item) {
		var mine = me.$getPart(item);
		var other = v.$getPart(item);
		if (BaseObject.is(mine, "IBKUrlObject") && BaseObject.is(other, "IBKUrlObject") &&
				mine.classType() == other.classType()
			) {
			if (!mine.set_nav(other)) {
				success = false;
			}
		}
	});
	return success;
}
BKUrl.prototype.createNew = function(str) {
	var inst = new BKUrl(str,this.$settings,this.get_decode(),this.get_encode());
	return inst;
}
BKUrl.prototype.get_baseUrl = function() {
	var b = this.createNew();
	b.get_scheme().copyFrom(this.get_scheme());
	b.get_authority().copyFrom(this.get_authority());
	if (!b.get_path().readAsString(this.get_path().get_pathname())) return null;
	return b;
}.Description("Gets a copy of the URL with query string and fragment stripped down and the path cut to the base (without file part)");
BKUrl.prototype.get_pathUrl = function() {
	var b = this.createNew();
	b.get_scheme().copyFrom(this.get_scheme());
	b.get_authority().copyFrom(this.get_authority());
	b.get_path().copyFrom(this.get_path());
	return b;
}.Description("Gets a copy of the URL with query string and fragment stripped down");

BKUrl.basePath = function() {
	var s = window.g_ApplicationBasePath;
	if (s.charAt(0) != "/") s = "/" + s;
	if (s.charAt(s.length-1) != "/") s = s + "/";
	return s;
}
BKUrl.getBasePathAsUrl = function() {
	var url = new BKUrl();
	if (!url.get_scheme().readAsString(window.location.protocol.replace(/:$/,""))) return null;
	if (!url.get_authority().set_host(window.location.hostname)) return null;
	if (window.location.port != null && window.location.port.length > 0) {
		if (!url.get_authority().set_port(window.location.port)) return null;
	}
	if (typeof g_ApplicationBasePath == "string" && g_ApplicationBasePath.length > 0) {
		if (!url.get_path().readAsString(g_ApplicationBasePath)) return null;
	}
	return url;
}
BKUrl.getInitialFullUrl = function() {
	var url = new BKUrl();
	if (!url.readAsString(window.g_ApplicationStartFullUrl)) return null;
	return url;
}
BKUrl.getInitialUrl = function() {
	var url = this.getInitialFullUrl();
	if (url != null) {
		return url.readAsString.get_pathUrl();
	}
	return url;
}
BKUrl.getInitialBaseUrl = function() {
	var url = this.getInitialFullUrl();
	if (url != null) {
		return url.readAsString.get_baseUrl();
	}
	return url;
}

// Static methods that have no good place elsewhere
/**
 * @returns {string}	Returns composed full baseURL
 * 
 * 
 */
BKUrl.baseURL = function() {
	// The easy way
	if (document.baseURI) return document.baseURI;
	// The hard way (IE)
	var t;
	var baseElement = null;
	// 1. Try base element
	t = document.head.getElementsByTagName("base");
	if (t != null && t.length > 0) {
		baseElement = t[0];
		return baseElement.href;
	}
	// No base - construct it from location (port is a problem in IE)
	var url = new BKUrl();
	if (!url.get_scheme().readAsString(window.location.protocol.replace(/:$/,""))) return null;
	if (!url.get_authority().set_host(window.location.hostname)) return null;
	if (window.location.port != null && window.location.port.length > 0) {
		if (!url.get_authority().set_port(window.location.port)) return null;
	}
	if (typeof g_ApplicationBasePath == "string" && g_ApplicationBasePath.length > 0) {
		if (!url.get_path().readAsString(g_ApplicationBasePath)) return null;
	}
	url.set_encode(false);
	return url.composeAsString();
}
BKUrl.startURL = function() {
	return window.g_ApplicationStartUrl;
}

BKUrl.dataToURL = function(_url, data, useFragment, _depth, booleanAsNumbers) {
	var url;
	var rmode = null;
	var depth = _depth || 0;
	var v;
	function _cycleObject(prefix, obj, qry, level) {
		if (level > depth) return;
		var kname;
		if (typeof obj == "object" && obj != null) { // Work it as plain object, but not require it to be plain too much
			for (var k in obj) {
				if (prefix.length > 0) {
					kname = prefix + "." + k;
				} else {
					kname = k;
				}
				// Unsupported values are skipped
				if (obj.hasOwnProperty(k)) {
					v = obj[k];
					if (BaseObject.is(v, "number")) {
						query.add(kname,v.toString(10));
					} else if (BaseObject.is(v, "string")) {
						query.add(kname,v);
					} else if (BaseObject.is(v, "boolean")) {
						if (booleanAsNumbers) {
							query.add(kname,v?"1":"0");
						} else {
							query.add(kname,v?"true":"false");
						}
					} else if (BaseObject.is(v, "Array")) {
						for (var i = 0; i < v.length; i++) {
							var x = v[i];
							if (typeof x == "number") { x = x.toString(10); }
							else if (BaseObject.is(x, "string")) { x = x; }
							else if (BaseObject.is(x, "boolean")) { x = (booleanAsNumbers?(x?"1":"0"):(x?"true":"false")); }
							else if (BaseObject.is(x, "Date")) { x = x.toISOString()}
							else { x = null; }
							query.add(kname, x);
						}
					} else if (BaseObject.is(v, "Date")) {
						// TODO: Perhaps this should go through the formatter (ConvertDateTime) and follow some settings.
						//		However, it seems logical to have separate settings for home and other servers, per-server even.
						//		Furthermore the settings are more aligned with the expected date encoding in JSON and it is not
						//		written in stone that query string parameters should follow the same ones. If more clues for such 
						//		a decision are found, this should be changed or the method refactored a little to allow external decision to take over.
						query.add(kname,v.toISOString());
					} else if (BaseObject.is(v,"object")) {
						_cycleObject(kname, v, qry, level + 1);
					}
				}
			}
		}
	}
	if (BaseObject.is(_url, "BKUrl")) {
		url = _url;
		rmode = "BKUrl";
	} else if (typeof _url == "string") {
		rmode = "string";
		url = new BKUrl();
		if (!url.readAsString(_url)) {
			return null;
		}
	}
	if (!BaseObject.is(url, "BKUrl")) return null;;
	var query = useFragment?url.get_fragment():url.get_query();
	if (BaseObject.is(query, "BKUrlQuery")) {
		if (typeof data == "object" && data != null) { // Work it as plain object, but not require it to be plain too much
			_cycleObject("", data,query,0);
		}
		if (rmode == "string") {
			return url.composeAsString();
		} else {
			return url;
		}
	} else {
		return null; // Don't know how to encode the data
	}
	return null;
}
/**
 * Converts to BKUrl and returns a BKUrl object no matter what. The result can be empty if the parameter
 * cannot be converted, but it will be BKUrl anyway.
 */
BKUrl.Url = function(url) {
	if (typeof url == "string") {
		return new BKUrl(url);
	} else if (BaseObject.is(url, "BKUrl")) {
		return url;
	} else if (BaseObject.is(url, "IBKUrlObject")) {
		var bku = new BKUrl();
		bku.set_nav(url);
		return bku; // Will be empty if nav failed
	} else {
		return new BKUrl(url + "");
	}
}