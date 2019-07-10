/*
	This implementer does all the work except deciding what to expose. For that reason it needs the class to implement the
	OnGetExposedLocalAPI method and return from it a list of interfaces and instances on which they are implemented. The implementer
	will do the rest.
	
	One limit applies - the life time of the instances has to be equal to the life time of the app.
	
	How to return the list:
	With variation any single entry can be
		
		<interfacenameN>: { instance: <instanceN>, variation: <variation> }
		
	example:
	{
		IMyAPIInterface1: { instance: this },
		IMyAPIInterface2: { instance: this.mysubobj }
	}
		
	if variation is null it isequivalent to no variation.
	
	Alternatives and plans: Static declaration support can be introduced with some inherent limitations (no API exposition according to state for example). Could be a separate implementer - will be determined after some usage.
*/
function IImplementsLocalAPIImpl() {}
IImplementsLocalAPIImpl.InterfaceImpl(IImplementsLocalAPI);
IImplementsLocalAPIImpl.classInitialize = function(cls) {
	cls.prototype.OnGetExposedLocalAPI = function() {
		throw "OnGetExposedLocalAPI must be implemented, but isn't. See the documentation or the IImplementsLocalAPIImpl.js for the details.";
		
		/*
			return something like:
			{
				IMyAPIInterface1: { instance: this },
				IMyAPIInterface2: { instance: this.mysubobj }
			}
		*/
	}
	function $registerSingleAPI(hub, iface, inst, variation) {
		if (iface != null && inst != null) {
			return hub.registerAPI(iface,inst,variation);
		}
		return null;
	}
	cls.prototype.__$registeredLocalAPI = null;
	cls.prototype.registerLocalAPI = function(hub) {
		if (this.__$registeredLocalAPI == null) {
			this.__$registeredLocalAPI = {};
		}
		if (this.__$registeredLocalAPI[hub.get_name()] == null) {
			this.__$registeredLocalAPI[hub.get_name()] = {}
		} else {
			// Already registered
			this.LASTERROR(_Errors.compose(),"This API is already registered with this hub. This is strong indication of a problem that can lead to unexpected early API revocation.");
			return 0;
		}
		var list = this.OnGetExposedLocalAPI();
		var cookie;
		var nreg = 0;
		if (list != null) {
			for (var k in list) {
				if (list[k] != null) {
					cookie = $registerSingleAPI(hub, k, list[k].instance, list[k].variation);
					if (cookie != null) {
						this.__$registeredLocalAPI[hub.get_name()][k] = cookie;
						nreg++;
					}
				}
			}
		}
		return nreg;
	}
	cls.prototype.revokeLocalAPI = function(hub) {
		var o = this.__$registeredLocalAPI[hub.get_name()];
		if (o != null) {
			for (var k in o) {
				hub.revokeAPI(k,o[k]);
			}			
		}
	}
	
}