/*
	TemplateFetcher is a helper for Base derived classes that separates the template specification from the
	rest of the implementation. It is especially useful for classes that use more than one template for purposes like:
		- templates of a specific parts of their views (e.g. one ore more kinds of items in a list/set, header, footer)
		- templates for different states (e.g. a calendar that changes its view and uses a specific one for day, week, month mode).
		- templates configured for some kind of template dipensing solution. (e.g. a ITemplateSource class that is asked by other classes
			to supply an appropriate template depending on the object's state. A set of Fetchers can be used to load it with all the 
			available templates and its get_template returns one of them depending on a condition implemented in the class)

	Typical classes would simply use ITemplateSourceImpl and be done with the template problem, but there are classes that deal with multiple
	templates, obtain them through various mechanisms and need to keep configuring them easy enough - using fetchers it is easy to create some static
	collection/dictionary with a separate initialized instance of TemplateFetcher in each item
			
*/
/*CLASS*/
function TemplateFetcher(connector_or_string, legacyLookup, extractor) {
	BaseObject.apply(this,arguments);
	this.$templatesource = connector_or_string;
	if (BaseObject.isCallback(legacyLookup)) {
		this.$trylegacy = false;
		this.templateExtractorCallback = legacyLookup;
	} else {
		this.$trylegacy = legacyLookup;
		if (BaseObject.isCallback(extractor)) {
			this.templateExtractorCallback = extractor;
		}
	}
}
TemplateFetcher.Description("Initializes a new instance of TemplateFetcher")
	.Param("connector_or_string", "Currently a connector instance or a string - name of a template. In future more options may be available")
	.Param("legacyLookup", "Can be omitted. If it is present and true-like, enables legacy template search by id or CSS class name, using the connector_or_string unchanged")
	.Param("extractor", "Optional, can be specified as 2-nd argument if legacyLookup is omitted. Specifies an extractor callback responsible to extract the actual template from the data fetched. See details in the comments.");
TemplateFetcher.Inherit(BaseObject, "TemplateFetcher");
TemplateFetcher.Implement(ITemplateFetcher);
TemplateFetcher.prototype.$templatesource = null;
// Set your custom extractor if the fetched data contains more than just the template and extract the pure template content from it in the callback
TemplateFetcher.prototype.templateExtractorCallback = null;
TemplateFetcher.prototype.$templateExtractorCallback = function(data, source) {
	if (BaseObject.isCallback(this.templateExtractorCallback)) {
		return BaseObject.callCallback(this.templateExtractorCallback(data,source));
	} else {
		return data;
	}
}
TemplateFetcher.prototype.fetchTemplate = function(callback) {
	var tml;
	if (BaseObject.is(this.$templatesource, "Connector")) { // An initialized connector is specified - this overrides all other sources and returns null if the connector fails
		this.$templatesource.bind(function (resource,err) {
			if (resource = null && err === false) { // Failure - pass null, do not process further sources, because when used with a connector it overrides other sources.
				BaseObject.callCallback(callback, null); 
			} else {
				BaseObject.callCallback(callback, this.$templateExtractorCallback(resource,this.templateSource));
				return; // All done
			}
		});
	} else if (BaseObject.is(this.$templatesource,"string")) {
		var tn = ITemplateSourceImpl.ParseTemplateName(this.$templatesource);
		tml = ITemplateSourceImpl.GetGlobalTemplate(tn,{legacy: this.$trylegacy});
		if (tml != null) {
			BaseObject.callCallback(callback, this.$templateExtractorCallback(resource,this.templateSource));
		}
	}
}



	
