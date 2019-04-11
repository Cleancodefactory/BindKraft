
/*
	Base interface for transport encapsulation.
	The Transports are ways to perform RPC like communication over different kinds of medias
	Unlike some other environments in BindKraft the transport can be quite complex, mulitple transports
	may be needed in oder a client to reach a server.
	
	Additionally there are other trnasport related protocols (more info later, or check "foreign communication").
*/

/*CLASS*/
function IForeignTransportTransmitter() {}
IForeignTransportTransmitter.Interface("IForeignTransportTransmitter");
IForeignTransportTransmitter.prototype.CallRemote = function(foreignOperation) { }
