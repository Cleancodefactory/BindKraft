


/*CLASS*/
function ForeignCall() {
	BaseObject.apply(this, arguments);
	
};
ForeignCall.Description("An instance of this class is returned by the callee when an async call is made to it. The instance enabales the caller to perform variety of operations, such as schedule a callback for the result, check state, cancel and so on. Not all of these operations are guaranteed to be implemented by the callee.");
ForeignCall.Inherit(BaseObject, "ForeignCall");
ForeignCall.ImplementProperty("adviseasync", new InitializeBooleanParameter("If true the callbacks will be called asynchronously a bit later with async result.", false));
//ForeignCall.
// State changers
ForeignCall.prototype.complete = function(/*varargs*/) {
	
}.Description("Called when the task is complete.");

// BEGIN Handlers
ForeignCall.prototype.$successCallback = null;
ForeignCall.prototype.$failureCallback = null;
ForeignCall.prototype.$commonCallback = null;
// Callbacks should be used exclusively - success/failure xor commonCallback. However, it is possible to have both, in which case the commonCallback will
//	be invoked first. The callbacks can be functions or IInvocationWithArrayArgs objects. This allows broadcasting of the results if an event dispatcher is used.

ForeignCall.prototype.passResultTo = function(callback) {
}
ForeignCall.prototype.passSuccessTo = function(callback) {
}
ForeignCall.prototype.passFailureTo = function(callback) {
}
