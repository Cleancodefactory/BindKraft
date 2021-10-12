(function() {

    /**
     * An interface implemented by ajax facilities that support extensions.
     * This interface implements their registration and removal, the actual extensions are
     * and requirements they need to fulfill depend on the specific extendable function.
     * 
     * The extensions cannot be reordered, they are executed in the order in which they were registered (addExtension).
     * 
     * The implementation SHOULD limit the types of the extensions that can be registered to those it can actually use.
     */
    function IAjaxExtensions(){}
    IAjaxExtensions.Interface("IAjaxExtensions");

    /**
     * Registers an extension
     */
    IAjaxExtensions.prototype.addExtension = function(extension) { throw "not impl.";}
    /**
     * Unregisters an extension by reference.
     */
    IAjaxExtensions.prototype.removeExtension = function(extension) { throw "not impl.";}
    /**
     * Unregisters all the extensions.
     */
    IAjaxExtensions.prototype.clearExtensions = function() { throw "not impl.";}

    /** 
     * Enables easy usage of the extensions. The callback is called with each extension in the order in which they were registered.
     * The actual extension interface(s) depends on the implementer. 
     * @param callback {Function} A callback function or delegate usually implemented by the class using this implementer. callback details - see below
     * @returns {null|string} Returns null if everything went fine, otherwise returns a string with error details.
     * 
     * The callback is function(callback_arguments): (null|string). If the callback returns anything but string it is 
     *  treated as success, if error occurs the callback must return a string with error details. An error will prevent any further extensions from
     *  being processed.
     * 
     * The callback_arguments will vary depending on the kind of element being extended. For example:
     * - Packers will pass packedRequest : IAjaxPackedRequest only
     * - Senders will pass packedRequest : IAjaxPackedRequest, fetcher : LightFetchHttp
     * for other cases please consult their documentation or source comments. Typically the callback's arguments are the same as the 
     * arguments of the specific method described in its interface see: IAjaxPackingExtension, IAjaxRequestSendingExtension and so on.
     * 
     */
    IAjaxExtensions.prototype.iterateExtensions = function(callback) { throw "not impl."; }
})();