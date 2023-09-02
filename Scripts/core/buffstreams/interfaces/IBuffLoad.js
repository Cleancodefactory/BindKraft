(function() {
    /**
     * This interface faces the receiver
     */ 
    function IBuffLoad() {}
    IBuffLoad.Interface("IBuffLoad");
    /**
     * Pushed object in the buffer
     * @param {object} o The object to push
     * @returns {boolean} True if successful, false otherwise 
     */
    IBuffLoad.prototype.PushObject = function(o) { throw "Not implemented"; };
    /**
     * Returns true if the buffer can accept more objects (not closed typically)
     */
    IBuffLoad.prototype.get_canpush = function() { throw "Not implemented"; };
    /**
     * 
     * @param {IBuffReceiver} receiver 
     */
    IBuffLoad.prototype.set_receiver = function(receiver) { throw "Not implemented"; };
    IBuffLoad.prototype.get_receiver = function() { throw "Not implemented"; };

    /**
     * If receiver is set firing the event is optional and depending on th
     */
    IBuffLoad.prototype.requestdataevent = new InitializeEvent("Fires to request data");
})();