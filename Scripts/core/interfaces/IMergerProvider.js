/**
	IoC on granular level. Implement this in a class that plays the role of a "host" to the objects that need mergers. 
	Those usually implement IoC functionality by asking hteir host to supply merger for a specific interface that extends IMergerProvider
	directly or indirectly.
*/
function IMergerProvider() {}
IMergerProvider.Interface("IMergerProvider");
/**
	@iface {interface} 	the interface identigying the desired merge operation.
	@hint  {string|any}	optional hint sent by the consumer of mergers. This is intended to help the "host"
						to identify the specific purpose for which the merger is needed if the "host" created
						multiple merger consumers. While optional, it is strongly recommended to use hints.
						
	@returns {IMerger}	an instance that supports the interface specified in iface argument or null if the host cannot
						return such an instance.
						
	@remarks	How to determine the hint? This is usually much easier than it looks - the requester can specify the
				value that best describes the specific data it deals with. For example:
				- a connector can specify its address
				- a custom class can specify the property path to the data it deals with
				This is helped by the fact that the host actually creates and sets up the consumers of IMerger and ITranslator
				and in doing that it has knowledge about their function and what kind of data they deal with. So, it is usually
				relatively easy to know what to expect as a hint.
				
				On the other hand following the OOP principles the usual way should make a rarity cases where many consumers of 
				mergers and translators exist for the same host.
		
*/
IMergerProvider.prototype.GetMerger = function(iface, hint) {throw "not impl";}
