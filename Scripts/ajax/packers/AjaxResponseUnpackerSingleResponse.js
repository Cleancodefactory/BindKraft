(function(){

    function AjaxResponseUnpackerSingleResponse() {
        AjaxBase.apply(this,arguments);
    }
    AjaxResponseUnpackerSingleResponse.Inherit(AjaxBase, "AjaxResponseUnpackerSingleResponse")
        .Implement(IAjaxResponseUnpacker);

})();