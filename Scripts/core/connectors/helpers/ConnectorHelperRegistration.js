


/*
    Register connector helpers with configurations and constraints in your project's conf file (or another file executed at that point.)
    Example usage may look like:
    ConnectorHelperRegister.Default()
        .registerHelper(AjaxXmlConnector, "ConnectorHelperPaging", {limit: "maxrows", offset: "startrow"}, "./apps/pack.asp?$read=.+/mypackage", null, true) // Very concrete rule
        .registerHelper(AjaxXmlConnector, "ConnectorHelperPrimaryKey", {primarykey: "id"}, "./apps/pack.asp?$read=.+/mypackage", null, true) // Very concrete rule
        .registerHelper(AjaxXmlConnector, "ConnectorHelperPaging", {limit: "limit", offset: "offset"}, "./apps/pack.asp?$read=", null, false) // Everything else

*/

/*CLASS*/
function ConnectorHelperRegistration(className, configuration, addressConstraint, bindHostConstraint) {
    BaseObject.apply(this,arguments);
    var helperClass = (typeof className == "function")?className:Function.classes[className];
    this.classDef = helperClass;
    this.configuration = configuration;

    if (typeof addressConstraint == "string") {
        // Treat as regexp pattern
        this.addressConstraint = function(connector,protocolName) {
            var addr = connector.get_address();
            if (addr != null && typeof addr == "string") {
                var re = new RegExp(addressConstraint,"i");
                if (re.test(addr)) return true;
            }
            return false;
        }
	} else if (addressConstraint instanceof RegExp) {
		this.addressConstraint = function(connector,protocolName) {
            var addr = connector.get_address();
			if (addr != null && typeof addr == "string") {
				return addressConstraint.test(addr);
			}
            return false;
        }
    } else if (BaseObject.isCallback(addressConstraint)) {
        this.addressConstraint = addressConstraint;
    } else {
        this.addressConstraint = null;
    }
    
    if (typeof bindHostConstraint == "string") {
        this.bindHostConstraint = function(connector,protocolName) {
            var arr = bindHostConstraint.split(",");
            for (var i = 0; i < arr.length; i++) {
                if (!BaseObject.is(connector.host,arr[i])) return false;
            }
            return true;
        }
    } else if (BaseObject.isCallback(bindHostConstraint)) {
        this.bindHostConstraint = bindHostConstraint;
    } else {
        this.bindHostConstraint = null;
    }
}
ConnectorHelperRegistration.Inherit(BaseObject,"ConnectorHelperRegistration");
ConnectorHelperRegistration.prototype.classDef = null;
ConnectorHelperRegistration.prototype.addressConstraint = null;
ConnectorHelperRegistration.prototype.bindHostConstraint = null;
ConnectorHelperRegistration.prototype.checkConstraints = function(connector, protocolName) {
    if (this.addressConstraint != null) {
        if (!this.addressConstraint(connector, protocolName)) return false;
    }
    if (this.bindHostConstraint != null) {
        if (!this.bindHostConstraint(connector, protocolName)) return false;
    }
    return true;
}