/*
	DO NOT USE FOR NOW See core: IServiceHub and IService.
	Later this interface can provide a shorter and faster way through them (or bypass them), but according to our updated plans it will be optional and not a core method for digging through available services provided
	by a daemon or app.

	Usage as factory of a daemon - supplies all the services provided by the daemon
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	alias - SHOULD NOT be null. We may decide to support services uniquelly identified by an interface, but this is debatable.
	alias -> service name
		iservice -> the interface we want from the alias service
		
	Usage (not implemented, debatable) as service injection
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	THIS IS NOT PRACTICED AS OF YET. SEE THE REMARKS LATER.
	
	in this case the service factory is obtained in some manner (could be as construction parameter/injection - does not really matter). Then the clent requests
	a service from the factory without alias and gets whatever is avalable for the service.
	
	Remarks: 
		It seems more practical to create another interface without the alias argument in the GetService (or analogous method if another name is used).
		This kind of usage is described here only to inform developers for the option and the fact that the interface is NOT CURRENTLY employeed this way.
		
	Usage patterns and requirements
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	The interface should be implemented to create real proxies
	
	

*/

function IServiceFactory() {}
IServiceFactory.Interface("IServiceFactory","IRequestInterface");
IServiceFactory.prototype.GetService = function(alias /* string can be null*/, iservice /* as string */, std_instance_parameters) /* returns Operation */ {
		throw "Not implemented";
}.Param("std_instance_parameters", "Standard parameters in textual or object form - the same as the data-class parameters")
	.Param("alias","A service can be more than a single interface or can be provided through different interfaces - so we need alias and interface to unique identify a service")
	.Returns("Operation");
	