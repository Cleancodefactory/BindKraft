(function() {

    var IBuffReceiver = Interface("IBuffReceiver"),
        IBuffTransmitter = Interface("IBuffTransmitter"),
        BufferStream = Class("BufferStream");

    function MessageListenerRT(origin, checker) {
        BaseObject.apply(this, arguments);
        this.$origin = origin;
        this.$checker = checker;
        
    }
    MessageListenerRT.Inherit(BaseObject,"MessageListenerRT")
        .Implement(IBuffReceiver)
        .Implement(IBuffTransmitter);
    MessageListenerRT.prototype.msglistener = null;
    MessageListenerRT.prototype.$buffstream = null;
    MessageListenerRT.ImplementReadProperty("origin");
    MessageListenerRT.ImplementReadProperty("buffstream");
    MessageListenerRT.prototype.init = function(msglistener,bread,bwrite) {
        this.msglistener = msglistener;
        var bs = new BufferStream();
        if (bread == null || bread) bs.set_receiver(this);
        if (bwrite == null || bwrite) bs.set_transmitter(this);
        this.set_loader(bs);
        this.set_unloader(bs);
        this.$buffstream = bs;
        return bs;
    }
    //#region IBuffReceiver
    MessageListenerRT.ImplementProperty("loader");
    MessageListenerRT.prototype.RequestData = function(){ 
        // TODO: If we think of something ...
    }
    //#endregion
    //#region  IBuffTransmitter
    MessageListenerRT.ImplementProperty("unloader");
    MessageListenerRT.prototype.RequestTransmit = function(nobjects) {
       if (this.$buffstream.get_canpull()) {
            var o = this.$buffstream.PullObject();
            this.msglistener.PostMessage(this,o);
       }
    }; 
    //#endregion
    //#region IBuffReceiver/IBuffTransmitter
    MessageListenerRT.prototype.ClosingStream = function(){ 
        this.set_loader(null);
        this.set_unloader(null);
        // TODO: If possible remove from the listener
    }
    //#endregion

    MessageListenerRT.prototype.onMessage = function(messageEvent) {
        if (this.$buffstream.get_closed()) return; //
        if (BaseObject.isCallback(this.$checker) && BaseObject.callCallback(this.$checker, messageEvent)) {
            if (this.$buffstream.get_canpush()) {
                this.$buffstream.PushObject(messageEvent.data);
            } else {
                // TODO: If the listener can autoremove itself this should not happen,
                // because Close will indirectly invoke removal from the list of the liteners
            }
            return true;
        }
    }

})();