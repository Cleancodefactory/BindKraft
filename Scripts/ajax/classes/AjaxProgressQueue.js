(function() {

    /**
     * Holds the requests that are in progress. In case of batch requests - the batch
     * request is put on the queue and it contains the basic requests from which it is composed.
     */

    function AjaxProgressQueue() {
        AjaxBase.apply(this, arguments);
    }
    AjaxProgressQueue.Inherit(AjaxBase,"AjaxProgressQueue");
})();