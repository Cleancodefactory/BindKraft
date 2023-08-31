
(function() {
	/**
	 * Defines the interface used by readers of the stream. Implementations can work with anything - from fake streams, to message port, to window.postmessage/onmessage
	 * and so on. Obviously from the interface the implementations must provide queuing/buffering if the underlying nature og the stream has none, or if it is not 
	 * capable of supporting the interface's requirements.
	 */
	function IMessageReadStream() {
	}
	IMessageReadStream.Interface("IMessageReadStream");
	/**
	 * Returns boolean indicating if there is anything to read from the stream
	 */
	IMessageReadStream.prototype.get_hasincoming = function() {
		throw Class.notImplemented(this, "hasincoming");
	}
	/** Reads the next message from the queue/buffer if available,, or returns null if not.
	 * This method is synchronous and must return something if there is nothing to read, so streams that can include null messages must be read by using get_hasincoming
	 * before the call. See also the IMessageReadStreamAsync for options to implement this asynchronously
	 */
	IMessageReadStream.prototype.readMessage = function() {
		throw Class.notImplemented(this, "readMessage");
	}
	IMessageReadStream.prototype.incomingevent = new InitializeEvent("Fired when the stream receives new message(s) in the read queue");
	IMessageReadStream.prototype.OnIncoming = function() {
		throw Class.notImplemented(this,"OnIncoming");
	}.Description("Must be called internally when new message(s) enter the read queue, but before firing the incomingevent, which will not be fired if this method returns false.");
	/** Returns the receiver 
	 * - implementation of the IMessageReadStreamReceiver interface 
	 * Implementation can be based on bubble interface or custom one - the received messages must be pushed in the read queue.
	 */
	IMessageReadStream.get_receiver = function() { throw "not implemented";}
})();