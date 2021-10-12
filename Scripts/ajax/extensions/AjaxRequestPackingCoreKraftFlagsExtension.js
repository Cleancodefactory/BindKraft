(function() {

    var IAjaxCoreKraft = Internal("IAjaxCoreKraft"),
        AjaxBase = Class("AjaxBase");

    function AjaxRequestPackingCoreKraftFlagsExtension(addFlags, fallBackFlags, paramname) {
        AjaxBase.apply(this, arguments);
        this.addFlags = addFlags || 0;
        this.fallBackFlags = fallBackFlags || 0;
        this.reqParamname = paramname || "sysrequestcontent";
    }
    AjaxRequestPackingCoreKraftFlagsExtension.Inherit(AjaxBase, "AjaxRequestPackingCoreKraftFlagsExtension");

    AjaxRequestPackingCoreKraftFlagsExtension.prototype.patchPackedRequest = function(packedRequest) { 
        if (!BaseObject.is(packedRequest, "IAjaxPackedRequest")) {
            this.LASTERROR("Received argument that is not IAjaxPackedRequest.", "patchPackedRequest");
            return;
        }
        var flags = 0;
        var me = this;
        var info = null;
        var originals = packedRequest.get_originalRequests();
        if (Array.isArray(originals)) {
            originals.Each(function(idx, req) {
                if (BaseObject.is(req, "IAjaxAttachedInfo")) {
                    info = req.getAttachedInfo(IAjaxCoreKraft);
                    if (info != null) { // User passed flags
                        if (typeof info.contentFlags == "number") {
                            flags |= info.contentFlags;
                        }
                    }
                }
            });
            if (flags == 0) {
                flags |= this.fallBackFlags;
            } else {
                flags |= this.addFlags;
            }
            var url = packedRequest.get_url();
            if (url != null) {
                url.get_query().set(this.reqParamname, flags.toString(16));
            }
        }
    }

})();