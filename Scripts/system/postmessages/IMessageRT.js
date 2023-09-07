(function(){

    /**
     * IMessageRT (Receiver/Transmitter) interface defines basics for implementations of receivers/transmitters for BufferStream.
     * They are usually not created directly, but by some managing (messenger) object that listens/creates the connection.
     * RT classes are usually not usable with different messengers and they actually are implied by the messenger - created by
     * the messenger when the corresponding connection is established
     */
    function IMessageRT(){}
    IMessageRT.Interface("IMessageRT");
    IMessageRT.RequiredTypes("IBuffReceiver","IBuffTransmitter");
    /**
     * Method to call after creating the RT - like constructor, called by the messenger.
     * 
     * @param {} messenger 
     * @param {*} bread 
     * @param {*} bweite 
     */
    IMessageRT.prototype.init = function(messenger, bread, bweite) {throw "not implemented";}
    /**
     * Inspects the message - depending on the scenarion it can be the connection message or each message
     * @param {PostMessage} emessage 
     */
    IMessageRT.prototype.onMessage = function (emessage) {
        throw "not implemented"
    }
})();