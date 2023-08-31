(function(){

    function IBuffStreamRead() {}
    IBuffStreamRead.Interface("IBuffStreamRead");
    /**
     * Reads and returns the next object from the buffer or returns null if there is nothing to read
     */
    IBuffStreamRead.prototype.Read = function() { throw "not implemented"; }
        /**
     * Returns an Operation that completes when there is something read or completes unsuccessfully if the stream is closed.
     */
    IBuffStreamRead.prototype.ReadAsync = function() { throw "not implemented"; }
    
})();