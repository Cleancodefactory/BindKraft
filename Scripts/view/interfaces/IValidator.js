

// Protocols used by Binding
/* IValidator is the Interface through which the bindings communicate with validators. 
In theory the validators can work with multiple bindings and apply rules that corelate the data from them. However this depends
both on the implementation of the rules configured in the particular validator and the implementation of the validator itself.
If the validator does not support more than one binding it should Implement the methods that add/register bindings as set methods
replacing the single binding supported by the validator. 
The implementation of binding removal methods is not critical, but it is not clear yet if that feature will be used in future.
*/
/*INTERFACE*/
function IValidator() { };
IValidator.Interface("IValidator");
IValidator.prototype.add_binding = function (binding) { };
IValidator.prototype.set_binding = function (bindings) { }; // must support multiple arguments
IValidator.prototype.remove_binding = function (binding) { };
IValidator.prototype.validate = function (bIndicate) { return ValidationResultEnum.correct; }; // bIndicate tells the validator to show visual indication, if false no indication should be presented.
IValidator.prototype.close = function () { }; // called to give the validator chance to uninitialize
