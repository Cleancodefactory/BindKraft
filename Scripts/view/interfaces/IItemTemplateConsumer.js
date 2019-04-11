

function IItemTemplateConsumer() {}
IItemTemplateConsumer.Interface("IItemTemplateConsumer");
IItemTemplateConsumer.prototype.get_itemTemplateSource = function() {
	return null;
}.Description("Intended for usage as bound parameter @itemTemplateSource={..}, should point to a IItemTemplateSource implementor");
