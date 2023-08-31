(function(){

    function BufferStream(){

    }
    BufferStream.Inherit(BaseObject,"BufferStream")
        .Implement(IStreamController)
        .Implement(IBuffStreamRead)
        .Implement(IBuffStreamWrite)
        .Implement(IBuffLoad)
        .Implement(IBuffUnload);

    //#region Private members
    //#endregion Private members

    //#region IStreamController
    BufferStream.prototype.get_canread = function() { throw "not implemented"; }
    /**
     * Returns true if th Write method of IBuffStremWrite can be called with success returns false on read only streams
     */
    BufferStream.prototype.get_canwrite = function() { throw new Error("Not implemented"); }
    /**
     * Closes the read buffer and informs the other side
     */
    BufferStream.prototype.Close = function() { throw "not implemented";}
    /**
     * Returns true if stream is closed
     */
    BufferStream.prototype.get_closed = function() { throw "not implemented"; }
    //EVENTS
    BufferStream.prototype.closeevent = new InitializeEvent("Fires wheen stream closes - on Close call");
    //#endregion IStreamController

    //#region IBuffStreamRead
    BufferStream.prototype.Read = function() { throw "not implemented"; }
    BufferStream.prototype.ReadAsync = function() { throw "not implemented"; }
    //#endregion

    //#region IBuffStreamWrite
    BufferStream.prototype.Write = function(o) {
        throw new Error("Not implemented");
    }
    BufferStream.prototype.get_canwrite = function() { throw new Error("Not implemented"); }
    
    BufferStream.prototype.Flush = function() { throw new Error("Not implemented"); }
    //#endregion

    //#region IBuffLoad
    BufferStream.prototype.PushObject = function(o) { throw "Not implemented"; };
    
    BufferStream.prototype.get_canpush = function() { throw "Not implemented"; };
    
    BufferStream.prototype.set_receiver = function(receiver) { throw "Not implemented"; };
    BufferStream.prototype.get_receiver = function() { throw "Not implemented"; };

    // EVENTS
    BufferStream.prototype.requestdataevent = new InitializeEvent("Fires to request data");
    //#endregion IBuffLoad
    //#region IBuffUnload

    //#endregion IBuffUnload
})();