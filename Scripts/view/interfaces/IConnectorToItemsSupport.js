function IConnectorToItemsSupport() {}
IConnectorToItemsSupport.Description("Declares and implements the basic prerequisites for this interface family.");
IConnectorToItemsSupport.Interface("IConnectorToItemsSupport");
IConnectorToItemsSupport.RequiredTypes("Base");
IConnectorToItemsSupport.ImplementProperty("bindhost", new Initialize("The host for the connector operation", null));
IConnectorToItemsSupport.ImplementProperty("connectorType", new InitializeStringParameter("The class name of the connector to use (for both count and content if both are implemented)", null));
