


//// This can be used for implementation of notification properties and automatic data binding.
//// However the support for the parameter (telling which property has changed) is optional.
//// Currently not supported, we use dedicated event for each property for now!
///*PROTOCOL*/
//function PNotifyDataChange() { }
//PNotifyDataChange.Interface("PNotifyDataChange");
//PNotifyDataChange.prototype.notifydatachangeevent = new InitializeEvent("Fired to notify listeners that some data has changed. use invoke('propname') to identify the changed property for those handlers capable of using it");

/*INTERFACE*/
function IInvocationWithArrayArgs() { }
IInvocationWithArrayArgs.Interface("IInvocationWithArrayArgs");
IInvocationWithArrayArgs.prototype.invokeWithArgsArray = function(args) {
    throw "The IInvocationWithArrayArgs::invokeWithArgsArray MUST be implemented, but isn't!";
};