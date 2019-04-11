function AjaxRequestor() {
	BaseObject.apply(this, arguments);
}
AjaxRequestor.Inherit(BaseObject, "BaseObject");
AjaxRequestor.implement(IParametersObjectImpl); // GET parameters go here (obligatory GET parameters)
AjaxRequestor.implement(IDataHolder); // The main data, it gets into the body or the GET parameters depending on the method.
AjaxRequestor.prototype.$url = null;
AjaxRequestor.prototype.get_url = function() {
	return this.$url;
}
AjaxRequestor.prototype.set_url = function(v) {
	if (this.get_isactive()) {
		throw "The URL cannot be changed while the request is in progress."
	}
	this.$url = v;
}
AjaxRequestor.prototype.$xhr = null;
AjaxRequestor.prototype.get_xhr = function() {
	if (this.$xhr == null) {
		if (window.XMLHttpRequest) {
			this.$xhr = new XMLHttpRequest();
		} else {
			this.$xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return this.$xhr;
}
AjaxRequestor.prototype.get_isactive = function() {
	///////////////////////////
	
	if (this.$xhr == null) return false;
	if (this.$xhr.readyState > 0) return true;
	return false;
}