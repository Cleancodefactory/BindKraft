


/*INTERFACE*/
function IItemLoader() {}
IItemLoader.Interface("IItemLoader");
IItemLoader.RequiredTypes("IConnectorToItemsContent,IItemKeyPropertiesDescriptor");
// We need connector implementation for the loading and property descriptors in order to be able to compare items
IItemLoader.prototype.loaditemcompleteevent = new InitializeEvent("Fired when the item(s) are loaded.");
IItemLoader.ImplementProperty("itemkeyfield", new InitializeParameter("The name of the parameter that can accept id/key.","id"));
IItemLoader.prototype.OnLoadItemComplete = function(item) {
	throw "IItemLoader.OnLoadItemComplete not implemented in " + this.fullClassType();
}
IItemLoader.prototype.loadItemByKey = function(key) {
	var connector = this.get_contentconnector();
	if (connector != null) {
		connector = connector.createNewConnector();
		var fieldname = this.get_itemkeyfield();
		if (fieldname != null && fieldname.length > 0) {
			connector.set_parameters(fieldname, key);
			// TODO: Set limit field as well !!!
			connector.bind(this.thisCall(function(resource,success) {
				if (success !== false && resource != null) {
					if (BaseObject.is(resource,"Array")) { // Get the first element.
						if (resource.length > 0) {
							this.OnLoadItemComplete(resource[0]);
							this.loaditemcompleteevent.invoke(this, resource[0]);
						}
					} else if (typeof resource == "object") {
						this.OnLoadItemComplete(resource);
						this.loaditemcompleteevent.invoke(this, resource);
					}
				}
			}));
		}
	}
}
IItemLoader.prototype.loadItemsByKeys = function(keys) {
	var connector = this.get_contentconnector();
	if (connector != null) {
		connector = connector.createNewConnector();
		var fieldname = this.get_itemkeyfield();
		if (fieldname != null && fieldname.length > 0) {
			connector.set_parameters(fieldname, keys.join(",")); // TODO: Review this - multiple keys may need more care 
			// TODO: Set limit field as well !!!
			connector.bind(function(resource,success) {
				if (success !== false && resource != null) {
					if (BaseObject.is(resource,"Array")) { // Get the first element.
						if (resource.length > 0) {
							for (var i = 0; i < resource.length; i++) {
								this.OnLoadItemComplete(resource[i]);
								this.loaditemcompleteevent.invoke(this, resource[i]);
							}
						}
					} else if (typeof resource == "object") {
						this.OnLoadItemComplete(resource);
						this.loaditemcompleteevent.invoke(this, resource);
					}
				}
			});
		}
	}
}
