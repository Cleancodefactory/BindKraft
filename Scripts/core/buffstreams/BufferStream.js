(function(){
    var BaseObject = Class("BaseObject");
    var IStreamController = Interface("IStreamController"),
        IBuffStreamRead = Interface("IBuffStreamRead"),
        IBuffStreamWrite = Interface("IBuffStreamWrite"),
        IBuffLoad = Interface("IBuffLoad"),
        IBuffUnload = Interface("IBuffUnload");


    function BufferStream(allowread, allowwrite){
        BaseObject.apply(this, arguments);
        if (allowread == "auto") {
            this.$automode = true;
        } else {
            if (allowread != null) {
                this.$allowread = allowread?true:false;
            }
            if(allowwrite != null) {
                this.$allowwrite = allowwrite?true:false;
            }
        }
    }
    BufferStream.Inherit(BaseObject,"BufferStream")
        .Implement(IStreamController)
        .Implement(IBuffStreamRead)
        .Implement(IBuffStreamWrite)
        .Implement(IBuffLoad)
        .Implement(IBuffUnload);

    BufferStream.AsyncLimit = 128;

    //#region Private members
    BufferStream.prototype.$readbuffer = new InitializeArray("Buffer for the read part");
    BufferStream.prototype.$writebuffer = new InitializeArray("Buffer for the write part");
    BufferStream.prototype.$closed = false;
    BufferStream.prototype.$allowread = true;
    BufferStream.prototype.$allowwrite = true;
    BufferStream.prototype.$automode = false;
    BufferStream.prototype.$readbufferwaiting = new InitializeArray("ReadAsync requests waiting for the read part");
    BufferStream.prototype.$setupforread = function() {
        if (this.$closed) return false;
        if (this.$automode) {
            return (this.$receiver != null);
        } else {
            return this.$allowread;
        }
    }
    BufferStream.prototype.$setupforwrite = function() {
        if (this.$closed) return false;
        if (this.$automode) {
            return (this.$transmitter != null);
        } else {
            return this.$allowwrite;
        }
    }
    BufferStream.prototype.$adviseTransmitter = function(n) {
        if (this.$setupforwrite()) {
            if (this.$transmitter != null) {
                this.$transmitter.RequestTransmit(n?n:this.$writebuffer.length);
            } else {
                this.canpullevent.invoke(this,n?n:this.$writebuffer.length);
            }
        }
    }
    BufferStream.prototype.$adviseReceiver = function() {
        if (this.$setupforread()) {
            if (this.$receiver != null) {
                this.$receiver.RequestData();
            } else {
                this.requestdataevent.invoke(this,null);
            }
        }
    }
    
    //#endregion Private members

    //#region IStreamController
    BufferStream.prototype.get_canread = function() { 
        if (this.$setupforread() && this.$readbuffer != null && this.$readbuffer.length > 0) return true;
        return false;
    }
    /**
     * Returns true if th Write method of IBuffStremWrite can be called with success returns false on read only streams
     */
    BufferStream.prototype.get_canwrite = function() { 
        if (this.$setupforwrite() && this.$writebuffer != null) return true;
        return false;
    }
    /**
     * Closes the read buffer and informs the other side
     */
    BufferStream.prototype.Close = function() { 
        if (this.$receiver != null) this.$receiver.ClosingStream();
        if (this.$transmitter != null) this.$transmitter.ClosingStream();
        this.closeevent.invoke(this,null);
        this.$closed = true;
    }
    /**
     * Returns true if stream is closed
     */
    BufferStream.prototype.get_closed = function() { 
        return this.$closed;
    }
    //EVENTS
    BufferStream.prototype.closeevent = new InitializeEvent("Fires wheen stream closes - on Close call");
    //#endregion IStreamController

    //#region IBuffStreamRead
    BufferStream.prototype.Read = function() { 
        if (this.$setupforread() && this.$readbuffer.length > 0) {
            return this.$readbuffer.unshift();
        }
        return null;
    }
    BufferStream.prototype.ReadAsync = function() { 
        if (this.$setupforread()) {
            if (this.get_canread()) {
                return Operation.From(this.Read())
            } else { // queue operation
                if (this.$readbufferwaiting.length > BufferStream.AsyncLimit) {
                    return Operation.Failed("Async limit reached(128)");
                }
                var op = new Operation("BuffwrStream.ReadAsync");
                this.$readbufferwaiting.push(op);
                return op;
            }
        } else {
            this.LASTERROR("The steam is either not readable or closed");
            return Operation.Failed("The stream is not readable");
        }    
    }
    //#endregion

    //#region IBuffStreamWrite
    BufferStream.prototype.Write = function(o) {
        if (this.$setupforwrite() && this.$writebuffer != null) {
            this.$writebuffer.unshift(o);
            this.$adviseTransmitter();
        } else {
            this.LASTERROR("The steam is either not writable or closed");
            throw "Cannot write to this stream";
        }
    }
    
    BufferStream.prototype.Flush = function() { 
        if (this.$setupforwrite()) {
            if (this.$transmitter != null) {
                this.$adviseTransmitter(-1);
            } 
        }     
    }
    //#endregion

    //#region IBuffLoad
    BufferStream.prototype.PushObject = function(o) {
        if (!this.$setupforread()) {
            return false;
        } else {
            this.$readbuffer.push(o);
            if (this.$readbufferwaiting.length > 0) {
                var op = this.$readbufferwaiting.shift();
                if (BaseObject.is(op, "Operations")) {
                    op.CompleteOperation(true,this.Read());
                }
            }
        }
    };
    
    BufferStream.prototype.get_canpush = function() { 
        if (this.$setupforread() && this.$readbuffer != null) return true;
        return false;
    };
    BufferStream.prototype.$receiver = null;
    BufferStream.prototype.set_receiver = function(receiver) { 
        if (BaseObject.is(receiver, "IBuffReceiver")) {
            this.$receiver = receiver;
        } else if (receiver == null) {
            this.$receiver = null;
        } else {
            throw "Assigning not IBuffReceiver or null is not allowed";
        }
    };
    BufferStream.prototype.get_receiver = function() { 
        return this.$receiver;
    };

    // EVENTS
    //BufferStream.prototype.requestdataevent = new InitializeEvent("Fires to request data");
    //#endregion IBuffLoad
    //#region IBuffUnload

    BufferStream.prototype.PullObject = function() {
        if (this.$setupforwrite() && this.$writebuffer.length > 0) {
            return this.$writebuffer.pop();
        }
        return null;
    }
    /**
     * Returns true if there any objects available for pulling.
     */
    BufferStream.prototype.get_canpull = function() {
        if (this.$setupforwrite() && this.$writebuffer.length > 0) return true;
        return false;
    }
    BufferStream.prototype.$transmitter = null;
    /**
     * Sets or gets the current transmitter (Implementing IBuffTransmitter interface, other implementations can exist, but they depend on events )
     */
    BufferStream.prototype.get_transmitter = function() { 
        return this.$transmitter;
    }
    BufferStream.prototype.set_transmitter = function(transmitter) {
       if (BaseObject.is(transmitter,"IBuffTransmitter")) {
            this.$transmitter = transmitter;
       } else if (transmitter == null) {
            this.$transmitter = null;
       } else {
         throw "Assigning value other than IBuffTransmitter or null is not allowed";
       }
    }

    //#endregion IBuffUnload
})();