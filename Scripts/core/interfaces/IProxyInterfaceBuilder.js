/*
	Proxy building interface.
	
	Many of the considerations apply also to the StubBuilders (just keep in mind they wrap an interface and do not know the class of the implementation ...)
	
	The transport is a separate concern and these interfaces and their basic implementations are too low level to link their nature to a specific 
	architecture and ways to deal with the transport. The transport is setup and otherwise configured and manipulated separately - buildProxy only
	attaches proxy the transport.
	
	Initially we considered buildProxy as initiator of the transport, but this will force it to become async and complicate its usage unnecessarily.
	
*/

/*INTERFACE*/
function IProxyInterfaceBuilder() {}
IProxyInterfaceBuilder.Interface("IProxyInterfaceBuilder");
// Sync
IProxyInterfaceBuilder.prototype.buildProxy = function(instance, interfaceDef) {
	throw "Not implemented.";
}.Description("Creates a proxy in some manner and returns reference to the proxy when done. The transport has to be supplied to the builder separately and before calling buildProxy.");