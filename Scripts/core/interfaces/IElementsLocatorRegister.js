(function() {
    /**
     * As the IElementsLocator is intended for finding elements by certain interfaces they support (optionally adding a condition to that)
     * it is practical to use it with registration the elements can make themselves or can be performed for them.
     * 
     * The usage patterns are not limited, but two were considered as recommended ones:
     * 1. Self-registration - each element uses service locator (through findService for example) to find the 
     *  IElementsLocatorRegister or interface derived from it and register there, then unregister when needed.
     * 2. Assisted registration - the creator of the element registers it in the IElementsLocatorRegister and unregisters
     *  it when appropriate.
     * 
     * Both approaches can be safely mixed and the only concern that remains is the unregistration which could be difficult
     * to perform in some scenarios. To alleviate that, implementations SHOULD check if the element is obliterated when they 
     * possible ( when they have to return it most likely) and remove it from the register and not return it.
     */
    function IElementsLocatorRegister() {}
    IElementsLocatorRegister.Interface("IElementsLocatorRegister", "IElementsLocator");

    /**
     * @param {}
     */
    IElementsLocatorRegister.prototype.registerLocatableElement = function(element) { throw "not impl."; }
    IElementsLocatorRegister.prototype.unregisterLocatableElement = function(element) { throw "not impl."; }
    

})();