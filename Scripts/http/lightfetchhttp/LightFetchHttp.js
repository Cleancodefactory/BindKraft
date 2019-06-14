/**
	type: 
	string 		- responseText => string to result.data
	view   		- responseText => string to result.views.normal
	json|data   - responseText => JSON.parse => result.data
	
*/
function LightFetchHttp(type, bFillResponseHeaders) {
	BaseObject.apply(this, arguments);
	this.$expectedContent = type;
	this.$xhr = new XMLHttpRequest();
}
LightFetchHttp.Inherit(BaseObject, "LightFetchHttp");
LightFetchHttp.$ultimateTimeLimit = 600;
LightFetchHttp.ImplementProperty("httpuser", new InitializeStringParameter("The user name for http std header", null));
LightFetchHttp.ImplementProperty("httppass", new InitializeStringParameter("The password for http std header", null));
LightFetchHttp.ImplementProperty("url", new InitializeStringParameter("The raw url for the request, any mapping, constructing MUST be done before setting it", null));
LightFetchHttp.ImplementProperty("timelimit", new InitializeNumericParameter("The maximum time permitted for the request to complete in seconds, default is 60 seconds", 60));
LightFetchHttp.ImplementProperty("fillResponseHeaders", new InitializeNumericParameter("Include the response headers in the result", 60));
LightFetchHttp.ImplementProperty("expectedContent", new InitializeStringParameter("Hoe to process/check the response", ""));
LightFetchHttp.ValueArray.$valueProc = function() {
	var v = "";
	for (var i = 0;i < this.length;i++) {
		if (v.length > 0) v += ", ";
		v += this[i];
	}
	return v;
}
LightFetchHttp.ValueArray = function(v) {
	if (BaseObject.is(v, "Array") && typeof v.Value == "function") return v;
	var va = [];
	va.Value = LightFetchHttp.ValueArray.$valueProc;
	return va;
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
	if (this.$xhr != null) {
		if (header == null) {
			if (this.$xhr.readyState
		} else {
			/////
		}
	}
	return null;
}

/////

LightFetchHttp.prototype.onReadyStateChange = function() {
	if (this.$xhr != null) {
		if (this.$xhr.readyState == 4) {
			// Finished
			if (this.$xhr.status == 200) {
				//////////
			}
			this.$xhr = null;// Clean up
		} else if (this.$xhr.readyState == 2) {
		} else if (this.$xhr.readyState == 3) {
		}
	}
}
LightFetchHttp.prototype.$xhr = null;
LightFetchHttp.prototype.$op = null;
LightFetchHttp.prototype.isOpened = function() {
	if (this.$xhr && this.$xhr.readyState >= 1) return true;
	return false;
}
LightFetchHttp.prototype.isComplete = function() {
	if (this.$xhr && this.$xhr.readyState == 4) return true;
	return false;
}
LightFetchHttp.prototype.getResponse = function() {
	if (this.isComplete()) {
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
				case "":
					res.data = this.responseText;
				break;
				case "view":
					res.views = {
						normal: this.responseText;
					};
				break;
				case "data":
				case "json":
				break;
				default:
					res.status.issuccessful = false;
					res.status.message = "Unknown request type";
			}
		}
		if (this.get_fillResponseHeaders()) {
			var headers = String.reGroups2(s,/([A-Za-z0-9\-]+)\:\s+(.*)/,"header","value");
			var headerVal;
			for (var i = 0; i < headers.length;i++) {
				headerVal = LightFetchHttp.ValueArray(res.status.headers[headers[i].header]);
				headerVal.push(headers[i].value);
				res.status.headers[headers[i].header] = headerVal;
			}
		}
	}
	return null;
}
LightFetchHttp.prototype.$settimelimit = function() {
	var tl = this.get_timelimit();
	if (typeof tl == "number" && tl < LightFetchHttp.$ultimateTimeLimit) {
		this.async(this.$requestReset).after(tl * 1000).key("cancellrequest").execute();
	}
}
LightFetchHttp.prototype.$requestReset = function() {
	if (this.$xhr != null) {
			this.$xhr.abort();
			if (this.$op != null) {
				var op = this.$op;
				this.$op = null;
				if (!op.isOperationComplete()) {
					op.CompleteOperation(false,"aborted");
				}
			}
		}
	}
}
LightFetchHttp.prototype.fetch = function(body) {
	if (this.$xhr != null) {
		if (this.isOpened()) return Operation.Failed("busy - reset needed");
		this.$op = new Operation();
		this.discardAsync("cancellrequest");
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
		// Add time limit callback (if needed)
		this.$settimelimit();
		return this.$op;
	}
	return null; // Nothing happened;	
	
}