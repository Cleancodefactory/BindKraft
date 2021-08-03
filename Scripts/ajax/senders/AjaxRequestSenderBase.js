(function() {

    function AjaxRequestSenderBase() {
        AjaxBase.apply(this, arguments);
    }

    AjaxRequestSenderBase.Inherit(AjaxBase, "AjaxRequestSenderBase")
        .Implement(IAjaxRequestSender);

    //#region IAjaxRequestSender
    AjaxRequestSenderBase.prototype.get_blocked = function() {throw "not implemented."; }

    // override
    AjaxRequestSenderBase.prototype.sendRequest = function(request) {
        // TODO: Try sending request, if the limitations prevent that, enqueue it and grab it when it becomes possible to send it.
    }
    
    

    //IAjaxRequestSender.prototype.unblockedevent = new InitializeEvent("Fired when the sender can accept more requests");
    //#endregion

    //#region Internal queue
    AjaxRequestSenderBase.prototype.$requests = new InitializeArray("Buffered requests");
    AjaxRequestSenderBase.prototype.$enqueueRequest = function(r) {
        if (BaseObject.is(r, "IAjaxRequest")) {
            var r = this.$requests.unshift(r);
        } else {
            this.LASTERROR("Attempt to enqueue non-IAjaxRequest object.");
        }
        return -1;
    }
    AjaxRequestSenderBase.prototype.$dequeueRequest = function() {
        if (this.$requests.length > 0) {
            return this.$requests.pop();
        }
        return null;
    }
    
    //#endregion

    //#region Fetcher pool
    //AjaxRequestSenderBase.prototype.reCreatePool
    //#endregion
})();