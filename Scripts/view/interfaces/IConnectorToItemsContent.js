


// Why not rename this to IConnectorToItemsContent - sounds much more clear.

// Connector usage standardization
/*INTERFACE*/
function IConnectorToItemsContent() {}
IConnectorToItemsContent.Interface("IConnectorToItemsContent");
IConnectorToItemsContent.RequiredTypes("Base,IParameters");
IConnectorToItemsContent.ImplementProperty("lastCallProcessing", new InitializeBooleanParameter("Set this to true to instruct the area to use connector in last call mode - concurrent calls are ignored, only the last is actually processed.", false));
IConnectorToItemsContent.ImplementProperty("contentaddress", new Initialize("URL/address or connector from/to which to fetch/store items.", null));
IConnectorToItemsContent.ImplementProperty("bindhost", new Initialize("Binding host for the connector. If null the DataArea will set itself as host.", null));
IConnectorToItemsContent.ImplementProperty("contentflags", new Initialize("Specific option for some connectors. Override content request flags. -1 will set this to STUFFRESULT.ALL", null));
IConnectorToItemsContent.ImplementProperty("connectorType", new InitializeStringParameter("Describes the class type of the connector to use", null));
IConnectorToItemsContent.prototype.$prepareContentConnector = function() { throw "$prepareContentConnector not implemented."};
IConnectorToItemsContent.prototype.$applyParameters = function(){ throw "$aplyParameters not implemented."};
IConnectorToItemsContent.prototype.get_contentconnector = function() { throw "not implemented";};
IConnectorToItemsContent.prototype.set_contentconnector = function() { throw "not implemented";};