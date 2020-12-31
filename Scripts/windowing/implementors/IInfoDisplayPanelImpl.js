/**
	Message structure is the one defined by the so called "info message".
	The InfoMessageQuery structural query defines it as:
	{
		message: string, // The text of the message,
		code: number,			// code of the message if any
		messageType: InfoMessageTypeEnum, // the type InfoMessageTypeEnum.(error|warning|information|confirm|general)
		priority: number
	}
	
	Only the message is mandatory, 
	code is determined by the emiter, which also means that if some codes are defined by an app it has to take care to
		show all images inside itself, so that the users would not mistake its error codes with the codes of another app (can happen if the messages show 
		only in the workspace).
	messageType will impact (depending on the customizations of the template) colors, icons etc.
	priority is 0 if not specidied. It is sometimes used as a filter e.g. the window hierarchy of an app may use it to display the more critical messages
	closer to the point where they have happened and the rest further out in the hierarchy, possibly even hiding those with lowest priority.
	
*/
function IInfoDisplayPanelImpl() { }
IInfoDisplayPanelImpl.RequiredTypes("Base");
IInfoDisplayPanelImpl.InterfaceImpl(IInfoDisplayPanel, "IInfoDisplayPanelImpl");
IInfoDisplayPanelImpl.prototype.get_reversedc = function () {
    var dc = this.get_data(); // nali
    if (BaseObject.is(dc, "Array")) dc = dc.reverse().slice(0, 10);
    return dc;
};
IInfoDisplayPanelImpl.prototype.$setupAutoClear = function() {
	this.discardAsync("autoclear");
	if (this.get_infodisplayautoclear() > 0) {
		this.async(this.onClearMessages).key("autoclear").after(this.get_infodisplayautoclear() * 1000).execute();
	}
}
IInfoDisplayPanelImpl.prototype.addEntry = function (info) {
	var dc = this.get_data();
	this.$setupAutoClear();
    if (dc == null) {
        dc = [info];
    } else {
		if (BaseObject.is(dc, "Array")) {
			dc.push(info);
		}
    }
    this.set_data(dc);
};
IInfoDisplayPanelImpl.prototype.onRemoveMessage = function (e, item, binding, bparam) {
    var dc = this.get_data();
    if (BaseObject.is(dc, "Array")) {
        dc.removeElement(item);
        if (dc.length <= 0) {
			this.discardAsync("autoclear");
            this.dataexhaustedevent.invoke(this, null);
        } else {
            this.updateTargets();
        }
    }
};
IInfoDisplayPanelImpl.prototype.onClearMessages = function (e, dc, binding, bparam) {
	this.set_data([]);
	this.discardAsync("autoclear");
    this.dataexhaustedevent.invoke(this, null);
};
IInfoDisplayPanelImpl.prototype.get_infomessagesavailable = function() {
	var dc = this.get_data();
	if (dc != null && dc.length > 0) return true;
	return false;
}
IInfoDisplayPanel.prototype.$infodisplayautoclear = 0;
IInfoDisplayPanel.prototype.get_infodisplayautoclear = function() { return this.$infodisplayautoclear; }
IInfoDisplayPanel.prototype.set_infodisplayautoclear = function(v) { this.$infodisplayautoclear = v; }
