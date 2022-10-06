(function() {
    var IComparison = Interface("IComparison");

    /**
     * This is a simple wrapper class intended mostly to wrap a callback as IComparison object with added option to wrap another IComparison
     * for convenience whenever the comparison is generated in various manners and must be presented somewhere else uniformly.
     * @param {function} proc 
     */
    function Comparison(proc) {
        BaseObject.apply(this,arguments);
        if (BaseObject.is(proc,"IComparison")) return proc; // Return the other object instead to avoid excessive wrapping.
    }
    Comparison.Inherit(BaseObject, "Comparison")
    .Implement(IComparison);

    Comparison.prototype.compare = function(a,b) {
        if (BaseObject.isCallback(this.expression)) {
            return BaseObject.callCallback(this.expression,a, b);
        } else if (BaseObject.is(this.expression,"IComparison")) {
            return this.expression.compare(a,b);
        } else {
            return 0;
        }
    }

})();