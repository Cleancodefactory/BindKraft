(function() {

    var Predicate = Class("Predicate"),
        IEquality = Interface("IEquality"),
        IComparison = Interface("IComparison");
    /**
     * An Array manipulator class intended for performing operations with passed/pre-defined predicate or other functions.
     * This class implements functionality somewhat intersecting with what the Array has as added methods by BK and in time some of 
     * them will be moved here completely, but in general the idea is to concentrate mostly on operations that need operation state 
     * (e.g. the predicate) in order to avoid polluting the array objects with such data which will make them unsafe when used concurrently.
     * @param {Array} array The array on which the operations will be performed.
     * @param {Func<any,boolean>} predicate The function applied to the array elements when predicate is needed. 
     */
    function DoArray(array, predicate, sorter) {
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
        if (BaseObject.is(sorter,"IComparison")) {
            this.comparison = sorter;    
        } else if (BaseObject.isCallback(sorter)) {
            this.comparison = new Comparison(sorter);
        }
    }
    DoArray.Inherit(BaseObject, "DoArray");

    DoArray.Over = function(array) {
        return new DoArray(array);
    }
    DoArray.prototype.EqualityAs = function(predicate) {
        if (BaseObject.is(predicate,"IEquality")) {
            this.predicate = predicate;    
        } else if (BaseObject.isCallback(predicate)) {
            this.predicate = new Predicate(predicate);
        }
        return this;
    }
    DoArray.prototype.ComparisonAs = function(compare) {
        if (BaseObject.is(compare,"IComparison")) {
            this.comparison = compare;    
        } else if (BaseObject.isCallback(compare)) {
            this.comparison = new Comparison(compare);
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
    DoArray.prototype.$useComparison = function(compare) {
        var comparer =  this.comparison;
        if (compare != null) {
            if (BaseObject.is(compare,"IComparison")) {
                comparer = compare;    
            } else if (BaseObject.isCallback(compare)) {
                comparer = new Comparison(compare);
            }
        }
        if (comparer == null) comparer = function(a,b) {return a - b;}
        return comparer;
    }


    DoArray.prototype.predicate = null;
    DoArray.prototype.comparison = null;
    

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
    DoArray.prototype.sort = function(compare) { 
        var comparer = this.$useComparison(compare);
        this.array.sort(comparer);
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
    DoArray.prototype.DataState = new InitializeInterfaceBubble("Manipulations according to data state","IDataStateManipulator",{

        Delete: function(item_index) { 
            var index = item_index;
            var item = item_index;
            if (typeof item_index == "object") {
                index = this.array.indexOf(item_index);
            } else if (typeof item_index == "number") {
                if (index >= 0 && index < this.array.length) {
                    item = this.array[index];
                    index = -1;
                } else {
                    item = null;
                }
            }
            if (index >= 0) {
                if (Binding.isInStore(item)) {
                    Binding.asDeleted(item);
                } else {
                    this.array.splice(index, 1);
                }
            }
            return item;
        },
        New: function(item_index) {
            var item = item_index;
            if (typeof item_index == "number") {
                if (item_index >= 0 && item_index < this.array.length) {
                    // Make the item new
                    item = this.array[item_index];
                    return Binding.asNew(item);
                } else {
                    this.LASTERROR("Index out of range", "New");
                    return null;
                }
            } else if (typeof item_index == "object") {
                this.array.push(Binding.asNew(item_index));
                return item_index;
            }
            return null;
        },
        Update: function(item_index, item_changes) {
            var item = item_index;
            var index = -1;
            if (typeof item_index == "number") {
                if (item_index >= 0 && item_index < this.array.length) {
                    item = this.array[item_index];
                    index = item_index;
                } else {
                    item = null;
                }
            } else if (typeof item_index == "object") {
                // Find it
                index = indexOf(item_index);
                if (index < 0) {
                    // Not found - cannot update
                    item = null;
                } else {
                    item = this.array[index];
                }
            }
            if (item != null && index >= 0) {
                if (item_changes != null && typeof item_changes == "object") {
                    this.array[index] = Binding.asChanged(BaseObject.CombineObjects(item, item_changes));
                } else {
                    Binding.asChanged(item);
                }
                return item;
            }
            return null;
        }
        
    });
})();