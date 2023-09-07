(function() {
    var IMessageRT = Interface("IMessageRT");

    function BaseRT() {
        BaseObject.apply(this,arguments);
    }
    BaseRT.Inherit(BaseObject,"BaseRT")
        .Implement(IBuffReceiver)
        .Implement(IBuffTransmitter)
        .Implement(IMessageRT);
    //#region IBuffReceiver
    BaseRT.ImplementProperty("loader");
    BaseRT.prototype.RequestData = function(){ 
        // TODO: If we think of something ...
    }
    //#endregion IBuffReceiver
    //#region IBuffTransmitter
    BaseRT.ImplementProperty("unloader");
    BaseRT.prototype.RequestTransmit = function(nobjects) {
       if (this.$buffstream.get_canpull()) {
            var o = this.$buffstream.PullObject();
            this.msglistener.PostMessage(this,o);
       }
    }; 
    //#endregion IBuffReceiver
    //#region IMessageRT
    BaseRT.prototype.init = function(messenger, bread, bweite) {
        throw "not implemented";
    }
    BaseRT.prototype.onMessage = function (emessage) {
        throw "not implemented";
    }
    //#endregion

    //#region IBuffReceiver/IBuffTransmitter
    BaseRT.prototype.ClosingStream = function(){ 
        this.set_loader(null);
        this.set_unloader(null);
        // TODO: Remove from the messenger?
    }
    //#endregion
    //#region BaseRT
    BaseRT.prototype.Transmit = function() {
        
    }
    //#endregion
})();