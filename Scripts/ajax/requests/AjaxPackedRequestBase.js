(function() {

    var AjaxRequest = Class("AjaxRequest"),
        IAjaxRequest = Interface("IAjaxRequest"),
        IAjaxPackedRequest = Interface("IAjaxPackedRequest"),
        PackedRequestStateEnum = Enumeration("PackedRequestStateEnum");


    /**
     * Base, abstract class for packed requests
     * the owner for a packed request is usually its carrier
     */
    function AjaxPackedRequestBase(packer, unpacker, owner) {
        AjaxRequest.call(this, owner);
        this.$requestPacker = packer;
        this.$responseUnpacker = unpacker;

    }
    AjaxPackedRequestBase.Inherit(AjaxRequest, "AjaxPackedRequestBase")
        .ImplementEx(IAjaxPackedRequest);


    //#region IAjaxPackedRequest

    AjaxPackedRequestBase.prototype.$originalRequests = null;
    // override if needed
    /**
     * This property will work in conjunction with the constructor
     */
    AjaxPackedRequestBase.prototype.get_originalRequests = function() { return this.$originalRequests;}

    AjaxPackedRequestBase.prototype.$requestPacker = null;
    AjaxPackedRequestBase.prototype.get_requestPacker = function() { return this.$requestPacker; }
    AjaxPackedRequestBase.prototype.$responseUnpacker = null;
    AjaxPackedRequestBase.prototype.get_responseUnpacker = function() { return this.$responseUnpacker;}
    
    AjaxPackedRequestBase.prototype.$progressQueue = null;
    AjaxPackedRequestBase.prototype.get_progressQueue = function() { return this.$progressQueue; }
    AjaxPackedRequestBase.prototype.set_progressQueue = function(v) {
        if (v == null || BaseObject.is(v, "IAjaxProgressQueue")) {
            if (v != this.$progressQueue) {
                if (this.$progressQueue != null) {
                    this.$progressQueue.removeRequest(this);
                    this.$progressQueue = null;
                }
                this.$progressQueue = v;
                if (v != null) {
                    this.$progressQueue.putRequest(this);
                }
            }
        } else {
            this.LASTERROR("Unsupported type was set to set_progressQueue and nothing was done.");
        }
    }
    
    
    AjaxPackedRequestBase.prototype.$processingState = PackedRequestStateEnum.unsent;
    AjaxPackedRequestBase.prototype.get_progressState = function () { return this.$processingState; }
    AjaxPackedRequestBase.prototype.set_progressState = function (v) { 
        for (var k in PackedRequestStateEnum) {
            if (PackedRequestStateEnum.hasOwnProperty(k)) {
                if (v == PackedRequestStateEnum[k]) {
                    this.$processingState = v;
                    return;
                }
            }
        }
    }

    //#endregion

})();