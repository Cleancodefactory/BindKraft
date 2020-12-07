/*
    File: oop.js
    Contains the basics needed to form an OOP environment - class declaration and inheritance, Interface declaration and implementation and so on.
*/

CompileTime.info("Starting initial compile process");
if (JBCoreConstants.CompileTimeConsoleLog || JBCoreConstants.CompileTimeLogSize > 100) {
	CompileTime.warn("If this is a production deployment take time to adjust the configuration - smaller log size and minimal console logging are recommended.");
}


Function.createInstance = function (className, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) { // Supports up to 10 constructor parameters
    if (this.classes[className] != null) {
        return new this.classes[className](arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
    }
    return null;
};

//// CORE INHERITANCE //////////////////////////////////////

function copyFunctionPrototype(fto, ffrom) {
    for (var k in ffrom) {
        fto[k] = ffrom[k];
    }
}

/*
Inherit from another class
Usage:
function class(...) { }
class.Inherit(CParent);
// Call parent methods using
this.parent.methodName.call(this,...params...);
*/
Function.prototype.Inherit = function (parentCls, _clsName) {
	var clsName = _clsName || this.name;
	CompileTime.trace("constructing class " + clsName);
	if (typeof this.classType == "string") {
		CompileTime.err("Inherit is called more than once for " + this.classType + " with declared name " + clsName + ". Check if this is done in other files (happens sometimes when code is copied and pasted.");
		if (JBCoreConstants.CompileTimeThrowOnErrors) {
			throw "Inherit is called more than once for " + this.classType + " with declared name " + clsName + ". Check if this is done in other files (happens sometimes when code is copied and pasted.";
		}
		return;
	}
    if (parentCls.constructor == Function) {
        copyFunctionPrototype(this.prototype, parentCls.prototype);
        // this.prototype = parentCls.prototype;  // new parentCls;
        // this.prototype = new parentCls;
        this.prototype.constructor = this;
        this.parent = parentCls.prototype;
    } else {
        // Perhaps we will not need this but anyway
        this.prototype = parentCls;
        this.prototype.constructor = this;
        this.prototype.parent = parentCls;
    }
    if (clsName != null) {
        this.classType = clsName;
		if (JBCoreConstants.CheckTypeDuplicates && Function.classes[clsName] != null) {
			CompileTime.err("Duplicated class registration " + clsName);
			if (JBCoreConstants.CompileTimeThrowOnErrors) {
				throw "Duplicated class registration " + clsName;
			}
		}
        Function.classes[clsName] = this;
    } else {
		CompileTime.err("Class declaration without name. Use MyClass.Inherit(parentclass,'MyClass');");
		if (JBCoreConstants.CompileTimeThrowOnErrors) {
			throw "Class declaration without name. Use MyClass.Inherit(parentclass,'MyClass');";
		}
		return;
	}
	// Copy defaults
	if (parentCls.$defaults != null) {
		this.$defaults = {};
		for (var k in parentCls.$defaults) {
			this.$defaults[k] = parentCls.$defaults[k];
		}
	}
    // initialize supported interfaces
    var prots = Class.supportedInterfaces(this);
    if (prots != null) {
        var prot;
		if (parentCls.inheritorInitializers != null) {
			if (this.inheritorInitializers == null) this.inheritorInitializers = [];
			for (var i = 0; i < parentCls.inheritorInitializers.length; i++) {
				prot = parentCls.inheritorInitializers[i];
				if (prot != null && typeof prot.inheritorInitialize == "function") {
					this.inheritorInitializers.push(prot);
					prot.inheritorInitialize(this, parentCls);
				} else {
					CompileTime.err("Inheritor initializer is registered incorrectly: " + ((prot != null)?prot.classType:"unknown"));
				}
			}
		}
		
		/* Obsolete, replaced by the code above. In early versions there was only one implementer per interface allowed.
        for (var i = 0; i < prots.length; i++) {
            prot = Function.interfaces[prots[i]];
            if (prot != null && typeof prot.inheritorInitialize == "function") {
                prot.inheritorInitialize(this, parentCls);
            }
        }
		*/
    }
	// Transfer any obliterators registered for the parent class
	if (parentCls.customObliterators != null) {
		this.customObliterators = [];
		for (var i = 0; i < parentCls.customObliterators.length; i++) {
			this.customObliterators.push(parentCls.customObliterators[i]);
		}
	}
	this.createInstance = function (arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) { // Supports up to 10 constructor parameters
		// V: 2.21
		return new this(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
		/*
		if (this.classes[className] != null) {
			return new this.classes[className](arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
		}
		return null;
		*/
	};
    return this;
}.Description("Inherits from another class")
 .Param("parentCls","Class from which to Inherit")
 .Param("clsName","Class which inherits")
 .Returns("this - can be chained");

/*
Interface definition syntax sugar
	extendinterfaces should be ordered carefuly if their functionality is expected to be used.
	Becuase interfaces can carry self-consistent functionality in their members, it is strongly recommended to reimplement/redeclare all the members of 
	the extended interfaces in order to make sure everything fits together whenever the user implements this interface.
	These considerations do not apply if the interface does not carry anything but dummy implementations at most.
	
	While extending interfaces is supported, it is not recommended to overuse it, because of the potential functionality they might carry. The very concept
	of interface is rather unusual in Javascript and adapted by us to play the role of a limited multiple inheritance. However this has its implications
	and extending an interface will create inheritance chain over each interface of that kind for any class that implements it. We continue to treat interfaces
	as a plain set of "features" and the operator Implement will simply make sure all the extended interfaces are also Implement-ed before starting to proces the one
	that extends them. This means that everything will be Ok if the interfaces carry only definitions, but no actual functionality. Having functionality, one cannot
	say what will happen if it is mixed in with different implementations of certain members available in multiple extended interface definitions - the functionality can break.
	This is the reason for the above recommendation to reimplement every member in case you want an interface that extends others and carries usable implementations - this will
	gurantee consistency. Still, use interface extending with care and preferably only on interfaces that do not have more than declarations in them.
	
*/
Function.prototype.Interface = function (pname, /*multiple*/ extendsInterfaces) {
	CompileTime.trace("declaring interface " + pname);
	var i, ext, e;
	this.extendsInterfaces = {};
	for (i = 1; i < arguments.length; i++) {
		ext = Class.getInterfaceDef(arguments[i]);
		if (ext != null) {
			for (e in ext.prototype) {
				this.prototype[e] = ext.prototype[e];
			}
			this.extendsInterfaces[ext.classType] = ext;
		} else {
			CompileTime.err("Cannot find the definition of an interface being extended specified in the " + pname + ".Interface(" + pname+ ", ... " + arguments[i] + "....)");
			if (JBCoreConstants.CompileTimeThrowOnErrors) {
				throw "Cannot find the definition of an interface being extended specified in the " + pname + ".Interface(" + pname+ ", ... " + arguments[i] + "....)";
			}
		}
	}
    if (typeof pname == "string") {
        this.classType = pname;
		if (JBCoreConstants.CheckTypeDuplicates && Function.interfaces[pname] != null) {
			CompileTime.err("Duplicate interface declaration " + pname);
			if (JBCoreConstants.CompileTimeThrowOnErrors) {
				throw "Duplicate interface declaration " + pname; 
			}
			
		}
        Function.interfaces[pname] = this;
    } else {
		// +V: 2.7.1
			CompileTime.err("Interface declaration must specify an interface name as first argument: e.g. IMyInterface.Interface('MyInterface' ...). ");
			if (JBCoreConstants.CompileTimeThrowOnErrors) {
				throw "Interface declaration must specify an interface name as first argument: e.g. IMyInterface.Interface('MyInterface' ...). ";
			}
		// -V: 2.7.1
	}
	/* +V: 2.7.1
	else { // This should be obsoleted
        for (e in pname.prototype) {
            if (this.prototype[e] == null) {
                this.prototype[e] = pname.prototype[e];
            }
        }
        this.classType = pname.classType;
        Function.interfaces[pname.classType] = this;
    };
	-V: 2.7.1 */
	this.Cast = function(o, strict) {
		if (!BaseObject.is(o,this.classType)) return "The supplied argument does not support interface " + this.classType;
		return new __InterfaceCaster(o, this, strict);
	}
	this.StrictCast = function(o) {
		return this.Cast(o,true);
	}
	this.$definitionIsComplete = true;
    return this;
}.Description("Registers a 'Interface' with name")
 .Param("pname","Name of the Interface")
 .Returns("this - can be chained");
 // +v 2.7.0
	// Helpers for strict interface usage (non BaseObject class for performance reasons)
	// usage:
	// obtain caster (through IMyInterface.StrictCast(myobject);
	// caster.Call("mymethod", arg1, arg2....);
	// x = caster.Get("myprop");
	// x = caster.Get("myprop","empty");
	function __InterfaceCaster(obj, iface, strict) {
		this.iface = iface;
		this.obj = obj;
		this.strict = strict;
	}
	__InterfaceCaster.prototype.Call = function(method) {
		if (typeof method != "string") return null;
		var args = Array.createCopyOf(arguments,1);
		if (Class.supportsMethod(this.iface, method)) {
			return this.obj[method].apply(this.obj, args);
		} else {
			if (this.strict) throw "Method " + method + " not declared in interface " + this.iface;
			return null;
		}
	}
	__InterfaceCaster.prototype.Set = function(prop, v) {
		if (Class.supportsMember(this.iface, prop)) {
			BaseObject.setProperty(this.obj, prop, v);
		} else {
			if (this.strict) throw "Member " + prop + " not declared in interface " + this.iface;
			return null;
		}
	}
	__InterfaceCaster.prototype.Get = function(prop, defval) {
		if (Class.supportsMember(this.iface, prop)) {
			BaseObject.getProperty(this.obj, prop, defval);
		} else {
			if (this.strict) throw "Member " + prop + " not declared in interface " + this.iface;
			return null;
		}
	}
 // -v 2.7.0

Function.prototype.InterfaceImpl = function (pname, _implementerName) {
	var implementerName = _implementerName || this.name;
	var e;
	if (typeof pname == "string") {
		var s = pname;
		pname = Class.getInterfaceDef(pname);
		if (pname == null) {
			CompileTime.err("Cannot find interface " + s + " while declaring implementer for it");
			if (JBCoreConstants.CompileTimeThrowOnErrors) {
				throw "Cannot find interface " + s + " while declaring implementer for it";
			}
			return true;
		}
	}
	CompileTime.trace("declaring interface implementer for " + pname.classType);
	/* +V: 2.7.1 
	// DEPRECATED
    if (typeof pname == "string") { // DEPRECATED: This branch of the if should be removed - it causes inconsistent behavior and is barely used anywhere.
        this.classType = pname;
        Function.interfaces[pname] = this;
    } else {
	-V: 2.7.1*/
        for (e in pname.prototype) {
			// DEPRECATION?: Enables a few members to be redefined by the implementer before the InterfaceImpl declaration - we probably do not need that.
            if (this.prototype[e] == null) {
                this.prototype[e] = pname.prototype[e];
            }
        }
		if (pname.requiredTypesList != null) { // Copy required types (version 1.5)
			if (this.requiredTypesList == null) this.requiredTypesList = []; // +V: 2.7.1 - added to allow implementer sepcify requirements even before InterfaceImpl call - makes it more tolerant.
			for (var i = 0; i < pname.requiredTypesList.length; i++) { // This is used too early in the initialization process, so we are doing it the hard way.
				this.requiredTypesList.push(pname.requiredTypesList[i]);
			}
		}
		if (pname.forbiddenTypesList != null) { // Copy forbidden types (version 2.15.0)
			if (this.forbiddenTypesList == null) this.forbiddenTypesList = [];
			for (var i = 0; i < pname.forbiddenTypesList.length; i++) { // This is used too early in the initialization process, so we are doing it the hard way.
				this.forbiddenTypesList.push(pname.forbiddenTypesList[i]);
			}
		}
		// We do not copy ForbiddenTypes, because they usually help define the scope of an implementer and to that end have to be declared explicitly each time
        this.classType = pname.classType; // The helper is this way treated as the interace as far as the type reflection is concerned.
        this.$isImplementationProtocolHelper = true; // This helps other helpers to recognize what is this
        // Function.interfaces[pname.classType] = this; // Registration MUST NOT be performed, this is implementer of a protocol, not a redefinition of a protocol. Keep the commented code to warn people who may want to change this.
		
	// V: 2.7.1 // };
	// This is OBSOLETE and will cause errors, it returned back from a check-in by mistake. I am leaving it here commented out in order to make it more noticeable if this happens again (will remove it a bit later)
	if (typeof this.name == "string") {
		if (Function.interfaceImplementers[implementerName] != null) {
	 		CompileTime.warn("Interface implementer " + implementerName + " for interface " + pname.classType + " is previously defined and will be replaced. This is an error and may cause various unpredictable problems.");
		}
		Function.interfaceImplementers[implementerName] = this;
	} else {
		CompileTime.warn("Anonymous interface implementer is defined for interface " + pname.classType + ". If it is in a closure it will not be visible elsewhere and it will not be importable through InterfaceImplementer() function.");
	}
	
    return this;
}.Description("Defines an 'Interface' implementation (implementer). It is a coding feature and is not registarable.")
 .Param("pname","Interfae being implemented by the implementer. The definition must be specified, not the name only. In earlier versions name was usable, but led to inconsistencies, for htis reason passing interface name is left unsupported intentionally - to avoid mistakes based on earlier version knowledge.")
 .Returns("this - can be chained");

/*
	Registers a custom Obliterator for the class. It is executed by the BaseObject's obliterate automatically when an instance of the class is obliterated.
	The Obliterator must be parameterless function which will be called with this set to point to the obliterated instance.
	
	Remarks: Obliterators are usually registered by Interface implementation helpers (Impl interfaces) to clean up data and connections they create. This is typically done in
	their classInitialize function.
*/
Function.prototype.Obliterator = function(Obliterator) {
	if (Obliterator == null || typeof Obliterator != "function") {
		CompileTime.err("Invalid Obliterator passed to the Function.Obliterator declaration.");
		if (JBCoreConstants.CompileTimeThrowOnErrors) {
			throw "Invalid Obliterator passed to the Function.Obliterator declaration.";
		}
	}
	if (this.customObliterators == null) {
		this.customObliterators = [];
	}
	this.customObliterators.addElement(Obliterator);
	return this;
}.Description("Destructor registraton. Typically you can just override the obliterate method, but InterfaceImpl-s add functionality and may need to supply ibliteration code for them - this is  mostly for their benefit.")
 .Param("Obliterator","...")
 .Returns("this - can be chained");
 
 Function.prototype.RequiredTypes = function () {
    if (arguments.length > 0) {
		if (this.requiredTypesList == null) {
        	this.requiredTypesList = [];
		}
        for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] != "string") {
				CompileTime.warn("RequiredTypes declaration accepts only string parameters. Interface: " + this.classType);
			}
			this.requiredTypesList.push(arguments[i]);
        }
    };
    return this;
}.Description("Use in Interface declaration only. Adds objects to the required types, via the arguments. Specify as strings the types that need to be inherited/implemented by the class in order to Implement this Interface.")
 .Param("any","One or more type names (class or interface names), separated with commas, without spaces.")
 .Returns("this - can be chained.");
 Function.prototype.ForbiddenTypes = function () {
    if (arguments.length > 0) {
		if (this.forbiddenTypesList == null) {
        	this.forbiddenTypesList = [];
		}
        for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] != "string") {
				CompileTime.warn("RequiredTypes declaration accepts only string parameters. Interface: " + this.classType);
			}
            this.forbiddenTypesList.push(arguments[i]);
        }
    };
    return this;
}.Description("Declares types that must not be implemented in order to implement an interface or implementer")
 .Param("any","Single type name - class or interface name")
 .Returns("this - can be chained.");
 
Function.prototype.Initialize = function() {
	this.$requiresInitialization = true;
}

 
/*
	Inherit implementation of members from a special Interface class
	The constructor of the Interface class is not invoked - only the prototype members are copied
	Multiple constructors are not implemented for performance reasons. If you want to extend the library
	that way - consider carefully if this is really needed for your purposes.
	Usage:
	function class(...) { }
	class.Inherit(Parent, "class");
	class.Implement(Interface1); MUST BE INVOKED AFTER THE ABOVE METHODS
	class.Implement(Interface2);
	// Supported, but obsolete technique for mark only interfaces - DO NOT USE ANYMORE
	class.interfaces = {IMarkingInterface1:true,IMarkingInterface2:true ...}; 
	...
	
*/
Function.prototype.Implement = function(protClass /*, argument list to pass to classInitialize */) {
	return this.$Implement.apply(this, [protClass, {}].concat(Array.createCopyOf(arguments, 1)));
}
/*
	Like Implement, but will enable all new features which can potentially throw exceptions for mistakes that were not fatal for some reason and force you to resolve them.
	This may involve renaming members across the hierarchy and could require significant time, use this only when you are sure your classes and interfaces follow the latest
	features soon after they become available, but avoid changing all code to use ImplementEx unless you are ready to make the necessary changes that may be needed.
*/
Function.prototype.ImplementEx = function(protClass) {
	return this.$Implement.apply(this, [protClass, { keepexisting: true }].concat(Array.createCopyOf(arguments, 1)));
}
/*
	For the moment this does the same as Implement, but it is strongly recommended to use it when 
	an implementer for the same interface is intentionally re-implemented (was implemented earlier in
	the inheritance hierarchy). This strict separation may or may not be enforced in future, it is not
	yet decided.
*/
Function.prototype.Reimplement = function(protClass /*, argument list to pass to classInitialize */) {
	return this.$Implement.apply(this, [protClass, { reimplement: true}].concat(Array.createCopyOf(arguments, 1)));
}
Function.prototype.$Implement = function (protClass, options /*argument list to pass to classInitialize */) {
    var e, baseprot;
	var reimplement = (options != null)?options.reimplement:false;
	var keepexisting = (options != null)?options.keepexisting:false;
    if (protClass != null) {
		if (typeof protClass == "string") {
			var s = protClass;
			protClass = Class.getInterfaceDef(protClass);
			if (protClass == null) {
				CompileTime.err("Cannot find interface " + s + " while implementing it on " + this.classType);
				if (JBCoreConstants.CompileTimeThrowOnErrors) {
					throw ("Cannot find interface " + s + " while implementing it on " + this.classType);
				}
				return this;
			}
		}
        if (protClass.classType != null) {
            if (!protClass.$isImplementationProtocolHelper && Class.is(this, protClass.classType)) return this; // Do nothing, StrictImplement on the other hand will throw an exception if the interface was already implemented before.
        }
		if (protClass.$isImplementationProtocolHelper) {
			baseprot = Class.getInterfaceDef(protClass.classType);
		} else {
			baseprot= protClass;
		}
		if (baseprot.extendsInterfaces != null) {
			for (e in protClass.extendsInterfaces) {
				this.Implement(protClass.extendsInterfaces[e]); // recursively will implement other base interfaces as needed.
				// Nothing should repeat, because if the given interface was already implemented the Implement will do nothing,
				// effectively stopping the recursion from the particular interface further.
			}
		}
        if (protClass.requiredTypesList != null && protClass.requiredTypesList.length > 0) {
            var arr,b_any = false,b_set;
            for (var i = 0; i < protClass.requiredTypesList.length; i++) {
				arr = protClass.requiredTypesList[i].split(",");
				b_set = true;
				for (var j = 0;j < arr.length;j++) {
					if (!Class.is(this, arr[j])) {
						b_set = false;
					}
				}
				if (b_set) {
					b_any = true;
					break;
				}
            }
			if (!b_any) {
				CompileTime.err("The class " + this.classType + " does not meet the Interface's or Implementer's " + protClass.classType + " requirements. The class MUST Inherit or Implement: " + protClass.requiredTypesList.join(" or "));
				if (JBCoreConstants.CompileTimeThrowOnErrors) {
					throw "The class " + this.classType + " does not meet the Interface's or Implementer's " + protClass.classType + " requirements. The class MUST Inherit or Implement: " + protClass.requiredTypesList.join(" or ");
				}
			}
        }
		if (protClass.forbiddenTypesList != null && protClass.forbiddenTypesList.length > 0) {
            var arr,b_any = false,b_set;
            for (var i = 0; i < protClass.forbiddenTypesList.length; i++) {
				if (Class.is(this, protClass.forbiddenTypesList[i])) {
					CompileTime.err("The class " + this.classType + " does not meet the Interface " + protClass.classType + " requirements. The class MUST NOT Inherit or Implement: " + protClass.forbiddenTypesList.join(" or "));
					if (JBCoreConstants.CompileTimeThrowOnErrors) {
						throw "The class " + this.classType + " does not meet the Interface " + protClass.classType + " requirements. The class MUST NOT Inherit or Implement: " + protClass.forbiddenTypesList.join(" or ");
					}
				}
            }
            
        }
		if (keepexisting) {
			for (e in protClass.prototype) {
				if (typeof this.prototype[e] == "function" && typeof protClass.prototype[e] == "function") {
					// skip - interfaces should not carry real implementations
				} else if (this.prototype[e] == null) {
					this.prototype[e] = protClass.prototype[e];
				} else if (typeof this.prototype[e] != typeof protClass.prototype[e]) {
					CompileTime.err("Cannot implement interface " + protClass.classType + " over class " + this.classType + " because both declare member " + e + " but of different types");
					if (JBCoreConstants.CompileTimeThrowOnErrors) {
						throw "Cannot implement interface " + protClass.classType + " over class " + this.classType + " because both declare member " + e + " but of different types";
					}
				} else if (typeof this.prototype[e] == "function") {
					if (this.prototype[e].$issealed) {
						CompileTime.err("Cannot implement interface " + protClass.classType + " over class " + this.classType + " because method " + e + " is sealed (Declared as .Sealed() in a parent).");
					}
				}
			}
		} else {
			for (e in protClass.prototype) {
				this.prototype[e] = protClass.prototype[e];
			}
		}
		if (protClass.$requiresInitialization) {
			if (this.protocolInitializers == null) this.protocolInitializers = [];
			this.protocolInitializers.push(protClass);
		}
		if (protClass.inheritorInitialize) {
			if (this.inheritorInitializers == null) this.inheritorInitializers = [];
			this.inheritorInitializers.push(protClass);
		}
        if (protClass.classInitialize != null && typeof protClass.classInitialize == "function") {
            var args = Array.createCopyOf(arguments, 2);
            args.unshift(this); // All the arguments after the interface (1-st arg) are passed to the classInitialize to enable parametrized implementations
            protClass.classInitialize.apply(protClass, args);
        }
    }
    // Deprecated behaviour - we are now using all the arguments after the first as arguments to the classInitialize function (if any)
    /* ARCHIVE
		e = (protName != null) ? protName : ((protClass != null) ? protClass.classType : null);
		if (e != null) {
			if (!this.interfaces) {
				this.interfaces = {};
			}
			this.interfaces[e] = true;
		}
    */
    // Replaced with
    if (!this.interfaces) {
        this.interfaces = {};
    }
    this.interfaces[protClass.classType] = true;
	/* FUTURE
	// For future performance improvement - needs changes in other places as well - uncomment when ready
	if (!this.allSupportedInterfaces) {
		this.allSupportedInterfaces = {};
	}
	this.allSupportedInterfaces[protClass.classType] = true;
	*/
    return this;
}.Description("Implement Interface")
 .Param("protClass", "Interface name")
 .Param("arguments", "Starting with the second argument, all the arguments are sent to the classInitialize method of the implemented Interface. Check the Interface's documentation for the supported arguments.")
 .Returns("this - can be chained")
 
 // Quick shorthands for lazy people for denoting not implemented members, but no support for documentation. Better use throw Class.notImplemented(this,<member<) in a real member prototype.
 Function.prototype.NotImplementedMethod = function(methodname) {
	 this.prototype.methodname = new Function(methodname,'throw "Method " + this.classType + ".prototype." + methodname + "is not implemented.";');
 }
 Function.prototype.NotImplementedGetter = function(propname) {
	 this.prototype.methodname = new Function(propname,'throw "Getter " + this.classType + ".prototype.get_" + methodname + "is not implemented.";');
 }
 Function.prototype.NotImplementedSetter = function(propname) {
	 this.prototype.methodname = new Function(propname,'throw "Setter " + this.classType + ".prototype.set_" + methodname + "is not implemented.";');
 }
 Function.prototype.NotImplementedProperty = function(propname) {
	 this.prototype.methodname = new Function(propname,'throw "Getter " + this.classType + ".prototype.get_" + methodname + "is not implemented.";');
	 this.prototype.methodname = new Function(propname,'throw "Setter " + this.classType + ".prototype.set_" + methodname + "is not implemented.";');
 }
 
 /* Supports shorthand syntax for the most frequently used class definition elements.
 
	The declarations are provided in an {object} like:
		{
			elementname ":" propdef | methoddef
		}
		elementname := <javascript_identifier>
		propdef := objectpropdef | stringpropdef
		objectpropdef := { type : typepropdef, init: initvalue }
		stringpropdef := typepropdef
			ex stringpropdef: "rw array * Some property description"
			ex stringpropdef: "rwa numeric * Some property description"
			ex stringpropdef: "event void * Some event description"
			ex objectpropdef: { type : "rwa numeric * Some property description", init: 10 }
		typepropdef := " settings propertytype [ * [description]] "
		settings := ((r,w,a,f){ 1+ all optional}) | event
			r - read
			w - write
			a - active - has effect if w is also specified - adds elementname_changed event and fires it when set_elementname is called and the new value is different from previous
			f - forced - has effect only if a is also specified - forces event firing on set without checking new and old value for equality.
			event - event declaration creates EventDispatcher in the elementname
		propertytype := any|string|numeric|boolean|object|array|void // if event is specified only void can be specified as type
		
		methoddef := <javscript function>
		
		methods, active (pseudo) properties and eventdispatchers are the currently supported elements that can be defined using a declaration block
		
		When declaring a method you can also use helpers like ExtendMethod:
		MyClass.DeclarationBlock({
			...
			somemethod: MyClass.ExtendMethod(function(x,y,z) { ... some code ... }),
			...
		}
		ExtendMethod is not yet officially supported on interface declarations and should not be used in them.
 */
 Function.prototype.DeclarationBlock = function(objdecl) {
	 var initval = null;
	 var initializer;
	 var re = /^\s*([wraf]{1,4}|event)\s+(any|string|numeric|boolean|object|array|void)(?:\s+\*(?:\s+(.*)?)?)?$/gi;
	 var m, s;
	 if (typeof objdecl == "object" && objdecl != null) {
		 for (var pname in objdecl) {
			 re.lastIndex = 0;
			 initval = objdecl[pname];
			 switch (typeof initval) {
				 case "function":
					this.prototype[pname] = initval;
				 break;
				 case "string":
					m = re.exec(initval);
					if (m != null) {
						if (m[1].toLowerCase() == "event") {
							if (m[2].toLowerCase() != "void") {
								throw "The declaration of the event " + pname + " in a DeclarationBlock of " + Class.fullClassType(this) + " must specify void as type."
							}
							this.prototype[pname] = new InitializeEvent(m[3]);
							break;
						}
					}
					initval = { type: initval, init: null};
				 case "object":
					if (m == null) m = re.exec(initval.type);
					if (m != null) {
						switch (m[2].toLowerCase()) {
							case "any":
								initializer = new Initialize(m[3],initval.init);
							break;
							case "string":
								initializer = new InitializeStringParameter(m[3],initval.init);
							break;
							case "numeric":
								initializer = new InitializeNumericParameter(m[3],initval.init);
							break;
							case "boolean":
								initializer = new InitializeBooleanParameter(m[3],initval.init);
							break;
							case "object":
								initializer = new InitializeObject(m[3],initval.init);
							break;
							case "array":
								initializer = new InitializeArray(m[3],initval.init);
							break;
							case "void":
								throw "The declaration of property " + pname + " in a DeclarationBlock of " + Class.fullClassType(this) + " should not specify void.";
							break;
							default:
								initializer = new Initialize(m[3],initval.init);
						}
						s = m[1];
						if (s.indexOf("r") >= 0) {
							this.prototype["get_" + pname] = (function(pname){ return function () { return this["$" + pname]; }})(pname);
							this.prototype["get_" + pname].$Initialize = initializer;
						}
						if (s.indexOf("a") >= 0) {
							this.prototype[pname + "_changed"] = new InitializeEvent("Notifies when the property " + pname + " has changed.");
						}
						if (s.indexOf("w") >= 0) {
							if (s.indexOf("f") >= 0) {
								if (s.indexOf("a") >= 0) {
									this.prototype["set_" + pname] = (function(pname){ return function (v) {
										this["$" + pname] = v;
										this[pname + "_changed"].invoke(this, v);
									}})(pname);
								} else {
									this.prototype["set_" + pname] = (function(pname) { return function (v) {
										this["$" + pname] = v;
									}})(pname);
								}
							} else {
								if (s.indexOf("a") >= 0) {
									this.prototype["set_" + pname] = (function (pname) {return function (v) {
										var b = false;
										if (BaseObject.is(v, "Array") || BaseObject.is(v, "BaseObject")) {
											if (!v.equals(this["$" + pname])) b = true;
										} else {
											if (this["$" + pname] != v) b = true;
										}
										this["$" + pname] = v;
										if (b && this[pname + "_changed"] != null) this[pname + "_changed"].invoke(this, v);
									}})(pname);
								} else {
									// Repeated code is Ok, because we plan some extensions here
									this.prototype["set_" + pname] = (function(pname) {return function (v) {
										this["$" + pname] = v;
									}})(pname);
								}
							}
						}
						
						
					} else {
						throw "Wrong declaration in DeclarationBlock --> " + pname + " in declaration of " + Class.fullClassType(this);
					}
				 break;
				 default:
					throw "Unrecognized declaration in a DeclarationBlock for " + Class.fullClassType(this) + " is not an object.";
			 } // switch`
		 } // for
	 } else {
		 throw "DeclarationBlock for " + Class.fullClassType(this) + " is not an object."
	 } // if input is object
	 return this;
 }
 
// Accessors for important values created by common wrappers
// Extracts the $wrapperResult from the caller. This value is set by wrappers that create method groups exposed as a single method externally.
//Commented out because of #use strict
// function overridenReturnValue() {
// 	return arguments.callee.caller.arguments.callee.caller.$wrapperResult;
// }

// Used over methods of a class. Replaces the method with a proxy that calls both the original method and the supplied withMethod.
// The original result is returned in all cases, but those in which the original method does not return anything and the withMethod returns something different
// from undefined value.
// Ex: MyClass.ExtendMethod("mymethod", function(...) { ... }); // bFirst is optional and causes withMethod to be executed first
// Not fully compatible with strict mode
Function.prototype.ExtendMethod = function(method, withMethod, bRunFirst, bReturnFromOverride) {
	var m = null;
	if (!Class.is(this,"BaseObject")) {
		throw "This method can be used only in definitions of classes inheriting BaseObject and cannot be used in ImplementationBlocks - use myclass.ExtendMethod(...) syntax instead. "
	}
	if (typeof withMethod == "function") {
		m = withMethod;
	} else {
		throw "withMethod is required and must be a function";
	}
	
	if (BaseObject.is(method, "string")) {
		if (typeof this.prototype[method] == "function") {
			if (m != null) {
				var old_m = this.prototype[method];
				if (bRunFirst) {
					this.prototype[method] = function() {
						var r2 = m.apply(this, arguments);
						var r = old_m.apply(this, arguments);
						if (bReturnFromOverride) return r2;
						if (typeof r == "undefined") r = r2;
						return r;
					}
				} else {
					this.prototype[method] = function() {
						var r = old_m.apply(this, arguments);
						//Commented out because of #use strict
						//arguments.callee.$wrapperResult = r;
						var r2 = m.apply(this, arguments);
						if (bReturnFromOverride) return r2;
						if (typeof r == "undefined") r = r2;
						return r;
					}
				}
				return this.prototype[method];
			}
		} else if (this.prototype[method] == null) {
			this.prototype[method] = m;
		} else {
			throw "ExtendMethod can be used only on method or null members";
		}
	} else {
		throw "argument 'method' must be a string.";
	}
	return this;
}.Description("Used over methods of a class. Replaces the method with a proxy that calls both the original method and the supplied withMethod. The original result is returned in all cases, but those in which the original method does not return anything and the withMethod returns something different from undefined value.")
 .Param("method","Method to be raplaced/overriden")
 .Param("withMethod","Method with wich to replace")
 .Param("bRunFirst","Indicates if the replacement method is executed first")
 .Param("bReturnFromOverride","By default the value returned by the original (replaced) method is returned in the end unless it is undefined (no return value) in which case the return value of the new method is returned. If this argument is set to true the return value of the new method is always returned regardless of the return result of the old one.")
 .Returns("this - can be chained");
 

//// PROPERTY IMPLEMENTATION HELPERS //////////////////////////////////////
 
// MyClass.ImplementProperty("myprop", new Initialize("holds something",null) [, "$myproperty"[, "mycallback"]])
Function.prototype.ImplementProperty = function (pname, initialize, pstore, changeCallback, force) {
	var pstoreprop = (pstore != null) ? pstore : "$" + pname;
	if (initialize == null) initialize = new Initialize("(no description)", null);
    this.prototype[pstoreprop] = initialize;
    this.prototype["get_" + pname] = function () { return this[pstoreprop]; };
	this.prototype["get_" + pname].$Initialize = initialize;
    this.prototype["set_" + pname] = function (v) {
        var oldval = this[pstoreprop];
        this[pstoreprop] = v;
        if (changeCallback != null && (force || v != oldval)) {
			if (typeof changeCallback == "function") {
				changeCallback.call(this, oldval, v);
			} else if (typeof changeCallback == "string") {
				this[changeCallback](pname, oldval, v);
			}
        }
    };
	this.prototype["set_" + pname].$Initialize = initialize;
	return this;
}.Description("'Implements' pseudo-property on a class or Interface")
 .Param("pname","Property name")
 .Param("Initialize","Property type and documentation, instance of one of the Initialize classes")
 .Param("pstore","Optional location of the storage for the property, default is this.$<pname>")
 .Param("changeCallback","Optional callback name invoked on change ot the property. The callback must be a method of the class/Interface and has the following prototype function(propertyname,old_Value,new_Value).")
 .Returns("this - can be chained");

Function.prototype.ImplementActiveProperty = function (pname, initialize, pstore_or_force,force_in,changeCallback) {
	var pstore = null, force = false, oldval = null;;
	initialize = initialize || new Initialize("no description", null);
	if (typeof pstore_or_force == "boolean") {
		force = pstore_or_force;
	} else if (typeof pstore_or_force == "string") {
		pstore = pstore_or_force;
		force = force_in;
	}
	var pstoreprop = (pstore != null) ? pstore : "$" + pname;
	this.prototype[pstoreprop] = initialize;
	this.prototype["get_" + pname] = function () { return this[pstoreprop]; };
	this.prototype["get_" + pname].$Initialize = initialize;
	this.prototype["set_" + pname] = function (v) {
		var b = false;
		if (BaseObject.is(v, "Array") || BaseObject.is(v, "BaseObject")) {
			if (!v.equals(this[pstoreprop])) b = true;
		} else {
			if (this[pstoreprop] != v) b = true;
		}
		oldval = this[pstoreprop]; 
		this[pstoreprop] = v;
		if (force) b = true;
		if (changeCallback != null && b) {
			if (typeof changeCallback == "function") {
				changeCallback.call(this, oldval, v);
			} else if (typeof changeCallback == "string") {
				this[changeCallback](pname, oldval, v);
			}            
        }
		if (b && this[pname + "_changed"] != null) this[pname + "_changed"].invoke(this, v);
	};
	this.prototype["set_" + pname].$Initialize = initialize;
	this.prototype[pname + "_changed"] = new InitializeEvent("Notifies when the property " + pname + " has changed.");
	this.prototype["set_" + pname].$changeevent = pname + "_changed";
	return this;
}.Description("'Implements' pseudo-property of a class, which raises an event when changed")
 .Param("pname","the property name. An event (CDispatcher) is created with the name pname_changed automatically. In bindings use for example readdata=myprop_changed.")
 .Param("Initialize","Property type, instance of one of the Initialize classes")
 .Param("pstore_or_force","Optional - a stirng will set the name of the internal field - default is this.$<pname>, a boolean will force the event to be fired on each assignment even if the value has not actually changed.")
 .Param("force_in","Optional - if true will force the event to be fired on each assignment even if the value has not actually changed.")
 .Returns("this - can be chained");

 Function.prototype.ImplementSmartProperty = function(pname, propClass /* arguments depending on the implementer */) {
	var args = Array.createCopyOf(arguments,2);
	this.prototype["$__smartpropertyholder_" + pname] = new InitializeSmartProperty("smart property", propClass, args);
	this.prototype["get_" + pname] = function() {
		return this["$__smartpropertyholder_" + pname].get.apply(this, arguments);
	}
	this.prototype["set_" + pname] = function(v) {
		return this["$__smartpropertyholder_" + pname].set.apply(this, arguments);
	}
 }

Function.prototype.ImplementReadProperty = function (pname, initialize, pstore) {
	var pstoreprop = (pstore != null) ? pstore : "$" + pname;
	initialize = initialize || new Initialize("no description", null);
    this.prototype[pstoreprop] = initialize;
    this.prototype["get_" + pname] = function () { return this[pstoreprop]; };
	this.prototype["get_" + pname].$Initialize = initialize;
    return this;
}.Description("Implements a read-only pseudo-property on a class or Interface")
 .Param("pname","Property name")
 .Param("Initialize","Property type and documentation, instance of one of the Initialize classes")
 .Param("pstore","Optional location of the storage for the property, default is this.$<pname>")
 .Returns("this - can be chained");

Function.prototype.ImplementWriteProperty = function (pname, initialize, pstore) {
	var pstoreprop = (pstore != null) ? pstore : "$" + pname;
	initialize = initialize || new Initialize("no description", null);
    this.prototype[pstoreprop] = initialize;
    this.prototype["set_" + pname] = function (v) { this[pstoreprop] = v; };
	this.prototype["set_" + pname].$Initialize = initialize;
    return this;
}.Description("Implements a write-only pseudo-property on a class or Interface")
 .Param("pname","Property name")
 .Param("Initialize","Property type and documentation, instance of one of the Initialize classes")
 .Param("pstore","Optional location of the storage for the property, default is this.$<pname>")
 .Returns("this - can be chained");

Function.prototype.ImplementIndexedProperty = function (pname, Initialize, pstore, changeCallback) {
    var pstoreprop = (pstore != null) ? pstore : "$" + pname;
    this.prototype[pstoreprop] = Initialize;
    this.prototype["get_" + pname] = function (idx) {
        if (idx != null) {
            return this[pstoreprop][idx];
        } else {
            return this[pstoreprop];
        }
    };
	this.prototype["get_" + pname].$Initialize = Initialize;
    this.prototype["set_" + pname] = function (idx, v) {
        if (arguments.length > 1) {
            if (idx != null) {
                this[pstoreprop][idx] = v;
            } else {
                this[pstoreprop] = v;
            }
        } else {
            this[pstoreprop] = idx; // if called with a single arg we assume the caller calls this as normal (non-indexed property).
        }
		if (changeCallback != null) {
			if (typeof changeCallback == "function") {
				changeCallback.call(this, v, idx, this[pstoreprop]);
			} else if (typeof changeCallback == "string") {
				this[changeCallback](v, idx, this[pstoreprop]);
			}
            
        }
    };
	this.prototype["set_" + pname].$Initialize = Initialize;
    return this;
}.Description("Implements an indexed pseudo-property over a class or Interface. The indexed properties hide array-like/dictionary-like behavior behind set_prop(index,value)/get_prop(index) functions. They also allow index to be omitted and then they must set/get the object/array storage (if any exists). This helper should be used with object ot array intents, more complicated cases would require explicit implementation.")
 .Param("pname","Property name")
 .Param("Initialize","Property type and documentation, instance of one of the Initialize classes")
 .Param("pstore","Optional location of the storage for the property, default is this.$<pname>")
 .Param("changeCallback","A callback to be invoked when the property changes")
 .Returns("this - can be chained");

Function.prototype.ImplementActiveIndexedProperty = function (pname, Initialize, pstore,changeCallback) {
    var pstoreprop = (pstore != null) ? pstore : "$" + pname;
    this.prototype[pstoreprop] = Initialize;
    this.prototype["get_" + pname] = function (idx) {
        if (idx != null) {
            return this[pstoreprop][idx];
        } else {
            return this[pstoreprop];
        }
    };
	this.prototype["get_" + pname].$Initialize = Initialize;
    this.prototype["set_" + pname] = function (idx, v) {
        var b = false;
        if (arguments.length > 1) {
            if (idx != null) {
                if (this[pstoreprop][idx] != v) b = true;
                this[pstoreprop][idx] = v;
            } else {
                if (this[pstoreprop] != v) b = true;
                this[pstoreprop] = v;
            }
        } else {
            if (this[pstoreprop] != idx) b = true;
            this[pstoreprop] = idx; // if called with a single arg we assume the caller calls this as normal (non-indexed property).
        }
		if (b) {
			if (this[pname + "_changed"] != null) this[pname + "_changed"].invoke(this, v);
			if (changeCallback != null) {
				if (typeof changeCallback == "function") {
					changeCallback.call(this, v);
				} else if (typeof changeCallback == "string") {
					this[changeCallback](v);
				}
				
			}
		}
    };
	this.prototype["set_" + pname].$Initialize = Initialize;
    this.prototype[pname + "_changed"] = new InitializeEvent("Notifies when the property " + pname + " has changed.");
	this.prototype["set_" + pname].$changeevent = pname + "_changed";
    return this;
}.Description("Implements an active indexed pseudo-property over a class or Interface, a pname_changed event is fired when element is changed. The indexed properties hide array-like/dictionary-like behavior behind set_prop(index,value)/get_prop(index) functions. They also allow index to be omitted and then they must set/get the object/array storage (if any exists). This helper should be used with object ot array intents, more complicated cases would require explicit implementation.")
 .Param("pname","Property name")
 .Param("Initialize","Property type and documentation, instance of one of the Initialize classes")
 .Param("pstore","Optional location of the storage for the property, default is this.$<pname>")
 .Returns("this - can be chained");

Function.prototype.ImplementIndexedReadProperty = function (pname, Initialize, pstore) {
    var pstoreprop = (pstore != null) ? pstore : "$" + pname;
    this.prototype[pstoreprop] = Initialize;
    this.prototype["get_" + pname] = function (idx) {
        if (idx != null) {
            return this[pstoreprop][idx];
        } else {
            return this[pstoreprop];
        }
    };
    return this;
}.Description("Implements an indexed  read-only pseudo-property over a class or Interface. The indexed properties hide array-like/dictionary-like behavior behind set_prop(index,value)/get_prop(index) functions. They also allow index to be omitted and then they must set/get the object/array storage (if any exists). This helper should be used with object ot array intents, more complicated cases would require explicit implementation.")
 .Param("pname","Property name")
 .Param("Initialize","Property type and documentation, instance of one of the Initialize classes")
 .Param("pstore","Optional location of the storage for the property, default is this.$<pname>")
 .Returns("this - can be chained");


Function.prototype.ImplementIndexedWriteProperty = function (pname, Initialize, pstore) {
    var pstoreprop = (pstore != null) ? pstore : "$" + pname;
    this.prototype[pstoreprop] = Initialize;
    this.prototype["set_" + pname] = function (idx, v) {
        if (idx != null) {
            this[pstoreprop][idx] = v;
        } else {
            this[pstoreprop] = v;
        }

    };
    return this;
}.Description("Implements an indexed write-only pseudo-property over a class or Interface. The indexed properties hide array-like/dictionary-like behavior behind set_prop(index,value)/get_prop(index) functions. They also allow index to be omitted and then they must set/get the object/array storage (if any exists). This helper should be used with object ot array intents, more complicated cases would require explicit implementation.")
 .Param("pname","Property name")
 .Param("Initialize","Property type and documentation, instance of one of the Initialize classes")
 .Param("pstore","Optional location of the storage for the property, default is this.$<pname>")
 .Returns("this - can be chained");

 Function.prototype.ImplementCollectorProperty = function (pname, pstore, changeCallback) {
    var pstoreprop = (pstore != null) ? pstore : "$" + pname;
    this.prototype[pstoreprop] = new InitializeArray("the store for the collected values");
    this.prototype["get_" + pname] = function (idx) {
        if (idx != null) {
            return this[pstoreprop][parseInt(idx, 10)];
        } else {
            return this[pstoreprop];
        }
    };
	this.prototype["get_" + pname].$Initialize = this.prototype[pstoreprop];
    this.prototype["set_" + pname] = function (idx, v) {
        if (arguments.length > 1) {
            if (idx != null) {
                this[pstoreprop][parseInt(idx, 10)] = v;
            } else { // idx is null
				if (v == null) {
					this[pstoreprop].splice(0, this[pstoreprop].length);
				} else {
					this[pstoreprop].push(v);
				}
            }
        } else { // idx assumed null
			if (idx == null) {
				this[pstoreprop].splice(0, this[pstoreprop].length);
			} else {
				this[pstoreprop].push(idx); // if called with a single arg we assume the caller calls this as normal (non-indexed property).
			}
        }
		if (changeCallback != null) {
			if (typeof changeCallback == "function") {
				changeCallback.call(this, v);
			} else if (typeof changeCallback == "string") {
				this[changeCallback](v);
			}
			
		}
    };
	this.prototype["set_" + pname].$Initialize = this.prototype[pstoreprop];
    return this;
}.Description("Implements an 'indexed-like'pseudo-property over a class or Interface. It is always an array, most importantly set_prop adds new elements instead of replacing the array when called without index argument. However the setter still clears the array when both idx and value are null.")
 .Returns("this - can be chained");
 //// CHAIN GEN ////////////////////////
 // +VERSION 2.11.3
 Function.prototype.ImplementChainSetters = function( /* strings with existing property names or none - everything */) {
	 var names = arguments;
	 var i;
	 if (arguments.length == 0) {
		names = [];
		for (i in this.prototype) {
			if (typeof i == "string" && i.indexOf("set_") == 0 && i.length > 4) {
				names.push(i.slice(4));
			}
		} 
	 }
	 for (i = 0; i < names.length; i++) {
		 var arg = names[i];
		 if (typeof arg == "string") {
			 if (typeof this.prototype["set_" + arg] == "function") {
				 this.prototype[arg] = function(v) { this["set_" + arg].call(this,v); return this; }
			 } else {
				 if (typeof this.prototype["set_" + arg] == "undefined") {
					this.prototype[arg] = function(v) { this[arg] = v; return this;}
				 } else {
					 throw "Class " + this.classType + " cannot define a chain setter for the field " + arg + " becasue it already exists";
				 }
			 }
		 }
	 }
 }
 // -VERSION 2.11.3

 //// UTILITIES //////////////////////// 
 
Function.prototype.DefaultValueOf = function (propname, cur_instance) {
    if (this.prototype != null) {
        if (BaseObject.is(this.prototype[propname], "Initialize")) {
            return this.prototype[propname].produceDefaultValue(cur_instance);
        }
        if (propname.charAt(0) != "$" && BaseObject.is(this.prototype["$" + propname], "Initialize")) {
            return this.prototype["$" + propname].produceDefaultValue(cur_instance);
        }
    }
    return null;
}.Description("Gets the default value of a property/pseudo-property configured with Initialize. Does not work with pseudo-properties with customized storage.")
 .Param("propname","Property name (either simple one or pseudo-property name")
 .Param("cur_instance","Optional instance of the class. Some Intents may be able to produce different defaults depending on the intstance, but all must work fine without an instance passed.")
 .Returns("The value or null");

 Function.prototype.staticCall = function(f, optional_noerr) {
	if (f != null) {
		if (typeof f == "function") {
			return Delegate.createWrapper(this, f);
		} else {
			if (optional_noerr) return null;
			throw "thisCall requires a function argument or null. You can specify a noerr flag if you want wrong arguments to be ignored instead of throwing an exception";
		}
	}
	return null;
}.Description("Returns a wrapped function that will call the specified function f with this set to the class definition.")
	.Param("f","Function to wrap or null. When null is passed - null is returned. The code that works with this should deal with that or you should take care to avoid nulls")
	.Param("optional_noerr","Boolean which if specified and set to true will suppress the exception thrown when f is neither null or function. If so, non-function f argument will cause null to be returned")
	.Returns("A function wrapper or null.");

	
Function.prototype.Defaults = function(object_or_name, optvalue) {
	var dm = new DefaultsMgr(this);
	if (arguments.length > 0) {
		dm.set(object_or_name,optvalue);
	}
	return dm;
}.Description("Helps to define defaults while declaring a classs. Usage MyClass.Defaults('defname',defvalue) or MyClass.Defaults({def1: v1, def2: v2 ....});")
	.Param("object_or_name", "string name of a default setting or object containing setting/value pairs")
	.Param("optvalue", "When object_or_name is string this is the value for that setting, otherwise it is ignored")
	.Returns("The DefaultsMgr for this class.");

Function.prototype.ClassData = function(dataType, object_or_name, optvalue) {
	if (typeof dataType != "string") {
		CompileTime.warn("ClassData requires a string dataType parameter. dataType is not a string while declaring ClassData on " + this.classType + ".");
	}
	var cdm = new ClassDataMgr(this, dataType);
	if (arguments.length > 0) {
		cdm.set(object_or_name,optvalue);
	}
	return this;
}

Function.prototype.InterfaceData = function(iface, object_or_name, optvalue) {
	var iface_name = Class.getInterfaceName(iface);
	if (iface_name == null) {
		CompileTime.warn("InterfaceData cannot find the specified interface while setting InterfaceData on " + this.classType + ". Check if the interface is defined before trying to set data for it.");
		return this;
	}
	if (Class.is(this, iface)) {
		return this.ClassData(iface_name,object_or_name,optvalue);
	} else {
		CompileTime.warn("InterfaceData cannot be set becase the class " + this.classType + " does not support the specified interface " + iface_name + ".");
		return this;
	}
}
