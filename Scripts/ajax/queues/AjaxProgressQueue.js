(function() {

    /**
     * Holds the requests that are in progress. In case of batch requests - the batch
     * request is put on the queue and it contains the basic requests from which it is composed.
     */

    function AjaxProgressQueue() {
        AjaxBase.apply(this, arguments);
    }
    AjaxProgressQueue.Inherit(AjaxBase,"AjaxProgressQueue")
        .Implement(IAjaxProgressQueue);


    //#region IAjaxProgressQueue
    AjaxProgressQueue.prototype.$queue = new InitializeArray("Requess queue");
    AjaxProgressQueue.prototype.putRequest = function(request) { 
        if (BaseObject.is(request,  "IAjaxPackedRequest")) {
            var index = this.$queue.indexOf(request);
            if (index >= 0) { // already there
                this.LASTERROR("The request is already on the queue.");
                return index;
            } else {
                this.$queue.push(request);
                return this.$queue.length - 1;
            }
        } else {
            this.LASTERROR("Only IAjaxPackedRequest objects can be put on the progress queue.");
            return -1;
        }
    }

    AjaxProgressQueue.prototype.removeRequest = function(request) { 
        if (BaseObject.is(request,  "IAjaxPackedRequest")) {
            var index = this.$queue.indexOf(request);
            if (index >= 0) { // already there
                var r = this.$queue.splice(index,1);
                // FYI: IAjaxPackedRequest.set_progressQueue(null) should call this.
                return r;
            }
        }
        return null;
    }

    AjaxProgressQueue.prototype.cancelRequest = function(request) { 
        var r = this.removeRequest(request);
        if (BaseObject.is(r,"IAjaxPackedRequest")) {
            r.completeRequest(new AjaxResponse(false)); // Cancellation response.
        }
    }

    //#endregion

    /**
     * @param callback {callback} Proto: function(IAjaxRequest): boolean returns true for each request matching the 
     *                              implemented by the callback criteria.
     * @returns {Array<IAjaxRequest>} An array of references to all the requests (rather IAjaxPackedRequest-s) matching 
     *                                the callback's criteria.
     */
        AjaxProgressQueue.prototype.peekRequests = function(callback) { throw "not impl."; }


})();