(function() {
    var IComparison = Interface("IComparison");


    function Comparison(proc) {
        BaseObject.apply(this,arguments);
        this.expression = proc;
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