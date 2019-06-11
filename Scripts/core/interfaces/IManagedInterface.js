/**
	This is a base interface required for locally proxable interfaces (colloquially: local stubbing). (After version 2.18).
	Locally proxable - usable only in the local workspace without remoting.
	It is mostly mutually exclusive with IRequestInterface, but member names are kept separate to allow both requirements to be met by the same class.
	
	The Release method is not to be implemented by any class, it is implemented only by proxies generated by default by the system.
	Custom proxy builders and proxies are supported at a low level, but it is unlikely that such will be ever needed. Thus the proxy generation
	is kept rather closed.
	
	The Release method enables the proxies to be released when no longer needed, which enables them to tear off any connections to IEventDispatcher memebers
	of the interface they are proxy for. Further mechanics like this one may be introduced in future following the same principles.
	
*/
function IManagedInterface() {}
IManagedInterface.Interface("IManagedInterface");

IManagedInterface.prototype.GetInterface = function(iface) { throw "not implemented"; }
IManagedInterface.prototype.Release = function() { };
