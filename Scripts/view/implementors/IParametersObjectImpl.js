


// IParameters std implementor
/*INTERFACE*/ /*IMPL*/
function IParametersObjectImpl() {}
IParametersObjectImpl.InterfaceImpl(IParameters, "IParametersObjectImpl");
IParametersObjectImpl.ImplementIndexedProperty("parameters", new InitializeObject("Object acting as parameters dictionary"),null,"OnParametersChanged");
IParametersObjectImpl.prototype.OnParametersChanged = function() { /*Do nothing by default. Override if needed. */ };