

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
// Binding management
IValidator.prototype.add_binding = function (binding) { };
IValidator.prototype.set_binding = function (bindings) { }; // must support multiple arguments
IValidator.prototype.remove_binding = function (binding) { };
/**
	bIndicate - tells the validator to show visual indication. It is currently handled a bit incorrectly, recommend to call with it true always
	callback - optional, required for asynchronous validators - called when the validation completes
*/
IValidator.prototype.validate = function (bIndicate, callback) { return ValidationResultEnum.correct; }; // bIndicate tells the validator to show visual indication, if false no indication should be presented.
/**
	Puts the validator into uninitialized state.
*/
IValidator.prototype.uninit = function() {}; 
/**
	A legacy feature that considers indication as indicators and hints (usually popped up somehow). Closes only the popped out part. 
	In future versions it might be completely removed or most likely deactivated (the method will do nothing, but will remain there for compatibility reasons).
*/
IValidator.prototype.closeValidator = function () { }; // called to ask the validator to hide any additional UI (popped hints, but not status indicators)
