/*
	Shared interface by all the BKUrlXXX classes. There is also a base class implementing this interface partially and offereing a few helpers.
	See the comments here for implementation guide lines.
*/
function IBKUrlObject() {}
IBKUrlObject.Interface("IBKUrlObject");

/*
	encode - encode on return (while composeAsString)
	decode - decode on setting (readAsString, set_xxx of the parts of the specific class)
	
	URL encoding and decoding are applied by component (single subelement) and not to all. Some sub-elements are never URL encoded/decoded and there are some
	even more complicated cases - each class has to decide when to use and how these flags. Helpers for the most commoncases are implemented in the base
	class.
	
	Implemented in the base class. (no need of overriding)
*/
IBKUrlObject.prototype.get_encode = function() {throw "not implemented"; }
IBKUrlObject.prototype.set_encode = function(v) {throw "not implemented"; }	// Encoding mode - if true means perform encoding while applying source (set_source)
IBKUrlObject.prototype.get_decode = function() {throw "not implemented"; }
IBKUrlObject.prototype.set_decode = function(v) {throw "not implemented"; }	// Decoding mode - if true means perform decodingencoding while reading (get_source)
IBKUrlObject.prototype.copyFrom = function(v) { throw"not implemented"; }
/*
	Sets the entire source of the part. The class has to parse and validate it (see also throwonerror for behavior details.)
*/
IBKUrlObject.prototype.get_source = function() { throw "not implemented"; } // Regenerate the source
IBKUrlObject.prototype.set_source = function(v) { throw "not implemented"; }
/*
	This is false by default. When set to true signifies the expected behaviors of the part/sub-part get/set properties of the specific classes.
	These properties allow you to construct URL sub-part by sub-part and vary between the classes dealing with different parts of the URL.
	The setters must perform validation and construction (in the case of set_source). All the setters must return boolean result signifying the successful 
	validation and parsing of their part.
	
	When throwonerror is true these properties have to throw an exception when they otherwise just return false.
	
	This rule is introduced in order to make possible to adjust the behavior according to the programming style of the developer.
	
*/
IBKUrlObject.prototype.get_throwonerror = function() { throw "not implemented"; } // Throws errors on invalid parts set
IBKUrlObject.prototype.set_throwonerror = function(v) {throw "not implemented"; }

/*
	Acts as set source, but performs "navigation", combines the part with another (if appropriate - mostly the path)
*/
IBKUrlObject.prototype.set_nav	= function(v) { throw "not supported"; } // Applies new source over the existing as navigation change. If not supported should work the same as set_source

IBKUrlObject.prototype.get_isempty = function() { throw "not implemented"; }

IBKUrlObject.prototype.readAsString = function(v) { throw "not implemented"; } // Must return true/false to indicate success in case different classes are tried
/*
	Compose the whole part from its subparts performing component decoding if decode is true.
	If the result is empty this must return null.
*/
IBKUrlObject.prototype.composeAsString = function() { throw "not implemented"; } // Compose back to a whole string from all the subparts.

IBKUrlObject.prototype.clear = function() { throw "not implemented"; }

IBKUrlObject.prototype.toString = function(enc) {
	return this.get_source();
}
