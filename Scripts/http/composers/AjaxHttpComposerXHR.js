/**
	XHR Base composer class
*/
function AjaxHttpComposerXHR(req) {
	BaseObject.apply(this, arguments);
	if (BaseObject.is(req, "IAjaxHttpRequest")) {
		this.request = req;
	} else {
		throw "req must be IAjaxHttpRequest";
	}
}
AjaxHttpComposerXHR.Inherit(BaseObject,"AjaxHttpComposerXHR");
AjaxHttpComposerXHR.Implement(IAjaxHttpRequestComposer);
AjaxHttpComposerXHR.prototype.xhr = null;
AjaxHttpComposerXHR.prototype.request = null;
AjaxHttpComposerXHR.prototype.composeRequest = function() { 
	this.OnCreateCommunicator();
	this.OnOpenCommunicator();
	// All but verb, url, async and user/password are set here
	this.OnFillStandardXHR();
	this.OnFillHeaders();
}
AjaxHttpComposerXHR.prototype.OnCreateCommunicator = function() {
	this.xhr = req.get_communicator(); // My own madness
	if (this.xhr == null) { // Risking it (detection may not be flawless in IE)
		// TODO: Make this aware of IE
		var xhr = new XMLHttpRequest();
		this.request.set_communicator(xhr);
		this.xhr = xhr;
	}
}
AjaxHttpComposerXHR.prototype.OnOpenCommunicator = function() {
	this.xhr.open(
			this.request.get_verb() || "GET",
			this.OnCreateUrl(),
			this.request.get_async()?true:false
				// TODO: add user/pass
			);
}
AjaxHttpComposerXHR.prototype.OnEncodeExplicitGetParams = function() {
	var parms = this.request.get_getparams();
	if (params != null) {
		// foreach the params and push them into the URL
	}
}
AjaxHttpComposerXHR.prototype.OnCreateUrl = function() {
	var url = this.request.get_url();
	// TODO: implement it really - using BkUrl
	return url+"";
}
AjaxHttpComposerXHR.prototype.OnFillHeaders = function() {
	var hdrs = this.requesr.get_headers();
	for (var hname in hdrs) {
		this.xhr.setRequestHeader(hname, hdrs[hname]);
	}
}
AjaxHttpComposerXHR.prototype.OnEncodeData = function() {
	// encode data to url or body json dep on verb.
	// POST - > set content type to application/json;
	// if needed (check!) calc and set the content-length
	throw "override me";
}
AjaxHttpComposerXHR.prototype.OnFillStandardXHR = function() {
	this.OnEncodeExplicitGetParams();
	
}