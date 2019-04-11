function TemplateConnector(addr, host, options) {
	Connector.apply(this,arguments);
}
TemplateConnector.Inherit(Connector, "TemplateConnector");
TemplateConnector.prototype.resolve = function(callback) {
	var tml = ITemplateSourceImpl.GetGlobalTemplate(ITemplateSourceImpl.ParseTemplateName(this.$data));
	if (tml != null) {
		this.$resource = tml;
		return true;
	} else {
		return false;
	}
	
	
}
//Inherit(Connector, "TemplateConnector");