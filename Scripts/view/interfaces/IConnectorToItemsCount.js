


/*INTERFACE*/
function IConnectorToItemsCount() {}
IConnectorToItemsCount.Interface("IConnectorToItemsCount");
IConnectorToItemsCount.RequiredTypes("IConnectorToItemsContent");
IConnectorToItemsCount.ImplementProperty("itemscountaddress", new Initialize("URL/address or connector from which to fetch data items count (if paging is a concern).", null));
IConnectorToItemsCount.prototype.$prepareCountConnector = function() {throw "not implemented";};
IConnectorToItemsCount.prototype.get_countconnector = function() {throw "not implemented";};
IConnectorToItemsCount.prototype.set_countconnector = function(v) {throw "not implemented";};