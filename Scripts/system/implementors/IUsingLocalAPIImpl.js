/*
	Helps with the import of local APIs and supports DI-like feature letting the developer put
	the various API in fields.
	
	Usage:
	// Bulk imports:
	
		// Shortest form - no variations supported
		MyClass.Implement(IUsingLocalAPIImpl,"IApi1,IApi2,...");
		// Extended form
		MyClass.Implement(IUsingLocalAPIImpl,{IApi1: null,IApi2: "variationx",...});
	
	After setLocalAPIClient is called ofer an instance
	you will have this.LocalAPI.IApi1 also this.LocalAPI.IApi2 and so on 
	
	// Injection
		// Minimal syntax
		MyClass.Implement(IUsingLocalAPIImpl);
		...
		MyClass.ImportLocalAPI("api1", IApi1);
		MyClass.ImportLocalAPI("api2", IApi2);
		MyClass.ImportLocalAPI("api3", IApi3, "variationZ");
		
	After setLocalAPIClient is called ofer an instance
	you will have this.api1 also this.api2 this.api3 and so on 
	
	Both can be mixed - e.g. you can include second argument to Implement and supply import list in any if the both ways above, then still
	use ImportLocalAPI statements to inject some or all of the Local API interfaces into fields of your choice
	
	When inheriting ImportLocalAPI must not change the variation! The only way to use DI throughout inheritance chain is to inject any API only once in
	the whole chain (never re-inject in children). DI has inherent limitations when used with OOP inheritance in general and different solutions in
	different languages (whatever is possible). So, some problems are to be expected with member/field injection anyway, treating such fields as "implemented"
	by a parent is the best way to align your thinking with the limitations.
	
	When inheriting and reimplementing the import table grows and the only possible collision is again the variation. It is again an obvious problem - having two (or
	even worse - more) variations used in the same class is terrible idea no matter if it is possible or not. The only recommendation here is that whenever base classes
	are designed they should be abstract and depend on an import made by a class that inherits them. This is important only if variations are a concern, of course.
	
*/
function IUsingLocalAPIImpl() {}
IUsingLocalAPIImpl.InterfaceImpl(IUsingLocalAPI);
IUsingLocalAPIImpl.RequiredTypes("AppBase"); // Further scope of compatibility may be extended a little
IUsingLocalAPIImpl.inheritorInitialize = function(cls, parentCls) {
	// __$localAPIInjects is an object. Reusing the same field name when inheriting is an error
	//	because it can break inherited methods that use it
	// __$localAPIImports is an object corresponding to the definition expected by the LocalAPIClient constructor.
	//	We just extend it during inheritance if the children classes happen to have additional requirements (imports).
	if (parentCls.__$localAPIInjects != null) {
		cls.__$localAPIInjects = BaseObject.CombineObjects(parentCls.__$localAPIInjects);
	}
	if (parentCls.__$localAPIImports != null) {
		cls.__$localAPIImports = BaseObject.CombineObjects(parentCls.__$localAPIImports);
	}
}
IUsingLocalAPIImpl.classInitialize = function(cls, apiimports) {
	CompileTime.warn("IUsingLocalAPIImpl is obsolete from BK 2.18, please use AppGate to access and record local API refs. Compiling: " + Class.getClassName(cls));
	var clientFieldName = "__$localAPIClient";
	// if (!(typeof fieldName == "string") || !PatternChecker.IdentName.checkValue(fieldName)) {
		// throw "IUsingLocalAPIImpl requires fieldName argument in the Implement(IUsingLocalAPIImpl, ...) statement and it needs to be valid identifier name";
	// }
	// var parentimpl = null;
	// if (typeof cls.prototype.setLocalAPIClient == "function") {
		// parentimpl = cls.prototype.setLocalAPIClient;
	// }
	
	
	// Create/extend the import list
	if (cls.__$localAPIImports == null) {
		cls.__$localAPIImports = {};
	}
	if (apiimports != null) {
		if (typeof apiimports == "object") {
			cls.__$localAPIImports = BaseObject.CombineObjects(cls.__$localAPIImports, apiimports);
		} else if (typeof apiimports == "string") {
			var arr = apiimports.split(",");
			if (arr != null && arr.length > 0) {
				cls.__$localAPIImports = {};
				for (var i = 0; i < arr.length; i++) {
						cls.__$localAPIImports[arr[i]] = null; // no variations in the short syntax
				}
			}
		}
	}
	// interface impl
	cls.prototype.getLocalAPIImportDefinition = function() {
		return cls.__$localAPIImports;
	}
	cls.prototype.setLocalAPIClient = function(clnt) {
		if (BaseObject.is(this[clientFieldName], "LocalAPIClient")) {
			// The client can be set later than usual, but not changed!
			throw "System error - setLocalAPIClient has been called to set different client - the client cannot be changed due to the DI behavior";
		}
		if (BaseObject.is(clnt, "LocalAPIClient")) {
			this[clientFieldName] = clnt;
			this.LocalAPI = clnt.API; // Copy of the object containing refs to all proxies
			// Injects
			var _inj = _injects();
			for (var k in _inj) {
				if (this[k] == null) {
					this[k] = this.LocalAPI[_inj[k]];
				} else {
					CompileTime.warn("Injection into field " + k + " failed because it was not empty. Unpredictable runtime errors may occur");
				}
			}
			
		} else if (clnt == null) {
			// nothing - just convenient for us - one less check when launched
		} else {
			throw ("setLocalAPIClient has been called with invalid argument - expected LocalAPIClient");
		}
		
	}
	// internal utility
	/**
		Returns and creates if missing the injects "register"
	*/
	function _injects() {
		if (cls.__$localAPIInjects == null) {
			cls.__$localAPIInjects = {};
		}
		return cls.__$localAPIInjects;
	}
	/**
		puts the iface in the imports (had to be there in order to be in the injects)
		or if it is already there checks the variation and issues a warning if it is different.
	*/
	function _import(iface, variation) {
		var imps = cls.__$localAPIImports;
		if (imps == null) {
			throw "Local API imports list is missing unexpectedly - system level error";
		}
		var ifacename = Class.getInterfaceName(iface);
		if (ifacename in imps) {
			if (variation != null && variation != imps[ifacename]) {
				CompileTime.warn("The requested variation " + variation + " is different from the previousy declared (e.g. in an inherited class) " + imps[variation] + " for Local API interface " + ifacename);
			}
		} else {
			imps[ifacename] = variation;
		}
	}
	
	// inject statements support - declaration tools
	/**
		Usage:
		MyClass.ImportLocalAPI(fieldname, apiinterface[, variation]);
	*/
	cls.ImportLocalAPI = function(field_name, iface, variation) {
		_import(iface, variation);
		var ifacename = Class.getInterfaceName(iface);
		if (ifacename == null) {
			CompileTime.warn("ImportLocalAPI cannot find interface declaration");
		}
		var _inj = _injects();
		if (PatternChecker.IdentName.checkValue(field_name)) {
			_inj[field_name] = ifacename;
		} else {
			CompileTime.warn("ImportLocalAPI -> Trying to inject local API " + ifacename + " in a field with unusable name " + field_name);
		}
		return this;
	}
	
}