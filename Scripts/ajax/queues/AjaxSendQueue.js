(function() {

    /**
     * Be warned, while called queue, this is mostly used in non-queue manner.
     */
    var AjaxBase = Class("AjaxBase"),
        IAjaxSendQueue = Interface("IAjaxSendQueue"),
        IAjaxRawData = Interface("IAjaxRawData"),
        IAjaxAttachedInfo = Interface("IAjaxAttachedInfo");

    function AjaxSendQueue() {
        AjaxBase.apply(this,arguments);
    }
    AjaxSendQueue.Inherit(AjaxBase, "AjaxSendQueue")
        .Implement(IAjaxSendQueue)
        .Implement(IAjaxRawData);

    //#region Events
    AjaxSendQueue.prototype.requestaddedevent = new InitializeEvent("Fired each time new request is added to the queue.");
    // TODO: For now it looks
    //AjaxSendQueue.prototype.fillqueueevent = new InitializeEvent("Fired When the queue reaches certain limit.");
    //#endregion

    AjaxSendQueue.prototype.$queue = new InitializeArray("The queue");
    
    //#region IAjaxRawData
    AjaxSendQueue.prototype.get_rawdata = function() { 
        return this.$queue;
    }
    AjaxSendQueue.prototype.set_rawdata = function(v) { 
        if (BaseObject.is(v,"Array") && v.All(function(i,e) { return BaseObject.is(e, "IAjaxRequest");})) {
            this.$queue = v;
            return true;
        }
        return false;
    }
    //#endregion

    //#region IAjaxSendQueue
    
    AjaxSendQueue.prototype.enqueueRequest = function(req, priority) { 
        if (BaseObject.is(req, "IAjaxRequest") && BaseObject.is(req, "IAjaxQueueSlot")) {
            for (var i = this.$queue.length - 1; i >= 0; i--) {
                var el = this.$queue[i];
                if (el.get_priority() >= req.get_priority()) {
                    this.$queue.splice(i+1,0,req);
                    return true;
                }
            }
            // enqueue
            // this.$queue.unshift(slot);
            this.$queue.push(req); // TODO This requires some rearrangements
            return true;
        }
        this.LASTERROR("Attempted to enqueue a non-request. AjaxSendQueue supports only objects supporting both IAjaxRequest and IAjaxQueueSlot interfaces", "enqueueRequest");
        return false;
    }
    // TODO the dequeue logic needs revising, however it is not clear if we will need it in this form at all.
    AjaxSendQueue.prototype.dequeueRequest = function(priority) { 
        if (priority == null) {
            if (this.$queue.length > 0) {
                //var el = this.$queue.pop();
                var el = this.$queue.shift();
                return el;
            }
        } else if (typeof priority == "number" && !isNaN(priority)) {
            for (var i = this.$queue.length - 1; i >= 0; i--) {
                var el = this.$queue[i];
                if (el.get_priority() <= priority) {
                    var p = this.$queue.splice(i,1);
                    return p;
                }
            }
        }
        return null;

    }

    IAjaxSendQueue.prototype.removeRequest = function(request) {
        var i = this.$queue.indexOf(request);
        if (i >= 0) {
            return this.$queue.splice(i,1);
        }
        return null;
    }
    AjaxSendQueue.prototype.pickRequest = function(callback) { 
        if (BaseObject.isCallback(callback)) {
            for (var i = this.$queue.length - 1; i >= 0; i--) {
                var el = this.$queue[i];
                if (BaseObject.callCallback(callback, el)) {
                    var p = this.$queue.splice(i,1);
                    return p;
                }
            }
            return null;
        } else {
            return this.dequeueRequest();                    
        }
    }
    AjaxSendQueue.prototype.pickRequests = function(callback) { 
        var result = [];
        if (BaseObject.isCallback(callback)) {
            for (var i = this.$queue.length - 1; i >= 0; i--) {
                var e = this.$queue[i];
                if (BaseObject.callCallback(callback, e)) {
                    result.push(e); // collect it
                    this.$queue.splice(i, 1); // remove it from the queue
                }
            }
            return result;
        } else {
            return this.$queue.splice(0)
        }
    }

    AjaxSendQueue.prototype.queueLength = function() {
        return this.$queue.length;
    }
    AjaxSendQueue.prototype.peekRequest = function(index) { 
        if (Array.isArray(this.$queue)) {
            if (index >= 0 && index < this.$queue.length) {
                return this.$queue[index];
            }
        }
        return null;
    }
    AjaxSendQueue.prototype.peekRequests = function(inspector_or_callback, priority, limit) {
        var info, _limit = limit || 1;
        if (BaseObject.is(inspector_or_callback, "IAjaxRequestInspector")) {
            var inspector = inspector_or_callback;
            return this.$queue.Select(function(idx, req) {
                if (_limit <= 0) return null;
                if (priority != null && priority > req.get_priority()) return null;
                info = inspector.inspectRequest(req);
                if (info != null) {
                    if (req.is(IAjaxAttachedInfo)) {
                        req.mixInfo(IAjaxRequestInspector, info);
                        // TODO: Important - see are we going to pack non-null results in request details or not and align the code
                        // TODO complete this
                        //req.attachInfo()
                    }
                    _limit --;
                    return req;
                }
                return null;
            });
        } else if (BaseObject.isCallback(inspector_or_callback)) {
            return this.$queue.Select(function(idx, req) {
                if (_limit <= 0) return null;
                if (priority != null && priority > req.get_priority()) return null;
                info = BaseObject.callCallback(inspector_or_callback, req);
                if (info === true) {
                    _limit --;
                    return req;
                } else if (typeof info == "object" && info != null) {
                    if (req.is(IAjaxAttachedInfo)) {
                        req.mixInfo(IAjaxRequestInspector, info);
                    }
                    _limit --;
                    return req;
                }
            });
        }
    }
    /**
     * This method is under consideration. Its existence depends on serious decisions that are yet to be made.
     */
    AjaxSendQueue.prototype.cancelRequests = function(callback) {throw "not impl.";}
    //#endregion

    


    //#region  Holder object
    function AjaxQueueHolder(req, priority) {
        this.request = req;
        this.priority = priority || 0;
        this.queued = Date.now();
    }
    //#endregion

    //#region Singleton
    AjaxSendQueue.Default = (function() {
        var sysqueue;
        return function() {
            if (sysqueue == null) sysqueue = new AjaxSendQueue();
            return sysqueue;
        }
    })();
    //#endregion

})();