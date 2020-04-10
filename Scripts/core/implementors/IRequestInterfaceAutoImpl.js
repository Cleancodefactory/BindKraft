// NOT READY

/*INTERFACE*/ /*IMPL*/
function IRequestInterfaceAutoImpl() { }
IRequestInterfaceAutoImpl.InterfaceImpl(IRequestInterface, "IRequestInterfaceAutoImpl");
IRequestInterfaceAutoImpl.classInitialize = function(cls) {
	// var requestable = Class.is(cls,"IRequestInterface"); // We have to implement this
	// This query below makes it necessary to put this last or re-apply the implementer in derived class again
	// var requestables = Class.supportedInterfaces(cls, null, "IRequestInterface");
	cls.prototype.requestInterface = function(iface, proxybuilder /*ignored*/) {
		var pb = proxybuilder || DummyInterfaceProxyBuilder.Default();
		if (BaseObject.is(pb, "IProxyInterfaceBuilder") && Class.isrequestable(iface) && BaseObject.is(this, iface)) {
			return pb.buildProxy(this, Class.getInterfaceDef(iface));
		} else {
			return null; // This is an error, can be logged.
		}
	}
	cls.prototype.Relieve = function() {
		// Has no purpose on the original instance.
	}
};