


/*CLASS*/

function ArrayView() {
    Base.apply(this, arguments);
    this.$filter = { };
};
ArrayView.Inherit(Base, "ArrayView");
ArrayView.prototype.$builtin = null;
ArrayView.prototype.get_builtin = function() { return this.$builtin; };
ArrayView.prototype.set_builtin = function(v) {
    if (typeof this["$std_" + v] == "function") {
        this.filterproc = new Delegate(this, this["$std_" + v]);
    }
    this.$builtin = v;
};
ArrayView.prototype.$input = null;
ArrayView.prototype.set_input = function(v) {
    this.$input = v;
};
ArrayView.prototype.get_input = function() {
    return this.$input;
};
ArrayView.prototype.set_output = function(v) {
    // Cannot be set
};
ArrayView.prototype.get_output = function() {
    if (BaseObject.is(this.filterproc, "Delegate")) {
        if (BaseObject.is(this.$input, "Array")) {
            var o, arr = [];
            for (var i = 0; i < this.$input.length; i++) {
                o = this.filterproc.invoke(this.$input[i], this.$filter);
                if (o != null) arr.push(o);
            }
            return arr;
        }
    }
    return this.$input;
};
ArrayView.prototype.$filter = null;
ArrayView.prototype.set_filter = function(idx, v) {
    this.$filter[idx] = v;
};
ArrayView.prototype.get_filter = function(idx) {
    return this.$filter[idx];
};
ArrayView.prototype.filterproc = new Initialize("Callback to perform the filtering: function(data,{...params...}) returns filtered array");
ArrayView.prototype.$std_FilterDeleted = function(item) {
    if (item[Binding.entityStatePropertyName] != DataStateEnum.Deleted) return item;
    return null;
};