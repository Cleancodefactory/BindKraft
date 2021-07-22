(function() {

    var AjaxBase = Class("AjaxBase"),
        IAjaxSendQueue = Interface("IAjaxSendQueue"),
        IAjaxRawData = Interface("IAjaxRawData");

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
        if (BaseObject.is(req, "IAjaxRequest")) {
            var slot = new AjaxQueueHolder(req, priority);
            for (var i = this.$queue.length - 1; i >= 0; i--) {
                var el = this.$queue[i];
                if (el.priority >= slot.priority) {
                    this.$queue.splice(i+1,0,slot);
                    return true;
                }
            }
            // enqueue
            this.$queue.unshift(slot);
            return true;
        }
        return false;
    }
    AjaxSendQueue.prototype.dequeueRequest = function(priority) { 
        if (priority == null) {
            if (this.$queue.length > 0) {
                var el = this.$queue.pop();
                return el.request;
            }
        } else if (typeof priority == "number" && !isNaN(priority)) {
            for (var i = this.$queue.length - 1; i >= 0; i--) {
                var el = this.$queue[i];
                if (el.priority <= priority) {
                    var p = this.$queue.splice(i,1);
                    return p.request;
                }
            }
        }
        return null;

    }

    AjaxSendQueue.prototype.pickRequest = function(callback) { 
        if (BaseObject.isCallback(callback)) {
            for (var i = this.$queue.length - 1; i >= 0; i--) {
                var el = this.$queue[i];
                if (BaseObject.callCallback(callback, el)) {
                    var p = this.$queue.splice(i,1);
                    return p.request;
                }
            }
            return null;
        } else {
            return this.dequeueRequest();                    
        }
    }
    AjaxSendQueue.prototype.pickRequests = function(callback) { 
        if (BaseObject.isCallback(callback)) {
            return this.$queue.Select(function(i, e) {
                if (BaseObject.callCallback(callback, e)) return e;
                return null;
            });
        } else {
            return Array.createCopyOf(this.$queue);
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
    /**
     * This method is under consideration. Its existence depends on serious decisions that are yet to be made.
     */
    AjaxSendQueue.prototype.cancelRequests = function(callback) {throw "not impl.";}
    //#endregion

    //#region IAjaxSendQueueEnumApi
    //#endregion


    //#region  Holder object
    function AjaxQueueHolder(req, priority) {
        this.request = req;
        this.priority = priority || 0;
        this.queued = Date.now();
    }
    //#endregion

    //#region Singleton
    AjaxSendQueue.Default = function() {
        var sysqueue;
        return function() {
            if (sysqueue == null) sysqueue = new AjaxSendQueue();
            return sysqueue;
        }
    }
    //#endregion

})();