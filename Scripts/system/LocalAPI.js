/*
	LocalAPI - published collection of APIs (local interface services).
	Despite the similarities this differs from the remotable classes interfacing.
	
	Explanation
	~~~~~~~~~~~
	
	Understanding what we do is probably capable to prevent many misunderstandings and mistakes, so this is the rationale and the corresponding implementation.
	
	We introduced IRequestInterface with main goal to build around it ability to connect objects that can't or shouldn't call each other directly. This is
	motivated mostly by remoting of running objects - calling them from other browser windows, from other machines even through variety of transports (which
	will obviously require a lot of experiements if we are to find the best ways for different scenarios).
	
	However another need has been bothering us for a long time - how to add non-builtin API to the system. Many built-in API can be exposed as optional,
	so we wondered how to do this. If you miss the point, it is about avoiding a myriad of properties and methods exposing API after API in static classes, singletons and so on.
	So, we decided to use the mechanism for remoting, but stripped of everything unnecessary and most importantly from the asynchronous implementations and requirements.
	For a local API that you need to call extensively making the call asynchronous without reason will be a nightmare (even if we settle to use async functions, which we do not
	want to employ for some time to come in order to keep compatibility with more browsers).
	
	The APIs are registered only locally, have only proxies (no stubs) and they are dummy (no transport, except for some dev/diagnostic solutions - none is available for the moment.)
	To keep them clean the API interfaces also do not need to extend IRequestInterface as they "requested" only once - by this LocalAPI register/hub class and then references to the registered proxy.
		
	So the LocalAPI provides something that would probably be named global services in another environment.
	
	The procedure is as follows:
	1. The Local API server is loaded or global implementation (the BK code itself) instantiated and we have 'server' insnatance -
		reference to an object implementing the API interface - server
	2. Registration call is made to the desired LocalAPI instance - called further hub: hub.registerAPI(API_interface, server, optional_variation)
		this returns operation
	3. When operation is completed successfuly we obtain from it registration report in the form { proxy: , cookie: }. It is important to keep the cookie
		for revoking the registration if the API is implemented by app or daemon for example - they have to revoke the api registration on shutdown.
		
	These steps can be performed by an app for its API. This can be done in two manners:
		a) Registering in LocalAPI.Default()
		b) By implementing the interface IImplementsLocalAPI which is the better ways
		
	Why b) is better - the launcher/daemon loader are responsible to check for the interface and call its methods for registration and revocation. providing as an
		argument the LocalAPI instance in which the registration should occur. App/Daemon implemented that way will thus be able to register in LocalAPI hubs as requested
		by the launcher and this enables them to be exposed in mock local api hubs for example (other uses are also forseen)
	
*/


function LocalAPI(name) {
	BaseObject.apply(this, arguments);
	this.$proxybuilder = new DummyInterfaceProxyBuilder();
	this.$name = name;
}
LocalAPI.Inherit(BaseObject,"LocalAPI");
LocalAPI.genCookie = (function() {
	var g_cookie = 0;
	return function(iface) {
		var ifname = Class.getInterfaceName(iface);
		if (ifname != null) {
			return ifname + "_" + (g_cookie++);
		}
		return null;
	}
})();
LocalAPI.prototype.get_name = function() { return this.$name; }
LocalAPI.prototype.$apis = {};
/*
	iface 		- interface under which the API will be known/identified (interface def or string name)
	instance 	- instance of an implementation of the @iface
	variation	- (optional) variation id of the implementation and/or the interface
	bdefault	- (optional) Default (returned if iface is requested and no variation is supplied).
	RETURNS		- cookie if successful and null otherwise
*/
LocalAPI.prototype.registerAPI = function(iface, instance, variation, bdefault) {
	this.LASTERROR().clear();
	//var op = new Operation();
	var ifname = Class.getInterfaceName(iface);
	if (typeof ifname == "string") {
		if (!this.$apis) this.$apis = {};
		if (this.$apis[ifname] == null) {
			this.$apis[ifname] = {};
		}
		var reg = { proxy: null, cookie: LocalAPI.genCookie(ifname) };
		var pxy = this.$proxybuilder.buildProxy(instance, Class.getInterfaceDef(iface));
		if (pxy == null) {
			this.LASTERROR(_Errors.compose(),"Failed to build a proxy. The Local API registration failed for " + ifname);
			return null;
		}
		reg.proxy = pxy;
		if (typeof variation == "string") {
			if (this.$apis[ifname][variation] != null) {
				this.LASTERROR(_Errors.compose(),"this variation is already registered");
				return null;
			} else {
				this.$apis[ifname][variation] = reg;
				if (this.$apis[ifname]["__$default"] == null || bdefault) {
					this.$apis[ifname]["__$default"] = reg;
				}
			}
		} else if (variation == null) {
			if (this.$apis[ifname]["__$default"] == null) {
				this.$apis[ifname]["__$default"] = reg;
			} else {
				this.LASTERROR(_Errors.compose(),"API is already registered as default with this interface.");
				return null;
			}
		} else {
			this.LASTERROR(_Errors.compose(),"Unsupported variation type - string or null are accepted only");
			return null;
		}
		return reg.cookie;
	}
	this.LASTERROR(_Errors.compose(false,null,GeneralCodesFlags.NotFound),"Cannot find the interface");
	return null;
}
/*
	iface	- previously regisered interface of an API
	cookie	- the cookie returned by registerAPI.
	RETURNS - true if unregisteration really occurs and false otherwise.
*/
LocalAPI.prototype.revokeAPI = function(iface, cookie) {
	this.LASTERROR().clear();
	if (this.$apis != null) {
		var ifname = Class.getInterfaceName(iface);
		if (this.$apis[ifname] != null) {
			for (k in this.$apis[ifname]) {
				var reg = this.$apis[ifname][k];
				if (reg.cookie != null && reg.cookie == cookie) {
					this.$apis[ifname][k] = null;
				}
			}
			// Default is not restored for now.
			return true;
		}
	}
	return false;
}.Description("The cookie is returned by registerAPI");
/*
	Obtains a reference to the proxy created by registerAPI for the iface implementation
	iface 	- the API you want
	variation - optional - the variation you want.
*/
LocalAPI.prototype.getAPI = function(iface, variation) {
	this.LASTERROR().clear();
	if (this.$apis != null) {
		var ifname = Class.getInterfaceName(iface);
		if (this.$apis[ifname] != null) {
			var reg;
			if (variation == null) {
				reg = this.$apis[ifname]["__$default"];
				if (reg != null && reg.proxy != null) return reg.proxy;
			} else {
				reg = this.$apis[ifname][variation];
				if (reg != null && reg.proxy != null) return reg.proxy;
			}
		}
	}
	this.LASTERROR(_Errors.compose(),"API not found");
	return null;
}

// Singleton - Global API Hub
// Default hub for the system, all the rest are mocks or private hubs created for a strange reason (really who will want private ones?)
LocalAPI.Default = (function() {
	var hub = new LocalAPI("default");
	return function() {
		return hub;
	}
})();