(function() {

    var IAjaxRequestPacker = Interface("IAjaxRequestPacker"),
        IAjaxExtensions = Interface("IAjaxExtensions");

    /**
     * This simple implementer assumes that all the requests passed to it will be packed into a single packed request or each one of them will
     * be packed into separate packed request
     */
    function IAjaxRequestPackerImpl() {}
    IAjaxRequestPackerImpl.InterfaceImpl(IAjaxRequestPacker, "IAjaxRequestPackerImpl")
    IAjaxRequestPackerImpl.RequiredTypes("AjaxRequestPackerBase");
    /**
     * @param packedRequestType {string} The name of the type to create for packed requests. It must implement IAjaxPackedRequest
     */
    IAjaxRequestPackerImpl.classInitialize = function(cls, packedRequestType, _$packRequests) {
        var packedRequestClass = Class.getClassDef(packedRequestType || "AjaxPackedRequestBase");
        if (packedRequestClass == null || !Class.is(packedRequestClass, "IAjaxPackedRequest")) {
            CompileTime.err("Packed request type specified for IAjaxRequestPackerImpl implementor in the definition of " + cls.classType + " is not declared or does not support IAjaxPackedRequest");
            if (JBCoreConstants.CompileTimeThrowOnErrors) {
                throw "Packed request type specified for IAjaxRequestPackerImpl implementor in the definition of " + cls.classType + " is not declared or does not support IAjaxPackedRequest";
            }
        }

        cls.prototype.packRequests = function(requests) {
            var packed = this.$createPackedRequest(requests);
            if (this.$packRequests(packed)) {
                // Apply extensions if supported
                if (this.is(IAjaxExtensions)) {
                    var result = this.iterateExtensions(function(extension) {
                        return extension.patchPackedRequest(packed);
                    });
                }
                return [packed];
            }
            this.LASTERROR("Packing requests failed. This must not happen if the Ajax chains are configured correctly.");
            return null;
        }

        // override if the packed request class is not enough
        /**
         * @param originalRequests {IAjaxRequest | Array<IAjaxRequest>}
         * @returns {IAjaxPackedRequest} Initialized packed request without any IAjaxRequest 
         * data transferred (they may need to change when packing and original requests can be many)
         */
        cls.prototype.$createPackedRequest = function(originalRequests) {
            var r = new packedRequestClass(this, this.get_unpacker()?this.get_unpacker():this);
            r.$originalRequests = Array.isArray(originalRequests)?originalRequests:[originalRequests];
            return r;
        }

        if (typeof _$packRequests == "function") {
            cls.prototype.$packRequests = _$packRequests;
        } else {
            // override to implement the actual packing - from the original requests to the packed request
            cls.prototype.$packRequests = function(packedRequest) { throw "not implemented.  This method must be implemented in a packer: Implement(IAjaxRequestPackerImpl,[type|null], f(packedRequest) implementation ). This can be done also in the body of the class yourclass.prototype.$packRequests = function ...";}
        }

    }
})();