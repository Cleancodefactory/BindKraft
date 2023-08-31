/*
	Base class for classes of objects participating in an URL.
	
	
	Implementation checklist for inheritors
	
	set_nav (defaults to replacing source)
	get_isempty
	readAsString
	composeAsString
	clear
	
	get_XXX
	set_XXX

*/
function BKUrlObjectBase(str, bdecode, bencode) {
	BaseObject.apply(this, arguments);
	// Configure encoding behavior
	if (bdecode === true || bdecode === false) {
		this.set_decode(bdecode);
	} 
	if (bencode === true || bencode === false) {
		this.set_encode(bencode);
	}
	if (typeof str == "string") {
		if (str.length > 0) {
			if (!this.set_source(str)) {
				throw "cannot parse"; 
			}
		}
	} else if (str != null) {
		if (!this.set_source(str + "")) {
			throw "cannot parse"; 
		}
	}
}
BKUrlObjectBase.Inherit(BaseObject,"BKUrlObjectBase");
BKUrlObjectBase.Implement(IBKUrlObject);
BKUrlObjectBase.prototype.$blockencoding = false; // Some elements may want to block the encoding (encoding can break trivial parsing of an unknown syntax)
BKUrlObjectBase.prototype.$encode = true;
BKUrlObjectBase.prototype.get_encode = function() { return this.$encode; }
BKUrlObjectBase.prototype.set_encode = function(v) {this.$encode = v; }
BKUrlObjectBase.prototype.$decode = true;
BKUrlObjectBase.prototype.get_decode = function() { return this.$decode; }
BKUrlObjectBase.prototype.set_decode = function(v) {this.$decode = v; }
BKUrlObjectBase.prototype.get_source = function() { 
	return this.composeAsString();
}
// Override
BKUrlObjectBase.prototype.$copyFrom = function(v) {
	// TODO: Implement this in each class as copy from another
	return this.set_source(v + ""); // This is ineffective implementation
}
BKUrlObjectBase.prototype.copyFrom = function(v) {
	if (BaseObject.is(v, this.classType())) {
		return this.$copyFrom(v);
	}
	return false;
}
// Creates a new one with the same setting
// Override only if the settings go beyond encode/decode
BKUrlObjectBase.prototype.createNew = function(str) {
	var cls = this.classDefinition()
	var inst = new cls(str,this.get_decode(), this.get_encode());
	return inst;	
}
BKUrlObjectBase.prototype.set_source = function(v) { 
	if (BaseObject.is(v, this.classType())) {
		return this.copyFrom(v);
	}
	if (typeof v != "string" && v != null) v = v + "";
	if (!this.readAsString(v)) {
		if (this.get_throwonerror()) {
			throw "Invalid value assinged to set_source in class " + this.classType();
		}
		return false;
	}
	return true;
}
BKUrlObjectBase.prototype.$throwonerror = false;
BKUrlObjectBase.prototype.get_throwonerror = function() { return this.$throwonerror; } // Throws errors on invalid parts set
BKUrlObjectBase.prototype.set_throwonerror = function(v) { this.$throwonerror = v; }

BKUrlObjectBase.prototype.$combine = function(v) {
	// General policy - empty parts do nothing
	if (!v.get_isempty()) {
		return this.copyFrom(v); // Relies on the type protection in copyFrom
	}
	return true;
}
// Override this and deal with classes of your own kind
// Override
BKUrlObjectBase.prototype.set_nav = function(v) {
	if (this.isempty(v)) return true;
	if (BaseObject.is(v, this.classType())) {
		if (!v.get_isempty()) {
			return this.$combine(v);
		}
		return true;
	} else {
		if (typeof v != "string" && v != null) v = v + "";
		var cls = this.classDefinition();
		var inst = this.createNew();
		if (this.is("IBKUrlPart")) {
			inst.set_parent(this.get_parent());
		}
		var b = inst.readAsString(v);
		if (b) {
			b = this.$combine(inst);
		}
		if (this.is("IBKUrlPart")) {
			inst.set_parent(null);
		}
		return b;
	}
	return false;
}
// Override
BKUrlObjectBase.prototype.get_isempty = function() { throw "not implemented"; }
// Override
BKUrlObjectBase.prototype.readAsString = function(v) { throw "not implemented"; } // Must return true/false to indicate success in case different classes are tried
// Override
BKUrlObjectBase.prototype.composeAsString = function() { throw "not implemented";} // Compose back to a whole string from all the subparts.
// Override
BKUrlObjectBase.prototype.clear = function() { throw "not implemented"; }
BKUrlObjectBase.prototype.toString = function() {
	return this.composeAsString() || "";
}
BKUrlObjectBase.prototype.equals = function(other) { 
	if (BaseObject.is(other,this.classType())) {
		return (this.toString().toLowerCase() == other.toString().toLowerCase());
	} else {
		return false;
	}
}
BKUrlObjectBase.prototype.nullIfEmpty = function(v) {
	if (v == null) return null;
	if (typeof v == "string") {
		if (v.length > 0) {
			return v;
		}
	}
	return null;
}
BKUrlObjectBase.prototype.isempty  = function(v) {
	if (v == null || (typeof v == "string" && v.length == 0)) return true;
	return false;
}
// Encoding tools
/*
	We keep the exception behavior of the original global functions - so this will throw when surogate is not high-low codepoint pair
	RFC3986 reserves ! ' ( ) * this means we have to encode them in "components" to avoid mistreatment from future URL processing contraptions.
	However this is applicable only for components in an URL and not headers to which RFC3986 does not apply (rfc5987 is covering encoding in header values)
*/
BKUrlObjectBase.$reRFC3986addition = /[!'()*]/g;
BKUrlObjectBase.$replacerRFC3986addition = function(c) {
	return '%' + c.charCodeAt(0).toString(16);
}
BKUrlObjectBase.encodeURIComponentRFC3986 = function(v) {
	return encodeURIComponent(v).replace(BKUrlObjectBase.$reRFC3986addition,BKUrlObjectBase.$replacerRFC3986addition);
}
// Decode does not need fixing, but if it ever needs - it can be done here
BKUrlObjectBase.decodeURIComponentRFC3986 = function(v) {
	return decodeURIComponent(v);
}
// Component only!!!
BKUrlObjectBase.prototype.deCode = function(v) {
	if (typeof v != "string") return v;
	if (this.$decode && !this.$blockencoding) return BKUrlObjectBase.decodeURIComponentRFC3986(v);
	return v;
}
BKUrlObjectBase.prototype.enCode = function(v) {
	if (typeof v != "string") return v;
	if (this.$encode && !this.$blockencoding) return BKUrlObjectBase.encodeURIComponentRFC3986(v);
	return v;
}
/*
	The validation regular expressions are best designed for URL encoded pieces - only a small set of characters appear in them this way
	However validation is sometimes required for strings that are set unencoded. Here we use a trick - we encode them, test the regular expressions
	and return the result. It is slow, but correct unlike other methods that will produce a range of unacceptable results.
*/
BKUrlObjectBase.prototype.validateNotEncoded = function(re,v) {
	if (v == null) return true; // nulls require separate checks
	if (typeof v != "string") v = v + "";
	try {
		var x = BKUrlObjectBase.encodeURIComponentRFC3986(v)
		if (typeof x == "string") {
			return re.test(x);
		}
		return false;
	} catch(e) {
		return false;
	}
}
// Tools
//IBKUriObject.prototype.Encode
