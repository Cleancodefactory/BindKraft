/**
	LocalAPIClient - attaches references to LocalAPI interfaces.
	Changes are made in the behavior in BK 2.18! The text below needs some changes. The compatibility should not be broken - the behavior becomes 
	more liberal.
	
	In Depth
	~~~~~~~~
	Local API is a mechanism enabling system code, apps and daemons to publish services/APIs for workspace wide usage - limited to the local 
	(same browser widnow/tab - same global context). None of these should be in any way exposed to other windows or remoted.
	
	The local API has these main benefits -
		- common and well known point for access to APIs avalable to app code - all globaly usable APIs are obtained from one place
		- separate and less demanding than other ways to expose services. Being non-remotable means they are not obliged to implementation
			their methods as async ones (returning Operation-s) which would be extremely frustrating for APIs dealing with local concerns, resources etc.
		- Similar separation between supplier and consumer of an API - a proxy sits between them and doesn't allow calling non-declared methods. Stub is not
			needed, because no (direct) remoting is allowed, so the proxy acts as both in a way.
			
	What else looks like a candidate for LocalAPI, but should not be exposed by it
		- App/daemon provided services. These usually fail to fit the "global" characteristic, because they openly belong to an app/daemon and all their
			clients know and expect that.
		- App/(sometimes may be even daemon) UI bound services. Accessible in the same way, but involve UI changes on the server app while proceeding.
			Exposed though local API these will make the wrong impression that they are like system UI, while the better abstraction is app automation.
			
	
			
	Using
	~~~~~
	
	Note that this usage is automated to an extent and some of the details should not concern the user. When created the client is given
	one simple configuration of the API-s needed (with their variations if needed) and the client will try to attach them. Some APIs may not
	be available at this time. So, in that respect the usage can split in two ways:
	1. Assume the important APIs are attached and potentially explicitly try to reattach some that known to be only optionaly available when convenient.
		This pattern goes that way in code
		if (<client>.API.ISomeAPIInterface != null) {
			<client>.API.ISomeAPIInterface.Somemethod()
		}
		Further one can put an else and do this there
		if (<client>.attachAPI("ISomeAPIInterface")) {
			// retry the API usage
		}
		Depending on deployment and other considerations it can be assumed that the administrator/system integrator is responsile to make sure the pieces of code
		apps, demons that provide the APIs are all there. If that is the way you choose to go you can even skip the if and allow the code to fail if this is not
		done correctly.
		In case of missing API -> if (<client>.API.ISomeAPIInterface == null) one can try to reattach it - the API may become available in time (e.g. if 
		app or daemon supply it they may have been started later than expected and this may be reasonable.
	2. Careful usage assuming less. Instead of using
		<client>.API.ISomeAPIInterface.Somemethod()
		which directly goes through the references and fails if one is missing, you get the API, check if it is ok and then use it
		var myapi - <client>.API.getAPI("ISomeAPIInterface");
		if (myapi != null) {
			// Do your work
		} else {
			// handle the missing API case if needed and if possible
		}
		getAPI method returns the API immediately if it is already attached, but if it is missing it will try to reattach it in case it became available.
		
	Further the local APIs may be and are likely supplied by daemons or apps or the system. So knowledge which daemon/app supplies what API may be available in
	various forms and through system functions. Constructs that autmatically start the supplier when the API is requested are and will be available in various 
	scenarios. To further refine the usage check out what LocalAPI related features are available for apps, view, components and other elements.
	
	Syntaxes
	~~~~~~~~
	
	Constructor
	first arg (optional) object:
		{ ifacename1: null,
		  ifacename2: variation2.1,
		  ...........
		  ifacenameN: ...
		}
		The object contains the interfaces of all requested APIs with null (default variation) or the name of the specific variation (if needed). Variations are
		rarely used (the reasons are not described here), but may be involved when they have to be exposed to apps expecting different versions or modifications 
		of an API - obviously not practiced for system APIs, but some of specific ones may need to go this way at least temporarily.
		
		If a variation is supplied it is honored when getAPI is called later (at any time)
		
		All other parameters (one or more) are references to LocalAPI objects that supply regeistered APIs. In the real world only one is exposed by the system, but
		for testing and for other reasons during the development mock APIs can be exposed - search is done in the specified order in all of the registers, so some can be mocked,
		while others will come from the system (wherever they are found first)...
		
	
*/
function LocalAPIClient(objapis, lapi, lapi1, lapiN) {
	BaseObject.apply(this, arguments);
	if (arguments.length > 0) {
		this.$localapis = [];
		for (var i = 0; i < arguments.length; i++) {
			if (BaseObject.is(arguments[i], "LocalAPI")) {
				this.$localapis.push(arguments[i]);
			} else if (BaseObject.is(arguments[i], "Array")) {
				for (var j = 0; j < arguments[i].length; j++) {
					if (BaseObject.is(arguments[i][j], "LocalAPI")) {
						this.$localapis.push(arguments[i][j]);
					}
				}
			}
		}
	}
	if (this.$localapis == null || this.$localapis.length == 0) {
		// Implicitly set the defaults
		var configuredAPI = System.Default().get_settings("localAPI",null);
		if (BaseObject.is(configuredAPI,"LocalAPI")) {
			this.$localapis.push(configuredAPI);
		}
		this.$localapis.push(LocalAPI.Default());
	}
	if (objapis != null && typeof objapis == "object" && !BaseObject.is(objapis,"LocalAPI")) {
		for (var k in objapis) {
			this.attachAPI(k, objapis[k]);
		}
		this.$objapis = objapis;
	}
}
LocalAPIClient.Inherit(BaseObject, "LocalAPIClient");
LocalAPIClient.prototype.$localapis = null;
LocalAPIClient.prototype.$objapis = null;
LocalAPIClient.prototype.API = new InitializeObject("API proxies go here under their interface names."); // APIs attach here
/**
	From V.2.18. getAPI is more liberal and will auto attach default versions of API even if it is not pre-configured.
	However using non-default variations still requires configuration.
*/
LocalAPIClient.prototype.getAPI = function (ifacedef_or_name) {
	var ifacename = Class.getInterfaceName(ifacedef_or_name);
	if (ifacename == null) {
		this.LASTERROR(-1, "The argument did not resolve to an interface", "getAPI");
		return null; // Incorrect call - argument did not resolve to an interface
	}
	if (!BaseObject.is(this.API[ifacename], ifacedef_or_name)) { // f(IFace) - try from conf if it isn't bound yet
		if (this.attachAPIConf(ifacedef_or_name)) {
			return this.API[ifacename];
		}
	}
	if (BaseObject.is(this.API[ifacename], ifacedef_or_name)) { // Check if we have it and return 
		return this.API[ifacedef_or_name];
	}
	// Attempt to attach the default one
	this.attachAPI(ifacedef_or_name);
	if (BaseObject.is(this.API[ifacename], ifacedef_or_name)) { // Check if we have it and return 
		return this.API[ifacename];
	}
	this.LASTERROR(-1,"Cannot find the requested interface in the configured LocalAPI hubs");
	return null;
	//this.attachAPI
}
LocalAPIClient.prototype.attachAPIConf = function (ifacedef_or_name) {
	var ifacename = Class.getInterfaceName(ifacedef_or_name);
	if (ifacename != null && ifacename in this.$objapis) {
		var variation = null;
		if (this.$objapis != null && this.$objapis[ifacename] != null) {
			// TODO: We probably have to enforce string here? It is not enforced on the other side too (for now).
			variation = this.$objapis[ifacename];
		}
		return this.attachAPI(ifacedef_or_name, variation);
	} else {
		return false;
	}
}
LocalAPIClient.prototype.attachAPI = function (iface, variation) {
	if (BaseObject.is(this.$localapis, "Array")) {
		var pxy = null;
		for (var i = 0; i < this.$localapis.length; i++) {
			var la = this.$localapis[i];
			if (BaseObject.is(la, "LocalAPI")) {
				pxy = la.getAPI(iface, variation);
				if (pxy != null) {
					this.API[Class.getInterfaceName(iface)] = pxy;
					return true;
				}
			}

		}
	}
	return false;
}