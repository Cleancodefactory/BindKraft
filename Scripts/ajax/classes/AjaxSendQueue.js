(function() {

    function AjaxSendQueue() {
        AjaxBase.apply(this,arguments);
    }
    AjaxSendQueue.Inherit(AjaxBase, "AjaxSendQueue")
        .Implement(IAjaxSendQueue)
        .Implement(IAjaxRawData);

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
    //#endregion


    //#region  Holder object
    function AjaxQueueHolder(req, priority) {
        this.request = req;
        this.priority = priority || 0;
    }
    //#endregion

})();