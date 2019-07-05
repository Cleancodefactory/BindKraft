/**
	Implemented by classes that encapsulate a reference to an origin (only one is assumed). It is implemented,
	for example, by local proxies, but can be meaningful in some other cases.
	
	To have a clear meaning the IDereference should be implemented only by classes that have at least 
	proxy/link-like	purpose. If they can chain one after another the Dereference method is supposed to go
	down until it reaches an object/value that:
		Case1: does not support the IDereference
		Case2: are not of the same type as this one
		
	The kind of implementation must be documented for the classes that implement IDereference.
*/
function IDereference() {}
IDereference.Interface("IDereference");
IDereference.prototype.Dereference = function() { throw "not implemented"; }