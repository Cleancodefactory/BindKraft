


/*CLASS*/
// This class needs a host in order to work!
function FastArrayConnector(arg, host) {
    Connector.apply(this, arguments);
}
FastArrayConnector.Inherit(Connector, "FastArrayConnector");
FastArrayConnector.prototype.resolve = function (callback) {
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
            if ((params.startrowindex != null && params.startrowindex > 0) && params.numrows != null) {
                this.$resource = this.$resource.slice(params.startrowindex - 1, params.startrowindex - 1 + params.numrows);
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