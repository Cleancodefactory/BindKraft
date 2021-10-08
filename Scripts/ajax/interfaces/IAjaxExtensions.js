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
     * The actual extension interface(s) depends in the implementer. 
     */
    IAjaxExtensions.prototype.iterateExtensions = function(callback) { throw "not impl."; }
})();