(function(){
    var AjaxRequestSenderBase = Class("AjaxRequestSenderBase"),
        IAjaxPackedRequest = Interface("IAjaxPackedRequest");

    /**
     * Special sender that cancels all the requests passed to it
     */
    function AjaxRequestSenderCancel() {
        AjaxRequestSenderBase.apply(this,arguments);
    }
    AjaxRequestSenderCancel.Inherit(AjaxRequestSenderBase, "AjaxRequestSenderCancel");

    AjaxRequestSenderCancel.prototype.sendRequest = function(req) {
        if (BaseObject.is(req, IAjaxPackedRequest)) {
            this.$enqueueRequest(req);
            this.trySend();
            return true;
        } else {
            return false;
        }
    }
    AjaxRequestSenderCancel.prototype.trySend = function() {
        this.cancel();
    }
})();