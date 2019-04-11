


/*CLASS*/
function StringConnector(arg, host) {
    Connector.apply(this, arguments);
}
StringConnector.Inherit(Connector, "StringConnector");
StringConnector.prototype.resolve = function (callback) {
    this.$resource = this.$data;
    return true;
};