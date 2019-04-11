/**
	We did not come up with good terms for the service oriented architectures in BindKraft, so have in mind that the word "service" is used in two similar, but different contexts and means slightly different things:
	
	1) lightweight technique - considers a service a code inside a running application (usually, but not explicitly) that can be used through a single interface. Such services are identified by their interface 
	and at most one service implementing the corresponding interface may be obtainable from arbitrary points in the application. This can cross application boundaries, but it is basically a technique for code organization in single 
	project or in projects very cosely integrated by design. The pros are the ease of use and exposition, similarity to traditional "find service" practicies and open options for custom extensions.
	2) heavy service - such a service is considered to be more complex, its functionalities represented through multiple types of interfaces, often providing a functionality that can process data given by its client independently - outside of the
	context of the client. Its usage looks like giving jobs to external application/daemon and so forth. These are usually represented by a root interface IService and all the other interfaces are obtained either through
	another of them when methods are called or directly from IService if they do not depend on context produced as a result of another part of their functionality. An informative example would be some kind of CRUD
	functionality represented as separate interfaces for each operation. In such a scenario the iservice can provide you with an interface for single item management to which you will provide the item either directly or through result from call to another interface.

*/
function IService() {}
IService.Interface("IService","IRequestInterface");
// RequestInterface provides the raw and uninitialized interface implementations.
// The specific interfaces can have methods that provide yet other interfaces by returning initialized interface implementations.
// See also IServiceHub