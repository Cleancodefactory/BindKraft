


/*INTERFACE*/
function IInfoDisplayPanel() { }
IInfoDisplayPanel.RequiredTypes("Base");
IInfoDisplayPanel.Interface("IInfoDisplayPanel");
IInfoDisplayPanel.prototype.dataexhaustedevent = new InitializeEvent("Fired by the display panel whenever the data inside it is cleared by the user.");
IInfoDisplayPanel.prototype.addEntry = function (entry) { return false; }.Description("Optional. If supported it should add entry with minimal overhead. return true if supported");
IInfoDisplayPanel.prototype.get_reversedc = function () {
    var dc = this.get_data(); // nali
    if (BaseObject.is(dc, "Array")) dc = dc.reverse().slice(0, 10);
    return dc;
};
IInfoDisplayPanel.prototype.addEntry = function (info) {
    var dc = this.get_data();
    if (dc == null) {
        dc = [info];
    } else {
		if (BaseObject.is(dc, "Array")) {
			dc.push(info);
		}
    }
    this.set_data(dc);
};
IInfoDisplayPanel.prototype.onRemoveMessage = function (e, item, binding, bparam) {
    var dc = this.get_data();
    if (BaseObject.is(dc, "Array")) {
        dc.removeElement(item);
        if (dc.length <= 0) {
            this.dataexhaustedevent.invoke(this, null);
        } else {
            this.updateTargets();
        }
    }
};
IInfoDisplayPanel.prototype.onClearMessages = function (e, dc, binding, bparam) {
    this.set_data([]);
    this.dataexhaustedevent.invoke(this, null);
};
IInfoDisplayPanel.prototype.get_infomessagesavailable = function() {
	var dc = this.get_data();
	if (dc != null && dc.length > 0) return true;
	return false;
}