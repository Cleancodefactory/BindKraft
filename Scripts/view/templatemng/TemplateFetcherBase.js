function TemplateFetcherBase() {
	BaseObject.apply(this, arguments);	
};

TemplateFetcherBase.Inherit(BaseObject, "TemplateFetcherBase");
TemplateFetcherBase.Implement(ITemplateFetcher);

// Set your custom extractor if you expect
TemplateFetcherBase.prototype.templateExtractorCallback = null;
TemplateFetcherBase.prototype.$templateExtractorCallback = function(data, source, method) {
	if (typeof this.templateExtractorCallback == "function") {
		return this.templateExtractorCallback(data, source, method);
	} else {
		return data;
	}
};

TemplateFetcherBase.prototype.$execWithExtractorCallbackResult= function(callback, data, source, method){
	BaseObject.callCallback(callback, this.$templateExtractorCallback(data, source, method));
};
