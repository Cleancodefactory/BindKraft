


/*INTERFACE*/ /*IMPL*/
function IConnectorToItemsContentImpl() {}
IConnectorToItemsContentImpl.InterfaceImpl(IConnectorToItemsContent);
IConnectorToItemsContentImpl.RequiredTypes("IConnectorToItemsSupport");
IConnectorToItemsContentImpl.ImplementProperty("contentflags", new InitializeNumericParameter("Content flags for the content connector (rarely used)",0))
IConnectorToItemsContentImpl.prototype.$contentconnector = null;
IConnectorToItemsContentImpl.prototype.get_contentconnector = function() {
	this.$prepareContentConnector(); 
	return this.$contentconnector; 
};
IConnectorToItemsContentImpl.prototype.set_contentconnector = function(v) { this.$contentconnector = v;};
IConnectorToItemsContentImpl.prototype.$applyParameters = function() {
	// Be advised: The Connector set_parameters combines objects when object is set.
	if (BaseObject.is(this.$contentconnector,"Connector")) {
		this.$contentconnector.set_parameters(this.get_parameters());
	}
};
IConnectorToItemsContentImpl.prototype.$prepareContentConnector = function() {
	if (this.__obliterated) return;
    var m = this.get_contentaddress();
    if (m != null) {
        if (BaseObject.is(m, "Connector")) {
            this.$contentconnector = m; //////////////////
			this.$applyParameters();
            // Old: m.set_parameters(this.$genParameters());
            return true;
        } else if (BaseObject.is(m, "string")) {
            if (this.get_connectorType() != null && Function.classes[this.get_connectorType()] != null) {
                if (!BaseObject.is(this.$contentconnector, this.get_connectorType())) {
                    // Different connector - replace it
                    var host = this.get_bindhost();
                    var opts = { };
                    if (this.get_lastCallProcessing()) opts.last = true;
					if (this.get_contentflags() != null) {
						if (this.get_contentflags() == -1) {
							opts.contentFlags = STUFFRESULT.ALL;
						} else {
							opts.contentFlags = this.get_contentflags();
						}
					}
                    if (host == null) {
                        this.$contentconnector = new Function.classes[this.get_connectorType()](m, this, opts);
                    } else {
                        this.$contentconnector = new Function.classes[this.get_connectorType()](m, host, opts);
                    }
                } else {
                    this.$contentconnector.resetState(m);
                }
				this.$applyParameters();
                // Old: this.$contentconnector.set_parameters(this.$genParameters());
                return true;
            }
        }
    }
    return false; // helps the comm methods to bail out
}