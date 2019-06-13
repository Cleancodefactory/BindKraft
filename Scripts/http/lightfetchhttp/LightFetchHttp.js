function LightFetchHttp() {
	BaseObject.apply(this, arguments);
}
LightFetchHttp.Inherit(BaseObject, "LightFetchHttp");
LightFetchHttp.ImplementProperty("httpuser", new InitializeStringParameter("The user name for http std header", null));
LightFetchHttp.ImplementProperty("httppass", new InitializeStringParameter("The password for http std header", null));
LightFetchHttp.ImplementProperty("url", new InitializeStringParameter("The raw url for the request, any mapping, constructing MUST be done before setting it", null));


LightFetchHttp.prototype.get_busy = function() {
	return (this.$xhr != null);
}

LightFetchHttp.prototype.url = function(v) {
	if (arguments.length > 0) {
		this.set_url(v);
	}
	return this.get_url();
}
LightFetchHttp.prototype.$method = "GET";
LightFetchHttp.prototype.get_method = function() {
	return this.$method;
}
LightFetchHttp.prototype.set_method = function(v) {
	if (v == null) {
		tihs.$method = "GET";
	} else {
		this.$method = (v + "").toUpperCase();
	}
}
LightFetchHttp.prototype.$headers = new InitializeObject("Headers");
LightFetchHttp.prototype.setHeader = function(header, content) {
		this.$headers[header] = content;
		return this;
}
LightFetchHttp.prototype.getHeader = function(header) {
		return this.$headers[header];
}
LightFetchHttp.prototype.responseHeader = function(header) {
	if (header == null) {
		////
	} else {
		/////
	}
}

/////

LightFetchHttp.prototype.onReadyStateChange = function() {
	if (this.$xhr != null) {
		if (this.$xhr.readyState == 4) {
			// Finished
			if (this.$xhr == 200) {
				//////////
			}
		} else if (this.$xhr.readyState == 2) {
		} else if (this.$xhr.readyState == 3) {
		}
	}
}
LightFetchHttp.prototype.$xhr = null;
LightFetchHttp.prototype.fetch = function(body) {
	if (this.$xhr == null) {
		this.$xhr = new XMLHttpRequest();
		xhr.open(this.$method, this.$url, true, this.$httpuser, this.$httppass);
		for (var h in this.$headers) {
			if (this.$headers.hasOwnProperty(h)) {
				xhr.setRequestHeader(h, this.$headers[h]);
			}
		}
		// Connect handlers
		xhr.onreadystatechange = Delegate.createWrapper(this, this.onReadyStateChange);
		xhr.send(body);
	}
	return false; // Nothing happened;	
	
}