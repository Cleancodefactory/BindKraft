(function() {
    var AjaxBase = Class("AjaxBase");

    /**
     * 
     * TODO
     * 
     * Not sure if we ara going to use this with multiple queue inspectors. Still it will be supported, but it might be impractical (We will see).
     * 
     */
    function AjaxCarrier() {
        AjaxBase.apply(this,arguments);
    }
    AjaxCarrier.Inherit(AjaxBase, "AjaxCarrier")
        .Implement(IAjaxCarrier);

    //#region Parameters
    AjaxCarrier.ImplementProperty("limit", new Initialize)
    //#endregion


    //#region IAjaxCarrier
    AjaxCarrier.prototype.run = function() {
        var reqs;
        if (this.$inspectors.length > 0) {
            reqs = this.$pickQueue();
            if (reqs.length > 0) {
                // Something to send is available
            }
            
        }
    }
    AjaxCarrier.prototype.asyncRun = function() {
        this.callAsync(this.run);
    }
    //#endregion

    //#region Inspectors

    AjaxCarrier.prototype.$checkQueueIndex = 0; // Initial
    AjaxCarrier.prototype.$pickQueue = function(priority, limit) {
        var results = [];
        var index = this.$checkQueueIndex;
        if (index > this.$inspectors.length) index = 0;
        if (index < this.$inspectors.length) {
            var inspector, reqs, total, excess;
            do {
                inspector = this.$inspectors[index];
                if (BaseObject.is(inspector, IAjaxSendQueueInspector)) {
                    var reqs = inspector.checkQueue(priority);
                    total = results.limit + reqs.length;
                    if (limit != null) {
                        if (total > limit) {
                            excess = total - limit;
                            reqs = reqs.reverse.splice(0,excess);
                            if (reqs.length > 0) {
                                inspector.grabRequests(reqs);
                                results = results.concat(reqs);
                            }
                            this.$checkQueueIndex = ++index;
                            return results;
                        } else {
                            inspector.grabRequests(reqs);
                            results = results.concat(reqs);
                        }
                    } else {
                        inspector.grabRequests(reqs);
                        results = results.concat(reqs);
                        this.$checkQueueIndex = ++index;
                    }
                }
                this.$checkQueueIndex = ++index;
            } while(index < this.$inspectors.length);
        } 
        return results;
    }

    AjaxCarrier.prototype.$inspectors = new InitializeArray("Array of all the inspectors using this carrier");
    AjaxCarrier.prototype.addInspector = function(inspector) {
        if (BaseObject.is(inspector, "IAjaxSendQueueInspector")) {
            if (this.$inspectors.indexOf(inspector) >= 0) return true; // already there
            this.$inspectors.push(inspector);
            return true;
        }
        return false;
    }
    AjaxCarrier.prototype.removeInspector = function(inspector) {
        var idx = this.$inspectors.indexOf(inspector);
        if (idx >= 0) {
            return this.$inspectors.splice(idx,1);
        }
        return null;
    }
    AjaxCarrier.prototype.removeAllInspectors = function() {
        this.$inspectors.splice(0);
    }

    //#endregion

    //#region Packer
    AjaxCarrier.prototype.get_requestPacker = function() { 
        // TODO
    }
    AjaxCarrier.prototype.get_responseUnpacker = function() {
        // DO:
    }
    //#endregion




})();