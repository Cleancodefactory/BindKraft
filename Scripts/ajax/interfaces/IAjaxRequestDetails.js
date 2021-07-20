(function(){

    /**
     * This interface is often skipped when the data it describes is used. The implementation is a rather plain object with
     * several standard fields and a number of additional fields and/or sub-objects.
     * The interface enables official access to the common fields only. For the rest the interfaces may or may not exist.
     * It it recommended to define interfaces derived from this one for any set of fields that are likely to be of interest of multiple classes and especially
     * future ones.
     */
    function IAjaxRequestDetails() {}
    IAjaxRequestDetails.Interface("IAjaxRequestDetails");

    IAjaxRequestDetails.prototype.priority = 0;
    IAjaxRequestDetails.prototype.targetOrigin = null; //BKUrlAuthority
    IAjaxRequestDetails.prototype.targetPathOrigin = null; // Reserved, BKUrlPath
    IAjaxRequestDetails.prototype.hasBinary = false; // Indicates if the request has binaries that need multipart submission



})();