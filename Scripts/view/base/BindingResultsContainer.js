/**
 * Encapsulates a simple container for reporting "results". In this case
 * the container collects the bindings being created by Base.prototype.$recursiveBind
 * and only if it is passed as an argument. A class is used instead of plain object in order
 * to avoid multiple checks for existence of the sub-collections.
 * 
 * When descend is true the contextBinding should not be used!
 * 
 */

(function() {



    function BindingResultsContainer(descend) {
        BaseObject.apply(this,arguments);
        this.bindings = [];
        this.bindingDescendants = [];
        this.descend = descend;
        this.handlers = [];
        this.namedBindings = {};
    }
    BindingResultsContainer.Inherit(BaseObject,"BindingResultsContainer");
    BindingResultsContainer.prototype.contextBinding = null;
    /**
     * Enter descendants if true
     */
    BindingResultsContainer.prototype.descend = false;
    BindingResultsContainer.prototype.bindings = null;
    BindingResultsContainer.prototype.bindingDescendants = null;
    BindingResultsContainer.prototype.handlers = null;
    BindingResultsContainer.prototype.namedBindings = null;

    
})();