/**
	Active result accessor for the "active" profile of the LightFetchHttp.
	
	This class provides wrapper instances enabling the clients of LightFetchHttp to dig deeper into the XHR respones.
	Apparently this is needed mostly by higher level abstraction implementations and is hardly a part of any "light and handy"
	solution for everyday use.
*/
function LightFetchHttpActiveResult(lightFetchHttp) {
	BaseObject.apply(this, arguments);
	this.$lf = lightFetchHttp;
}
LightFetchHttpActiveResult.Inherit(BaseObject,"LightFetchHttpActiveResult");
/** 
	Detaches this instance from the LightFetchHttp object that created it. Any consequent usage will cause errors.
*/
LightFetchHttpActiveResult.prototype.release = function() {
	this.$lf = null;
}
LightFetchHttpActiveResult.prototype.isAvailable = function() {
	return BaseObject.is(this.$lf, "LightFetchHttp");
}
LightFetchHttpActiveResult.prototype.$checkavailability = function() {
	if (!this.isAvailable()) {
		throw "This active result has been detached from its LightFetchHttp parent and is no longer usable";
	}
}
// Main methods for use
LightFetchHttpActiveResult.prototype.$headers = null;
LightFetchHttpActiveResult.prototype.headers = function() {
	this.$checkavailability();
	if (this.$headers != null) return this.$headers;
	this.$headers = this.$lf.getAllResponseHeaders();
	return this.$headers;
}
LightFetchHttpActiveResult.prototype.text = function() {
	this.$checkavailability();
	return this.$lf.$xhr.responseText;
}
LightFetchHttpActiveResult.prototype.response = function() {
	this.$checkavailability();
	return this.$lf.$xhr.response;
}
LightFetchHttpActiveResult.prototype.expectedContent = function() {
	this.$checkavailability();
	return this.$lf.get_expectedContent();
}
LightFetchHttpActiveResult.prototype.responseType = function() {
	this.$checkavailability();
	return this.$lf.$xhr.responseType;
}
LightFetchHttpActiveResult.prototype.responseXML = function() {
	this.$checkavailability();
	return this.$lf.$xhr.responseXML;
}
LightFetchHttpActiveResult.prototype.status = function() {
	this.$checkavailability();
	return this.$lf.$xhr.status;
}


