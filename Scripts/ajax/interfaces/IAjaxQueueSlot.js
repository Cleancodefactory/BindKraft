(function() {
    /**
     * This interface is implemented by classes with objects held in queues/staging pools etc. It contains the
     * properties needed to manage the holding collection's items that will otherwise have to be provided on a separate
     * object (slot) that keeps the place of the actual object in the collection. Processing such collections thus requires 
     * from the consumer code to obtain both the slot and the housed object, mixing them together simplifies such operations 
     * and justifies the existence of this interface. 
     * 
     * Whenever some of the properties are not needed, they are simply left unused.
     * 
     */

    function IAjaxQueueSlot() {}
    IAjaxQueueSlot.Interface("IAjaxQueueSlot");

    /**
     * Contains an integer priority - the lower the number, the higher the priority. 0 is the normal priority.
     */
    IAjaxQueueSlot.prototype.get_priority = function() {throw "not implemented.";}
    IAjaxQueueSlot.prototype.set_priority = function(v) {throw "not implemented.";}
    
    /**
     * Holds the time at which the item was enqueued/placed in the underlying collection. The time is kept in milliseconds (Date.getTime/now etc.)
     */
    IAjaxQueueSlot.prototype.get_enqueuedat = function() {throw "not implemented.";}
    IAjaxQueueSlot.prototype.set_enqueuedat = function(v) {throw "not implemented.";}

    /**
     * Resets the slot status by setting enqueued to now, the priority to the desired value.
     * @param [priority] {number} Optional priority, if missing 0 is set.
     * @returns {IAjaxQueueSlot} This object
     */
    IAjaxQueueSlot.prototype.slotIt = function(priority) {
        throw "Not implemented";
    }

})();