/*
	Pointer gestures are used by the MouseTrap
	Setting additional data depends on the implementation, but should be done during construction or initialization.
	This means that (when needed) DOM elements that can change should be identified through names, paths or other means that the gesture
	can use to find them each time it is called to inspectEvent.
	Lifecycle:
		A MouseTrap is configured with a new instance of PointerGesture-s (among which is ours)
			The gesture receives the needed arguments
		Each time the trap is invoked to handle a "mouse sighting" it reinitializes all its gestures by calling $start on them.
		The MouseTrap starts sending the mouse messages to the inspectEvent of each gesture.
		The inspectEvent returns nothing/null to continue listening
		If the gesture determines that there is no point in inspecting events further (no chance for gesture detection) it returns false and is no longer called.
			The MouseTrap calls stop() in the PointerGesture
		If a gesture is detected the gesture returns true from inspectEvent.
		If the trap decides to stop detecting or if gesture is detected it calls stop on all still active gestures (including the one that detected it).
		
		
*/
function PointerGesture(data) {
    BaseObject.apply(this,arguments);
    this.set_data(data);
}
PointerGesture.Inherit(BaseObject,"PointerGesture");

PointerGesture.ImplementProperty("data", new Initialize("Any kind of user data attached to the gesture for use by the owner of the trap.", null))
PointerGesture.ImplementPeroperty("recoginizing", new InitializeBooleanParameter("Indicates if the gesture is still actively recognizing or stopped.", false));
PointerGesture.prototype.$clear = function() {
	this.set_recognizing(false);
	this.clear();
}
// Override
PointerGesture.prototype.clear = function() {
	// Override this method as necessary.
}.Description("Override to clear your spcific recognition data. No need to call this after operation, it will be called first by the start method the next time the gesture is used. Still, to release a little memory it can be called after operation.");
PointerGesture.prototype.$start = function() {
	this.clear();
	this.set_recognizing(true);
	this.start();
};
// Override
PointerGesture.prototype.start = function() {
	// Override this as necessary
}.Description("Override to initialize the members your gesture needs during gesture recognition.");
PointerGesture.prototype.$stop = function() {
	var r = this.stop();
	this.$clear();
	if (r != null) return r;
	return false;
}.Description("Stops the gesture - gives it a chance to uninitialize any resources it is using")
    .Returns("Currently the return result is not used, but returning false is default (nothing running)");
// Override
PointerGesture.prototype.stop = function() {
	return false;
}.Description("Can be called by inspectEvent to cancel further recognition and directly return === false. Use like: return this.stop();");
PointerGesture.prototype.$inspectEvent = function(msg) {
	return this.inspectEvent(msg);
}
// Override
PointerGesture.prototype.inspectMessage = function(msg) {
	throw "Not implemented";
}.Description("All mouse events should be passed to this method after clearing the gesture before starting a new trap.")
	.Param("msg","A MouseTrackerEvent coming from the system MouseTracker.")
	.Returns("Empty result means the gesture recognition continues, === false menas cancelled - no longer recognizing, === true gesture detected.");
