(function() {
function IMessageWriteStream() {}
IMessageWriteStream.Interface("IMessageWriteStream");
IMessageWriteStream.prototype.writeMessage = function(msg) {
	throw Class.notImplemented(this,"writeMessage");
}
IMessageWriteStream.prototype.get_hasoutgoing = function() {
	throw Class.notImplemented(this,"get_hasoutgoing");
}
IMessageWriteStream.prototype.get_canwrite = function() {
	throw Class.notImplemented(this,"get_canwrite");
}
IMessageWriteStream.prototype.OnOutgoing = function(msg) {
	throw Class.notImplemented(this,"OnOutgoing");
}.Description("Called before firing onoutgoingevent internally, prevents the event if false is returned");
IMessageWriteStream.prototype.onoutgoingevent = new InitializeEvent("Fired when a new message is written, but not yet sent");
IMessageWriteStream.prototype.ongoneevent = new InitializeEvent("Fired when one, all or some outgoing messages are sent. The implementation must fire this when get_canwrite becomes true, otherwise it up to the implementer to decide when to fire it after that point.");
})();