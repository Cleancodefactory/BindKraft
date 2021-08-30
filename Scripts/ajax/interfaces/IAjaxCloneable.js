(function() {

    /**
     * Declares an object from the ajax library as cloneable. Most objects do not need cloning, 
     * but in some cases cloning is the most practical way to go. Therefore cloning is not innate
     * feature of the ajax library classes, but is implemented in some cases to help the internal 
     * implementation.
     * 
     * IAjaxCloneable does not participate in the definition of the interface tree, i.e. no other 
     * interface extends it. This guarantees that coning is feature specific to specific classes only
     * and not to features (represented by the interfaces).
     * 
     */
    function IAjaxCloneable() {}
    IAjaxCloneable.Interface("IAjaxCloneable");

    IAjaxCloneable.prototype.cloneAjaxComponent = function() { throw "not implemented"; };
})();