(function(){

    function IAjaxRequestSender() {}
    IAjaxRequestSender.Interface("IAjaxRequestSender");

    /**
     * The request senders can obey limitations determined in way not described by this interface. The blocked property indicates
     * if they can accept new requests at this moment or the limiting logic blocks them to do so for now.
     * The inspectors must wait and retry. They can also use the get_unblock() property to get an operation that will complete when the sender unblocks
     */
    IAjaxRequestSender.prototype.get_blocked = function() {throw "not implemented."; }

    /**
     * Returns an operation that completes when the sender is ready.
     */
    IAjaxRequestSender.prototype.get_unblock = function() {throw "not implemented.";}
})();