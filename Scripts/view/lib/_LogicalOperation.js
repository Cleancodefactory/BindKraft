


/*CLASS*/

function LogicalOperation() {
    Base.apply(this, arguments);
    this.$input = { };
}

LogicalOperation.Inherit(Base, "LogicalOperation");
LogicalOperation.prototype.operation = new InitializeStringParameter("Operation to perform over all the input[x] values - or, and, xor. Default is or", "or");
LogicalOperation.prototype.$input = null;
LogicalOperation.prototype.set_input = function(idx, v) {
    this.$input[idx] = v;
};
LogicalOperation.prototype.get_input = function(idx) {
    return this.$input[idx];
};
LogicalOperation.prototype.operatorproc = function(idx) {
    switch (this.operation) {
    case "or":
        for (x in this.$input) {
            if (this.$input[x]) return true;
        }
        return false;
        break;
    case "and":
        for (x in this.$input) {
            if (!this.$input[x]) return false;
        }
        return true;
        break;
    case "xor":
        var i = 0;
        for (x in this.$input) {
            if (this.$input[x]) i++;
        }
        if (i % 2 != 0) return true;
        return false;
        break;
    }
    return null;
};
LogicalOperation.prototype.get_output = function() {
    if (BaseObject.is(this.operatorproc, "Delegate")) {
        return this.operatorproc.invoke(this.$input);
    } else if (typeof this.operatorproc == "function") {
        return this.operatorproc.call(this, this.$input);
    } else {
        return null;
    }
};