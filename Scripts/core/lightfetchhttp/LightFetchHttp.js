/**
	type: 
	string 		- responseText => string to result.data
	view   		- responseText => string to result.views.normal
	json|data   - responseText => JSON.parse => result.data
	raw			- responseText => result
	active		- xhr		   <= result(manager)
	
	
	
	Following the philosophy of XHR this wraps it for reuse, but allows more settings to be preserved and reused for subsequential requests.
	
	Multiple patterns of usage are envisioned, basically we can try to categorize them as:
	- use properties for everything except post data, then just say "go"
	- use single call with arguments that change the URL and some others, but remember them so if we have to repeat - just say "go"
	
	Remarks:
		Dual timeout protection is implemented relying on the fact that the XHR timeout will occur before the timeout based on the system EventPump 
		which is involved as ultimate precaution. TODO: Consider removing the EventPump usage if no problems are detected long enough.
*/
function LightFetchHttp(type, bFillResponseHeaders) {
	BaseObject.apply(this, arguments);
	if (typeof type == "string") {
		this.$expectedContent = type;
	}
	var xhr = this.$xhr = new XMLHttpRequest();
	// Connect handlers permanently
	xhr.onreadystatechange = Delegate.createWrapper(this, this.onReadyStateChange);
	xhr.ontimeout = Delegate.createWrapper(this, this.onTimeout);
}
LightFetchHttp.Inherit(BaseObject, "LightFetchHttp");
LightFetchHttp.prototype.obliterate = function() {
	this.$xhr.onreadystatechange = null;
	this.$xhr.ontimeout = null;
	this.releaseActiveResult();
	this.$xhr = null;
	BaseObject.prototype.obliterate.call(this,null);
}

LightFetchHttp.$ultimateTimeLimit = 600;
LightFetchHttp.ImplementProperty("httpuser", new InitializeStringParameter("The user name for http std header", null));
LightFetchHttp.ImplementProperty("httppass", new InitializeStringParameter("The password for http std header", null));

LightFetchHttp.ImplementProperty("timelimit", new InitializeNumericParameter("The maximum time permitted for the request to complete in seconds, default is 60 seconds", null));
LightFetchHttp.ImplementProperty("fillResponseHeaders", new InitializeNumericParameter("Include the response headers in the result", false));
LightFetchHttp.ImplementProperty("expectedContent", new InitializeStringParameter("How to process/check the response", ""));
LightFetchHttp.ImplementProperty("withCredentials", new InitializeStringParameter("Send cookies for cors", false));
LightFetchHttp.ImplementProperty("queryBoolAsNumber", new InitializeBooleanParameter("When encoding data in query string, if set to true (default) booleans are sent as 0 and 1, otherwise as true/false", true));
LightFetchHttp.ImplementProperty("queryMaxDepth", new InitializeNumericParameter("When encoding data in query string, sets the max depth for object traversal, 0 is default", 0));
LightFetchHttp.ImplementProperty("postDataEncode", new InitializeStringParameter("Specifies how to encode the data for POST, PUT", "json"));

// + Plugins
/*
	Dynamic data consists of properties providing the fetcher with access to sources of tokens, parameters and alike. When a request is sent the fetcher will inspect them and 
	inject additional settings to the request (like headers).
*/
LightFetchHttp.prototype.$plugins = null;
LightFetchHttp.prototype.addPlugin = function(plugin) {
	if (!BaseObject.is(plugin, "LightFetchHttpPluginBase")) return false;
	if (this.$plugins == null) this.$plugins = [];
	var existing = this.$plugins.FirstOrDefault(function(idx, p) {
		if (p.classDefinition() == plugin.classDefinition()) return p;
	})
	if (existing != null) return false;
	this.$plugins.push(plugin);
	return true;
}
LightFetchHttp.prototype.removePlugin = function(plugin_ot_type) {
	if (this.$plugins == null) return false;
	var cls = Class.getClassDef(plugin_ot_type);
	for (var i = 0; i < this.$plugins.length; i++) {
		if (cls == this.$plugins[i].classDefinition()) {
			this.$plugins.splice(i,1);
			return true;
		}
	}
	return false;
}
LightFetchHttp.prototype.removeAllPlugins = function() {
	this.$plugins = null;
}

// Frequently used plugins have helper properties:
LightFetchHttp.prototype.set_bearerTokens = function(storage) {
	if (storage != null) {
		if (!BaseObject.is(storage, "IQueryTokenStorage")) throw "set_bearerToken accepts only IQueryTokenStorage as parameter.";
		var bp = new LightFetchHttpBearerPlugin(storage);
		return this.addPlugin(bp);
	} else {
		this.removePlugin(LightFetchHttpBearerPlugin);
	}
}


// - Plugins



LightFetchHttp.prototype.$url = null;
LightFetchHttp.prototype.get_url = function() {
	return this.$url;
}
LightFetchHttp.prototype.set_url = function(/*string,BkUrl*/url) {
	var bkurl;
	if (typeof url == "string") {
		// Convert to BkUrl
		bkurl = new BKUrl(url); // Defaults for BKUrl are assummed
	} else if (BaseObject.is(url, "BKUrl")) {
		bkurl = url;
	} else if (url == null) { // Clean up case
		this.$url = null;
		return true;
	} else {
		throw "Unsupported incorrect URL";
	}
	if (BaseObject.is(this.$url,"BKUrl")) {
		return this.$url.set_nav(bkurl);
	} else {
		this.$url = bkurl;
		return true;
	}
	return false;	
}
LightFetchHttp.prototype.url = function(v) {
	if (arguments.length > 0) {
		this.set_url(v);
	}
	return this.get_url();
}
// Encodings
// Into query string (only this is supported)
LightFetchHttp.prototype.dataToUrl = function(url, data) {
	return BKUrl.dataToURL(url, data, false, this.get_queryMaxDepth(), this.get_queryBoolAsNumber());
}
// Into body
LightFetchHttp.prototype.bodyEncoders = {
	json: function(data) {
		return JSON.stringify(data);
	},
	raw: function(data) {
		return data;
	},
	form: function(data) {
		var url = new BKUrl();
		BKUrl.dataToUrl(url, data, false, this.get_queryMaxDepth(), this.get_queryBoolAsNumber());
		return url.get_query().composeAsString();		
	}
};

// Events
LightFetchHttp.prototype.finished = new InitializeEvent("Fired when the request finishes");
LightFetchHttp.prototype.done = new InitializeEvent("Fired when the request finishes successfuly");
LightFetchHttp.prototype.sent = new InitializeEvent("Fired when the request was sent");
LightFetchHttp.prototype.progressed = new InitializeEvent("Fired during request to indicate progress");

LightFetchHttp.$valueProc = function() {
	var v = "";
	for (var i = 0;i < this.length;i++) {
		if (v.length > 0) v += ", ";
		v += this[i];
	}
	return v;
}
LightFetchHttp.ValueArray = function(v) {
	if (BaseObject.is(v, "Array") && v.Value == LightFetchHttp.$valueProc) return v;
	var va = [];
	va.Value = LightFetchHttp.$valueProc;
	return va;
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
// +Request headers
LightFetchHttp.prototype.$headers = new InitializeObject("Headers");
LightFetchHttp.prototype.setHeader = function(header, content) {
		this.$headers[header] = content;
		return this;
}
LightFetchHttp.prototype.getHeader = function(header) {
		return this.$headers[header];
}
// -Request headers


// +INTERNAL XHR HANDLERS
LightFetchHttp.prototype.onReadyStateChange = function() {
	if (this.$xhr != null) {
		if (this.$xhr.readyState == 4) {
			// Finished
			if (this.$xhr.status == 200) {
				if (this.$op != null && !this.$op.isOperationComplete()) {
					this.$op.CompleteOperation(true, this.getResponse());
				}
			} else {
				if (this.$op != null && !this.$op.isOperationComplete()) {
					this.$op.CompleteOperation(false, "Communication error, status=" + this.$xhr.status);
				}
			}
		} else if (this.$xhr.readyState == 2) {
		} else if (this.$xhr.readyState == 3) {
		}
	}
}
LightFetchHttp.prototype.onTimeout = function() {
	if (this.$op != null && !this.$op.isOperationComplete()) {
		this.$op.CompleteOperation(false, "Timeout");
	}
}
// -INTERNAL XHR HANDLERS

// +Internally maintained XHR and Operation
LightFetchHttp.prototype.$xhr = null;
LightFetchHttp.prototype.$op = null;
// -Internally maintained XHR and Operation
// +Currently connected active result
LightFetchHttp.prototype.$activeresult = null;
// -Currently connected active result

// +State query
LightFetchHttp.prototype.releaseActiveResult = function() {
	if (BaseObject.is(this.$activeresult, "LightFetchHttpActiveResult")) {
		this.$activeresult.release();
	}
	this.$activeresult = null;
}
LightFetchHttp.prototype.isOpened = function() {
	if (this.$xhr && this.$xhr.readyState >= 1) return true;
	return false;
}
LightFetchHttp.prototype.isComplete = function() {
	if (this.$xhr && this.$xhr.readyState == 4) return true;
	return false;
}
// -State query

// +Response reading
LightFetchHttp.prototype.getResponse = function() {
	if (this.isComplete()) {
		this.discardAsync("cancellrequest");
		var res = {
			status: {
				issuccessful: this.$xhr.status == 200, // for compatibility reasons in this case both are the same
				httpSuccess: this.$xhr.status == 200,
				httpStatus: this.$xhr.status,
				httpStatusText: this.$xhr.statusText,
				headers: {}
			}
		};
		if (res.status.issuccessful) {
			switch (this.get_expectedContent()) {
				case "string":
				case "text":
				case "":
					res.data = this.$xhr.responseText;
					break;
				case "data":
				case "json":
					res.data = JSON.parse(this.$xhr.responseText);
					res.datas = { "default": res.data }; // Link it here also for compatibility with both 0.9 and 1.0
					break;
				case "blob":
					// TODO Change this (**if we decide to**) also change UserProfileAvatarImage - the only code using it to match the change
					// the change: res.blob = this.$xhr.response;
					res = this.$xhr.response;
					break;
				case "active":
					res = new LightFetchHttpActiveResult(this);
					this.$activeresult = res;
					return res;
					break;
				default:
					res.status.issuccessful = false;
					res.status.message = "Unknown request type";
			}
		}
		if (this.get_fillResponseHeaders()) {
			res.status.headers = this.getAllResponseHeaders();
		}
		return res;
	}
	return null;
}
/**
	Like the same named method of XHR gets all the response headers, but in more manageable form:
	def(
		Object<header>
		header := HArray<string>
		HArray := 
					Array<string>
						.Value() => Array<string.join(". ");
	)
*/
LightFetchHttp.prototype.getAllResponseHeaders = function() {
	var /*string*/ headers = String.reGroups2(this.$xhr.getAllResponseHeaders(),/([A-Za-z0-9\-]+)\:\s+(.*)/,"header","value");
	var result = {};
	var /*ValueArray*/ headerVal;
	for (var i = 0; i < headers.length;i++) {
		headerVal = LightFetchHttp.ValueArray(result[headers[i].header]);
		headerVal.push(headers[i].value);
		result[headers[i].header] = headerVal;
	}
	return result;
}
// - Response reading

// +Internal 
LightFetchHttp.prototype.$settimelimit = function() {
	// Not sure if we need this overprotection - the XHR timeout should work fine, but it does not hurt, does it?
	var tl = this.get_timelimit();
	if (typeof tl == "number" && tl < LightFetchHttp.$ultimateTimeLimit) {
		this.async(this.$requestReset).after(tl * 1000).key("cancellrequest").execute();
	}
}
LightFetchHttp.prototype.$requestReset = function() {
	if (this.$xhr != null) {
		this.$xhr.abort();
		this.$xhr.responseType = "";
		this.releaseActiveResult();
		if (this.$op != null) {
			var op = this.$op;
			this.$op = null;
			if (!op.isOperationComplete()) {
				op.CompleteOperation(false,"aborted");
			}
		}
	}
}

// -Internal 

/** The fetch (go) internal procedure
	@param url {BKUrl}
	@param reqdata {any} data to encode into the query string
	@param bodydata {any?} Data to encode into the body
	
	The data is encoded into the url if the method is GET, HEAD
*/
LightFetchHttp.prototype.$fetch = function(url, /*encoded*/ reqdata, bodydata) {
	if (this.$xhr != null) {
		var i;
		if (this.isOpened()) {
			this.$requestReset();
			//return Operation.Failed("busy - reset needed");
		}
		
		this.discardAsync("cancellrequest");
		this.$op = new Operation();
		
		try {
			var urlString = null;
			// TODO: Analysis of the URL requires some url comparison features in BkUrl
			//			The analysis should be based on needs not completely defined yet.
			if (BaseObject.is(url,"BKUrl")) {
				// Encode any query string data
				if (reqdata != null) {
					this.dataToUrl(url, reqdata);
				}
				urlString = url.composeAsString();
			} else {
				throw "The url is not processed";
			}
			xhr = this.$xhr;
			xhr.open(this.$method, urlString, true, this.$httpuser, this.$httppass);
			xhr.withCredentials = this.get_withCredentials();
			for (var h in this.$headers) {
				if (this.$headers.hasOwnProperty(h)) {
					xhr.setRequestHeader(h, this.$headers[h]);
				}
			}
			if (this.$plugins != null) {
				for (i = 0; i < this.$plugins.length; i++) {
					this.$plugins[i].manipulateRequest(this, xhr);
				}
			}
			// Set timeout (allowed between open and send)
			var tl = this.get_timelimit();
			if (typeof tl == "number" && tl > 0) {
				xhr.timeout = tl * 1000;
			}
			var body = null;
			if (bodydata != null) {
				var benc = this.get_postDataEncode(); // Body encoding
				if (typeof benc == "string") {
					if (typeof this.bodyEncoders[benc] == "function") {
						body = this.bodyEncoders[benc].call(this, bodydata);
					} else {
						throw "Unknown body data encoding " + benc;
					}
				} else if (BaseObject.isCallback(benc)) {
					body = BaseObject.callCallback(benc);
				} else {
					throw "Unknown value time in postDataEncode. Specify either predefined string encoding name or a callback";
				}
			}
			switch (this.get_expectedContent()) {
				case "blob":
					xhr.responseType = "blob";
					break;
				case "text":
				case "string":
					xhr.responseType = "text";
					break;

			}
			xhr.send(body);
			// Add time limit callback (if needed)
			this.$settimelimit();
		} catch (ex) {
			if (BaseObject.is(this.$op, "Operation") && !this.$op.isOperationComplete()) {
				this.$op.CompleteOperation(false, "exception occured: " + ex);
			}
		}
		return this.$op;
	}
	return null; // Nothing happened;	
}

// Fetch variants
LightFetchHttp.prototype.get = function(url, data, exptype) {
	if (url != null) this.set_url(url);
	if (typeof exptype == "string") this.set_expectedContent(exptype);
	return this.$fetch(this.get_url(), data);
}
LightFetchHttp.prototype.post = function(url, data, enctype, exptype) {
	if (url != null) this.set_url(url);
	if (typeof exptype == "string") this.set_expectedContent(exptype);
	if (enctype != null) this.set_postDataEncode(enctype);
	return this.$fetch(this.get_url(), null, data);
}
LightFetchHttp.prototype.postEx = function(url, reqdata, data, enctype, exptype) {
	if (url != null) this.set_url(url);
	if (typeof exptype == "string") this.set_expectedContent(exptype);
	if (enctype != null) this.set_postDataEncode(enctype);
	return this.$fetch(this.get_url(), reqdata, data);
}

// Other publics
LightFetchHttp.prototype.reset = function(exptype) {
	this.$requestReset();
	if (typeof exptype == "string") {
		this.set_expectedContent(exptype);
	}
}