function ITemplateConsumerImpl(){}
ITemplateConsumerImpl.InterfaceImpl(ITemplateConsumer, "ITemplateConsumerImpl");
ITemplateConsumerImpl.RequiredTypes("Base");
ITemplateConsumerImpl.ForbiddenTypes("BaseWindow"); // This interface assumes in-view locations which makes it unusable for Windows

ITemplateConsumerImpl.prototype.templateSource = null;
ITemplateConsumerImpl.prototype.get_templateSource = function() {
	return this.templateSource;
}
ITemplateConsumerImpl.prototype.set_templateSource = function(v) {
	this.templateSource = v;
}
ITemplateConsumerImpl.classInitialize = function(cls) {
	ICustomParameterizationStdImpl.addParameters(cls, "templateSource");
}