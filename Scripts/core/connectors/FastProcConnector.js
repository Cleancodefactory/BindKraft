


/*CLASS*/
// The bindhost is required and the address is the name of a function(start, limit) on it.
// The function can do whatever, but should return from start (if present, otherwise from 0)
// limit entries (if present, otherwise to the end)
function FastProcConnector(arg, host) {
	FastArrayConnector.apply(this,arguments);
}
FastProcConnector.Inherit(FastArrayConnector, "FastProcConnector");
FastProcConnector.$lengthPropName = ".length";
FastProcConnector.prototype.resolve = function (callback) {
    var result = null;
	if (this.host == null || this.$data == null || this.$data == "") {
		this.$resource = null;
		return false;
	}
	var f;
	var params = this.get_parameters();
	if (this.$data.indexOf(FastProcConnector.$lengthPropName) == (this.$data.length - FastProcConnector.$lengthPropName.length)) {
		f = this.host[this.$data.slice(0, this.$data.length - FastProcConnector.$lengthPropName.length)];
		this.$resource = f.call(this.host, "length", params, params);
		return true;
	}
	f = this.host[this.$data];
    if (typeof f != "function") {
		this.$resource = null;
		return false;
	}
	if (params != null) {
		this.$resource = f.call(this.host, 
								((params.startrowindex != null && params.startrowindex > 0)?params.startrowindex:1),
								params.numrows, 
								params); // Params are sent for potential filtering functionality
	} else {
		this.$resource = f.call(this.host);
	}
    return true; // as is
};