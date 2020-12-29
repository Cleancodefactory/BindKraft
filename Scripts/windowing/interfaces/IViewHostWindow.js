

function IViewHostWindow() {}
IViewHostWindow.Interface("IViewHostWindow");

// TODO: Review the methods from the Implementer and list them here. We have to make this a serious contract.

// Windowing message handlers
IViewHostWindow.prototype.on_LoadView = function(msg) {
	// Should invoke immediate view load if msg.data contains the required information or reload the current view if msg.data == null
	throw "not implemented";
}
IViewHostWindow.prototype.on_Deactivating = function(msg) {
	throw "not implemented";
	// TODO: Should call any view unload operations. Most often used with IPersistableView to allow the view to save changes
}
IViewHostWindow.prototype.on_ReloadData = function(msg) {
}
IViewHostWindow.prototype.on_Close = function(msg) {
}

IViewHostWindow.prototype.ReloadView = function(loadnow, initData, clientState) {
	// TODO: Implement view reload
}
IViewHostWindow.prototype.LoadView = function(initData) {
}
IViewHostWindow.prototype.LoadViewNow = function(initData) {
}
IViewHostWindow.prototype.closeView = function (forceClose) {
	
}

IViewHostWindow.prototype.viewLoadParameters = null;
IViewHostWindow.prototype.hostClientCSSStyles = null;
IViewHostWindow.prototype.hostClientCSSClasses = null;

IViewHostWindow.prototype.get_viewcontainerelement = function() {}
IViewHostWindow.prototype.get_currentview = function () {throw "not implemented";}
IViewHostWindow.prototype.viewService = function(svcName) {}
IViewHostWindow.prototype.viewDelegate = function (func, params) {}
IViewHostWindow.prototype.connectToViewEvent = function (eventname, handler) {}
IViewHostWindow.prototype.disconnectFromViewEvent = function (eventname, handler) {}
IViewHostWindow.prototype.addViewEventConnector = function (conn) {}
IViewHostWindow.prototype.removeViewEventConnector = function (conn) {}
