/*
	Streams usually have one side and the other is a question of internal implementation. Here we suggest something else -
	an interface for actual implementation:
	
	The methods needed for the work with the actual source are not part of the interface except for standard methods required to queue a received message and call the appropriate methods
	and a method that sends response to the source (if neccessary, by default nothing is done). The receiveRespond can be also called from the code implementing the IMessageReadStream if queue
	limitations are supported and the corresponding dialog with the source. Not all cases will allow the same method to be called from the IMessageReadStream side, but in order to make this possible
	in more cases we recomend following this pattern:
	- on receive call the receiveRespond with the received message as arguments
	- when calling from anywhere else call with true or false to enable/disable the source.
	Obviously enable/disable is a very specific action, that depends on the source. If this is not enough - well do it as necessary - the recomendation is here only to help, it is not a requirement.
	

*/

function IMessageReadStreamReceiver() {}
IMessageReadStreamReceiver.Interface("IMessageReadStreamReceiver");
IMessageReadStreamReceiver.prototype.receiveMessage = function(msg) {
	throw Class.notImplemented(this, "receiveMessage");
}.Description("Must put the message in the queue, call the respond, call the OnIncoming and fire incomingevent if OnIncoming does not return === false.");
IMessageReadStreamReceiver.prototype.receiveRespond = function(msg) {
	// By default does nothing
}.Description("Should be implemented if there is a need for response after receiving a message. Depending on limitations and nature this can tell the other side to wait before sneding more messages.");