
function IPointerTracker() {}
IPointerTracker.Interface("IPointerTracker");
IPointerTracker.prototype.handleMouseTrack = function(sender, trackevent) {
	if (BaseObject.is(trackevent, "MouseTrackerEvent")) {
		throw "handleMouseTrack is not implemented.";
	}
}