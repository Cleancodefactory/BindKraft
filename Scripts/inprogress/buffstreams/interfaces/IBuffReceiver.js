(function () {
    /**
     * The receiver (like the transmitter) can listen to events emitted by the loader, but it can do by receiving calls to
     * its RequestData and ClosingStream methods - see the comments for implementation requirements
     */
    function IBuffReceiver(){}
    IBuffReceiver.Interface("IBuffReceiver");
    /**
     * Gets reference to the buffer loader of the read stream
     * @param {IBuffLoader} loader 
     */
    IBuffReceiver.prototype.set_loader = function(loader) {
        throw "Not implemented";
    }
    IBuffReceiver.prototype.get_loader = function() {
        throw "Not implemented";
    }
    /**
     * Called by the buff stream when there is need of data in the buffer.
     */
    IBuffReceiver.prototype.RequestData = function(){ throw "Not implemented"; }
    /**
     * Informs the receiver that the stream is closing
     * Also removes the reference to the loader. The receiver usually closes the underlying implementation if applicable.
     */
    IBuffReceiver.prototype.ClosingStream = function(){ throw "Not implemented"; }
})();