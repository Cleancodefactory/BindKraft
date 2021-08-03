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

})();