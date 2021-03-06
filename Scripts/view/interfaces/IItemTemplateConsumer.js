

function IItemTemplateConsumer() {}
IItemTemplateConsumer.Interface("IItemTemplateConsumer");
IItemTemplateConsumer.prototype.get_itemTemplateSource = function() {
	return null;
}.Description("Intended for usage as bound parameter @itemTemplateSource={..}, should point to a IItemTemplateSource implementor");


// Helpers
IItemTemplateConsumer.ConsumeTemplate = function(component, key) {
	if (component.is("IItemTemplateConsumer")) {
		var source = component.get_itemTemplateSource();
		if (BaseObject.is(source, "IItemTemplateSource")) {
			return source.get_itemtemplate(key);
		}
		return source;
	}
	return null;
}