(function () {

    var IComparison = Interface("IComparison");

    /**
     * Sorter (Comparison) for objects by the values of some of their fields
     * The syntax is series of objects:
     * { propName: direction}
     * propName - the name of the property
     * direction - either -1 (descending) or 1 (ascending) or
     *             callback/IComparison over the value
     * 
     * @param {Array<object>|object} directions
     */
    function ObjectComparison(directions) {
        BaseObject.apply(this, arguments);
        if (Array.isArray(directions)) {
            this.init(directions);
        } else if (directions != null && typeof directions == "object") {
            this.init([directions]);
        }
    }
    ObjectComparison.Inherit(BaseObject,"ObjectComparison")
    .Implement(IComparison);

    ObjectComparison.prototype.$comparisons = null;

    /**
     * @param {Array<object>} directions
     */
    ObjectComparison.prototype.init = function(directions) {
        if (Array.isArray(directions)) {
            var arr = [];
            for (var i=0; i<directions.length; i++) {
                var o = directions[i];
                if (typeof o == "object" && o != null) {
                    for (var field in o) { 
                        var fd = o[field];
                        if (typeof fd == "number") {
                            arr.push(new ObjectFieldComparison(field,fd));
                        } else if (typeof fd == "string") {
                            if (fd.toLowerCase() == "asc") {
                                arr.push(new ObjectFieldComparison(field,1));
                            } else if (fd.toLowerCase() == "desc") {
                                arr.push(new ObjectFieldComparison(field,-1));
                            }
                        } else if (BaseObject.isCallback(fd) || BaseObject.is(fd, "IComparison")) {
                            arr.push(new ObjectFieldComparison(field,fd));
                        } else {
                            // Nothing
                            this.LASTERROR("Unrecognized ordering instruction " + fd);
                        }
                    }
                }
            }
            this.$comparisons = arr;
        }
    }

    ObjectComparison.prototype.compare = function(a, b) { 
        if (Array.isArray(this.$comparisons)) {
            var result = 0;
            for (var i = 0; i < this.$comparisons.length; i++) {
                var comparison = this.$comparisons[i];
                if (BaseObject.is(comparison, "IComparison")) {
                    result = comparison.compare(a, b);
                    if (result != 0) break;
                }
            }
            return result;
        }
        return 0; // Everything looks the same if we cannot discriminate between objects
    };

})();