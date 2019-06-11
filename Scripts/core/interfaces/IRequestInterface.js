/* IRequestInterface

	This interface provides isolated abstract object usage pattern - the client once confirming the IRequestInterface
	is supported requests specific interface(s) and interacts only through its/their members with the instance.
	It can be compared with IUnknown in COM and XPCOM, but lacks reference counting, because the javascript garbage 
	collection takes care for the life cycle.
	
	In the framework we have two approaches to usage of the concept of interfaces - one similar to the one found in languages like
	C# and Java and another similar to the way COM or XPCOM (Mozilla) make use of them (derivative of their meanining and usage n RPC).
	In Java and C# it is possible to use interfaces in the COM way, for instance, but it is rare and unusual approach and the normal way
	is to assign type definitions to types and then make sure they can be CASTED to those definitions and be sure they are implemented.
	The COM/XPCOM/RPC approach is different - a special action performed by the instance is required in order to obtain pointer/reference to
	the interface. Unlike C#/Java this guarantees only one thing - that the obtained reference/poiner can be operated as the interface requested,
	but there are no assumptions or even officially supported mechanisms to "cast" this to something else (another interface for instance) you
	know is implemented by the instance in question. Said with other words - casting approach is external operation over the instance - feature 
	implemented by the platform and not implemented in various specific ways by the different instances, requesting	interace unlike casting is
	operation performed by the instance in a way you know nothing about.
	
	In reality a requested interface can, for example, return a proxy object controlling the original implementing only the requested interface and 
	the usages of this technique are quite wide.
	
	In the framework we actually support both approaches, letting the developer work mostly in the easier C#/Java manner and implement and use requestable 
	interfaces mechanisms only for cases where the communication betweeb objects has to be detached, oblivious for the other details of the instance or if it is
	really reachable localy. Remote communications, for example, need this abstraction, because it naturally limits the autoimplementations of proxies and stubs 
	to explicitly specified interfaces, making their implementation easier and in some occassions even possible at all. Obviously proxying everything an object
	of a given class looks possible, but when one notices the fact that many interfaces/members of the class actually depend (indirectly or directly) onLine
	assumptions that they directly access the instance, it becomes difficult if not impossible to route them through some abstract transport between objects 
	living in different javascript engine instances/contexts (an illustratiuve and complicated example will be communication between two browsers on different 
	machines). When we consider the fact that such operations will actually include in some form direct memory management elements in a foreign engine/context
	the need of a separatable interface implementation and special care for interfaces that are by design remotable, becomes obvious.
	
	IMPLEMENTATION:
	Any requestable interface must extend IRequestInterface which makes it requestable. A requestable interface may or may not be also a normal (checked with is or supports)
	interface - this is entirely up to the developer. However any requestable interface mus be castable to IRequestInterface (must support it as part of itself
	and the RequestInterface implementation must call the original object. This call may pass through a proxy or even series of proxies in complex scenarios - each
	method calling the same method of the instanc from which the particular proxy is derived/proxied - consistency implements the requirement without further considerations.
	
	The IRequestInterface itself must be implemented in classes as both normal and requestable interface (well, class becomes requestable implicitly)
	
	Check for available implementers that can save you some troubles.

	Relieving the server
	====================
	
	Unlike COM we do not have to be that strict about reference counting - here we do not need it for memory management. Relieve is named differently for that reason exaclty.
	
	Typically the client requests an interface and then uses it until it no longer needs it. The client usually has another reference to the server as well and there is no
	need to manage details, the worst that will happen is that the underlying object can go into unusable state and further calls fail.
	
	Assume the requested interface is returned through some teared off object (lets call it proxy). They will all keep each other in memory until needed or until one of the 
	sides decides to shutdown. After that point calls may fall or continue to work if the objects implementing the interface and the actions it perfomrms keep each other alive.
	This last bit is a problem even in COM - keeping thigs in memory is not enough in some cases - they are part of something big that either works or does not, having parts 
	still in memory would not force it to keep itself in working condition. This is exactly an assumption in COM which cannot be really enforced that easilly. So we count on the
	garbage collector for this (obliteration just forces garbage collection by breaking as many links as possible). So, why we have this at all then?
	
	Releave is designed for handling by proxies and not the objects themselves! This means that it is important in Foreign communications, can be used in direct ones, but is not
	absolutely required and if proxies are involved in the direct cases it is certainly not some standard - they will most often be just teared of objects making implementation of
	certain interface easier or more convenient. So reaction to Relieve will be optional. It is a good idea to call it in the end of what makes up a session, but it is not the end of the world
	if you forget.
	
	In foreign communication a stub created for the client is viewed as playing the role similar to a socket and not a COM interface instance! So, what Relieve does is more
	like closing a socket and quite different from decreasing a reference count. Usage pattern in foreign communication will be:
	
		<lookup the server you need>
		<request an interface to be wired from you to the server> *
		<call the interface one or more times and receive response(s) each time>
		<inform the system that maintains the connection that you no longer need it>
	
	* - wiring the connection is done by the foreign communication API and may be constructed in different manners on the server side -
		- launching new server (App) for each cient
		- launching one, but creating separate proxy for each client.
		- launching the server app but starting a service instance inside it for each client.
		
	The client usually needs to know how the server works, but not because it needs to manage its life, but in order to be able to know what to expect as "session",
	single response to a call or mulitple responses for each call etc. In any case it can use the interface for long period of time and having an explicit way to inform the system
	that it no longer needs it is crtical and that is the purpose of Relieve.
	
	The RequestInterface method
	~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	This method accepts the interface definition or name and optionally (required in many foreign communication cases) accepts a proxy builder. The builder is an instance suporting IProxyInterfaceBuilder
	which contains the contract that enables an interface with clear definition and extendinf IRequestInterface to be packed in an object that transaltes the calls into something that directly or indirectly
	calls the original instance being queried. The simplest case will be a simple instance that repeats the calls to the original with the only purpose to prevnet the user from accessing anything that is not 
	declared on the interface. More complex example will be a proxy tied to a commmunication channel with another on remote machine.

	RequestInterface can return both an Operation or the intreface synchronously. If unification is desired use Operation.From to deal always with operations.
	
	TODO: Consider the need of asynchronous version of RequestInterface. Remoting related interfaces need time to initialize stubs and proxies and often will not be functional when otained synchronously
			On the other hand such interfaces will have all-async methods and will be able to invoke creation of everything needed during the first call, slowing down that call (or any call depending on the communication implementation).
			Is this the right place to wait for full initialization? Current view: Yes, this naturally fits every scenario, making a call slowere in a place where the client naturally waits for the method to complete. Such implementation
			will successfully hide the nature almost any kind of communition and will not use resources for interfaces that remain unused (even if they were requested) - for logical or other reasons.
*/
/*INTERFACE*/
function IRequestInterface() {}
IRequestInterface.Interface("IRequestInterface");
IRequestInterface.prototype.RequestInterface = function(/*string|interfacedef*/iface, /* optional*/ proxybuilder, /*all parameters after that */ reserved) {
	throw "Not implemented";
}.Description("This interface provides isolated abstract object usage pattern - the client once confirming the IRequestInterface " + 
	"is supported requests specific interface(s) and interacts only through its/their members with the instance." + 
	" It can be compared with IUnknown in COM and XPCOM, but lacks reference counting, because the javascript garbage collection takes care for the life cycle. Read more in the comments in the core/interfaces/IRequestInterface.js;");
IRequestInterface.prototype.Relieve = function() {
}.Description("Release the other side when you no longer need it. See the usage patterns info.");

