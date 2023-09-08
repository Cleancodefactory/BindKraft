(function() {
    var IMessageRT = Interface("IMessageRT");

    function BaseRT() {
        BaseObject.apply(this,arguments);
    }
    BaseRT.Inherit(BaseObject,"BaseRT")
        .Implement(IBuffReceiver)
        .Implement(IBuffTransmitter)
        .Implement(IMessageRT);
    /**
     * Contains the messenger that created this RT
     */
    BaseRT.ImplementProperty("messenger");

    //#region IBuffReceiver
    BaseRT.ImplementProperty("loader");
    BaseRT.prototype.RequestData = function(){ 
        // TODO: If we think of something depending on the nature of the medium
    }
    //#endregion IBuffReceiver
    //#region IBuffTransmitter
    BaseRT.ImplementProperty("unloader");
    BaseRT.prototype.RequestTransmit = function(nobjects) {
        if (this.$buffstream.get_canpull()) {
             this.$doTransmitAndSchedule()
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
    /**
     *  
     * @param {object|any} o - object/message to transmit
     * @returns {boolean} true normally, false if transmit is unsuccessful, if cannto determine return true or nothing
     */
    BaseRT.prototype.Transmit = function(o) {
       // Implement as needed for the specific case - it may involve calling the messenger, doing it directly and so on 
       throw "must be implemented in the class derived from BaseRT"
    }
    BaseRT.prototype.$scheduleTransmit = function() {
        this.callAsync(this.doTransmitAndSchedule);
    }
    BaseRT.prototype.$doTransmit = function() {
        if (this.$buffstream.get_canpull()) {
            var o = this.$buffstream.PullObject();
            return this.Transmit(o)
       }
       return false;
    }
    BaseRT.prototype.$doTransmitAndSchedule = function() {
        if (this.$doTransmit()) {
            this.$this.$scheduleTransmit();
        }
    }
    
    //#endregion
})();