/*
	This class is a container for local proxies. It is used by AppGate to manage the proxies requested by an application, but
	can be used in other cases as well.
*/
function LocalProxyContainer() {
	BaseObject.apply(this,arguments);
}
LocalProxyContainer.Inherit(BaseObject,"LocalProxyContainer");

/*
	Structure
	{
		proxyclassN: {
			proxy_instanceId: ref
			proxy_instanceId: ref
			....
		}
	}
*/
LocalProxyContainer.prototype.$proxies = new InitializeObject("Proxies register");

// +Internal API
//LocalProxyContainer.prototype.$get
// -Internal API

/**
	Registers a proxy non-conditionally
*/
LocalProxyContainer.prototype.register = function(prxy) {
	if (BaseObject.is(prxy, "$Managed_BaseProxy")) {
		var proxyClassName = prxy.classType();
		var proxyClassBranch = this.$proxies[proxyClassName];
		if (proxyClassBranch == null) {
			proxyClassBranch = this.$proxies[proxyClassName] = {};
		}
		proxyClassBranch[prxy.$__instanceId] = prxy;
		return prxy;
	}
	return null;
}
/**
	Checks if there is a proxy of the same type pointing to the same target ($instance) and returns it,
	if none already exists retains the passed proxy. When the proxy already exists the passed is assumed redundant
	and is released. The target is resolved fully by dereferencing the proxy chain (if that is the case).
	The proxy must not be used before the registration.
	
	@returns {proxy}  The proxy to really use
	
	
*/
LocalProxyContainer.prototype.registerByTarget = function(prxy) {
	if (BaseObject.is(prxy, "$Managed_BaseProxy")) {
		var target = DummyInterfaceProxyBuilder.Dereferece(prxy); // Get the non-proxy target
		// Inspect all the proxies of the same kind for their targets
		var proxyClassName = prxy.classType();
		var proxyClassBranch = this.$proxies[proxyClassName];
		if (proxyClassBranch == null) {
			// No other proxies like this one exist - register it and return
			proxyClassBranch = this.$proxies[proxyClassName] = {};
			proxyClassBranch[prxy.$__instanceId] = prxy;
			return prxy;
		}
		for (var k in proxyClassBranch) {
			if (proxyClassBranch.hasOwnProperty(k)) { // Prevent unwanted protos
				var _target = DummyInterfaceProxyBuilder.Dereferece(proxyClassBranch[k]);
				if (target == _target) {
					prxy.Release();
					return proxyClassBranch[k];
				}
			}
		}
		// None of the existing proxies points to the same target - register the new one and return it.
		proxyClassBranch[prxy.$__instanceId] = prxy;
		return prxy;
	}
	return null;
}


/**
	Releases all the proxies registered with the container
	@param 	prxy_or_prxyclass	{$Managed_BaseProxy|string} OPTIONAL. If present releases only the proxies of that kind
*/
LocalProxyContainer.prototype.releaseAll = function(prxy_or_prxyclass) {
	var k,kk;
	if (prxy_or_prxyclass == null) {
		// Obliterate everything
		for (k in this.$proxies) {
			if (this.$proxies.hasOwnProperty(k)) {
				for (kk in this.$proxies[k]) {
					if (this.$proxies[k].hasOwnProperty(kk)) {
						if (BaseObject.is(this.$proxies[k][kk], "IManagedInterface")) {
							this.$proxies[k][kk].Release();
						}
						delete this.$proxies[k][kk];
					}
				}
				delete this.$proxies[k];
			}
		}
	} else {
		// Release only the branch in question
		var prxyclass = Class.getClassName(prxy_or_prxyclass);
		var proxyClassBranch = this.$proxies[prxyclass];
		if (proxyClassBranch != null) {
			for (k in proxyClassBranch) {
				if (proxyClassBranch.hasOwnProperty(k)) { // Prevent unwanted protos
					if (BaseObject.is(proxyClassBranch[k], "IManagedInterface")) {
						proxyClassBranch[k].Release();
					}
				}
			}
			delete this.$proxies[prxyclass]; // Remove the whole branch
		}
	}
}
/**
	Release a specific proxy
*/
LocalProxyContainer.prototype.release = function(prxy) {
	if (BaseObject.is(prxy, "$Managed_BaseProxy")) {
		var proxyClassName = prxy.classType();
		var proxyClassBranch = this.$proxies[proxyClassName];
		if (proxyClassBranch != null) {
			if (BaseObject.is(proxyClassBranch[prxy.$__instanceId], "$Managed_BaseProxy")) {
				proxyClassBranch[prxy.$__instanceId].Release();
				delete proxyClassBranch[prxy.$__instanceId];
			}
		}
	}
}
/**
	Removes all proxies pointing to a specific target. This is relatively slow, but it is not likely
	to be called in any intensive segment of code.
	Currently this will release proxies to the same target, but not the proxies obtained from the same initial target.
	Further options will be introduced for better control.

	@param target_proxy {ref}  A reference to the target or a proxy leading to it.
*/
LocalProxyContainer.prototype.releaseTarget = function(target_proxy) {
	var target = DummyInterfaceProxyBuilder.Dereferece(target_proxy);
	if (BaseObject.is(target, "BaseObject")) {
		var k,kk, _target;
		for (k in this.$proxies) {
			if (this.$proxies.hasOwnProperty(k)) {
				for (kk in this.$proxies[k]) {
					if (this.$proxies[k].hasOwnProperty(kk)) {
						if (BaseObject.is(this.$proxies[k][kk], "IManagedInterface")) {
							//
							_target = DummyInterfaceProxyBuilder.Dereferece(this.$proxies[k][kk])
							if (_target == target) {
								this.$proxies[k][kk].Release();
								delete this.$proxies[k][kk];
							}
						}
					}
				}
			}
		}
		
	}
}