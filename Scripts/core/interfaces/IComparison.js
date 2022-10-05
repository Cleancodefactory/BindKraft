(function() {
    function IComparison() {}
    IComparison.Interface("IComparison");

    /**
     * Must return >0 if a is greater than b
     *  < 0 if b is greater than a
     * and 0 if they are equal.
     * The actual meaning of greater is of course arbitrary, when used for sorting greater means sorts before the lower/smaller.
     */
    IComparison.prototype.compare = function(a, b) { throw "not implemented"; };
    
})();