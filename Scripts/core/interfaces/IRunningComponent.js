
(function() {
    /**
     * This interface is usually implemented by Base derived components, but there is no reason to
     * avoid using it with other (non-visual) components. Implementers (if any) can restrict the
     * applicable types as needed, but the interface itself is abstract enough to assume nothing 
     * except what purpose implies - an object held in memory for prolonged (relatively) periods,
     * with functions that can be stopped when unused.
     * 
     * The most typical usage would be usage with views (held by windows) that should stop working
     * when invisible and reinitialize when visible again.
     * 
     * The interface does not include any assumption for shutdown/closing of the component. This 
     * (if applicable) must be handled according to the component's context and lifecycle.
     * 
     * Another important matter is that the interface does not include a concept for multiple running
     * functionalities that can be stopped/started individually. If that is needed for some reason it
     * is beyond the direct responsibilities of this interface alone. This can be solved with containers 
     * for running components for instance.
     * 
     */
    function IRunningComponent() {}    
    IRunningComponent.Interface("IRunningComponent");

    IRunningComponent.prototype.stopRunningComponent = function() { throw "not impl."; }
    IRunningComponent.prototype.startRunningComponent = function(data) { throw "not impl."; }

})();