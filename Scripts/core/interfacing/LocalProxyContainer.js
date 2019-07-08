/*
	This class is a container for local proxies. It is used by AppGate to manage the proxies requested by an application, but
	can be used in other cases as well. It might not be the most convenient tool when used directly, but embedded in someting 
	like in the AppGate case it provides a convenient safety net for forgotten proxies and their underlying references.
	
	Usage: Create and keep instance of the CONTAINER for the length of the life cycle through which you want to secure leaking refs
	
		Pass each obtained reference, array of references, plain object with referenes to the CONTAINER. Prefer registerByTarget and take back the patched result.
		
		-> rgisterByTarget will release duplicate proxies and replace them with the already registered ones.
		
		When the proxy ref is no longer needed - call CONTAINER.release(proxy) on it.
		
	The life cycle should be managed as whole, the need of any given proxy considered for the whole cyclle and everything involved in it.
	
	AppGate is one such case provided by BK. It considers as life cycle the life of an application from initialization to its shutdown.
*/
function LocalProxyContainer(recursionLevel) {
	BaseObject.apply(this,arguments);
	this.$maxRecursion = recursionLevel || 10;
}
LocalProxyContainer.Inherit(BaseObject,"LocalProxyContainer");
LocalProxyContainer.Implement(IManagedInterfaceContainer);
LocalProxyContainer.prototype.obliterate = function() {
	if (!this.__obliterated) {
		this.releaseAll();
	}
	BaseObject.prototype.obliterate.call(this);
}
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

// +IManagedInterfaceContainer
LocalProxyContainer.prototype.register = function(proxy) {
	return this.registerByTarget(proxy);
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
							this.$proxies[k][kk].Release(true);
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
	var i;
	if (BaseObject.is(prxy, "$Managed_BaseProxy")) {
		var proxyClassName = prxy.classType();
		var proxyClassBranch = this.$proxies[proxyClassName];
		if (proxyClassBranch != null) {
			if (BaseObject.is(proxyClassBranch[prxy.$__instanceId], "$Managed_BaseProxy")) {
				proxyClassBranch[prxy.$__instanceId].Release(true);
				delete proxyClassBranch[prxy.$__instanceId];
				return;
			}
		}
		prxy.Release(); // If it is not in the container, release it anyway
	} else if (BaseObject.is(prxy, "Array")) {
		for (i = 0; i < prxy.length;i++) {
			this.release(prxy[i]);
		}
	} else if (BaseObject.is(prxy, "object")) {
		for (i in prxy) {
			if (prxy.hasOwnProperty(i)) {
				this.release(prxy[i]);
			}
		}
	}
}
// -IManagedInterfaceContainer

/**
	Registers a proxy non-conditionally
*/
LocalProxyContainer.prototype.registerProxy = function(prxy) {
	if (BaseObject.is(prxy, "$Managed_BaseProxy")) {
		var proxyClassName = prxy.classType();
		var proxyClassBranch = this.$proxies[proxyClassName];
		if (proxyClassBranch == null) {
			proxyClassBranch = this.$proxies[proxyClassName] = {};
		}
		proxyClassBranch[prxy.$__instanceId] = prxy;
		prxy.$container = this;
		return prxy;
	}
	return null;
}
/**
	Checks if there is a proxy of the same type pointing to the same target ($instance) and returns it,
	if none already exists retains the passed proxy. When the proxy already exists the passed is assumed redundant
	and is released. The target is resolved fully by dereferencing the proxy chain (if that is the case).
	The proxy must not be used before the registration.
	
	@param   prxy	{
				$Managed_BaseProxy - single proxy reference
				Array containing some proxies - they are recorded or replaced with the already recorded ones and the others released
				plain object with some proxies in some fields -
	}
	
	@remark	The method is recursive and if you pass object or array it will traverse their elements accordingly down to the max 
			recursion depth (default is 10, can be adjusted through the constructor).
	
	@returns {proxy}  The proxy to really use or null if the parameter cannot be processed. When object/Array is passed their original refs are returned
						So, when used over a single proxy, return result of null can be treated as error, otherwise (especially in recursive scenarios)
						the return result can be treated as non-null -> replace the original, null - do nothing.
	
	
*/
LocalProxyContainer.prototype.registerByTarget = function(prxy,_level) {
	var level = _level || 1;
	if (level > this.$maxRecursion) return null;
	var i, p;
	if (BaseObject.is(prxy, "$Managed_BaseProxy")) {
		var target = DummyInterfaceProxyBuilder.Dereferece(prxy); // Get the non-proxy target
		// Inspect all the proxies of the same kind for their targets
		var proxyClassName = prxy.classType();
		var proxyClassBranch = this.$proxies[proxyClassName];
		if (proxyClassBranch == null) {
			// No other proxies like this one exist - register it and return
			proxyClassBranch = this.$proxies[proxyClassName] = {};
			proxyClassBranch[prxy.$__instanceId] = prxy;
			prxy.$container = this;
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
	} else if (BaseObject.is(prxy, "Array")) {
		for (i = 0; i < prxy.length;i++) {
			p = this.registerByTarget(prxy[i], level + 1);
			if (p != null) prxy[i] = p;
		}
		return prxy
	} else if (prxy != null && BaseObject.is(prxy, "object")) {
		for (i in prxy) {
			if (prxy.hasOwnProperty(i)) {
				p = this.registerByTarget(prxy[i], level + 1);
				if (p != null) {
					prxy[i] = p;
				}
			}
		}
		return prxy;
	}
	return null;
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
								this.$proxies[k][kk].Release(true);
								delete this.$proxies[k][kk];
							}
						}
					}
				}
			}
		}
	}
}