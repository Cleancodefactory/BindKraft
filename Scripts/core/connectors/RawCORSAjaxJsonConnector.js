


/*CLASS*/
function RawCORSAjaxJsonConnector(url, host) {
    Connector.apply(this, arguments);
    this.isAsync = true;
    this.cache = false;
    this.host = (BaseObject.is(this.host, "BaseObject")) ? this.host : this; // Correct the host if it is not BaseObject derived (we need ajax functionality over it)
}
RawCORSAjaxJsonConnector.Inherit(Connector, "RawCORSAjaxJsonConnector");
RawCORSAjaxJsonConnector.ImplementProperty("usepost", new InitializeBooleanParameter("Use POST to bind to the resource and post the parameters instead of attaching them into the URL. The store always uses post.", false));
RawCORSAjaxJsonConnector.prototype.$getUrlMethod = function () {
    var u = this.$data;
    if (u != null && u.length > 0 && u.indexOf("post:") == 0) return "POST";
    return "GET";
};
RawCORSAjaxJsonConnector.prototype.$getUrlQuery = function () {
    var u = this.$data;
    if (u != null && u.length > 0 && u.indexOf("post:") == 0) return u.slice(5);
    return u;
};

RawCORSAjaxJsonConnector.prototype.$adjustSettings = function(settings) {
	if (this.$options != null) {
		// TODO: Not sure if we need any option.
	}
}
RawCORSAjaxJsonConnector.prototype.resolve = function (callback) {
    // hint: ajaxGetXml = function(url, data, callback, cache) {
    var self = this;
    var settings = {
        url: this.$getUrlQuery(),
        dataType: 'json',
        crossDomain: true,
        
        cache: this.cache,
        success: function (result, statusText, xhr) {
            self.$reportResult(true, result, null, callback);
        },
        error: function(xhr, statusText, errdesc) {
            self.$reportResult(false, null, "Communication error", callback);
        }

    };
    if (this.$options.allheaders) {
        if (settings["xhrFields"] == null) settings["xhrFields"] = {};
        settings["xhrFields"].withCredentials = true;
    }
    var params = this.get_parameters();
    var requmethod = this.$getUrlMethod();
    if (requmethod == "POST") { 
        settings.type = "POST";
        settings.contentType = "application/json; charset=utf-8"; // we aresending stringified json as post body 
    }
    settings.data = params;
    
	this.$adjustSettings(settings); // Does nothing for now
    $.ajax(settings);
};