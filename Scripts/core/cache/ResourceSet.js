


// Resource manager - DEPRECATION IN PROGRESS
/*CLASS*/

function ResourceSet(fLoadDataProc) {
    BaseObject.apply(this, arguments);
    this.$dataStates = { };
    this.$dataState = { loaded: false, lastchange: new Date(), dirty: true };
    this.data = { };
    if (fLoadDataProc != null) {
        if (BaseObject.is(fLoadDataProc, "function")) {
            this.onLoadData = fLoadDataProc;
        } else {
            this.data = fLoadDataProc;
        }
    }
}

ResourceSet.Inherit(BaseObject, "ResourceSet");
ResourceSet.prototype.data = null;
// the real data sits there
ResourceSet.prototype.$dataStates = null;
ResourceSet.prototype.isLoaded = function(branchChain) {
    var arr = branchChain.split(".");
    var branch = arr[0];
    var state = this.$dataStates[branch];
    if (state != null) {
        if (!state.loaded || state.dirty) return false;
        return true;
    } else {
        return false;
    }
};
ResourceSet.prototype.setLoaded = function(branchChain, data) { // sets the data for a specific branch and marks it as not dirty
    var arr = branchChain.split(".");
    var branch = arr[0];
    this.data[branch] = data;
    this.$dataStates[branch] = { loaded: true, lastchange: new Date(), dirty: false };
};
ResourceSet.prototype.ensureLoaded = function(branchChain, callback) { // returns true if the resource is already loaded
    var branch;
    if (branchChain != null) {
        var arr = branchChain.split(".");
        branch = arr[0];
        if (this.$dataStates[branch] == null) this.$dataStates[branch] = { loaded: false, lastchange: new Date(), dirty: true };
        this.onLoadData(branch, this.$dataStates[branch], callback);
    } else {
        this.onLoadData(null, this.$dataState, callback);
    }
};
ResourceSet.prototype.onLoadData = function(branch, state, callback) {
    // Override or pass a function to the constructor if you want to support by branch loading
};
ResourceSet.prototype.get_data = function(v) {
    if (v == null) { // split in two for debugging convenience
        this.ensureLoaded();
        return this.data;
    } else {
        this.ensureLoaded(v);
        return this.data;
    }
};
ResourceSet.prototype.get = function(path, defalutValue) {
    var arr;
    if (BaseObject.is(path, "string")) {
        arr = path.split(".");
    } else if (BaseObject.is(path, "Array")) {
        arr = path;
    }
    var o = this.data;
    for (var i = 0; i < arr.length && o != null; i++) {
        o = o[arr[i]];
    }
    return (o != null) ? o : defalutValue;
};
// {read source=globalresource path=errorNotFound}