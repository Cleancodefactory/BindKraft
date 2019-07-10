/**
	This class is introduced in BK 2.18 (officially) as a replacement of a mix of solutions previously giving anchor
	app access to various system or shell provided features. As the previous solutions were experimental and minimally used
	the impact of the change should be minimal and only felt in-house.
	
	Conceptual usage
	
	The SysShell creates one instance of this class for each app it launches (including daemons). The instance is tailored for
	that app (for example: to minimize the number of arguments where possible). The instance thus created is given to the app
	through its constructor (the old queryback interface is deprecated). Simple apps can often entirely get by without using it,
	but others preserve the receved instance and can use it to access API-s, the shell, the running apps though the shell etc.
	
	This setup provides for future non-breaking extensions to this class and keep all the (potentially growing) features provided
	on a separate dedicated instance, thus entirely avoiding the need the app too inherit a growing number of methods for that purpose.
	
	An important detail is that the shell may continue to manipulate the already passed AppGate as the application progresses. Some features
	or parts of them may become available at later phases (see the App related documentation).
	
	Provided features:
	2.18
		- LocalAPIClient
		- Shell (query) API
	
	The shell API is rather limited in this version, but will be extended in 2.19, some other frequently needed stuff will be added to AppGate
	as well - even if it is easilly accessible from elsewhere, AppGate is supposed to become a hub giving the app access to the majority of the
	API and services an app usually needs.
*/
function AppGate(shell, lapiclient, appClass,apiHub) {
	BaseObject.apply(this, arguments);
	this.$shell = shell;
	this.$api = lapiclient;
	this.$appClass = appClass;
	this.$lapiHub = apiHub;
	this.$container = new LocalProxyContainer();
}
AppGate.Inherit(BaseObject, "AppGate");
AppGate.Implement(IHasManagedInterfaceContainer);
AppGate.prototype.get_managedinterfacecontainer = function() {
	return this.$container;
}
// Proxy wrapper
AppGate.prototype.$arrayRelease = function() {
	var cont = this.$container;
	return function() {
		if (BaseObject.is(this, "Array")) {
			for (var i = 0; i < this.length; i++) {
				if (BaseObject.is(this[i],"IManagedInterface")) {
					cont.release(this[i]);
				}
			}
		}
	}
}
/**
	A localProxyContainer - all returned proxies are registered here
*/
AppGate.prototype.$container = null;
/**
	Wraps a single reference or an array of same-interface references with a proxy/ies for the given interface
	@param iface {string|interfacedef}	The interface for which to generate a proxy
	@param p	 {BaseObject*}			A reference to the instance implementing the interface
	@returns 	 {LocalProxy}			The proxy. Must be released after use (call Release() in it)
	
	@remarks
*/
AppGate.prototype.$wrap = function(iface, p) {
	if (BaseObject.is(p,"BaseObject")) {
		var v = DummyInterfaceProxyBuilder.Default().buildProxy(p, iface);
		if (this.LASTERROR().iserror()) {
			throw "Cannot wrap: " + this.LASTERROR().text();
		}
		return v;
	} else if (BaseObject.is(p, "Array")) {
		// Here we actually allow proxies to be chain-wrapped.
		// This is intentional - the proxies are considered created outside of the control of the code that calls wrap
		// Thus passing them further is considered passind a proxy to a new client, hence a new proxy is needed.
		var arr = Array.createCopyOf(p);
		for (var i = 0; i < arr.length; i++) {
			if (BaseObject.is(arr[i],"BaseObject")) {
				arr[i] = this.wrap(iface,arr[i]);
			}
		}
		arr.Release = this.$arrayRelease();
		return arr;
	}
	return p;
}
/**
	For use by the app when needed.
	
	When implementing methods of service interfaces which return BaseObject derived instances
	you have to generate a local proxy yourself.
	
	Example: 
		var inst = this.myObject;
		return this.appgate.wrap(IMyInterface,inst);
		
	In the example we assume the AppGate passed to the app constructor is saved in the appgate field (can be anywhere - up to the programmer).
	We also assume IMyInterface extends IManagedInterface and inst supports IMyInterface.
	
	Workspace exposed app services are typically supported through GetInterface on the app's main class. They can return any object that supports the requested
	interface. However this is not enough if certain service (available this way) maintains varying number of instances of some class(es) - created and further
	managed through it. I.e. the service manages some items and direct interface reference to one or more of them can be obtained by a client throuhg a method call
	on the service. In this case the local proxy is responsibility of the implementation.
	
	Why? It is possible to intercept the return values, hence the returned references, but as we do not want to introduce strict method typing just for this reason
	there is no sure way in which to determine what is the interface expected by the client. That interface is assumed according to the services's server documentation
	and not available to the system. Any information about the return result will require more work than the mere wrapping it, which includes the needed information anyway.
	So this makes the proxy generation by the server simple and preferable compared to a clumsy return type declaration system or returning description object that carries both
	the interface definition/name and the reference - the proxy is built from this knowledge and is ready for use without the need of an additional and (frankly) redundant step.
	If you have any doubts - please consider the fact that this is for local (workspace/page) usage only - not remote.
	
	
*/
AppGate.prototype.wrap = function(iface, p, container) {
	if (BaseObject.is(p,"BaseObject")) {
		var v = DummyInterfaceProxyBuilder.Default().buildProxy(p, iface, container);
		if (this.LASTERROR().iserror()) {
			throw "Cannot wrap: " + this.LASTERROR().text();
		}
		return v;
	} else if (BaseObject.is(p, "Array")) {
		// Here we actually allow proxies to be chain-wrapped.
		// This is intentional - the proxies are considered created outside of the control of the code that calls wrap
		// Thus passing them further is considered passind a proxy to a new client, hence a new proxy is needed.
		var arr = Array.createCopyOf(p);
		for (var i = 0; i < arr.length; i++) {
			if (BaseObject.is(arr[i],"BaseObject")) {
				arr[i] = this.wrap(iface,arr[i], container);
			}
		}
		return arr;
	}
	return p;
}
//
AppGate.prototype.release = function(p) {
	this.$container.release(p);
}
AppGate.prototype.releaseAll = function() {
	this.$container.releaseAll();
	this.$api.releaseAll();
}

// LocalAPI usage
AppGate.prototype.api = function(iface) {
	var api = this.$api.getAPI(iface);
	if (api != null) {
		return api;
	} else {
		this.LASTERROR(_Errors.compose(),"Cannot find API " + Class.getInterfaceName(iface) + " in AppGate of " + Class.getClassName(this.$appClass));
	}
	return null;
}
/**
	No need to use this method for now
*/
AppGate.prototype.attachAPI = function(iface, variation) {
	return this.$api.attachAPI(iface, variation);
}
// LocalAPI exposure/implementation
AppGate.prototype.$registeredLocalAPI = new InitializeArray("Array of API registration cookies for revokation on shutdown");
AppGate.prototype.registerLocalAPI = function(iface, instance, variation, bdefault) {
	if (BaseObject.is(this.$lapiHub,"LocalAPI")) {
		var cookie = this.$lapiHub.registerAPI(iface, instance, variation, bdefault);
		if (cookie != null) {
			this.$registeredLocalAPI.push({iface: Class.getInterfaceName(iface), cookie: cookie});
		}
	}
}
AppGate.prototype.revokeAllLocalAPI = function() {
	if (BaseObject.is(this.$lapiHub,"LocalAPI")) {
		while (this.$registeredLocalAPI.length > 0) {
			var entry = this.$registeredLocalAPI.pop();
			this.$lapiHub.revokeAPI(entry.iface,entry.cookie);
		}
	}
}
AppGate.prototype.revokeLocalAPI = function(iface) {
	var entry,ifname = Class.getInterfaceName(iface);
	if (BaseObject.is(this.$lapiHub,"LocalAPI")) {
		for (var i = this.$registeredLocalAPI.length - 1; i >= 0; i--) {
			entry = this.$registeredLocalAPI[i];
			if (entry.iface == ifname) {
				this.$lapiHub.revokeAPI(entry.iface,entry.cookie);
				this.$registeredLocalAPI.splice(i,1);
			}
		}
	}
}

// Shell interface - similar to old query back
AppGate.prototype.runningInstance = function() {
	return this.$container.register(this.$wrap(IManagedInterface, this.$shell.getAppByClassName(this.$appClass.classType)));
}
AppGate.prototype.runningInstances = function() {
	return this.$container.register(this.$wrap(IManagedInterface,this.$shell.getAppsByClassNames(this.$appClass.classType)));
}
AppGate.prototype.bindAppByClassName = function(className) {
	var app = this.$shell.getAppByClassName(className);
	if (app != null) {
		return this.$container.register(this.$wrap(IManagedInterface, app));
	}
	return null;
}
AppGate.prototype.bindAppsByClassNames = function(className1, className2, className3) {
	var classNames = Array.createCopyOf(arguments,1);
	var apps = this.$shell.getAppsByFilter(function(app) {
		if (classNames.length > 0 && !classNames.Any(Predicates.TypeIs(app))) return false;
		if (BaseObject.is(app,iface)) return true;
		return false;
	});
	return this.$container.register(this.$wrap(IManagedInterface, apps));
}
AppGate.prototype.bindAppByInstanceId = function(instanceId) {
	var app = this.$shell.getAppByInstanceId(instanceId);
	if (BaseObject.is(app,"IAppBase")) {
		return this.$container.register(this.$wrap(IManagedInterface,app));
	}
	return null;
}
AppGate.prototype.bindAppByInstanceName = function(instanceName) {
	var apps = this.$shell.getAppsByInstanceName(instanceName);
	return this.$container.register(this.$wrap(IManagedInterface,apps));
}
AppGate.prototype.activateApp = function(appproxy) {
	var inst = DummyInterfaceProxyBuilder.Dereferece(appproxy);
	if (BaseObject.is(inst,"IApp")) {
		return this.$shell.activateApp(inst);
	}
	return false;
}

