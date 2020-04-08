function IChannelCommEvents() {}
IChannelCommEvents.Interface("IChannelCommEvents");
IChannelCommEvents.prototype.messageevent = new InitializeEvent("Fired when message is received handler(sender, message)");
IChannelCommEvents.prototype.errorevent = new InitializeEvent("Fired when message is received handler(sender, error)");