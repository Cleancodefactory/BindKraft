(function(){
    /**
     * Interface implemented by the transmitter, it is set to the IBuffUnload to obtain object for transmission
     */
    function IBuffTransmitter() {}
    IBuffTransmitter.Interface("IBuffTransmitter");
    /**
     * Gets reference to the buffer unloader of the write stream
     * @param {IBuffLoader} loader 
     */
    IBuffReceiver.prototype.set_unloader = function(loader) {
        throw "Not implemented";
    }
    IBuffReceiver.prototype.get_unloader = function() {
        throw "Not implemented";
    }
    /**
     * Tells the transmitter that there is data to be transferred, it should call IBuffUnload to obtain object(s) for transmission
     * @param {Integer | null} nobjects - optionally the approximate number of objects waiting for transmission, null if not provided
     * 
     * Transmitters can ignore nobjects or use it to optimize their work if possible.
     */
    IBuffTransmitter.prototype.RequestTransmit = function(nobjects){}; 
    /**
     * Called when the buffered stream is closing to allow the transmitter to close connection or other means it is using. Can be called more than once. It should
     * clear the reference to the unloader.
     */
    IBuffTransmitter.prototype.ClosingStream = function(){};
    
})();