(function() {

    function IAjaxRequestPackingExtension(){}
    IAjaxRequestPackingExtension.Interface("IAjaxRequestPackingExtension");

    /**
     * The packed request has a reference to the original, so the extension has access to everything passed by the initial request.
     * It can ask the owner if neccessary, check for advanced interfaces or attribute the rest of the ajax ignores and apply them by
     * modifying, url, data etc.
     * 
     * Obviously the extensions will depend on the packing mechanism, so they have to be registered only with appropriate packer.
     */
    IAjaxRequestPackingExtension.prototype.patchPackedRequest = function(packedRequest) { throw "not impl.";}

})();