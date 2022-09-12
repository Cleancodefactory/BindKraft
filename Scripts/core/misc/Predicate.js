(function() {

    var IEquality = Interface("IEquality");

    function Predicate(proc) {
        BaseObject.apply(this,arguments);
        this.expression = proc;
    }
    Predicate.Inherit(BaseObject, "Predicate")
        .Implement(IEquality);

    Predicate.prototype.areEqual = function(a, b) {
        if (BaseObject.isCallback(this.expression)) {
            return BaseObject.callCallback(this.expression,a, b);
        } else if (BaseObject.is(this.expression,"IEquality")) {
            return this.expression.areEqual(a,b);
        } else {
            return false;
        }
    }
})();