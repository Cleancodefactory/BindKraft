(function () {
    function IBuffStreamWrite(){}
    IBuffStreamWrite.Interface("IBuffStreamWrite");
    /**
     * 
     * Writes the object to the write buffer and rises the event that tells the transmitter that there is data to send 
     * @param {object} o the object to write
     * @returns {Boolean} True or false depending on succefullly putting the object in the buffer
     */
    IBuffStreamWrite.prototype.Write = function(o) {
        throw new Error("Not implemented");
    }
    IBuffStreamWrite.prototype.get_canwrite = function() { throw new Error("Not implemented"); }
    /**
     * Rises the event that tells the transmitter that there is data to send and fulshevent - see IBuffUnload
     */
    IBuffStreamWrite.prototype.Flush = function() { throw new Error("Not implemented"); }
})();