
/*
Root class
*/
function BaseObject() {
	if (!BaseObject.is(this,"BaseObject")) {
		if (CompileTime.finished()) {
			throw "You are calling a constructor without new";
		} else {
			CompileTime.err("You are calling a constructor without a new keyword. The name of the class cannot be extracted due to Javascript limitations. If you can't find where this is happening turn on CompileTimeThrowOnErrors and see the stack trace of the exception that will ocur.");
			if (JBCoreConstants.CompileTimeThrowOnErrors) {
				throw "You are calling a constructor without the new keyword. The name of the class cannot be extracted, to find out which one is hte class - see the stack of the exception.";
			}
			return; // unavoidable because the rest of the code will blow up
		}
	}
	if ( typeof DIAGNOSTICS != "undefined" )
	{
		JBUtil.referenceObjCount ( this );
	}
	
    this.$__instanceId = BaseObject.genInstanceId();
    for (var k in this) {
        if (BaseObject.is(this[k], "Initialize")) {
            this[k] = this[k].produceDefaultValue(this, k);
        }
    }
    BaseObject.initProtocols(this);
};
Function.classes["BaseObject"] = BaseObject; // Exception for the root class
// usage in the constructor:
// BaseObject.initProtocols(this);
// Never use this directly, calling the constructor of the parent will eventually call it in BaseObject constructor.
BaseObject.initProtocols = function (instance) {
    var s = instance.fullClassType();
    if (s != null) {
        var arr = s.split("::");
        for (var i = 0; i < arr.length; i++) {
            var c = Function.classes[arr[i]];
            if (c != null && c.protocolInitializers != null) {
                for (var j = 0; j < c.protocolInitializers.length; j++) {
                    c.protocolInitializers[j].apply(instance);
                }
            }
        }
    }
};
BaseObject.prototype.parent = null;
BaseObject.classType = "BaseObject";
BaseObject.interfaces = { PObject: true };
BaseObject.$__currentInstanceIdL = 0;
BaseObject.$__currentInstanceIdH = 0;
BaseObject.genInstanceId = function () {
    BaseObject.$__currentInstanceIdL++;
    if (BaseObject.$__currentInstanceIdL > 2000000000) {
        BaseObject.$__currentInstanceIdH++;
        BaseObject.$__currentInstanceIdL = 0;
    }
    return BaseObject.$__currentInstanceIdH + "_" + BaseObject.$__currentInstanceIdL;
};

BaseObject.queryRegistrations = {};

BaseObject.lastError = (function() {
	var _code = 0;
	var _text = null;
	var _className = null;
	var _method = null;
	var _subscribers = {};
	function _checkcodes(code, subscription) {
		if (subscription.codes != null) {
			if (!subscription.codes.Any(function(idx, itm) {
				return (itm == code)?true:null;
			})) {
				return false;
			}
			
		}
		return true; // All
	}
	function _advise(le) {
		for (var k in _subscribers) {
			if (_subscribers.hasOwnProperty(k) && _subscribers[k] != null) {
				var subs = _subscribers[k];
				if (BaseObject.isCallback(subs.callback)) {
					if (_checkcodes(_code,subs)) {
						BaseObject.callCallback(subs.callback, le); 
					}
				}
			}
		}
	}
	return {
		clear: function() {
			_code = 0;
			_text = null;
			_className = null;
			_method = null;
			return this;
		},
		report: function(code, text, cls, method) {
			this.clear();
			_code = code;
			_text = text;
			_className = cls;
			_method = method;
			_advise(this)
			return this;
		},
        append: function(code, text, cls, method) { 
            _text = _text || "";
            _text += "{" + code + ", " + text + ", " + (cls || "unknown class") + ", " + (method || "unknown method") + "}";
            return this;
        },
		none: function() {
			return (_code == 0 || _code == null);
		},
		iserror: function() {
			return (!this.none());
		},
		code: function() { return _code; },
		codeHex: function() { return _code.toString(16); },
		text: function() { return _text; },
		className: function() { return _className; },
		method: function() { return _method; },
		subscribe: function(callback,codes) {
			if (!BaseObject.isCallback(callback)) return null;
			var id = BaseObject.genInstanceId();
			var c = null;
			if (BaseObject.is(codes,"Array")) {
				c = codes;
			} else if (typeof codes == "number") {
				c = [codes];
			}
			_subscribers[id] = { 
				callback: callback,
				
			};
			return id;
		},
		unsubscribe: function(id) {
			delete _subscribers[id];
		}
		
	};
})();
/**
 * Gets/sets last error. If called without any arguments returns the system last error object
 * @param {number|string} [code] Code of the error or its description (for short report)
 * @param {string} [text] If code is number this is the description, otherwise this is the method name (see method)
 * @param {string} [method] Method name in which the error occurred.
 * @returns {object} The last error object. Use .code() for error code, .text() for description, .iserror() or .none() to make sure is an error ...
 */
BaseObject.prototype.LASTERROR = function(code, text, method) {
	if (arguments.length == 0) {
		return BaseObject.lastError;
	} else {
        if (typeof code == "string") {
            return this.LASTERROR(_Errors.compose(), code, text);
        }
		return BaseObject.lastError.report(code, text, this.classType(), method);
	}
}
BaseObject.prototype.AMMEND_LASTERROR = function(code, text, method) {
	if (arguments.length == 0) {
		return BaseObject.lastError;
	} else {
        if (typeof code == "string") {
            return this.AMMEND_LASTERROR(_Errors.compose(), code, text);
        }
        var err = BaseObject.lastError;
        if (err.none()) {
            return BaseObject.lastError.report(code, text, this.classType(), method);
        } else {
            return BaseObject.lastError.append(code, text, this.classType(), method);
        }
		
	}
}
/**
 * Gets/sets last error. If called without any arguments returns the system last error object. This is the static version of the function.
 * @param {number|string} [code] Code of the error or its description (for short report)
 * @param {string} [text] If code is number this is the description, otherwise this is the method name (see method)
 * @param {string} [method] Method name in which the error occurred.
 * @returns {object} The last error object. Use .code() for error code, .text() for description, .iserror() or .none() to make sure is an error ...
 */
BaseObject.LASTERROR = function(code, text, method) {
	if (arguments.length == 0) {
		return BaseObject.lastError;
	} else {
        if (typeof code == "string") {
            return this.LASTERROR(_Errors.compose(), code, text);
        }
		return BaseObject.lastError.report(code, text, "static", method);
	}
};


BaseObject.prototype.releaseAllEventSubscribers = function() {
    for (var i in this) {
        if (BaseObject.is(this[i], "IEventDispatcher")) {
            this[i].removeAll();
        }
    }
}
// HINT: When implementing your own Obliterator call the parent after your specific code, this way problems are much less likely to occur
BaseObject.prototype.obliterate = function (bFull) { // Destructor
    if ( typeof DIAGNOSTICS != "undefined" && !this.__obliterated )	{
		JBUtil.referenceObjCountRem ( this );
	}
	// Discard all pending async tasks
	this.discardAsync();
	
	// Check for custom obliterators.
	if (this.constructor.customObliterators != null) {
		var obls = this.constructor.customObliterators;
		for (var n = 0; n < obls.length; n++) {
			obls[n].call(this);
		}
	}
	// Perform the default oblitration
    for (var i in this) {
        if (bFull) {
            if (BaseObject.is(this[i], "BaseObject") || BaseObject.is(this[i], "Array")) {
                if (typeof this[i].obliterate == "function") this[i].obliterate(bFull);
            }
        } else {
            // In normal mode we obliterate only those kinds of objects that are intentionaly used as holders of references
            // We must provide a way to determine if something is "preserved" in the instance and can be desroyed safely.
            // if (BaseObject.is(this[i], "Delegate") || BaseObject.is(this[i], "EventDispatcher") || BaseObject.is(this[i], "WeakDelegate")) {
            if (BaseObject.is(this[i], "EventDispatcher") || BaseObject.is(this[i], "Delegate")) {
                BaseObject.obliterate(this[i]);
            }
        }
        if (typeof this[i] != "function" && !BaseObject.is(this[i], "BaseObject")) {
            if (this[i] != null) delete this[i];
        } else { // function
            if (this[i].$detachOnObliterate === true) delete this[i];
        }
    }
    this.__obliterated = true;
}.Description("Destructor")
 .Param("bFull","...")
 .Remarks("When implementing your own Obliterator call the parent after your specific code, this way problems are much less likely to occur");

// BaseObject.obliterate(o1,o2 ... oN, bFull,oN+1, oN+2);
BaseObject.obliterate = function() { // Calls the destructors
    var bFull = false;
    var obj;
    for (var i = arguments.length - 1; i >= 0; i--) {
        if (arguments[i] === true) {
            bFull = true;
            continue;
        }
        obj = arguments[i];
        if (obj != null && (BaseObject.is(obj, "BaseObject") || BaseObject.is(obj, "Array"))) {
            if (typeof obj.obliterate == "function") obj.obliterate(bFull);
        }
    }
}.Description("Static destructor. Call as BaseObject.obliterate(obj1, obj2, ....); ");

BaseObject.typeOf = function (o) {
    var t = typeof o;
    if (o != null && typeof o.classType == "function") return o.classType();
	var typedef = Class.getType(o);
	if (typedef != null && typedef.classType) {
		return typedef.classType;
	}
    return t;
}.Description("Returns class of the object")
 .Param("o","Object")
 .Returns("string");

BaseObject.fullTypeOf = function (o) {
    var t = typeof o;
    if (o != null && typeof o.fullClassType == "function") return o.fullClassType();
    return t;
}.Description("Returns the full class name of an object")
 .Returns("string");

BaseObject.is = function (o, clsOrProt) {
	if (clsOrProt == "null") return (o == null);
    if (o != null && (typeof o == "object")) {
        if (typeof o.is == "function" && typeof o.classType == "function" && typeof o.obliterate == "function") return o.is(clsOrProt);
		return (clsOrProt == "object")?true:false;
    } else if (typeof clsOrProt == "string" && typeof o == clsOrProt) {
        return true;
    }
    return false;
}.Description("Checks if an object is derived from a class or protocl")
 .Param("o","Object to be tested")
 .Param("clsOrProt","class or Interface to check against")
 .Returns("true or false");
 
BaseObject.as = function (o, clsOrProt) {
    if (o != null && (typeof o == "object")) {
        if (o.is) return (o.is(clsOrProt)?o:null);
    } else if (typeof clsOrProt == "string" && typeof o == clsOrProt) {
        return o;
    }
    return null;
}.Description("Returns object if it is a instanciated from a class or Interface")
 .Param("o","Object to be tested")
 .Param("clsOrProt","class or Interface to check against")
 .Returns("object or null");
// +V: 2.7.1
BaseObject.supports = function(o, prot) {
	if (this.is(o, "BaseObject")) return o.supports(prot);
	return false;
}
BaseObject.isrequestable = function(o) {
	return this.supports("IRequestInterface");
}.Description("indicates if the object can be queried for interface - equivalent to supports('IRequestInterface'), but heavily used in certain scenarios and for this reason presented as separate method for better code redability.");
// -V: 2.7.1
// Special "is" implementations. The additional conditions will lower the performance if these were in the main "is"
BaseObject.isJQuery = function(o) {
    if (o != null && o.jquery) return true;
    return false;
}.Description("Checks if a javascript object is a jQuery object")
 .Param("o","Object to be testd")
 .Returns("true or false");

BaseObject.isDOM = function (o) {
    if (o != null && o.tagName && o.nodeName && o.nodeType) return true;
    return false;
}.Description("Checks if javascript object is a DOM element")
 .Param("o","Javascript object to be tested")
 .Returns("true or false");

BaseObject.isLocked = function(o) {
    if (o != null && o["<locked>"] === true) return true;
    if (typeof o == "function") return true; // The functions are treated as static classes and cannot be removed
    return false;
}.Description("Checks if the object is locked in memory")
 .Param("o","Object to be tested")
 .Returns("true or false");

BaseObject.lock = function(o) {
    if (o != null && typeof o == "object") o["<locked>"] == true;
}.Description("Locks object in memory")
 .Param("o","Object to be locked");

BaseObject.unlock = function(o) {
    if (o != null && typeof o == "object" && o["<locked>"] === true) delete o["<locked>"];
}.Description("Unlocks object in memory")
 .Param("o","Object to be unlocked");

BaseObject.parseBool = function (v) {
    if (typeof (v) == "string") {
        switch (v.toLowerCase()) {
            case "yes":
            case "true":
                return true;
            default:
                return false;
        }
    } else if (typeof (v) == "boolean" || typeof (v) == "number") {
        return (v ? true : false);
    } else if (typeof (v) == "object" && v != null) {
        return BaseObject.parseBool(v.toString());
    }
    return false;
}.Description("Parses string to boolean value")
 .Param("v","String values to be parsed")
 .Returns("true or false");

BaseObject.compare = function (o1, o2) {
    if (BaseObject.is(o1, "BaseObject")) {
        return o1.compareTo(o2);
    } else if (BaseObject.is(o2, "BaseObject")) {
        return -o1.compareTo(o2);
    } else {
        try {
            return (o1 > o2)?1:((o2 > o1)?-1:0);
        } catch (ass) {
            return -1;
        }
    }
    return -1;
}.Description("Static function for comparing")
 .Param("o1","First object to be tested")
 .Param("o2","Second object to be tested")
 .Returns("number, -1, 0, 1")
 .Remarks("To be used as callback for sort function");

BaseObject.equals = function (o1, o2) {
    if (BaseObject.is(o1, "BaseObject")) {
        return o1.equals(o2);
    } else if (BaseObject.is(o2, "BaseObject")) {
        return o2.equals(o1);
    }
    return (o1 == o2);
}.Description("Determines whether object is equal to other object.")
 .Param("o1","First object to compare")
 .Param("o2","Second object to compare");
BaseObject.compareObjectProperties = function(o1,o2,props,comparer) {
	if (o1 != null && o2 != null) {
		var i,p1,p2;
		if (BaseObject.isCallback(comparer)) {
			for (i = 0; i < props.length; i++) {
				if (!BaseObject.callCallback(comparer, o1[props[i]], o2[props[i]])) return false;
			}
			return true;
		} else if (comparer == null) {
			for (i = 0; i < props.length; i++) {
				p1 = o1[props[i]], p2 = o2[props[i]];
				if (BaseObject.is(p1, "BaseObject")) {
					if (!p1.equals(p2)) return false;
				} else {
					if (p1 != p2) return false;
				}
			}
			return true;
		}
	} else {
		return false;
	}
}.Description("Compares the given properties of two objects. Missing property in both objects is considered equal.");
 
 BaseObject.prototype.classType = function () {
    return this.constructor.classType;
}.Description("Returns the class name of an object")
 .Returns("string");

BaseObject.prototype.inherits = function (cls) {
    if (this.classType() == cls) return true;
    if (this.base() != null && this.base().constructor != Object) {
        return this.base().inherits(cls);
    }
    return false;
}.Description("Checks if a class inherits from another one")
 .Param("cls","Class to test against")
 .Returns("true or false");

BaseObject.prototype.base = function () { // DO NOT USE THIS IN USER CODE !!! IT IS NOT LIKE C# base!!!
    return this.constructor.parent;
}.Hide();

BaseObject.prototype.classDefinition = function () {
    return Function.classes[this.classType()];
}.Description("...")
 .Returns("object");

BaseObject.prototype.supports = function (prot) {
    if (this.constructor.interfaces && this.constructor.interfaces[prot]) return true;
    if (this.base() != null && this.base().constructor != Object) {
        return this.base().supports(prot);
    }
    return false;
}.Description("Checks if the current object supports Interface")
 .Param("prot","Interface to check against")
 .Returns("true or false");

BaseObject.prototype.is = function (clsOrProt) {
    var t = clsOrProt;
    if (BaseObject.typeOf(clsOrProt) != "string") {
        t = BaseObject.typeOf(clsOrProt);
    }
    if (this.inherits(t)) return true;
    if (this.supports(t)) return true;
    return false;
}.Description("Checks if an object is instantiated from a class derived from a class or Interface")
 .Param("clsOrProt","Class or Interface to test against")
 .Returns("true or false");

BaseObject.prototype.as = function (clsOrProt) {
    var t = clsOrProt;
    if (BaseObject.typeOf(clsOrProt) != "string") {
        t = BaseObject.typeOf(clsOrProt);
    }
    if (this.inherits(t)) return this;
    if (this.supports(t)) return this;
    return null;
}.Description("Checks if an object is instantiated from a class derived from a class or Interface")
 .Param("clsOrProt","Class or Interface to test against")
 .Returns("object or null");

BaseObject.prototype.fullClassType = function (childClasses) {
    var s = childClasses ? childClasses : "";
    s = this.classType() + ((s.length > 0) ? ("::" + s) : "");
    if (this.base() != null && this.base().constructor != Object) return this.base().fullClassType(s);
    return s;
}.Description("Returns class name tree, the names of all parent classes")
 .Param("childClasses","...")
 .Returns("string");

BaseObject.prototype.toString = function (r) {
    return "[" + this.fullClassType() + "]";
}.Description("Returns the class type of the object as string")
 .Returns("string");

BaseObject.prototype.equals = function (obj) {
    if (obj == null) return false;
    if (this == obj) return true;
    return false;
//    if (this.fullClassType() != BaseObject.fullTypeOf(obj)) return false;
//    return true;
}.Description("Check if the current object is equal to an object")
 .Param("obj","Object to be checked for equality")
 .Returns("true or false");

BaseObject.prototype.compareTo = function (obj) {
    throw loc_CompareNotImplemented + ' ' + this.fullClassType();
};

BaseObject.prototype.copyFrom = function (o) {
    var i;
    for (i in o) {
        if (typeof (o[i]) != "function") {
            this[i] = o[i];
        }
    }
}.Description("Copies all properties from an object - shallow copy")
 .Param("o","Object from which all properties will be copied");

BaseObject.prototype.clone = function () {
    var o = new this.constructor();
    o.copyFrom(this);
    return o;
}.Description("Shallow clone")
 .Returns("object");

BaseObject.prototype.deepClone = function () {
    return BaseObject.DeepClone(this);
}.Description("Deep clonning - not recommended only for experts - breaks a bunch of rules.")
 .Returns("object");

// TODO: *** Include this call back in the clonning process!
BaseObject.$DeepCloneCallback = function (node, callback) {
    if (!BaseObject.is(callback)) return node;
    return BaseObject.callCallback(callback, node);
}.Description("...")
 .Param("node","...")
 .Param("callback","...")
 .Returns("...");

// Deep clone and comparison - these may need some extensions
BaseObject.DeepClone = function (o, callback) {
	var _callback = function(v,kind) { return true; }
	if (typeof callback == "function") _callback = callback;
    var v = v || {};
    if (typeof o == "undefined" ) {
        v = undefined;
    } else if (o == null) {
        v = null;
    }
    else {
        if (BaseObject.is(o, "BaseObject")) {
			if (!_callback(o,"BaseObject")) return null;
			v = new Function.classes[o.classType()]();
			for (i in o) {
				if (o[i] == null) {
					v[i] = null;
				} else {
					v[i] = BaseObject.DeepClone(o[i], callback);
				}
			}
        } else if (BaseObject.is(o, "Array")) {
			if (!_callback(o,"Array")) return null;
			v = [];
			for (var i = 0; i < o.length; i++) {
				v[i] = BaseObject.DeepClone(o[i], callback);                
			}
        } else if (typeof (o) == "number") {
			if (!_callback(o,"number")) return null;
            v = Number(o);
        } else if (typeof (o) == "string") {
			if (!_callback(o,"string")) return null;
            v = String(o);
        } else if (o.constructor == Date) {
			if (!_callback(o,"Date")) return null;
            v = new Date(o);
        } else if (typeof (o) == "boolean") {
			if (!_callback(o,"boolean")) return null;
            v = Boolean(o);
        } else if (typeof (o) == "object") {
			if (!_callback(o,"object")) return null;
            for (i in o) {
                if (o[i] == null) {
                    v[i] = null;
                } else {
                    v[i] = BaseObject.DeepClone(o[i]);
                }
            }
        } else if (typeof (o) == "function") {
			if (!_callback(o,"function")) return null;
            v = o;
        }
    }
    return v;
}.Description("Deep clonning. Not guaranteed to work properly on classes. Future improvements needed to that effect.")
 .Param("o","object, array, value to clone.")
 .Param("callback","called on each node and value with proto: f(node,type) where type is BaseObject, Array, number, string, boolean, object, function - true allows it, false returns null and stops recursion from going in the node.")
 .Returns("clonned object/array/value");
// Predefined callbacks
BaseObject.DeepClone.PlainOnly = function(node, type) {
	return type.inSet([ "Array", "number", "string", "boolean", "object"]);
}

 
 BaseObject.DeepCloneData = function(o) {
	 return BaseObject.DeepClone(o, function(v,t) {
		 if (t == "function" || t == "BaseObject") return false;
		 return true;
	 });
 }
 BaseObject.DeepCloneFunc = function(o) {
	 return BaseObject.DeepClone(o, function(v,t) {
		 if (t == "BaseObject") return false;
		 return true;
	 });
 }
 BaseObject.DeepCloneDataObject = function(o) {
	 return BaseObject.DeepClone(o, function(v,t) {
		 if (t == "function" || t == "BaseObject" || t == "Array") return false;
		 return true;
	 });
 }

 // Deep comparison
BaseObject.Equals = function (o, v) {
    if (o != null && v != null) {
        var i;
        for (i in o) {
            if (BaseObject.is(o[i], "BaseObject")) {
                if (!BaseObject.is(v[i], "BaseObject")) { return false; }
                else {
                    if (o[i] !== v[i]) return false;
                }
            } else if (BaseObject.is(o[i], "Array")) {
                if (BaseObject.is(v[i], "Array")) {
                    if (o[i].length != v[i].length)
                        return false;
                    else
                        for (var j = 0; j < o[i].length; j++) {
                            if (!BaseObject.Equals(o[i][j], v[i][j]))
                                return false;
                        }
                }
                else {
                    return false;
                }
            } else if (o[i] instanceof Date) {
                if (!v[i] instanceof Date)
                    return false;
                else
                    if (o[i].getFullYear() != v[i].getFullYear() && o[i].getMonth() != v[i].getMonth() && o[i].getDate() != v[i].getDate())
                        return false;
            } else {
                switch (typeof (o[i])) {
                    case "undefined":
                        if (typeof (v[i]) != "undefined") return false;
                        break;
                    case "number":
                        if (typeof (v[i]) != "number") return false;
                        else
                            if (o[i] != v[i]) return false;
                        break;
                    case "string":
                        if (typeof (v[i]) != "string") return false;
                        else
                            if (o[i] != v[i]) return false;
                        break;
                    case "Boolean":
                        if (typeof (v[i]) != "Boolean") return false;
                        else
                            if (o[i] != v[i]) return false;
                        break;
                    case "object":
                        if (typeof (v[i]) != "object") return false;
                        else {
                            if (o.hasOwnProperty(i) && v.hasOwnProperty(i)) {
                                if (!BaseObject.Equals(o[i], v[i]))
                                    return false;
                            }
                        }
                        break;
                    case "function":
                        if (typeof (o[i]) == "undefined" || (o[i].toString() != v[i].toString()))
                            return false;
                        break;
                }
            }
        }
    }
    return true;
};
 
// Deep comarison
// BaseObject.Equals = function (v1, v2) {
	// if (v1 === v2) return true;
	// if ((v1 == null && v2 != null) || (v1 != null && v2 == null)) return false;
	// if (v1 == null && v2 == null) return true;
	// if (typeof v1 != typeof v2) return false;
	// if (BaseObject.fullTypeOf(v1) != BaseObject.fullTypeOf(v2)) return false;
	// if (BaseObject.is(v1, "Array")) {
	//	for (
	// }
// }.Description("...")
 // .Param("v1","First object")
 // .Param("v2","Second object")
 // .Returns("true or false");

// Deep comparison
BaseObject.Equals1 = function (o, v) {
    if (o != null && v != null) {
        var i;
        for (i in o) {
			
            if (BaseObject.is(o[i], "BaseObject")) {
                if (!BaseObject.is(v[i], "BaseObject")) { // BaseObject with non-BaseObject
					return false; 
				} else { // Use equals
                    if (!o[i].equals(v[i])) return false;
                }
            } else if (BaseObject.is(o[i], "Array")) {
                if (BaseObject.is(v[i], "Array")) {
                    if (o[i].length != v[i].length)
                        return false;
                    else
                        for (var j = 0; j < o[i].length; j++) {
                            if (!BaseObject.Equals(o[i][j], v[i][j]))
                                return false;
                        }
                }
                else {
                    return false;
                }
            } else if (o[i] instanceof Date) {
                if (!v[i] instanceof Date)
                    return false;
                else
                    if (o[i].getFullYear() != v[i].getFullYear() && o[i].getMonth() != v[i].getMonth() && o[i].getDate() != v[i].getDate())
                        return false;
            } else {
                switch (typeof (o[i])) {
                    case "undefined":
                        if (typeof (v[i]) != "undefined") return false;
                        break;
                    case "number":
                        if (typeof (v[i]) != "number") return false;
                        else
                            if (o[i] != v[i]) return false;
                        break;
                    case "string":
                        if (typeof (v[i]) != "string") return false;
                        else
                            if (o[i] != v[i]) return false;
                        break;
                    case "Boolean":
                        if (typeof (v[i]) != "Boolean") return false;
                        else
                            if (o[i] != v[i]) return false;
                        break;
                    case "object":
                        if (typeof (v[i]) != "object") return false;
                        else {
                            if (o.hasOwnProperty(i) && v.hasOwnProperty(i)) {
                                if (!BaseObject.Equals(o[i], v[i]))
                                    return false;
                            }
                        }
                        break;
                    case "function":
                        if (typeof (o[i]) == "undefined" || (o[i].toString() != v[i].toString()))
                            return false;
                        break;
                }
            }
        }
    } else if (o == null && v == null) { // Both are nulls
		return true;
	} else { // One null the other not
		return false;
	}
}.Description("...")
 .Param("o","...")
 .Param("v","...")
 .Returns("true or false");

BaseObject.prototype.proto = function(protocolName, method) { // usage: obj.proto("PMyProtocol","SomeMethod").invoke(... args ...); // safe invoke only if the Interface is supported
    if (this.is(protocolName)) {
        if (BaseObject.is(method, "string")) {
            return new Delegate(this, this[method]);
        } else {
            return new Delegate(this, method);
        }
    } else {
        return new Delegate();
    }
}.Description('usage: obj.proto("PMyProtocol","SomeMethod").invoke(... args ...);  safe invoke only if the Interface is supported')
 .Param("protocolName","")
 .Param("method","")
 .Returns("object");
 
BaseObject.prototype.thisCall = function(f, optional_noerr) {
	if (f != null) {
		if (typeof f == "function") {
			return Delegate.createWrapper(this, f);
		} else {
			if (optional_noerr) return null;
			throw "thisCall requires a function argument or null. You can specify a noerr flag if you want wrong arguments to be ignored instead of throwing an exception";
		}
	}
	return null;
}.Description("Returns a wrapped function that will call the specified function f with the same this as the this of the thisCall method.")
	.Param("f","Function to wrap or null. When null is passed - null is returned. The code that works with this should deal with that or you should take care to avoid nulls")
	.Param("optional_noerr","Boolean which if specified and set to true will suppress the exception thrown when f is neither null or function. If so, non-function f argument will cause null to be returned")
	.Returns("A function wrapper or null.");
	
BaseObject.prototype.staticCall = function(f, optional_noerr) {
	var cls = this.classDefinition();
	if (f != null) {
		if (typeof f == "function" && cls != null) {
			return Delegate.createWrapper(cls, f);
		} else {
			if (cls == null) {
				throw "staticCall cannot determine the class of this instance, your class definition is probably incorrect.";
			}
			if (optional_noerr) return null;
			throw "thisCall requires a function argument or null. You can specify a noerr flag if you want wrong arguments to be ignored instead of throwing an exception";
		}
	}
	return null;
}.Description("Returns a wrapped function that will call the specified function f with this set to the class of this instance - i.e. the function willbe able to access static properties andmethods through its this and not instance members.")
	.Param("f","Function to wrap or null. When null is passed - null is returned. The code that works with this should deal with that or you should take care to avoid nulls")
	.Param("optional_noerr","Boolean which if specified and set to true will suppress the exception thrown when f is neither null or function. If so, non-function f argument will cause null to be returned")
	.Returns("A function wrapper or null.");
// +V:2.16.0	
// Formatters usage from code
BaseObject.prototype.Format = function(name_or_inst, val, bind, params) {
	var fmt = null;
	if (typeof name_or_inst.classType == "string" && Class.is(name_or_inst, "SystemFormatterBase")) {
		name_or_inst = name_or_inst.classType;
	}
	if (typeof name_or_inst == "string") {
		// From Registers
		fmt = Registers.Default().getRegister("systemformatters").item(name_or_inst);
		if (fmt == null) {
			throw "The formatter " + name_or_inst + " is not registered as a system formatter/convertor/filter";
		} else {
			return fmt.ToTarget(val, bind, params);
		}
	} else if (BaseObject.is(name_or_inst, "CustomFormatterBase")) {
		return name_or_inst.ToTarget(val, bind, params);
    } else if (typeof name_or_inst == "object" && typeof name_or_inst.ToTarget == "function") {
        return name_or_inst.ToTarget.call(this,val, bind, params);
	} else { 
		throw "The formatter cannot be found";
	}
}
BaseObject.prototype.Unformat = function(name_or_inst, val, bind, params) {
	var fmt = null;
	if (typeof name_or_inst.classType == "string" && Class.is(name_or_inst, "SystemFormatterBase")) {
		name_or_inst = name_or_inst.classType;
	}
	if (typeof name_or_inst == "string") {
		// From Registers
		fmt = Registers.Default().getRegister("systemformatters").item(name_or_inst);
		if (fmt == null) {
			throw "The formatter " + name_or_inst + " is not registered as a system formatter/convertor/filter";
		} else {
			return fmt.FromTarget(val, bind, params);
		}
	} else if (BaseObject.is(name_or_inst, "CustomFormatterBase")) {
		return name_or_inst.FromTarget(val, bind, params);
    } else if (typeof name_or_inst == "object" && typeof name_or_inst.FromTarget == "function") {
        return name_or_inst.FromTarget.call(this,val, bind, params);
	} else { 
		throw "The formatter cannot be found";
	}
}
// -V:2.16.0	
	
BaseObject.isCallback = function (callback) {
    if (callback == null) return false;
    if (BaseObject.is(callback, "IInvocationWithArrayArgs")) {
        return true;
    } else if (typeof callback == "function") {
        return true;
    }
    return false;
}.Description("Checks if the value represents a callback. A callback is: every function, every object supporting IInvocationWithArrayArgs. Usually classes implementing IInvocationWithArrayArgs also implement IInvoke, but the reverse is not alwyas true!")
 .Param("callback","value to be tested")
 .Returns("true or false");

BaseObject.callCallback = function (callback) { // usage: BaseObject.invokeCallback(callback, arg1, arg2, arg3 ....)
    if (callback == null) return null;
    var args = Array.createCopyOf(arguments, 1);
    if (BaseObject.is(callback, "IInvocationWithArrayArgs")) {
        return callback.invokeWithArgsArray(args);
    } else if (typeof callback == "function") {
        return callback.apply(null, args);
    }
    return null;
}.Description("Executes a callback. Id the value represents a callback it will be executed and any return value returned. Otherwise nothing will happen and null will be returned.")
 .Param("callback","callback to execute.")
 .Returns("object or null");
BaseObject.callCallbackDelegate = function(callback /*,args*/) {
	var args = Array.createCopyOf(arguments, 1);
	return new Delegate(null, function() { return BaseObject.applyCallback(callback,args);});
}.Description("Use only if really needed - creates a delegate that when invoked (without args) executes performs the callCallback logic");

BaseObject.applyCallback = function (callback, args) { // usage: BaseObject.invokeCallback(callback[, arg1, arg2, arg3 ....])
    if (callback == null) return null;
    if (BaseObject.is(callback, "IInvocationWithArrayArgs")) {
        return callback.invokeWithArgsArray((args != null) ? args : []);
    } else if (typeof callback == "function") {
        if (args != null) {
            return callback.apply(null, args);
        } else {
            return callback.apply(null, []);
        }
    }
    return null;
}.Description("Executes a callback, but passes arguments in an apply style.")
 .Param("callback","Function to be checked and executed")
 .Param("args","Parameters to be passed to the callback")
 .Returns("object or null");
BaseObject.applyCallbackDelegate = function(callback, args) {
	var args = Array.createCopyOf(arguments, 1);
	if (args == null) args = [];
	return new Delegate(null, function() { return BaseObject.applyCallback(callback,args);});
}.Description("Use only if really needed - creates a delegate that when invoked (without args) executes performs the applyCallback logic");
BaseObject.defaultAjaxErrorHandler = function (xmlHttpReq, textStatus, errDescription) {
    alert("AJAX Error:\n HTTP status: " + xmlHttpReq.status + "\nstatus text: " + textStatus + "\ndescription: " + errDescription + "\n------\n" + xmlHttpReq.responseText); 
};

BaseObject.ajaxDefaults = {
    "default": {
        cache: false,
        error: BaseObject.defaultAjaxErrorHandler,
        onStartOperation: null,
        onEndOperation: null
    }

};

BaseObject.prototype.get_ajaxDefaults = function (kind) {
    var k = (kind != null) ? kind : "default";
    var c = this.constructor;
    do {
        if (c.ajaxDefaults != null && c.ajaxDefaults[k] != null) return c.ajaxDefaults[k]; 
        c = c.parent.constructor;
    } while(c != null && c.constructor != Object)
    return null;
}.Description("...")
 .Param("kind","...")
 .Returns("object or null");

/*
	Implementation considerations:
	settings is enriched with a number of properties we are using, which are ignored by jquery.
	... TODO: complete this ...
	confData property is reserved for use by custom extensions implemented in the conf file.
		It is not initialized by the framework, if the conf handlers need it always initialized onStartOperation should do the initialization.
		
*/
BaseObject.prototype.ajax = function (settings, kind) { // base transfer method
    var localThis = this;
    var defs = this.get_ajaxDefaults(kind);
    if (defs == null) defs = this.get_ajaxDefaults();
    if (defs != null) {
        for (var k in defs) {
            if (settings[k] == null) settings[k] = defs[k];
        }
    }
    if (settings.mapUrl) settings.url = mapPath(settings.url);
    var userCallBack = settings.success;
    var userErrorHandler = settings.error;
    settings.success = function (result, statusText, jqXHR) {
		if (localThis.__obliterated) return; // Cancel any processing.
        var processedResult = null;
        if (settings.onEndOperation) processedResult = settings.onEndOperation.call(localThis, settings, result, { success: true, status: 200, statusText: "OK", description: null, xhr: jqXHR });
        if (settings.AbortAllProcessing) return;
        if (settings.failRequest != null) {
            if (settings.failRequest.skipErrorProcessing !== true) {
                settings.error(jqXHR, settings.failRequest.statusText, settings.failRequest.description);
            } else {
                IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "end", settings, result, { success: false, status: 200, statusText: settings.failRequest.statusText, description: settings.failRequest.description });
            }
        } else {
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "end", settings, result, { success: true, status: 200, statusText: "OK", description: null });
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "success", settings);
            if (userCallBack != null && !settings.AbortAllProcessing) userCallBack.call(localThis, (processedResult != null) ? processedResult : result);
        }
    };
    settings.error = function (xmlHttpReq, textStatus, errDescription) {
		if (localThis.__obliterated) return; // Cancel any processing.
        if (settings.onEndOperation) settings.onEndOperation.call(localThis, settings, null, { success: false, status: xmlHttpReq.status, statusText: textStatus, description: errDescription, xhr: xmlHttpReq });
        if (settings.AbortAllProcessing) return;
        if (userErrorHandler != null) userErrorHandler.call(localThis, xmlHttpReq, textStatus, errDescription, settings);
        IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "end", settings, null, { success: false, status: xmlHttpReq.status, statusText: textStatus, description: errDescription });
        IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "error", settings, null, { success: false, status: xmlHttpReq.status, statusText: textStatus, description: errDescription });
    };
    if (settings.onStartOperation) {
        if (settings.onStartOperation.call(localThis, settings) === true) {
            // Operation is redundand or cancelled
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "start", settings);
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "end", settings, settings.immediateResult, { success: true, status: 200, statusText: "OK", description: null });
            IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "success", settings.immediateResult);
            settings.success(settings.immediateResult);
            return;
        }
    }
    IAjaxReportSinkImpl.ajaxNotifyObject(localThis, "start", settings);
    $.ajax(settings);
}.Description("...")
 .Param("settings","Array with settings")
 .Param("kind","...");

// These two static methods should be overriden by the application to append any app specific
// OOB parameters to the URL (first method) and returns the meaningful part of these parameters (the second metod).
// This is usually done by using regullar expressions.
// Details: Most applications need some kind of OOB app wide data to be passed in the server requests, such as role, group, mode etc.
//  These methods must be used by the application's ajax pre/post callbacks, caching code and other modules that may need to identify
//  certain elements by URL used to load/init them. As the OOB data may (or may not depending on the design) be part of the data needed
//  to identify such an element uniquely the application needs some help from the framework both to inject the data and to identify it back
//  whenever the URL must be "recognized" and matchaed against cache managers or other keyed stores.
//  Performance recommendation: When keying data this way it is recommended to put the element supplied part of the URL hash first (in the start of the key string) because
//  it is likely that this part is much more unique than the application OOB part.
// ajaxDecorateUrl( this, url in preparation)
BaseObject.ajaxDecorateUrl = function (obj, url) { return url; };
BaseObject.ajaxDecorateUrlHash = function (obj, url) { return ""; };
// note about ajaxDecorateUrlHash. Although this routine has the same arguments like the first one, depending on the application design the first argument may
//  or may not be needed.

// Communication specialization
/* Note that these are a bit more specialized than one would expect in a base class.
    However the communication pattern specified here is quite convenient and can be used in different apps.
*/

BaseObject.prototype.ajaxGetXml = function (url, data, callback, cache, failonoperations, isBackgroundRequest) {
    this.ajax({
        url: url,
        dataType: 'xml', // expect xml
        // contentType: "application/json; charset=utf-8", // This should not be needed in Get request
        data: data, // will be translated to parameters
        cache: ((cache) ? true : false),
        success: callback,
        failonoperations: failonoperations,
        isbackgroundrequest: isBackgroundRequest
    },"xml");
}.Description("...")
 .Param("url","URL path")
 .Param("data","Data object to be sent")
 .Param("callback","Method / function to be executed on success")
 .Param("cache","...")
 .Param("failonoperations","...");

BaseObject.prototype.ajaxPostXml = function (url, data, callback, cache, sync, failonoperations, isBackgroundRequest) {
    this.ajax({
        url: url,
        type: "POST",
        dataType: 'xml', // we expect data and control notifications packed in xml
        contentType: "application/json; charset=utf-8", // we aresending stringified json as post body
        data: data,
        cache: ((cache) ? true : false),
        success: callback,
        async: !sync,
        failonoperations: failonoperations,
        isbackgroundrequest: isBackgroundRequest
    }, "xml");
}.Description("...")
 .Param("url","URL path")
 .Param("data","Data object to be sent")
 .Param("callback","Method / function to be executed on success")
 .Param("cache","...")
 .Param("sync","Indicates if the call is async")
 .Param("failonoperations","...");

BaseObject.prototype.ajaxPostXmlSync = function (url, data, callback, cache) {
    this.ajaxPostXml(url, data, callback, cache, true);
}.Description("...")
 .Param("url","Url path")
 .Param("data","Data object to be sent")
 .Param("callback","...")
 .Param("cache","...");

// These are out of fashion - we communicate with XML packed json now
BaseObject.prototype.ajaxGetJson = function (url, data, callback, cache) {
    this.ajax({
        url: url,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: data,
        cache: ((cache) ? true : false),
        success: callback
    }, "json");
}.Description("...")
 .Param("url","URL path")
 .Param("data","Data object to be sent")
 .Param("callback","Method / function to be executed on success")
 .Param("cache","...");

BaseObject.prototype.ajaxPostJson = function (url, data, callback) {
    this.ajax({
        url: url,
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: data,
        cache: false,
        success: callback
    }, "json");
}.Description("...")
 .Param("url","URL path")
 .Param("data","Data object to be sent")
 .Param("callback","Method / function to be executed on success");


BaseObject.prototype.getDelegatedProperty = function (proppath, calcCallback, autoRefresh) {
    return new PropertyDelegate(this, proppath, calcCallback, autoRefresh);
}.Description("...")
 .Param("proppath","...")
 .Param("calcCallback","...")
 .Returns("...");

// Asynch support at its deepest
BaseObject.prototype.callAsync = function (method /*args*/) { // Blind simple execution (without dependencies and fine control
    var m = BaseObject.is(method, "string") ? this[method] : method;
    if (typeof m != "function") throw "Attempt to call non-function in " + this.fullClassType();
    var args = Array.createCopyOf(arguments, 1);
    var ar = this.async(m).apply(args);
    return ar;
}.Description("Executes the specified method asynchronously. The arguments after the first one are passed to the method.")
 .Param("method","The method name as string or function. It is executed with correct this (pointing to current instance on which callAsync has been invoked)")
 .Returns("The ControllableAsyncResult created for the execution. The result supports IAsyncResult, but also has more convenient methods for simple control of the behaviour. The execution specifics can be adjusted directly over the returned result. The returned result is already scheduled for execution with the default task scheduler.");
 // BaseObject.prototype.callAsyncCallback = function (callback /*args*/) { 
 // }
 BaseObject.prototype.callAsyncIf = function (condition, method /*,arguments*/) {
    var args = Array.createCopyOf(arguments, 2);
    if (condition) {
        return this.callAsync.apply(this, args);
    } else {
        args.shift();
        var m = BaseObject.is(method, "string") ? this[method] : method;
        return m.apply(this, args);
    }
};

BaseObject.prototype.callAsynch = BaseObject.prototype.callAsync; // For backward compatibility
BaseObject.prototype.$asyncResultWasScheduled = function (ar) {
    if (this.$ownedAsyncResults == null) this.$ownedAsyncResults = [];
    this.$ownedAsyncResults.addElement(ar);
}.Description("...")
 .Param("ar","...");

BaseObject.prototype.$asyncResultWasUnscheduled = function (ar) {
    if (this.$ownedAsyncResults != null && this.$ownedAsyncResults.length > 0) {
        this.$ownedAsyncResults.removeElement(ar);
        if (this.$ownedAsyncResults.length == 0) this.$ownedAsyncResults = null; // To save space
    }
}.Description("...")
 .Param("ar","...");

BaseObject.prototype.async = function (method, ownerObject) { // Returns controllable async result that is not yet schedulled for execution use like this.async(this.mymethod).execute(arg1, arg2, ...); See ControllableAsyncResult for more details.
    var ar = new ControllableAsyncResult(EventPump.Default(), this, method);
    ar.ownerObject = (BaseObject.is(ownerObject,"BaseObject")?ownerObject:this);
    return ar;
}.Description("Prepares a controllable async result for the specified method.")
 .Param("method","...")
 .Param("ownerObject","...");
 // TODO: May be direct callbacks support is a good thing. It will help less, but there is usefulness to it - the callback is not thiscalled automatically, but this object owns the task and can kill it.
// BaseObject.prototype.asyncCallback = function(callback, ownerObject) {
	// var ar = new ControllableAsyncResult(EventPump.Default(), new Delegate(null, function() {callback});
    // ar.ownerObject = (BaseObject.is(ownerObject,"BaseObject")?ownerObject:this);
    // return ar;
//}

BaseObject.prototype.afterAsync = function (asyncResult, method) {
    if (BaseObject.is(asyncResult, "IAsyncResult")) {
        var args = Array.createCopyOf(arguments, 2);
        if (BaseObject.is(method, "IInvocationWithArrayArgs")) {
            if (BaseObject.is(method, "IArgumentManagement")) {
                method.applyArguments(args);
            }
            asyncResult.then(method);
        } else if (typeof method == "function") {
            asyncResult.then(new Delegate(this, method, args));
        } else if (typeof method == "string") {
            if (typeof this[method] == "function") {
                asyncResult.then(new Delegate(this, this[method], args));
            } else {
                throw "The method " + method + " does not exist.";
            }
        }
    } else {
        var args = Array.createCopyOf(arguments, 2);
        if (BaseObject.is(method, "IInvocationWithArrayArgs")) {
            method.invokeWithArgsArray(args);
        } else if (typeof method == "function") {
            method.apply(this, args);
        } else if (typeof method == "string") {
            if (typeof this[method] == "function") {
                this[method].apply(this, args);
            } else {
                throw "The method " + method + " does not exist.";
            }
        }
    }
}.Description("executes a method after the specified async result is completed.")
 .Param("asyncResult","...")
 .Param("method","...");

BaseObject.prototype.discardAsync = function (callback) {
    var _callback = callback;
    if (typeof _callback == "string" || typeof _callback == "number") {
        _callback = function (idx, item) { // if callback is a string use internal function that checks the async results key as selector for the discardable tasks
            if (item.get_key() == callback) return item;
            return null;
        };
    }  else if (BaseObject.is(callback, "Array")) {
        _callback = function (idx, item) { // if callback is a string use internal function that checks the async results key as selector for the discardable tasks
            if (callback.findElement(item.get_key()) >= 0) return item;
            return null;
        };
    }
    if (this.$ownedAsyncResults != null && this.$ownedAsyncResults.length > 0) {
        var discarding = null;
        if (_callback != null) {
            discarding = this.$ownedAsyncResults.Select(_callback);
        } else {
            discarding = Array.createCopyOf(this.$ownedAsyncResults);
        }
        if (discarding != null && discarding.length > 0) {
            for (var i = 0; i < discarding.length; i++) {
                var task = discarding[i];
                if (BaseObject.is(task, "IAsyncResult")) task.unschedule();
            }
        }
    }
}.Description("Discards async results by key or by selection by callback.")
 .Param("callback","...");
 
 // Non-related to the OOP static method anchored over BaseObject (as general tools)
 
 BaseObject.CombineObjects = function () {
    var o = {};
	var cbcontroller = null;
	var cnt = arguments.length;
	if (BaseObject.isCallback(arguments[arguments.length - 1])) {
		cbcontroller = arguments[arguments.length - 1];
		cnt = cnt - 1;
	}
    for (var i = 0; i < cnt; i++) {
        if (arguments[i] != null) {
            if (typeof arguments[i] == "object") {
                for (var j in arguments[i]) {
					if (cbcontroller != null) {
						if (BaseObject.callCallback(cbcontroller,j, o[j], arguments[i][j])) {
							o[j] = arguments[i][j];
						}
					} else {
						o[j] = arguments[i][j];
					}
                }
            }
        }
    }
    return o;
}.Description("Combines each object passed as parameter into single object, property by property, overriding existing ones")
 .Param("last", "If the last param is a callback it is called for each assignment wtih cb(key, leftval, rightval) to permit the transfer and potentially replacement")
 .Returns("The resulting object");
BaseObject.CombineObjectsProcessed = function () {
    var o = {};
	var cbcontroller = null;
	var cnt = arguments.length;
	if (BaseObject.isCallback(arguments[arguments.length - 1])) {
		cbcontroller = arguments[arguments.length - 1];
		cnt = cnt - 1;
	}
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != null) {
            if (typeof arguments[i] == "object") {
                for (var j in arguments[i]) {
					if (cbcontroller != null) {
						var x = BaseObject.callCallback(cbcontroller,j, o[j], arguments[i][j]);
						if (typeof x != "unefined") {
							o[j] = x;
						}
					} else {
						o[j] = arguments[i][j];
					}
                }
            }
        }
    }
    return o;
}.Description("Combines each object passed as parameter into single object, property by property, overriding existing ones")
 .Param("last", "If the last param is a callback it is called for each assignment wtih cb(key, leftval, rightval) to process the property value")
 .Returns("The resulting object");

BaseObject.CombineObjectsDeep = function () {
    var level = -1; // Default: Go to the bottom of the object tree
    if (arguments.length > 0 && typeof arguments[0] === "number") {
        level = arguments[0];
    }
    var o = {};
    for (var i = level == -1 ? 0 : 1; i < arguments.length; i++) {
        if (arguments[i] != null) {
            if (typeof arguments[i] == "object") {
                for (var j in arguments[i]) {
                    if (BaseObject.is(arguments[i][j],"object") && level != 0) {
                        o[j] = BaseObject.CombineObjectsDeep(level - 1, o[j], arguments[i][j]);
                    } else {
                        o[j] = arguments[i][j];
                    }
                }
            }
        }
    }
    return o;
}.Description("...")
 .Returns("object");

BaseObject.CombineObjectsDeepSelectively = function () {
    var deepClones = null;
    if (arguments.length > 1 && BaseObject.is(arguments[0],"Array")) {
        deepClones = arguments[0];
    }
    var o = {};    
    for (var i = IsNull(deepClones) ? 0 : 1; i < arguments.length; i++) {
        if (arguments[i] != null) {
            if (typeof arguments[i] == "object") {
                for (var j in arguments[i]) {
                    if (typeof arguments[i][j] == "object" && (IsNull(deepClones) || deepClones.findElement(j) >= 0)) {
                        o[j] = BaseObject.CombineObjectsDeep(o[j], arguments[i][j]);
                    } else {
                        o[j] = arguments[i][j];
                    }
                }
            }
        }
    }
    return o;
}.Description("...")
 .Returns("object");
 /**
  * Casts object field values as specified in the 2 argument.
  * @param {Object} o object to cast
  * @param {Object} cast Specifies which fields and how to cast them (see below)
  * @returns the same object with specified field values casted as specified and the rest unchanged.
  * 
  * cast:
  * { <fieldname>:"<type>" }
  * where type can be a string:
  * int - cast to integer, if cast fails value is left as is.
  * number - cast to number, if cast fails value is left as is.
  * string - casted to string
  * null - set to null (no actual casting)
  * 
  */
 BaseObject.CastObjectValues = function (o, cast) {
    if (arguments.length < 2) return o;
    if (typeof cast == "object" && typeof o == "object") {
        var v,t;
        for (var k in o) {
            if (o.hasOwnProperty(k) && typeof cast[k] == "string") {
                t = cast[k];
                switch(t) {
                    case "int":
                    case "number":
                        v = Number(o[k]);
                        if (t == "int" && !isNaN(v)) {
                            v = Math.floor(v);
                        }
                        if (!isNaN(v)) o[k] = v;
                    break;
                    case "string":
                        v = o[k];
                        if (typeof v != "string") {
                            o[k] = String(v);
                        }
                    break;
                    case "null":
                        o[k] = null;
                    break;
                }
            }
        }
    }
    return o;
 }
 // property setters static versions
// Example: var v = BaseObject.getProperty(someObject, "subobj1.subobj2.prop"[,default]);
//          BaseObject.setProperty(someObject, "subobj1.subobj2.prop", v);
BaseObject.setProperty = function (obj, propPath, v) {
    if (obj != null && propPath != null && propPath.length > 0) {
        var arr = propPath.split(".");
        if (arr != null) {
            var o = obj;
            for (var i = 0; i < arr.length; i++) {
                if (i < arr.length - 1) {
                    if (typeof (o["get_" + arr[i]]) == "function") {
                        o = o["get_" + arr[i]]();
                    } else if (o[arr[i]] == null) {
                        o[arr[i]] = {};
                        o = o[arr[i]];
                    } else {
                        o = o[arr[i]];
                    }
                } else {
                    if (typeof (o["set_" + arr[i]]) == "function") {
                        o["set_" + arr[i]](v);
                    } else {
                        o[arr[i]] = v;
                    }
                }
            }
        }
    }
}.Description("...")
 .Param("obj","...")
 .Param("propPath","...")
 .Param("v","...");

BaseObject.getProperty = function (obj, propPath, defVal) {
    var defaultResult = ((defVal == null) ? null : defVal);
    if (obj != null && propPath != null && propPath.length > 0) {
        var arr = propPath.split(".");
        if (arr != null) {
            var o = obj;
            for (var i = 0; i < arr.length; i++) {
                if (o == null) return defaultResult;
                if (typeof (o["get_" + arr[i]]) == "function") {
                    o = o["get_" + arr[i]]();
                } else if (typeof (o[arr[i]]) == "undefined") {
                    return defaultResult;
                } else {
                    o = o[arr[i]];
                }
            }
            return o;
        }
    }
    return defaultResult;
}.Description("...")
 .Param("obj","...")
 .Param("propPath","...")
 .Param("defVal","Default result value")
 .Returns("...");
 
 BaseObject.ClearObject = function(params_obj) {
	 var n = 0;
	 for (var i = 0;i < arguments.length; i++) {
		 var obj = arguments[i];
		 if (BaseObject.is(obj,"object")) {
			 n++;
			 for (var k in obj) {
				 if (obj.hasOwnProperty(k)) {
					 delete obj[k];
				 }
			 }
		 }
	 }
	 return n;
 }.Description("Clears all the own properties of one or more passed objects - each as a separate argument")
  .Returns("The number of objects cleared");