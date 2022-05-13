(function(){

    var __emptyproc = function() {};

    /**
     * A proxy (called bubble) for pure interface implementations over another class. It somewhat reminds about the local proxies, but in
     * contrast no argument packing occurs and this is designed for in-app usage and not cross-app usage.
     * 
     * Bubbles enable interface implementations attached to an arbitrary class. Multiple different implementations (bubbles) can be 
     * attached to the same class and accessed through a getter property. The main usage of the feature is with ImplementInterfaceBubble 
     * which produces bubbles typically passed to controls that otherwise would require multiple callbacks to be configured. So, in 
     * essence this provides means to implement and consume interface callbacks which are more convenient when the communication between 
     * control and host is complex enough to not fit within a single callback.
     */
    function $InterfaceBubbleBase(host) {
        BaseObject.apply(this, arguments);
        this.$_host = host; // No checks because this should be called only internally
    }
    $InterfaceBubbleBase.Inherit(BaseObject, "$InterfaceBubbleBase");

    
    /**
     * Used internally to create wrapped methods for an interface
     * @param { } func 
     * @returns 
     */
    $InterfaceBubbleBase.CreateWrapper = function(func) {
        return function() {
            return func.apply(this.$_host, arguments);
        }
    }
    $InterfaceBubbleBase.WrapInterface = function(className, iface, impl, beStrict) {
        var iface_name = Class.getInterfaceName(iface);
        if (iface_name == null) {
            CompileTime.err("Cannot find the specified interface while wrapping interface bubble.");
            if (JBCoreConstants.CompileTimeThrowOnErrors) {
                throw "Cannot find the specified interface while wrapping interface bubble.";
            }
        }
        var ifaceDef = Class.getInterfaceDef(iface);
        if (typeof impl != "object") {
            // TODO: Extend the error description.
            CompileTime.err("The implementation supplied is not an object.");
            if (JBCoreConstants.CompileTimeThrowOnErrors) {
                throw "The implementation supplied is not an object.";
            }
        }
        // No check - if the name can be resolved the definition should too.
        var cls = Class.getClassDef(className);
        if (cls != null) {
            if (!Class.supports(cls, iface)) {
                CompileTime.err("A bubble class " + className + " already exists, but does not support the supplied interface " + iface_name + ".");
                if (JBCoreConstants.CompileTimeThrowOnErrors) {
                    throw "A bubble class " + className + " already exists, but does not support the supplied interface " + iface_name + ".";
                }   
            } else {
                return cls;
            }

        }
        // All ok. now create the className
        var basecls = this;
        cls = new Function("host",
			'Class("$InterfaceBubbleBase").call(this,host);');
        cls.Inherit(basecls, className);
        cls.ImplementEx(ifaceDef);

        for (var key in ifaceDef.prototype) {
            // The exceptions:
            //	constructor - does not need changes
            if (key != "constructor" && key.charAt(0) != "$") {
                if (typeof ifaceDef.prototype[key] == "function") {
                    if (typeof impl[key] != "function") {
                        if (beStrict) {
                            throw "Method " + key + " is not supplied for the implementation of bubble interface " + iface_name + ".";
                        } else {
                            cls.prototype[key] = __emptyproc;
                        }
                        throw "The " + iface_name + "." + key + " is not implemented as function in " + className + " and a local proxy cannot be created.";
                    } else {
                        cls.prototype[key] = this.CreateWrapper(impl[key]);
                    }
                }
            }
        }
        // cls is defined now
        return cls;
    }

})();
