(function() {

    var AjaxRequestPackerBase = Class("AjaxRequestPackerBase"),
        IAjaxRequest = Interface("IAjaxRequest"),
        IAjaxResponseUnpacker = Interface("IAjaxResponseUnpacker"),
        IAjaxRequestPackerImpl = InterfaceImplementer("IAjaxRequestPackerImpl");

    function AjaxRequestPackerDummy() {
        AjaxRequestPackerBase.apply(this,arguments);
        this.set_unpacker(this);
    }
    AjaxRequestPackerDummy.Inherit(AjaxRequestPackerBase, "AjaxRequestPackerDummy")
        .Implement(IAjaxResponseUnpacker)
        .Implement(IAjaxRequestPackerImpl, null,
            function(packedRequest) {
                return true;
            }
        );

    AjaxRequestPackerDummy.prototype.unpackResponse = function(packedrequest, objdata) { 
        var response = null;
        // If we do not have an request to complete there is no point in performing the unpacking.
        if (!BaseObject.is(packedrequest, "IAjaxPackedRequest")) return; // Can't do a thing
        var originalrequests = packedrequest.get_originalRequests();
        if (Array.isArray(originalrequest) && originalrequest.length > 0) {
            originalrequests.forEach(or => {
                var response = new AjaxErrorResponse("Request cancelled.");
                or.completeRequest(response);
            });
        }
    }
    

})();