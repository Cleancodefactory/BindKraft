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
		- Shell query
*/
function AppGate(shell, lapiclient, appClass) {
	BaseObject.apply(this, arguments);
	this.$shell = shell;
	this.$api = lapiclient;
	this.$appClass = appClass;
}
AppGate.Inherit(BaseObject, "AppGate");
// Proxy wrapper
AppGate.$arrayRelease = function() {
	if (BaseObject.is(this, "Array")) {
		for (var i = 0; i < this.length; i++) {
			if (BaseObject.is(this[i],"IManagedInterface")) {
				this[i].Release();
			}
		}
	}
}
/**
	Wraps a single reference with a proxy for the given interface
	@param iface {string|interfacedef}	The interface for which to generate a proxy
	@param p	 {BaseObject*}			A reference to the instance implementing the interface
	@returns 	 {LocalProxy}			The proxy. Must be released after use (call Release() in it)
*/
AppGate.prototype.wrap = function(iface, p) {
	if (BaseObject.is(p,"BaseObject")) {
		var v = DummyInterfaceProxyBuilder.Default().buildProxy(p, iface);
		if (this.LASTERROR().iserror()) {
			throw "Cannot wrap: " + this.LASTERROR().text();
		}
		return v;
	} else if (BaseObject.is(p, "Array")) {
		var arr = Array.createCopyOf(p);
		for (var i = 0; i < arr.length; i++) {
			if (BaseObject.is(arr[i],"BaseObject")) {
				arr[i] = this.wrap(iface,arr[i]);
			}
		}
		arr.Release = AppGate.$arrayRelease;
		return arr;
	}
	return p;
}


// Shell interface - similar to old query back
AppGate.prototype.runningInstance = function() {
	return this.wrap(IManagedInterface, this.$shell.getAppByClassName(this.$appClass.classType));
}
AppGate.prototype.runningInstances = function() {
	return this.wrap(IManagedInterface,this.$shell.getAppsByClassNames(this.$appClass.classType));
}