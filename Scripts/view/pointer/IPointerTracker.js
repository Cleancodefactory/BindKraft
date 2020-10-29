
function IPointerTracker() {}
IPointerTracker.Interface("IPointerTracker");
IPointerTracker.prototype.handleMouseTrack = function(sender, trackevent) {
		throw "handleMouseTrack is not implemented.";
}
IPointerTracker.prototype.get_allowdefault = function() {
	return false;
}