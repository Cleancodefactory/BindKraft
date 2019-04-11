/**
	In order to keep compatibility this interface implements some "traditional" methods and launchers that
	keep compatibility should implement this one and not the IAppManager - it will come through this interface.
	Unfortunately the implementation cannot be fully automated and small additional effort may be needed.
*/
function IAppManager2() {
}
IAppManager2.Interface("IAppManager2","IAppManager");

IAppManager2.prototype.launchApp = function(appCls, args) { throw "not implemented"; }
IAppManager2.prototype.launchAppWindow = function (appClass, wndClassName, args) { throw "not implemented"; }