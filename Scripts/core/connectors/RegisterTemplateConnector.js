
/*CLASS*/
function RegisterTemplateConnector(addr, host, options) {	
	if(!host) host = "templates";
    Connector.apply(this, [addr, Registers.getRegister(host), options]);
    this.isAsync = false;
}
RegisterTemplateConnector.Inherit(Connector, "RegisterTemplateConn");
RegisterTemplateConnector.prototype.resolve = function (callback) {
	var register= this.host;
	var tmpl_key= this.$data;
    var tmpl;
	
    if (BaseObject.is(register, "TemplateRegister")) tmpl = register.item(tmpl_key);
    this.$resource = tmpl;
    if ((typeof tmpl == "string") && tmpl.length > 0) return true;
    return false;
};