
(function() {
	/**
	 * Defines the interface used by readers of the stream
	 */
	function IMessageReadStream() {
	}
	IMessageReadStream.Interface("IMessageReadStream");
	IMessageReadStream.prototype.get_hasincoming = function() {
		throw Class.notImplemented(this, "hasincoming");
	}
	IMessageReadStream.prototype.readMessage = function() {
		throw Class.notImplemented(this, "readMessage");
	}
	IMessageReadStream.prototype.incomingevent = new InitializeEvent("Fired when the stream receives new message(s) in the read queue");
	IMessageReadStream.prototype.OnIncoming = function() {
		throw Class.notImplemented(this,"OnIncoming");
	}.Description("Must be called internally when new message(s) enter the read queue, but before firint the incomingevent, which will not be fired if this method returns false.");
})();