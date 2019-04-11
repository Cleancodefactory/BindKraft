


/*CLASS*/
// This class needs a host in order to work!
function ArrayConnector(arg, host) {
    Connector.apply(this, arguments);
}
ArrayConnector.Inherit(Connector, "ArrayConnector");
ArrayConnector.prototype.resolve = function (callback) {
    var result = null;
    if (this.$data != null && this.$data != "") {
        result = BaseObject.getProperty(this.host, this.$data);
    } else {
        result = this.host;
    }
    if (BaseObject.is(result, "Array")) {
        this.$resource = result; // just in case nothing happens next - we return the array "as is"
        var params = this.get_parameters();
        if (params != null) {
            this.$resource = this.$resource.clone();
            if (params.fieldtosort != null) {
                var ord = {};
                ord[params.fieldtosort] = ((params.sortdirection == "DESC") ? -1 : 1);
                this.$resource = this.$resource.OrderBy(ord);
            }
            if ((params.startrowindex != null && params.startrowindex > 0) || params.numrows != null) {
                this.$resource = this.$resource.Select(function (idx, item) {
                    if (params.startrowindex != null) {
                        if (idx < (params.startrowindex - 1)) return null;
                    }
                    if (params.numrows > 0) {
                        var s = ((params.startrowindex == null) ? 0 : params.startrowindex);
                        if (idx - (s - 1) >= params.numrows) return null;
                    }
                    return item;
                });
            }
        }
        return true;
    } else {
        this.$resource = result;
        return true; // as is
    }
    /////
    this.$resource = this.host[this.$data];
    return false;
};