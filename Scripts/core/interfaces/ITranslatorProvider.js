function ITranslatorProvider() {}
ITranslatorProvider.Interface("ITranslatorProvider");
/**
	Classes that need to influence the function of consumers of translations can implement this interface and
	respong to this method by supplying the requested translators
	
	@param iface {interface}	- the interface of the requested translator. The minimum interface required. Should never be just ITranslator
	@param hint  {string|any}	- optional. The requesters may supply a hint which is usually a string. See the remarks.
	
	@remarks The translators are distinguished by their interface, which inherits ITranslator directly or indirectly. So the interface can be 
			very specific or quite abstract depending on the requester's ability to deal with the result. The hint is usually not required unless
			the host (this object) is using multiple translation consumers.
	
*/
ITranslatorProvider.prototype.GetTranslator = function(iface, hint) { throw "not impl"; } 