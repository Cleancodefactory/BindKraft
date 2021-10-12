(function(){

    var AjaxResponse = Class("AjaxResponse"),
        AjaxBase = Class("AjaxBase"),
        AjaxResponsePacket = Class("AjaxResponsePacket"),
        IAjaxResponseUnpacker = Interface("IAjaxResponseUnpacker");
    /**
     * The simple unpacker for AjaxRequestPackerSingleJson
     *  -> Json is sent
     *  <- objdata.data only is extracted
     * 
     * This makes a scheme of the both a simple data ajax request
     */
    function AjaxResponseUnpackerSingleResponse() {
        AjaxBase.apply(this,arguments);
    }
    AjaxResponseUnpackerSingleResponse.Inherit(AjaxBase, "AjaxResponseUnpackerSingleResponse")
        .Implement(IAjaxResponseUnpacker);


    
    AjaxResponseUnpackerSingleResponse.prototype.unpackResponse = function(packedrequest, objdata) { 
        var response = null;
        // If we do not have an request to complete there is no point in performing the unpacking.
        if (!BaseObject.is(packedrequest, "IAjaxPackedRequest")) return; // Can't do a thing
        var originalrequest = packedrequest.get_originalRequests();
        if (Array.isArray(originalrequest) && originalrequest.length > 0) {
            originalrequest = originalrequest[0];
        } else {
            // No original to complete
            return;
        }
        if (objdata == null) {
            response = new AjaxErrorResponse("No data returned from the fetcher");
            originalrequest.completeRequest(response);
            return;
        }
        // Get the data only from the fetcher's objdata - presume single data
        // then complete the original request.
        if (objdata.status.issuccessful) {
            var r = new AjaxResponsePacket(objdata);
            originalrequest.completeRequest(new AjaxResponse(r.get_data()));
        } else {
            // In case of unsuccessful response, create appropriate response object
            originalrequest.completeRequest(new AjaxUnsuccessfulResponse(objdata));
        }
    }

})();