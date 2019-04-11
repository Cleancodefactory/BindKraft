/*CLASS*/
function RegisterTemplateFetcher(tmplKey, registername) {
	
	TemplateFetcherBase.apply(this, arguments);
	this.$registerName = registername;
	this.$templateKey = tmplKey;
};

RegisterTemplateFetcher.Inherit(TemplateFetcherBase, "RegisterTemplateFetcher");

RegisterTemplateFetcher.prototype.$registerName= null;
RegisterTemplateFetcher.prototype.$templateKey= null;
RegisterTemplateFetcher.prototype.$registerRef= null;

RegisterTemplateFetcher.prototype.fetchTemplate = function (callback) {
    if (this.$registerRef == null) this.$registerRef = Registers.getRegister(this.$registerName);
	var tmpl= null;	
	var templateexts= this.$registerRef.exists(this.$templateKey);
	if (templateexts) tmpl= this.$registerRef.item(this.$templateKey);
	this.$execWithExtractorCallbackResult(callback, tmpl, "registers", "lookup");
};