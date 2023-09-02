(function() {
    /**
     * Base interface for stream and stream like implementations
     * that provides methods for controlling the stat of the stream
     */
    function IStreamController() {}
    IStreamController.Interface("IStreamController");
    /**
     * Returns true if Read can be called with success returns false on write only streams
     */
    IStreamController.prototype.get_canread = function() { throw "not implemented"; }
    /**
     * Returns true if th Write method of IBuffStremWrite can be called with success returns false on read only streams
     */
    IStreamController.prototype.get_canwrite = function() { throw new Error("Not implemented"); }
    /**
     * Closes the read buffer and informs the other side
     */
    IStreamController.prototype.Close = function() { throw "not implemented";}
    /**
     * Returns true if stream is closed
     */
    IStreamController.prototype.get_closed = function() { throw "not implemented"; }
    IStreamController.prototype.closeevent = new InitializeEvent("Fires wheen stream closes - on Close call");
})();