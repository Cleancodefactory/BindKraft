/* Type query on classes
Utility functions
We need a few utilities for the standard classes. To avoid complicating the mixing of the library with others we use separate namespace instead
of prototyping the standard objects. The namespaces are nammed with preffix SC to hint at what they point and that they are static
*/

// Type manipulation and information. These methods work on class definitions, not instances.
var Class = {
    is: function (cls, clsOrProt) {
        var cur = cls;
		// +V: 2.7.1
		if (typeof cls == "string") {
			cur = this.getClassDef(cls);
		}
		// +-: 2.7.1
        if (cur == null) return false;
        if (cur.classType == clsOrProt) return true;
        if (cur.interfaces && cur.interfaces[clsOrProt]) return true;
        if (cur.parent) return Class.is(cur.parent.constructor, clsOrProt);
        return false;
    },
    supports: function (cls, prot) {
        var cur = cls;
		// +V: 2.7.1
		if (typeof cls == "string") {
			cur = this.getClassDef(cls);
		}
		// +-: 2.7.1
        if (cls == null) return false;
        if (cur.interfaces && cur.interfaces[prot]) return true;
        if (cur.parent) return Class.supports(cur.parent.constructor, prot);
        return false;
    },
    // Call as: Class.fullClassType(someClass);
    fullClassType: function (cls, childClasses) {
        var s = childClasses ? childClasses : "";
        s = cls.classType + ((s.length > 0) ? ("::" + s) : "");
        if (cls.parent != null && cls.parent.constructor != Object) return Class.fullClassType(cls.parent.constructor, s);
        return s;
    },
    supportedInterfaces: function (cls, arr, extending) {
        var cur = cls;
		var a = (arr != null) ? arr : [];
		if (cls == null) return a;
		var p;
		// Implement in two branches to gain performance - this is much more often used with extending == null
		if (extending != null) {
			if (cur.interfaces != null) {
				for (p in cur.interfaces) {
					if (p != null && p.length > 0 && Class.doextend(extending)) {
						a.addElement(p);
					}
				}
			}
			if (cur.parent) return Class.supportedInterfaces(cur.parent.constructor, a, extending);
			return a;
		} else {
			if (cur.interfaces != null) {
				for (p in cur.interfaces) {
					if (p != null && p.length > 0) {
						a.addElement(p);
					}
				}
			}
			if (cur.parent) return Class.supportedInterfaces(cur.parent.constructor, a);
			return a;
		}
    },
    implementors: function (prot) {
        var arr = [];
        for (var c in Function.classes) {
            if (Class.is(Function.classes[c], prot)) arr.push(c);
        }
        return arr;
    },
	funcDoc: function(func) {
		if (typeof func == "function") {
			return {
				description: func.$description,
				hidden: func.$hidden,
				parameters: func.$paramDescriptions,
				returns: func.$returns,
				remarks: func.$remarks
			};
		} else {
			return null;
		}
	},
	// +V: 2.7.0
		getInterfaceDef: function(iface) {
			if (typeof iface == "string") {
				if (Function.interfaces[iface]) return Function.interfaces[iface];
			} else if (typeof iface == "function" && typeof iface.classType == "string") {
				if (Function.interfaces[iface.classType]) return Function.interfaces[iface.classType];
			}
			return null;
		},
		// +V: 2.7.1
		getInterfaceName: function(iface) {
			if (typeof iface == "string") {
				return iface;
			} else if (typeof iface == "function") {
				return (typeof iface.classType == "string")?iface.classType:null;
			} else {
				return null;
			}
		},
		doesextend: function(inspected, iface) { // We avoid using the reserved word "extends" in case we run in something that gets crazy regardless of the context (there are known javascript machines and transpilers having this problem).
			var def = this.getInterfaceDef(inspected);
			if (Class.getInterfaceName(inspected) == Class.getInterfaceName(iface)) return true;
			if (def.extendsInterfaces) {
				if (Class.getInterfaceName(iface) in def.extendsInterfaces) return true;
			}
			return false;
		},
		extendedInterfaces: function (iface, arrcollect) {
			var ifacedef = this.getInterfaceDef(iface);
			var arr = arrcollect || [];
			if (ifacedef == null) return arr;
			if (ifacedef.extendsInterfaces != null) {
				for( var k in ifacedef.extendsInterfaces) {
					this.extendedInterfaces(ifacedef.extendsInterfaces[k], arr);
				}
			};
			arr.addElement(ifacedef.classType);
			return arr;
		},
		extendedInterfaceDefs: function (iface, arrcollect) {
			var ifacedef = this.getInterfaceDef(iface);
			var arr = arrcollect || [];
			if (ifacedef == null) return arr;
			if (ifacedef.extendsInterfaces != null) {
				for( var k in ifacedef.extendsInterfaces) {
					this.extendedInterfaceDefs(ifacedef.extendsInterfaces[k], arr);
				}
			};
			arr.addElement(ifacedef);
			return arr;
		},
		isrequestable: function(iface) {
			return Class.doesextend("IRequestInterface");
			// TODO: Extend the logic - all of the extended interfaces also have to be requestable
		},
		// -V: 2.7.1
		// + V: 2.18.0
		typeKind: function(def) {
			var d = Class.getClassDef(def);
			if (d != null) return "class";
			d = Class.getInterfaceDef(def);
			if (d != null) return "interface";
			return null;
		},// -V: 2.18.0
		getClassDef: function(cls) {
			if (BaseObject.is(cls, "BaseObject")) {
				var o = Function.classes[cls.classType()];
				return (o != null) ? o : BaseObject;
			} else if (typeof cls == "function" && typeof cls.classType == "string") {
				return Function.classes[cls.classType];
			} else if (typeof cls == "string") {
				return Function.classes[cls];
			}
			return null;
		},
		getType: function(t) {
			var o = this.getInterfaceDef(t);
			if (o == null) o = this.getClassDef(t);
			return o;			
		},
		supportsMember: function(type, member) {
			var def = this.getType(type);
			if (def != null && def.prototype[member] != null) return true;
			return false;
		},
		supportsMethod: function(type, member) {
			var def = this.getType(type);
			if (def != null && typeof def.prototype[member] == "function") return true;
			return false;
		},
	// +V: 2.16.3
		getClassName: function(cls) {
			if (BaseObject.is(cls, "BaseObject")) {
				return cls.classType();
			} else if (typeof cls == "function" && typeof cls.classType == "string") {
				return cls.classType;
			} else if (typeof cls == "string") {
				if (Function.classes[cls] != null) return cls;
			}
			return null;
		},
	// -V: 2.16.3
	// +V: 2.7.2
		notImplemented: function(_this,member) {
			return "Member " + _this.classType + ".prototype." + member + " is not implemented";
		},
	// -V: 2.7.2
	// +V: 2.7.3
		defaultsOf: function(cls) {
			var c = this.getClassDef(cls);
			if (c != null) {
				return new DefaultsMgr(c);
			}
			throw "Cannot find class definition";
		},
	// -V: 2.7.3
	// +V: 2.18.0
		classDataOf: function(cls, dataType) {
			if (typeof dataType == "string") {
				var c = this.getClassDef(cls);
				if (c != null) {
					return new ClassDataMgr(c);
				}
				throw "Cannot find class definition";
			} else {
				return null; // This is not a fatal mistake
			}
		},
		interfaceDataOf: function(cls, iface) { // Intended for direct use without checks
			var iface_name = Class.getInterfaceName(iface);
			if (iface_name != null) {
				if (Class.is(cls, iface)) {
					return Class.classDataOf(cls,iface_name);
				} else {
					return null;
				}
			} else {
				return null;
			}
		},
	// -V: 2.18.0
	// +V: 2.15.1
		// Ways to obtain some info available fromother places from the Class - for future encapsulation
		classes: function(filterproc) {
			var result = [];
			for (var cls in Function.classes) {
				if (typeof filterproc != "function" || filterproc(cls)) {
					result.push(cls);
				}
			}
			return result;
		},
	// -V: 2.15.1
	// +V: 2.18.0
		// selfdoc runtime systeminfo (non-doc)
		returnTypeOf: function(def, method) {
			var t = this.getType(def);
			if (t != null) {
				if (t.prototype && typeof t.prototype[method] == "function") {
					return Class.getType(t.prototype[method].$returnType);
				}
			}
			return null;
		},
		// +V: 2.18.5
		chunkTypeOf: function(def, method) {
			var t = this.getType(def);
			if (t != null) {
				if (t.prototype && typeof t.prototype[method] == "function") {
					var ct = Class.getType(t.prototype[method].$chunkType);
					if (ct == null) return Class.returnTypeOf(def, method); // Fallback to the return type.
				}
			}
			return null;
		},
		eventArgumentsOf: function(def, eventdecl) {
			var t = this.getType(def);
			if (t != null) {
				if (t.prototype && BaseObject.is(t.prototype[eventdecl],"InitializeEvent")) {
					var argtypes = t.prototype[eventdecl].$argumentTypes;
					if (BaseObject.is(argtypes, "Array")) {
						argtypes = Array.createCopyOf(argtypes);
						for (var i = 0; i < argtypes.length; i++) {
							var arg = Class.getType(argtypes[i]);
							if (arg != null) {
								argtypes[i] = arg;
							} else {
								argtypes[i] = null; // Any but not class
							}
						}
						return argtypes;
					}
				}
			}
			return null; // No definition
		},
		// -V: 2.18.5
		// Array of the declared with Arguments argument types, only BK types are returned, the rest are nulls (no matter how declared).
		argumentsOf: function(def, method) {
			var t = this.getType(def);
			if (t != null) {
				if (t.prototype && typeof t.prototype[method] == "function") {
					var argtypes = t.prototype[method].$argumentTypes;
					if (BaseObject.is(argtypes, "Array")) {
						argtypes = Array.createCopyOf(argtypes);
						for (var i = 0; i < argtypes.length; i++) {
							var arg = Class.getType(argtypes[i]);
							if (arg != null) {
								argtypes[i] = arg;
							} else {
								argtypes[i] = null; // Any but not class
							}
						}
						return argtypes;
					}
				}
			}
			return null; // No definition
		},
		argumentOf: function(def, method, index) {
			var args = Class.argumentsOf(def, method);
			if (args != null) return args[index];
			return null; // No definition
		}
	// -V: 2.18.0
	
};
// +V: 2.7.1
// Aliasing for easy usage:
Class.doextend = Class.doesextend;
Class.isexending = Class.doesextend;
Class.implementers = Class.implementors;
// -V: 2.7.1