(function(){

    var AjaxResponse = Class("AjaxResponse"),
        AjaxBase = Class("AjaxBase"),
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
        if (objdata == null) return new AjaxErrorResponse()
        var ar = new AjaxResponse(pa)
    }

})();