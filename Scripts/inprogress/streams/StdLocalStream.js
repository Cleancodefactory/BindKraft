function StdLocalStream() {
	BaseObject.apply(this, arguments);
}
StdLocalStream.Inherit(BaseObject,"StdLocalStream");
StdLocalStream.Implement(IMessageReadStream);
StdLocalStream.Implement(IMessageReadStreamReceiver);
StdLocalStream.Implement(IMessageWriteStream);
StdLocalStream.Implement(IMessageWriteStreamSender);

StdLocalStream.ImplementProperty("async", new InitializeBooleanParameter("Mode of operation", false));

// IMessageReadStream
StdLocalStream.prototype.$inQueue = new InitializeArray("Incoming queue.");
StdLocalStream.prototype.get_hasincoming = function() {
	return (this.inQueue.length > 0);
}
StdLocalStream.prototype.readMessage = function() {
	if (this.inQueue.length > 0) {
		return this.inQueue.shift();
	}
	return null;
}
// StdLocalStream.prototype.incomingevent = new InitializeEvent("Fired when the stream receives new message(s) in the read queue");
StdLocalStream.prototype.OnIncoming = function() {
	// Nothing to do for now
};

// IMessageReadStreamReceiver
StdLocalStream.prototype.receiveMessage = function(msg) {
	this.inQueue.push(msg);
	this.receiveRespond(msg);
	this.callAsyncIf(this.get_async(), function() {
		if (this.OnIncoming() !== false) {
			this.incomingevent.invoke(this,msg);
		}
	});
}
//.Description("Must put the message in the queue, call the respond, call the OnIncoming and fire incomingevent if OnIncoming does not return === false.");
StdLocalStream.prototype.receiveRespond = function(msg) {
	// By default does nothing
};

// 
// IMessageWriteStream
StdLocalStream.prototype.$outQueue = new InitializeArray("Outgoing queue");
StdLocalStream.prototype.writeMessage = function(msg) {
	this.outQueue.push(msg);
}
StdLocalStream.prototype.get_hasoutgoing = function() {
	throw Class.notImplemented(this,"get_hasoutgoing");
}
StdLocalStream.prototype.get_canwrite = function() {
	throw Class.notImplemented(this,"get_canwrite");
}
StdLocalStream.prototype.OnOutgoing = function(msg) {
	throw Class.notImplemented(this,"OnOutgoing");
}.Description("Called before firing onoutgoingevent internally, prevents the event if false is returned");
StdLocalStream.prototype.onoutgoingevent = new InitializeEvent("Fired when a new message is written, but not yet sent");
StdLocalStream.prototype.ongoneevent = new InitializeEvent("Fired when one, all or some outgoing messages are sent. The implementation must fire this when get_canwrite becomes true, otherwise it up to the implementer to decide when to fire it after that point.");

// IMessageWriteStreamSender
StdLocalStream.prototype.sendMessage = function(msg) {
	throw Class.notImplemented(this, "sendMessage");
}.Description("Must be internally called with dequeued message to send it to the target.");
StdLocalStream.prototype.sendResponse = function(response, msg) {
	throw Class.notImplemented(this, "sendResponse");
}.Description("Direct responses (if any) of the target to this method and implement behavior effects if desired.")
	.Param("msg","Optional - the message for which");