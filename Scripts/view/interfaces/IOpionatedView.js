function IOpionatedView() {}
IOpionatedView.Interface("IOpionatedView");
IOpionatedView.prototype.ViewDeactivating = function(reserved) { throw "not implemented"; }
IOpionatedView.prototype.ViewClosing = function(reserved) { throw "not implemented"; }
// TODO:
/*
	Persistence methods have to be added later - preferably on an interface that extends this one
	IPersistableView.Interface("IPersistableView", IOpionatedView);
	get_disablePersistableView
	ValidateViewData()
	SaveViewData(msg.data.callback, msg.data.sync);
*/



