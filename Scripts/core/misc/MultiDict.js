/**
 * MultiDict - contains multiple (Array) values for each key
 *
 * @desc This class is intended for usage with query parameters or any other set of parameters that behave in the same manner:
 *  	The parameters are key=value pairs. The same key may occur more than once in the source from wich they are obtained. If this
 *		is the case the values accumulate in arrays under the key.
 *		Developers may need various ways to access this 
 *			- detailed specification of the value index and key they want to access
 *			- access to all values under specific key
 *			- Concatenated value from all the values under a specific key
 *			- The first or the last value under specific key
 *			and some other less popular, but still convenient ways.
 *		This class aims at providing as much as possible of these methods to help developers dealing with such data.
 * 
*/
function MultiDict(mdfrom) { 
	BaseObject.apply(this,arguments);
	if (BaseObject.is(mdfrom, this.classType())) {
		this.$keys = mdfrom.get();
	}
};
MultiDict.Inherit(BaseObject, "MultiDict");
MultiDict.Implement(IUsingValueCheckersImpl);
MultiDict.ImplementProperty("keycheck", new Initialize("Optional checker for the keys used", null));
MultiDict.prototype.$keys = new InitializeObject("All keys go here and hold arrays of values");
MultiDict.prototype.$patchArray = function(_arr) {
	var arr;
	if (BaseObject.is(_arr,"Array")) {
		arr = Array.createCopyOf(_arr); // copy
	} else {
		arr = [];
	}
	
	arr.toString = function() {
		return arr.join(",");
	}
	return arr; // empty array if it is not an array (null and undefined ar handled this way too
}.Description("USed internaly to change the toString method of the returned arrays to comma separated lists");
/**
	Enumerates all keys calling the supplied callback for each key with its name and content (the original array in the store)
	callback(key, content)
		key - the enumerated key
		content - the array of values
		returns nothing, if false is returned at any point the enumeration stops and this is returned (for tasks that complete when something is found)
*/
MultiDict.prototype.enumKeys = function(callback) {
	if (BaseObject.isCallback(callback)) {
		for (var k in this.$keys) {
			if (this.$keys.hasOwnProperty(k)) {
				if (BaseObject.callCallback(callback,k, this.$keys[k]) === false) return this;
			}
		}
	}
	return this;
}
/**
	Returns all the key as an array
*/
MultiDict.prototype.keys = function(pat) {
	var r = [];
	
	if (BaseObject.is(pat, "IValueChecker")) {
		for (var k in this.$keys) {
			if (this.$keys.hasOwnProperty(k) && pat.checkValue(k)) {
				r.push(k);
			}
		}
	} else if (pat instanceof RegExp) {
		for (var k in this.$keys) {
			if (this.$keys.hasOwnProperty(k) && pat.test(k)) {
				r.push(k);
			}
		}
	} else {
		for (var k in this.$keys) {
			if (this.$keys.hasOwnProperty(k)) {
				r.push(k);
			}
		}
	}
	return r;
};
/**
 * Gets a value or array of values
 *
 *	@param x {string} Optional - the key name
 *  @param idx {integer} Optonal, the index of the value to get for that key 
 *  @returns {value|array} Depending on the parameters a value (both x and idx are passed) or an array (none or only x argument is supplied) will be returned. With no arguments returns copy of everything.
 *
 *
 */
MultiDict.prototype.get = function(x, /*optional*/ idx) {
	var me = this;
	if (arguments.length > 1) {
		if (!this.checkValueWith(this.get_keycheck(),x)) return this.$patchArray([]);
		// Both key and index
		if (BaseObject.is(this.$keys[x], "Array")) {
			if (idx >= 0 && idx < this.$keys[x].length) {
				return this.$keys[x][idx];
			} else {
				return null;
			}
		} else {
			return null;
		}
	} else if (arguments.length == 0) {
		// Full copy
		var co = BaseObject.CombineObjectsProcessed({}, this.$keys, function(key, oldItem, newItem) {
			if (BaseObject.is(newItem, "Array")) {
				return me.$patchArray(newItem);
			}
			// Return undefined
		});
		return co;
	} else { // Only key name
		if (!this.checkValueWith(this.get_keycheck(),x)) return this.$patchArray([]);
		if (this.$keys[x]) return this.$patchArray(this.$keys[x]);
		return this.$patchArray([]);
	}
};
MultiDict.prototype.set = function (_k, o) {
	var k = _k + "";
	if (!this.checkValueWith(this.get_keycheck(),k)) throw "Key " + k + " not allowed";
    if (!this.$keys[k]) this.$keys[k] = new Array();
    var a = this.$keys[k];
    for (var i = 0; i < a.length; i++) {
        if (a[i] === o) return this;
        if (a[i].equals && a[i].equals(o)) return this;
    }
    this.$keys[k] = [o]; // Set is expected to be "set"
	return this;
};
/**
 * Adds a value under tha specified key
 *	@desc Adds a new value if some values are already set to that key
 *  @param k {string} The key to which to add the value
 *  @param o {string|any} Depdending on what the dictionary is used for, the sensible values may have to be limited to certain types.
 */
MultiDict.prototype.add = function(_k, o) {
	var k = _k + "";
	if (!this.checkValueWith(this.get_keycheck(),k)) throw "Key " + k + " not allowed";
	if (arguments.length < 2) return this;
	if (!this.$keys[k]) this.$keys[k] = new Array();
	this.$keys[k].push(o);
	return this;
}
MultiDict.prototype.remove = function (_k, o) {
	var k = _k + "";
	if (!this.checkValueWith(this.get_keycheck(),k)) return this; // Incorrect keys are not searched at all, but silently ignored
    if (o == null) {
		// TODO: The negative disposition against delete lately may force us to change this a little
        delete this.$keys[k];// = null;
    } else {
        if (this.$keys[k]) {
            var a = this.$keys[k];
            for (var i = 0; i < a.length; i++) {
                if (a[i] === o || (a[i].equals && a[i].equals(o))) {
                    a.splice(i, 1);
                    return this;
                }
            }
        }
    }
	return this;
};
MultiDict.prototype.clear = function() {
	this.$keys = {}; // Everything is replaced with an empty storage
}
MultiDict.prototype.isempty = function() {
	for (var k in this.$keys) {
		if (this.$keys.hasOwnProperty(k)) {
			return false;
		}
	}
	return true;
}
// BaseObject
MultiDict.prototype.equals = function(obj) {
	if (BaseObject.is(obj, this.classType())) {
		// Compare keys
		var x = this.keys();
		var y = obj.keys();
		if (x.length != y.length) return false;
		var result = true;
		this.enumKeys(function(key, content) {
			if (BaseObject.is(content,"Array")) {
				var other = obj.get(key);
				if (other.length == content.length) {
					for (var i = 0; i < other.length; i++) {
						if (content.findElement(other[i]) < 0) {
							result = false;
							return false;
						}
					}
				} else {
					result = false;
					return false;
				}
			}
		});
		return result;
	}
	return false;
}