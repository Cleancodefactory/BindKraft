// The default implementer for IDialogView. 
// Different implementers may exist for specific dialogs, but this is very unlikely - the way dialogs report
// what happens in them whould be the same, what happens as a result is a completely different problem and not a concern for IDialogView
function IDialogViewImpl() { }
IDialogViewImpl.InterfaceImpl(IDialogView, "IDialogViewImpl");
IDialogViewImpl.RequiredTypes("Base");
IDialogViewImpl.prototype.hideDialog = function () {
    this.throwStructuralQuery(new HostCallQuery(HostCallCommandFlags.hide));
}
IDialogViewImpl.prototype.showDialog = function () {
    this.throwStructuralQuery(new HostCallQuery(HostCallCommandFlags.show | HostCallCommandFlags.activate));
}
IDialogViewImpl.prototype.completeDialog = function (success, data) {
	return this.$completeDialog(success,data,true);
}.Description("Open-close dialog behavior.");
IDialogViewImpl.prototype.applyDialog = function (success, data) {
	return this.$completeDialog(success,data,false);
}.Description("This is for behavior in which the actions apply some results to the opener, but the dialog remains open for further use by the user.");
IDialogViewImpl.prototype.$completeDialog = function (success, data, doclose) {
    var container = this.get_hostcontainer();
    if (BaseObject.is(container, "BaseWindow")) {
        WindowingMessage.fireOn(container, WindowEventEnum.ReportResult, {
            result: (success ? true : false),
            resultData: ((data === undefined)?this.get_data():data),
			close: doclose
        });
		/*
			What is reported and how to intercept it:
			ReportResul windowing event is fired on the view's container window. It can be intercepted like:
			in new *Window* {data}
			on_ReportResult: function(msg) {
				the data is in msg.data
			}
			in own window function
			...
			case WindowEventEnum.ReportResult:
				the data is in msg.data
			break;
			and the same way in handlers of the window event registered through some of the other available techniques.
			
			The data is:
			{ 
				result: true/false for sccess/failure
				resultData: resulting data returned (if not specified explicitly the datacontext of the dialog view is returned.
				close: true/false to signify the dialog's wishes - keep it open or close it
		
		*/
    } else {
        throw "Currently only windows are supported.";
    }
    this.throwStructuralQuery(new HostCallQuery((doclose?HostCallCommandFlags.close:0) | (success ? HostCallCommandFlags.apply : 0)));
}.Description("")
    .Param("success", "Boolean denoting success")
    .Param("data", "The data to include in the close event or/and callback");
IDialogViewImpl.prototype.InitWorkData = function(data) {
	alert("You have to implement InitWorkData in your dialog view.");
}