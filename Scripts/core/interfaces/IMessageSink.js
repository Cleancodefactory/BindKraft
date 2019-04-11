


/*INTERFACE*/
// Message sink - objects that declare themselves as receptors of messages of Messenger
function IMessageSink() { };
IMessageSink.Interface("IMessageSink");
IMessageSink.prototype.HandleMessage = function (message) {
    return false;
    // Override this in the implementing class, if you are subscribed to many message types check the type of the message.
    // See Messenger for more info
};