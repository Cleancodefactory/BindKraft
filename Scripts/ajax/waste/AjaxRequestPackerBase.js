(function() {

    var IAjaxRequestPacker = Interface("IAjaxRequestPacker"),
        AjaxBase = Class("AjaxBase");

    function AjaxRequestPackerBase() {
        AjaxBase.apply(this,arguments);
    }
    AjaxRequestPackerBase.Inherit(AjaxBase, "AjaxRequestPackerBase");
    // Use IAjaxRequestPacketImpl in the inherited class    

    //#region API for carriers
    AjaxRequestPackerBase.ImplementProperty("unpacker", new Initialize("Contains the reference to the responseUnpacker if it is different from the packer",null));
    //#endregion

    //#region IAjaxRequestPacker
    
    // override to apply some checking if the requests are ok for this packer or implement different kind of packing
    /**
     * This basic implementation packs one or more requests into one request
     */
    AjaxRequestPackerBase.prototype.packRequests = function(requests) {
        var packed = this.$createPackedRequest(requests);
        if (this.$packRequests(packed)) return [packed];
        this.LASTERROR("Packing requests failed. This must not happen if the Ajax chains are configured correctly.");
        return null;
    }

    // override
    /**
     * @param originalRequests {IAjaxRequest | Array<IAjaxRequest>}
     * @returns {IAjaxPackedRequest} Initialized packed request without any IAjaxRequest 
     * data transferred (they may need to change when packing and original requests can be many)
     */
    AjaxRequestPackerBase.prototype.$createPackedRequest = function(originalRequests) {
        var r = new AjaxPackedRequestBase(this, this.get_unpacker()?this.get_unpacker():this);
        r.$originalRequests = Array.isArray(originalRequests)?originalRequests:[originalRequests];
        return r;
    }

    // override
    AjaxRequestPackerBase.prototype.$packRequests = function(packedRequest) { throw "not implemented. This method must be overriden!";}
    //#endregion
})();