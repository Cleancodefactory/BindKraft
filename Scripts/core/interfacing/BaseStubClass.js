/*
	The stubs are used only with remoting and not with local stubbing.

	Stub is created on the requester's side to impersonate the actual object.
	The stub communicates with some adapter of a transport which reaches the proxy -
	which sits on the other side (at the requestee's side) and translates the incoming calls to
	calls to the actual object.
	
	The argument ifacedef may be unneeded and removed later.
*/

function $Requestable_BaseStub(ifacedef,transport) {
	BaseObject.apply(this, arguments);
	this.$transport = transport;
	// TODO: Stub has to register to the transport as both sender and receiver
}
$Requestable_BaseStub.Description("the transport is connected by other code - the stub (and the proxy actually) just call it without checking anything.");
$Requestable_BaseStub.Inherit(BaseObject, "$Requestable_BaseStub");
