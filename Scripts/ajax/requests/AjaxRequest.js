(function() {

    var AjaxBase = Class("AjaxBase"),
        IAjaxRequest = Interface("IAjaxRequest"),
        IAjaxRawData = Interface("IAjaxRawData"),
        IAjaxAttachedInfoImpl = InterfaceImplementer("IAjaxAttachedInfo"),
        IAjaxQueueSlot = Interface("IAjaxQueueSlot");

    function AjaxRequest(owner) {
        AjaxBase.apply(this, arguments);
        if (BaseObject.is(owner, "BaseObject")) {
            this.$owner = owner;
        } else {
            this.LASTERROR("Owner is not a BaseObject.", "constructor");
        }
    }
    AjaxRequest.Inherit(AjaxBase, "AjaxRequest")
        .Implement(IAjaxRequest)
        .Implement(IAjaxRawData)
        .Implement(IAjaxQueueSlot)
        .Implement(IAjaxAttachedInfoImpl);

    //#region IAjaxRawData - not sue if we are going to use this here and how.
    AjaxRequest.prototype.get_rawdata = function() { 
        return {
            data: this.$data,
            reqdata: this.$reqdata,
            cache: this.$cache,
            url: this.$url?this.$url.toString():null // Not sure about this
        }
    }
    AjaxRequest.prototype.set_rawdata = function(v) { 
        if (v.data === null) {
            this.$data = null;
        } else if (typeof v.data == "object") {
            this.$data = v.data;
        }
        if (v.reqdata == null) {
            this.$reqdata = null;
        } else if (typeof v.reqdata == "object") {
            this.set_reqdata(v.reqdata);
        }
        this.$cache = v.vache?true:false;
        if (v.url != null) {
            this.set_url(v.url);
        }

    }
    //#endregion


    //#region IAjaxRequest
    AjaxRequest.prototype.$owner = null;    
    AjaxRequest.prototype.get_owner = function() { return this.$owner; }

    AjaxRequest.prototype.$data = null;
    AjaxRequest.prototype.get_data = function() { return this.$data; }
    AjaxRequest.prototype.set_data = function(v) { this.$data = v; }
 
    AjaxRequest.prototype.$reqdata = null;
    AjaxRequest.prototype.get_reqdata = function(idx) { 
        if (idx == null) {
            if (this.$reqdata == null) return null;
            return BaseObject.CombineObjects({}, this.$reqdata);
        } else {
            if (this.$reqdata == null) return null;
            return this.$reqdata[idx];
        }
    }
    AjaxRequest.prototype.set_reqdata = function(idx,v) { 
        if (arguments.length == 1) {
            if (idx == null) {
                this.$reqdata = null;
                return;
            }
            if (typeof idx == "object") {
                if (this.$reqdata == null) {
                    this.$reqdata = CombineObjects.CombineObjects({}, idx);
                } else {
                    this.$reqdata[k] = CombineObjects.CombineObjects(this.$reqdata, idx);
                }
                return;
            } else {
                this.LASTERROR("When set_reqdata is used with a single parameter it must be object.")
            }
        } else {
            if (this.$reqdata == null) this.$reqdata = {};
            this.$reqdata[idx] = v;
            return;
        }
    }
 
    AjaxRequest.prototype.$url = null; 
    AjaxRequest.prototype.get_url = function() { return this.$url; }
    AjaxRequest.prototype.set_url = function(v) { this.$url = v; }
 
    
    AjaxRequest.prototype.$cache = false;
    AjaxRequest.prototype.get_cache = function() { return this.$cache; }
    AjaxRequest.prototype.set_cache = function(v) { this.$cache = v?true:false; }

    AjaxRequest.prototype.$verb = null;
    AjaxRequest.prototype.get_verb = function() { throw "not impl"; }
    AjaxRequest.prototype.set_verb = function(v) { throw "not impl"; }

    AjaxRequest.prototype.constructionError = null;
    AjaxRequest.prototype.get_constructionError = function() { throw "not impl.";}
    AjaxRequest.prototype.set_constructionError = function(v) { throw "not impl.";}

    //#endregion

    //#region Callbacking
    /**
     * This method is created dynamically by the requester. It calls internally the original completeRequest before
     * continuing to enable the class to perform the common tasks it needs to finish.
     * 
     * The generated method mostly deals with the call type - with callback / with operation etc. The rest of the work is done by $completeRequest.
     */
    AjaxRequest.prototype.completeRequest = function(response) {
        if (this.is("IAjaxPackedRequest")) {
            this.set_progressState(1); // complete
            this.set_progressQueue(null); // make sure it is removed from there.
        }
    };

    //#endregion

    //#region IAjaxQueueSlot
    AjaxQueueSlot.prototype.$priority = 0;
    AjaxQueueSlot.prototype.get_priority = function() { return this.$priority; }
    AjaxQueueSlot.prototype.set_priority = function(v) {
        if (v == null) {
            this.$priority = 0;
        } else if (typeof v == "number") {
            this.$priority = v;
        } else {
            this.$priority = 0;
            this.LASTERROR("Unknown type was assigned to priority and it was set to 0");
        }
    }
    
    AjaxQueueSlot.prototype.$enqueuedat = null;
    AjaxQueueSlot.prototype.get_enqueuedat = function() { return this.$enqueuedat; }
    AjaxQueueSlot.prototype.set_enqueuedat = function(v) {
        if (v instanceof Date) {
            this.$enqueuedat = v.getTime();
        } else if (typeof v == "number") {
            this.$enqueuedat = v;
        } else if (v == null) {
            this.$enqueuedat = null;
        } else {
            this.LASTERROR("Unsupported type was assigned to enqueuedat.");
        }
    }

    
    AjaxQueueSlot.prototype.slotIt = function(priority) {
        this.set_priority(priority);
        this.set_enqueuedat(Date.now());
        return this;
    }
    //#endregion


})();