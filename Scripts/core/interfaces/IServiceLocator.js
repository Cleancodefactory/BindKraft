/*
	NOT FOR REMOTING

	This interface define semantics for handy service location on a single target - i.e. target asked directly for services under its care.
	
	The implementor MUST NOT implement cascading to other IServiceLocator interfaces! Any cascading is and SHOULD be implemented externaly 
	(for this feature). Examples: 
		- Strctural queries cascade by their own logic and FindServiceQuery asks the IServiceLocator-s it "meets"
			one by one. 
		- A service located by calling a locator can be later asked (if it has its own IServiceLocator implementation) for another service. 
			Behind the scenes this may be hiding a number of cases - e.g the service can be the same object that is the locator or not, then 
			both cases will lead to obtaining very different service the second time and this enabling following the request logic. More about the
			philosophy of this behavior cna be found in the docs.
		
	The IServiceLocator is for local and direct usage only and MUST NOT return proxies or if it does it is for isolation and NEVER for REMOTING. When 
	proxies are returned and the implementation intends they to be service locators in turn the interfaces for these services have to EXTEND the
	IServiceLocator in turn to make it indistingushable from returning objects themselves. The same techniques CAN BE USED if it is desired the request 
	for one interface to locate a multi-service implementation.
*/
function IServiceLocator() {}
IServiceLocator.Interface("IServiceLocator");
IServiceLocator.prototype.locateService = function(iface, reason) { throw "not implemented";}