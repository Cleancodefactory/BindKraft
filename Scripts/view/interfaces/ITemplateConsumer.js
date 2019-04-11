

function ITemplateConsumer() {}
ITemplateConsumer.Interface("ITemplateConsumer");
ITemplateConsumer.prototype.get_templateSource = function() {
	return null;
}.Description("Intended for usage as bound parameter @templateSource={..}, should point to a ITemplateSource implementor");
