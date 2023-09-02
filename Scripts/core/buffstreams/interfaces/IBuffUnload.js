(function(){
    function IBuffUnload() {}
    IBuffUnload.Interface("IBuffUnload");
    /**
     * consumes the last object from the buffer and returns id, null if no object is available.
     */
    IBuffUnload.prototype.PullObject = function() {throw "Not implemented";}
    /**
     * Returns true if there any objects available for pulling.
     */
    IBuffUnload.prototype.get_canpull = function() {throw "Not implemented";}
    /**
     * Sets or gets the current transmitter (Implementing IBuffTransmitter interface, other implementations can exist, but they depend on events )
     */
    IBuffUnload.prototype.get_transmitter = function() { throw "Not implemented";}
    IBuffUnload.prototype.set_transmitter = function(transmitter) {throw "Not implemented";}

    /**
     * If transmitter is set - the event firing is optional, dealing with a transmitter should be done through its methods instead.
     */
    IBuffUnload.prototype.canpullevent = new InitializeEvent("Fires whenever canpull will return true.")
})();