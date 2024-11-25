function IServiceLocatorDefaultImpl(){}IServiceLocatorDefaultImpl.InterfaceImpl(IServiceLocator,"IServiceLocatorDefaultImpl");IServiceLocatorDefaultImpl.classInitialize=function(cls,map){if(cls.prototype.$__serviceLocatorMap==null||!cls.prototype.$__serviceLocatorMap.$__svclocator){CompileTime.warn("Found something in the $__serviceLocatorMap property which is not a service locator map - replacing it!");cls.prototype.$__serviceLocatorMap={$__svclocator:true};}if(map!=null){for(var k in map){if(Class.getInterfaceDef(k)==null){CompileTime.err("Interface "+k+" specified in a locator map while implementing IServiceLocatorDefaultImpl is not declared. Happened while declaring class "+cls.classType+".");}else{var oper=map[k];if(typeof oper=="string"){cls.prototype.$__serviceLocatorMap[k]=function(){var propname=oper;return function(iface,reason){var r=BaseObject.getProperty(this,propname,null);if(BaseObject.is(r,iface)){return r;}else{return null;}};}();}else if(BaseObject.is(oper,k)){cls.prototype.$__serviceLocatorMap[k]=function(iface){if(this.$__serviceLocatorMap&&BaseObject.is(this.$__serviceLocatorMap[iface],iface)){return this.$__serviceLocatorMap[iface];}else{return null;}};}else if(typeof oper=="function"){cls.prototype.$__serviceLocatorMap[k]=oper;}else if(oper===true){cls.prototype.$__serviceLocatorMap[k]=oper;}else{CompileTime.err("Unsupported entry in service locator map while implementing IServiceLocatorDefaultImpl on class "+cls.classType+".");}}}}cls.prototype.locateService=function(iface,reason){if(this.$__serviceLocatorMap){var ifacename=Class.getInterfaceName(iface);if(this.$__serviceLocatorMap[ifacename]===true){if(this.is(ifacename))return this;return null;}else if(typeof this.$__serviceLocatorMap[ifacename]=="function"){return this.$__serviceLocatorMap[ifacename].call(this,iface,reason);}}return null;};};