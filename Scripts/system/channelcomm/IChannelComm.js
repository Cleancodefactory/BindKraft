function IChannelComm() {}
IChannelComm.Interface("IChannelComm");

/** 
 * Posts/Sends a message to the other side (whatever the other side is).
 * The message can basically consist of any basic types, object and array. As a rule
 * it can be assumed that if it is convertible to JSON it is ok. Some channels may 
 * support more than that, but using that their capability is discouraged.
 * The serialization is usually performed by the underlying medium, but channels
 * for specific media would do it, especially if the underlying media requires it.
 * 
 * @param message {basics} Message to send. 
 */
IChannelComm.prototype.send = function(message) { throw "not impl"; }
/**
 * Receives a message, returns an Operation with optional timeout.
 */
IChannelComm.prototype.receive = function(timeout) { throw "not impl"; } // returns Operation.
// Alternatives to receive - events are not included in this interface!

