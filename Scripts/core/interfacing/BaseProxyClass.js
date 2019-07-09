/**
	Base class for proxies used for local stubbind.
*/
function $Managed_BaseProxy(instance, transport, builder, managedContainer) {
	$Root_BaseProxy.apply(this, arguments);
	this.$transport = transport;
	this.$instance = instance;
	this.$builder = builder;
	this.$container = managedContainer;
	// Proxy never calls the transport, the transport or any code that is using it calls the proxy (not true - dispatchers will call it)
	// TODO: Knowing the transport is not that important here - registering with the transport is the important part (interface for that purpose is not prototyped yet)
}
$Managed_BaseProxy.Inherit($Root_BaseProxy, "$Managed_BaseProxy");
$Managed_BaseProxy.ImplementEx(IManagedInterface);
$Managed_BaseProxy.ImplementEx(IDereference);
$Managed_BaseProxy.$maxRecursion = 10;

// +Internals
$Managed_BaseProxy.$notRef = function(arg, _level) {
	var level = _level || 1;
	if (level > this.$maxRecursion) return;
	var i;
	if (BaseObject.is(arg,"BaseObject")) {
		throw "References to BK objects not allowed. To enable references mark your interface method appropriately.";
	} else if (BaseObject.is(arg,"Array")) {
		for (i = 0; i < arg.length;i++) {
			this.$notRef(arg[i], level + 1);
		}
	} else if (BaseObject.is(arg, "object")) {
		for (i in arg) {
			this.$notRef(arg[i], level + 1);
		}
	}
}
$Managed_BaseProxy.$notRefs = function(args) {
	for (var i = 0; i < args; i++) {
		this.$notRef(args[i]);
	}
}
$Managed_BaseProxy.prototype.$buildProxyFromAnother = function(proxy, container) {
	var original = proxy.Dereference();
	if (original == null) throw "Dereferencing a proxy of type " + proxy.classType() + " produced null result.";
	if (this.$builder == null) throw "The proxy (" + this.classType() + ") does not have a builder set and cannot wrap references.";
	return this.$builder.buildProxy(original, proxy.proxiedInterface, container);
}
$Managed_BaseProxy.prototype.$buildProxyFrom = function(instance, iface, container) {
	if (BaseObject.is(instance, "BaseObject")) {
		if (BaseObject.is(instance, iface)) {
			if (Class.doesextend(iface, "IManagedInterface")) {
				if (this.$builder == null) throw "The proxy (" + this.classType() + ") does not have a builder set and cannot wrap references.";
				return this.$builder.buildProxy(instance, iface, container);
			} else {
				throw "The declared interface " + Class.getInterfaceName(iface) + " does not extend IManagedInterface.";
			}
		} else {
			throw "The instance does not support the declared interface: " + Class.getInterfaceName(iface);
		}
	} else { // Non-BaseObject
		$Managed_BaseProxy.$notRef(instance);
		return instance;
	}
}

$Managed_BaseProxy.prototype.$wrapResult = function(r, method) {
	// Use ReturnType or if r is a proxy use it as a template
	// Register in the local release container, ignore the one in the comming proxy
	var ridef = r.$proxiedInterface;
	if (BaseObject.is(r, "$Managed_BaseProxy")) {
		// Extract info from the proxy
		return this.$buildProxyFromAnother(r,this.$container);
	} else if (BaseObject.is(r, "BaseObject")) {
		// Use the $returnType from interface definition
		var rt = Class.returnTypeOf(this.$proxiedInterface,method);
		if (Class.typeKind(rt) == "interface") {
			if (BaseObject.is(r, rt)) {
				if (Class.doesextend(rt, "IManagedInterface")) {
					if (this.$builder != null) {
						return this.$builder.buildProxy(r, rt, this.$container);
					} else {
						throw "The proxy (" + this.classType() + ") does not have a builder set and cannot wrap the return result of " + method;
					}
				} else {
					throw "The declared return type by " + this.$proxiedInterface.classType + "." + method + " is not IManagedInterface and cannot be wrapped into a local proxy.";
				}
			} else {
				throw "The returned value is not " + rt.classType + " as declared in " + this.$proxiedInterface.classType + "." + method;
			}
		} else {
			throw "The return type declared for " + this.$proxiedInterface.classType + "." + method + " is not an interface and cannot be wrapped in a local proxy.";
		}
	} else { // Everything else return without changes as long as it does not contain BK instances
		$Managed_BaseProxy.$notRef(r);
		return r;
	}
}
/* May be unneeded, wrote it by mistake, if redundant - remove.
$Managed_BaseProxy.prototype.$wrapArgument = function(v, method, index) {
	var origin = null, container = null;
	if (BaseObject.is(v, "$Managed_BaseProxy")) {
		// Use the passed proxy as a template - overrides any Arguments specified for the function.
		origin = this.Dereference();
		container = null;
		if (BaseObject.is(origin,"IHasManagedInterfaceContainer")) {
			container = origin.get_managedinterfacecontainer();
			// No need to check the result - a null will still be ok, but the proxy will not register with a container.
		}
		return this.$buildProxyFromAnother(v, container);
	} else if (BaseObject.is(v, "BaseObject")) {
		// Use the Arguments configuration for the function (availability is crucial
		var arg_type = Class.argumentOf(this.$proxiedInterface, method, index);
		if (arg_type == null) {
			// No type info - no way to wrap the argument
			throw "Cannot wrap the argument " + index + " of " + method + " because .Arguments describer is not used or does not declare interface for the argument. The type being passed as argument is: " + c.classType();
		}
		origin = this.Dereference();
		if (BaseObject.is(origin,"IHasManagedInterfaceContainer")) {
			container = origin.get_managedinterfacecontainer();
		}
		return this.$buildProxyFrom(v, arg_type, container);
	} else {
		this.$notRef(v);
		return v;
	}
}
*/
$Managed_BaseProxy.prototype.$wrapArguments = function(args, method) {
	var origin = null, container = null, v;
	var result = [];
	origin = this.Dereference();
	if (BaseObject.is(origin,"IHasManagedInterfaceContainer")) {
		container = origin.get_managedinterfacecontainer();
		// No need to check the result - a null will still be ok, but the proxy will not register with a container.
	}
	for (var i = 0; i < args.length; i++) {
		v = args[i];
		if (BaseObject.is(v, "$Managed_BaseProxy")) {
			// Use the passed proxy as a template - overrides any Arguments specified for the function.
			result.push(this.$buildProxyFromAnother(v, container));
		} else if (BaseObject.is(v, "BaseObject")) {
			// Use the Arguments configuration for the function (availability is crucial
			var arg_type = Class.argumentOf(this.$proxiedInterface, method, i);
			if (arg_type == null) {
				// No type info - no way to wrap the argument
				throw "Cannot wrap the argument " + i + " of " + method + " because .Arguments describer is not used or does not declare interface for the argument. The type being passed as argument is: " + v.classType();
			}
			result.push(this.$buildProxyFrom(v, arg_type, container));
		} else {
			$Managed_BaseProxy.$notRef(v);
			result.push(v);
		}
	}
}
// -Internals
$Managed_BaseProxy.prototype.$initializeProxy = function() { // Called by the constructor of the generated class inheriting the base proxy.
	// Connect to instance
	var original = this.Dereference();
	if (original != null) {
		for (var key in this) {
			if (this.hasOwnProperty(key) && 
				BaseObject.is(this[key], "IEventDispatcher") &&
				BaseObject.is(original[key], "IEventDispatcher")
				) {
				original[key].add(this[key]); // Attach to the original dispatcher
			}
		}
	} else {
		// TODO: Log
	}
	// Register in the container if set
	if (BaseObject.is(this.$container, "IManagedInterfaceContainer")) {
		this.$container.register(this);
	}
}
// IDereference
$Managed_BaseProxy.prototype.Dereference = function() {
	if (BaseObject.is(this.$instance, this.classType())) {
		return this.$instance.Dereference();
	} else {
		return this.$instance;
	}
}
// IManagedInterface
$Managed_BaseProxy.prototype.GetInterface = function(iface) {
	if (this.__obliterated) return null;
	if (this.$instance == null) return null;
	if (arguments.length == 0) {
		// Clone self, but not register in any container. If this is desired the caller should do it or Release the clone explicitly
		return this.$buildProxyFromAnother(this);
	} else {
		var ifc = this.$instance.GetInterface(iface); // No more checks to save performance
		if (BaseObject.is(ifc, iface)) {
			// The implementations provide a referene to an instance implementing the interface being asked for.
			// If by chance we get another proxy it is not a critical problem, but it will slow hte performance a little bit (should be noticed in scenarios where this matters)
			if (BaseObject.is(this.$builder,"IProxyInterfaceBuilder")) {
				var proxiedInstance = this.$builder.buildProxy(ifc, iface, this.$container);
				return proxiedInstance;
			} else {
				throw "Cannot build a proxy for the queried interface becuase no proxy builder was supplied to the proxy marshalling the call";
			}
		}
	}
	return null;
}
$Managed_BaseProxy.prototype.Release = function(nocontainer) { // Called with true from contaners only
	if (this.__obliterated) return;
	var instance = this.$instance;
	this.$instance = null;
	if (instance != null) {
		for (var key in this) {
			if (this.hasOwnProperty(key) && 
				BaseObject.is(this[key], "IEventDispatcher") &&
				BaseObject.is(instance[key], "IEventDispatcher")
				) {
				instance[key].remove(this[key]); // Detach from the original dispatcher.
			}
		}
	}
	var container = this.$container;
	this.$container = null; // Prevents cycling
	this.obliterate(); // TODO: Check if this is going too far (not critical, but checking will not hurt)
	if (container != null && !nocontainer) container.release(this);
}