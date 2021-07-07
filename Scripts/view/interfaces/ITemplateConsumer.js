

function ITemplateConsumer() {}
ITemplateConsumer.Interface("ITemplateConsumer");
ITemplateConsumer.prototype.get_templateSource = function() {
	return null;
}.Description("Intended for usage as bound parameter @templateSource={..}, should point to a ITemplateSource implementor");

// Helpers
ITemplateConsumer.ConsumeTemplate = function(component) {
	if (component.is("ITemplateConsumer")) {
		var source = component.get_templateSource();
		if (BaseObject.is(source, "ITemplateSource")) {
			return source.get_template();
		}
		return source;
	}
	return null;
}