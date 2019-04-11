


/* 
The callback parameters are optional and the SupportViewDataCallbacks as well. However the implementation should support all the callbacks
or none of them and report availability by returning true in the SupportViewDataCallbacks. This enables callers that depend on the callback support for critical
functionality to be able to determine that they can count on that
*/
/*INTERFACE*/
function IPersistableView() { }
IPersistableView.Interface("IPersistableView");
IPersistableView.prototype.ValidateViewData = function(callback) { // callback: invokable(validationResult) { ... }
    // The callback must be called directly or asynch to continue the work if the view contains asynch validation
    // If synchronous the function should return ValidationResultEnum
    // Asynch functions should return ValidationResultEnum.pending
};
IPersistableView.prototype.SaveViewData = function(callbackSuccess, callBackFailure) { // callbackSuccess: invokable(view, data); callbackFailure: invokable(view, status)
    // The return value is optional with no current requirements defined.    

};
IPersistableView.prototype.SupportViewDataCallbacks = function() {
    return false;
};
IPersistableView.ImplementProperty("disablePersistableView", false);
