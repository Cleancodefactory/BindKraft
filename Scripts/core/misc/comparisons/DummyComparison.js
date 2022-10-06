(function() {

    var IComparison = Interface("IComparison");

    function DummyComparison() {
        BaseObject.apply(this, arguments);
    }

    DummyComparison.Inherit(BaseObject, "DummyComparison")
    .Implement(IComparison);

    DummyComparison.prototype.compare = function(a, b) {
        return 0; // All things are equal.
    }

})();