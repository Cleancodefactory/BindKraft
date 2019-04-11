function DrillDownDialogWindow() {
	PageSetWindow.apply(this, arguments);
}
DrillDownDialogWindow.Inherit(PageSetWindow,"DrillDownDialogWindow");

DrillDownDialogWindow.prototype.openDialogDirect = function(data,view) {
	var dlg = new SimpleViewWindow(
		{
			directData: data,
			view: view,
			on_ReportResult: new Delegate(this, this.onResultReported)
		}
	);
}
DrillDownDialogWindow.prototype.onResultReported = function(msg) {
	
}