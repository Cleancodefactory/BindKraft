/*
	Helps you implement simple service locator by mapping the locator logic with none or a little code.
*/
function IServiceLocatorDefaultImpl() {}
IServiceLocatorDefaultImpl.InterfaceImpl(IServiceLocator);
IServiceLocatorDefaultImpl.classInitialize = function(cls, map) {
	if (cls.prototype.$__serviceLocatorMap == null || !cls.prototype.$__serviceLocatorMap.$__svclocator) {
		CompileTime.warn("Found something in the $__serviceLocatorMap property which is not a service locator map - replacing it!");
		// Removing anything in the map's place
		cls.prototype.$__serviceLocatorMap = { $__svclocator: true }; // Property for proper identification 
	}
	if (map != null) {
		for (var k in map) {
			if (Class.getInterfaceDef(k) == null) {
				CompileTime.err("Interface " + k + " specified in a locator map while implementing IServiceLocatorDefaultImpl is not declared. Happened while declaring class " + cls.classType + ".");
			} else {
				var oper = map[k];
				if (typeof oper == "string") { // property name over the this.
					cls.prototype.$__serviceLocatorMap[k] = (function() {
						var propname = oper;
						return function(iface, reason) { // The function is called in run time with the this of the instance.
							var r = BaseObject.getProperty(this, propname, null);
							// TODO: Implement run-time error logging here
							if (BaseObject.is(r, iface)) {
								return r;
							} else {
								return null;
							}
						};
					})();
					
				} else if (BaseObject.is(oper, k)) { // single instance of a class - raarely usable, but supported nevertheless
					cls.prototype.$__serviceLocatorMap[k] = function(iface) {
						if (this.$__serviceLocatorMap && BaseObject.is(this.$__serviceLocatorMap[iface], iface)) {
							return this.$__serviceLocatorMap[iface];
						} else {
							// TODO: Implement run-time error logging here
							return null;
						}
					};
				} else if (typeof oper == "function") { // thisCall function(iface, reason) - iface and reason can be used or not depending on how much this is dispatched to separate functions.
					cls.prototype.$__serviceLocatorMap[k] = oper; // function(iface, reason) {
				} else if (oper === true) { // cast this to the requested interface
					cls.prototype.$__serviceLocatorMap[k] = oper; // null
					// The locateService will do the task if it sees null here - less closures
				} else {
					CompileTime.err("Unsupported entry in service locator map while implementing IServiceLocatorDefaultImpl on class " + cls.classType + ".");
				}
				
			}
		}
	}
	
	cls.prototype.locateService = function(iface, reason) {
		if (this.$__serviceLocatorMap) {
			var ifacename = Class.getInterfaceName(iface);
			if (this.$__serviceLocatorMap[ifacename] === true) {
				if (this.is(ifacename)) return this;
				return null;
			} else if (typeof this.$__serviceLocatorMap[ifacename] == "function") {
				return this.$__serviceLocatorMap[ifacename].call(this, iface, reason);
			}
		}
		return null;
	}
}