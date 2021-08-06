(function() {


    /**
     * This interface represents a mechanism for picking one or more requests from the send queue (ingress queue) 
     * for further processing. It is typically part of the classes implementing the IAjaxCarrier and is defined in order to
     * split this functionality in an implementer.
     */
    function IAjaxSendQueuePicker() {}
    IAjaxSendQueuePicker.Interface("IAjaxSendQueuePicker");

    IAjaxSendQueuePicker.prototype.pickQueue = function(priority, limit) { throw "not impl"; }
    IAjaxSendQueuePicker.prototype.addInspector = function(inspector) { throw "not impl"; }
    IAjaxSendQueuePicker.prototype.removeInspector = function(inspector) { throw "not impl"; }
    IAjaxSendQueuePicker.prototype.removeAllInspectors = function() { throw "not impl"; }
})();