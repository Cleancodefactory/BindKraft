function TemplateConnector(addr, host, options) {
	Connector.apply(this,arguments);
}
TemplateConnector.Inherit(Connector, "TemplateConnector");
TemplateConnector.prototype.resolve = function(callback) {
	var addr = this.$data + "";
	var arr = addr.split(",");
	var tml = null;
	for (var i = 0; i < arr.length;i++) {
		tml = ITemplateSourceImpl.GetGlobalTemplate(ITemplateSourceImpl.ParseTemplateName(arr[i].trim()));
		if (tml != null) break;
	}
	if (tml != null) {
		this.$resource = tml;
		return true;
	} else {
		return false;
	}
	
	
}
//Inherit(Connector, "TemplateConnector");