/*
*/

function IServiceHub() {}
IServiceHub.Interface("IServiceHub","IRequestInterface");
/**
	GetService - gets the root interface of the svcname service.
	@svcname - the name of the service you want to obtain. The name is arbitrary and depends on the IServiceHub implementation. The individual services can be configured, registered, hardcoded etc.
				one needs to know the names in order to get hold of a service.
	@interfacename suport of interfacename is optional. The default behavior MUST be supported for interfacename set to null or undefined. By default if interfacename is not passed IService is returned.
					IService is the standard service control interface and should be the ideal solution for almost all the cases. This parameter is included as an open opportunity for optimized service hubs
					in some specific scenarios with high performance requirements. Such hubs can implement shortcuts to individual service interfaces this skiping the additional calls otherwise needed. See the overview for the overal concept.
	@optionalarguments all the input arguments after the 2-d are not supported by default, but like the interfacename can be supported by special optimized hub implementation. In such cases they are to be somehow passed to the service in a way that italics
						will be able to initialize and return concrete interface of the service and initialize it internally so that it would be ready to use. Example scenario: Imagine a service that deals with some "items". Normally you will get the IService
						abd then request one or more more speiffic interfaces. Some interfaces would work on individual items and will require calling methods of oneof theinterfaces with data that identifies that item in order to obtain that interface. Obviously there
						will be cases where this data is known in advance and if we pass it intrnally to the service it will be able to produce such specific interfaces bound to the item. HAving this prototype such implementation is possible if the opportunity exists. 
						
	Still, lets underscore this - the default behavior MUST be implemented by any hub, the optimized variants are just an option for strightforward optimization, but not a requirement.
	@returns {Operation} that supplies IService or another interface (if interfacename is supported). Synchronous implementation is NOT ALLOWED! On error the returned operation must supply the error information as a plain string
*/
IServiceHub.prototype.GetService = function(/*string*/ svcname,/*string, optional*/ interfacename /*optional arguments if supported*/) {
	var op = new Operation();
	op.CompleteOperation(false, "Not implemented");
	return op;
}
