function IItemTemplateConsumerImpl(){}
IItemTemplateConsumerImpl.InterfaceImpl(IItemTemplateConsumer, "IItemTemplateConsumerImpl");
IItemTemplateConsumerImpl.RequiredTypes("Base");
IItemTemplateConsumerImpl.ForbiddenTypes("BaseWindow"); // This interface assumes in-view locations which makes it unusable for Windows

IItemTemplateConsumerImpl.prototype.itemTemplateSource = null;
IItemTemplateConsumerImpl.prototype.get_itemTemplateSource = function() {
	return this.itemTemplateSource;
}
IItemTemplateConsumerImpl.prototype.set_itemTemplateSource = function(v) {
	this.itemTemplateSource = v;
}
IItemTemplateConsumerImpl.classInitialize = function(cls) {
	ICustomParameterizationStdImpl.addParameters(cls, "itemTemplateSource");
}