(function() {

    var Predicate = Class("Predicate"),
        IEquality = Interface("IEquality");

    function DoArray(array, predicate) {
        BaseObject.call(this, array);
        if (Array.isArray(array)) {
            this.array = array;
        } else {
            throw "DoArray must be created with an array";
        }
        if (BaseObject.is(predicate,"IEquality")) {
            this.predicate = predicate;    
        } else if (BaseObject.isCallback(predicate)) {
            this.predicate = new Predicate(predicate);
        }
        
    }
    DoArray.Inherit(BaseObject, "DoArray");

    DoArray.Over = function(array) {
        return new DoArray(array);
    }
    DoArray.prototype.CompareAs = function(predicate) {
        if (BaseObject.is(predicate,"IEquality")) {
            this.predicate = predicate;    
        } else if (BaseObject.isCallback(predicate)) {
            this.predicate = new Predicate(predicate);
        }
        return this;
    }


    DoArray.prototype.$usePredicate = function(predicate) {
        var comparer =  this.predicate;
        if (predicate != null) {
            if (BaseObject.is(predicate,"IEquality")) {
                comparer = predicate;    
            } else if (BaseObject.isCallback(predicate)) {
                comparer = new Predicate(predicate);
            }
        }
        if (comparer == null) comparer = function(a,b) {return a== b;}
        return comparer;
    }


    DoArray.prototype.predicate = null;
    

    DoArray.prototype.addUnique = function(v,predicate) {
        var comparer = this.$usePredicate(predicate);
        if (comparer != null) {
            for (var i =0;i<this.array.length;i++) {
                if (comparer.areEqual(this.array[i], v)) return this;
            }
            this.array.push(v);
            return this;
        }
        this.array.push(v);
        return this;
    }
    DoArray.prototype.indexOf = function(v, predicate) {
        var comparer = this.$usePredicate(predicate);
        var i = 0;
        for (i =0;i<this.array.length;i++) {
            if (comparer.areEqual(this.array[i], v)) return i;
        }
        return -1;
    }
    DoArray.prototype.remove = function(v, predicate) {
        var comparer = this.$usePredicate(predicate);
        var i = this.indexOf(v,comparer);
        this.array.splice(i,1);
        return this;
    }
    // DoArray.prototype.with = function(v, predicate, action) {
    //     var comparer = this.$usePredicate(predicate);
    //     var i = this.indexOf(v,comparer);
    //     var me = this;
    //     if (i >= 0) {
    //         if (BaseObject.isCallback(action)) {
    //             BaseObject.callCallback(action,
    //                 function() {
    //                     me.array.push(v);
    //                 },
    //                 function() {
    //                     me.array.splice(i,1)
    //                 }
    //             );
    //         }
    //     }
    // }
})();