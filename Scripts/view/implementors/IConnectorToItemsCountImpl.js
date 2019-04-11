


/*INTERFACE*/ /*IMPL*/
function IConnectorToItemsCountImpl() {}
IConnectorToItemsCountImpl.InterfaceImpl(IConnectorToItemsCount);
IConnectorToItemsCountImpl.prototype.$countconnector = null;
IConnectorToItemsCountImpl.prototype.get_countconnector = function() {
	this.$preparecountconnector(); 
	return this.$countconnector; 
};
IConnectorToItemsCountImpl.prototype.set_countconnector = function(v) { this.$countconnector = v;};
IConnectorToItemsCountImpl.prototype.$preparecountconnector = function() {
	if (this.__obliterated) return;
    var m = this.get_itemscountaddress();
    if (m != null) {
        if (BaseObject.is(m, "Connector")) {
            this.$countconnector = m;
			this.$applyParameters();
            // Old: m.set_parameters(this.$genParameters());
            return true;
        } else if (BaseObject.is(m, "string")) {
            if (this.get_connectorType() != null && Function.classes[this.get_connectorType()] != null) {
                if (!BaseObject.is(this.$countconnector, this.get_connectorType)) {
                    // Different connector - replace it
                    var host = this.get_bindhost();
                    if (host == null) {
                        this.$countconnector = new Function.classes[this.get_connectorType()](m, this);
                    } else {
                        this.$countconnector = new Function.classes[this.get_connectorType()](m, host);
                    }
                } else {
                    this.$countconnector.resetState(m);
                }
				this.$applyParameters();
                // Old: this.$countconnector.set_parameters(this.$genParameters());
                return true;
            }
        }
    }
    return false; // helps the comm methods to bail out
};