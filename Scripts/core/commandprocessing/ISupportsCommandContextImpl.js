/**
	A default simple implementer. It depends on the other interfaces by default and does not fill the $custom property unless a callback is specified for that.
	@param mode {"new"|"single"} Specifies that a new context will be created for each call - "new", "single" will create the context and remember it 
								for the whole lifetime of the object implementing the interface. The default (when null is passed) is "new" making the final effect dependent on the other interfaces.
	@param getter* {callback} function(cls_instance): 
								getter_cmdreg 	-> CommandReg, 			// If null gets it from ISupportsCommandRegister if supported or leaves it null otherwise
								getter_env		-> IEnvironmentContext, // If null gets it from ISupportsEnvironmentContext if supported or leaves it null otherwise
								getter_app		-> IAppBase, 			// If null checks if the instnace supports the IAppBase interface and returns it if it does, otherwise leaves it null
								getter_custom	-> any 					// If null leaves it null
							  Getters are called as callbacks with first parametter the current instance
								
*/
function ISupportsCommandContextImpl() {}
ISupportsCommandContextImpl.InterfaceImpl(ISupportsCommandContext, "ISupportsCommandContextImpl");
ISupportsCommandContextImpl.classInitialize = function(cls, mode,/*optional*/getter_cmdreg, /*optional*/ getter_env, /*optional*/ getter_app,/*optional*/ getter_custom) {
	var $cachedcontext = null
	
	
	function createcontext(instance) {
		var reg = null, env = null, app = null, custom = null;
		if (BaseObject.isCallback(getter_cmdreg)) {
			reg = BaseObject.callCallback(getter_cmdreg, this);
		} else {
			if (this.is("ISupportsCommandRegister")) {
				reg = this.get_commandregister();
			}
		}
		if (BaseObject.isCallback(getter_env)) {
			env = BaseObject.callCallback(getter_env, this);
		} else {
			if (this.is("ISupportsEnvironmentContext")) {
				env = this.get_environment();
			}
		}
		if (BaseObject.isCallback(getter_app)) {
			app = BaseObject.callCallback(getter_app, this);
		} else {
			if (this.is("IAppBase")) {
				app = this;
			}
		}
		if (BaseObject.isCallback(getter_custom)) {
			app = BaseObject.callCallback(getter_custom, this);
		} 
		return new CommandContext(reg,env,app,custom);
	}
	if (mode == "single") {
		cls.prototype.get_commandcontext = function() {
			if ($cachedcontext == null) {
				$cachedcontext = createcontext.call(this);
			}
			$cachedcontext.$application = this;
			return $cachedcontext;
		}
	} else {
		cls.prototype.get_commandcontext = function() {
			var ctx = createcontext.call(this);
			return ctx;
		}
	}
}
