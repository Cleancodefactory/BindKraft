function IDialogView() { }
IDialogView.Interface("IDialogView");
IDialogView.RequiredTypes("Base");
IDialogView.prototype.hideDialog = function () {
    this.throwStructuralQuery(new HostCallQuery(HostCallCommandFlags.hide));
}
IDialogView.prototype.showDialog = function () {
    this.throwStructuralQuery(new HostCallQuery(HostCallCommandFlags.show | HostCallCommandFlags.activate));
}
IDialogView.prototype.completeDialog = function (success, data) {
	return this.$completeDialog(success,data,true);
}.Description("Open-close dialog behavior.");
IDialogView.prototype.applyDialog = function (success, data) {
	return this.$completeDialog(success,data,false);
}.Description("This is for behavior in which the actions apply some results to the opener, but the dialog remains open for further use by the user.");
IDialogView.prototype.$completeDialog = function (success, data, doclose) {
    var container = this.get_hostcontainer();
    if (BaseObject.is(container, "BaseWindow")) {
        WindowingMessage.fireOn(container, WindowEventEnum.ReportResult, {
            result: (success ? true : false),
            resultData: data || this.get_data(),
			close: doclose
        });
    } else {
        throw "Currently only windows are supported.";
    }
    this.throwStructuralQuery(new HostCallQuery((doclose?HostCallCommandFlags.close:0) | (success ? HostCallCommandFlags.apply : 0)));
}.Description("")
    .Param("success", "Boolean denoting success")
    .Param("data", "The data to include in the close event or/and callback");
IDialogView.prototype.InitWorkData = function(data) {
	alert("You have to implement InitWorkData in your dialog view.");
}