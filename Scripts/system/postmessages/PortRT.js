(function() {

    var IBuffReceiver = Interface("IBuffReceiver"),
        IBuffTransmitter = Interface("IBuffTransmitter"),
        BufferStream = Class("BufferStream");

    /**
     * 
     * @param {*} origin  - null or origin requirement
     * @param {*} checker - callback to check if the message carries the correct port
     */
    function PortRT(origin, checker) {
        BaseObject.apply(this, arguments);
        this.$origin = origin;
        this.$checker = checker;
        
    }
    PortRT.Inherit(BaseObject,"PortRT")
        .Implement(IBuffReceiver)
        .Implement(IBuffTransmitter);
    //PortRT.prototype.msglistener = null;
    PortRT.prototype.$buffstream = null;
    PortRT.ImplementReadProperty("origin");
    PortRT.ImplementReadProperty("buffstream");
    PortRT.prototype.init = function(msglistener,bread,bwrite) {
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
    PortRT.ImplementProperty("loader");
    PortRT.prototype.RequestData = function(){ 
        // TODO: If we think of something ...
    }
    //#endregion
    //#region  IBuffTransmitter
    PortRT.ImplementProperty("unloader");
    PortRT.prototype.RequestTransmit = function(nobjects) {
       if (this.$buffstream.get_canpull()) {
            var o = this.$buffstream.PullObject();
            this.msglistener.PostMessage(this,o);
       }
    }; 
    //#endregion
    //#region IBuffReceiver/IBuffTransmitter
    PortRT.prototype.ClosingStream = function(){ 
        this.set_loader(null);
        this.set_unloader(null);
        // TODO: If possible remove from the listener
    }
    //#endregion
    /**
     * In this case the message carries a  port
     * @param {} messageEvent 
     * @returns 
     */
    PortRT.prototype.onMessage = function(messageEvent) {
        if (this.$buffstream.get_closed()) return; //
        if (BaseObject.isCallback(this.$checker) && BaseObject.callCallback(this.$checker, messageEvent)) {
            if (messageEvent.ports)
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