


/*CLASS*/
function AjaxXmlConnector(url, host, options) {
    Connector.apply(this, arguments);
    this.isAsync = true;
    this.cache = false;
    this.host = (BaseObject.is(this.host, "BaseObject")) ? this.host : this; // Correct the host if it is not BaseObject derived (we need ajax functionality over it)
	this.set_address(url); // Implements module mapping if the option moduleName is present.
}
AjaxXmlConnector.Inherit(Connector, "AjaxXmlConnector");
AjaxXmlConnector.ImplementProperty("usepost", new InitializeBooleanParameter("Use POST to bind to the resource and post the parameters instead of attaching them into the URL. The store always uses post.", false));
AjaxXmlConnector.prototype.$getUrlMethod = function () {
    var u = this.$data;
    if (u != null && u.length > 0 && u.indexOf("post:") == 0) return "POST";
    return "GET";
};
AjaxXmlConnector.prototype.$getUrlQuery = function () {
    var u = this.$data;
    if (u != null && u.length > 0 && u.indexOf("post:") == 0) return u.slice(5);
    return u;
};
AjaxXmlConnector.prototype.set_address = function (v) {
	if (this.$options.moduleName != null && this.$options.moduleName.length > 0) {
		this.$data = IPlatformUrlMapper.mapModuleUrl(v,this.$options.moduleName);
	} else {
		this.$data = v;
	}
};
AjaxXmlConnector.prototype.$adjustSettings = function(settings) {
	if (this.$options != null) {
		if (this.$options.contentFlags != null && typeof this.$options.contentFlags == "number") {
			settings.requestedContentFlags = this.$options.contentFlags;
		}
	}
}
AjaxXmlConnector.prototype.resolve = function (callback) {
    // hint: ajaxGetXml = function(url, data, callback, cache) {
    var self = this;
    var settings = {
        url: this.$getUrlQuery(),
        dataType: 'xml',
        cache: this.cache,
        success: function (data) {
            if (data.status.issuccessful) {
				if (self.$options != null && self.$options.packetMode) {
					self.$reportResult(true, data, null, callback);
				} else {
					self.$reportResult(true, data.data, null, callback);
				}
            } else {
                self.$reportResult(false, null, ((data.status.message != null) ? data.status.message : "Communication error"), callback);
            }
        },
        error: function (xmlHttpReq, textStatus, errDescription) {
            self.$reportResult(false, null, "Communication error", callback);
        }
    };
    var params = this.get_parameters();
    var requmethod = this.$getUrlMethod();
    if (requmethod == "POST") {
        settings.type = "POST";
        settings.contentType = "application/json; charset=utf-8"; // we aresending stringified json as post body
        settings.data = params;
    } else {
        settings.getparams = params;
    }
	this.$adjustSettings(settings);
    this.host.ajax(settings, "xml");
};