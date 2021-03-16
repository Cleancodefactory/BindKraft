/**
 * Like IElementsLocator, but goes always all the way down to the app and collects all the matching services in an array and returns it.
 * There is no provision for corelation between the references returned by IServiceLocator and IElementsLocator, however implementations
 * should consider some corelation. Typical logic for deciding what to return from IServiceLocator and IElementsLocator looks like this:
 * 
 * a) IServiceLocator returns individual objects identified by very specific interfaces or even specific class types.
 * b) IElementsLocator returns some (subset) of the objects that can be possibly returned by IServiceLocator, but those that support certain common interface
 *  through which a common feature is accessible on each of them.
 * 
 */
(function() {
    function IElementsLocator() {}
    IElementsLocator.Interface("IElementsLocator");
    /**
     * @param iface {type}  Type - class or interface
     * @param condition {callback(iface):boolean|any}   Optional callback receiving reference to every object that can be returned. If passed it can filter the references returned. If something else is passed
     *                                                  it is up to the implementation to use it the same way reason is used in IServiceLocator. Typically this is part of the architecture planning of the 
     *                                                  specific application.
     * @returns {Array<iface>}  The references found.
     */
    IElementsLocator.prototype.locateElements = function(iface, condition) { throw "not implemented";}
})();