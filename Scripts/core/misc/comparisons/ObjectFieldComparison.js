(function() {

    var IComparison = Interface("IComparison");

    function ObjectFieldComparison(fieldname, direction) {
        BaseObject.apply(this, arguments);
        this.fieldName = fieldname;
        if (typeof fieldname != 'string') {
            return new DummyComparison();
        }
        if (typeof direction == "number" || direction == null) {
            var _dir = direction || 1;
            if (_dir < 0) {
                this.$proc = function(a,b) { 
                    if (a > b) return -1;
                    if (b > a) return 1;
                    return 0;
                }
            } else {
                this.$proc = function(a,b) { 
                    if (a > b) return 1;
                    if (b > a) return -1;
                    return 0;
                }
            }
            
        } else if (BaseObject.is(direction, "IComparison")) {
            this.$proc = function(a,b) {
                return direction.compare(a,b);
            }
        } else if (BaseObject.isCallback(direction)) {
            this.$proc = direction;
        } else {
            this.$proc = function(a,b) { 
                if (a > b) return 1;
                if (b > a) return -1;
                return 0;
            }
        }
    }

    ObjectFieldComparison.Inherit(BaseObject, "ObjectFieldComparison")
    .Implement(IComparison, "ObjectFieldComparison");

    ObjectFieldComparison.prototype.$proc = null;

    ObjectFieldComparison.prototype.compare = function(a,b) {
        var _a = null, _b = null;
        if (a != null) _a = a[this.fieldName];
        if (b != null) _b = b[this.fieldName];
        return this.$proc(_a,_b);
    }

})();