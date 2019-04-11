

/*CLASS*/
function URLConnector(url,host) { // Cache is currently unused
    Connector.apply(this, arguments);
    this.isAsync = true;
    this.useCache = false;
}
URLConnector.Inherit(Connector, "URLConnector");
URLConnector.prototype.resolve = function (callback) {
    var self = this;
    if (typeof this.$data == "string") {
        $.get(this.$data, null, function (data, textStatus) {
            self.$reportResult(true, data, null, callback);
        }).error(function (xhr) {
            self.$reportResult(false, null, "Communication error", callback);
        });
    } else if (typeof this.$data == "object" && typeof this.$data.url == "string") {
        // $.post
    }
    return true; // Asynch connectors return true
};