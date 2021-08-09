(function() {


    /**
     * This interface represents a mechanism for picking one or more requests from the send queue (ingress queue) 
     * for further processing. It is typically part of the classes implementing the IAjaxCarrier and is defined in order to
     * split this functionality in an implementer.
     * 
     * The primary usage of this interface is over a single send queue. However, except for the $sendqueue property the interface 
     * is not specialized that much and can be implemented in different fashion.
     */
    function IAjaxSendQueuePicker() {}
    IAjaxSendQueuePicker.Interface("IAjaxSendQueuePicker");

    IAjaxSendQueuePicker.prototype.pickQueue = function(priority, limit) { throw "not impl"; }
    IAjaxSendQueuePicker.prototype.addInspector = function(inspector) { throw "not impl"; }
    IAjaxSendQueuePicker.prototype.removeInspector = function(inspector) { throw "not impl"; }
    IAjaxSendQueuePicker.prototype.removeAllInspectors = function() { throw "not impl"; }

    /**
     * This property lets the implementor to set the queue to the added inspectors.
     */
     IAjaxSendQueuePicker.prototype.get_sendqueue = function() { throw "not implemented"; }
     IAjaxSendQueuePicker.prototype.set_sendqueue = function(v) { throw "not implemented"; }
})();