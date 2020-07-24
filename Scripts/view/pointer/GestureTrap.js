/**
 * A GestureTrap can be created when needed or kept in readiness and used when necessary - whichever
 * approach makes more sense in your particular scenario.
 * 
 * The trap is created with a set of gestures - each configured on its own. The trap procedure for detecting them is
 * as follows:
 * 
 * trap.start(e);   // The trap resets the gestures and starts tracking from the given point or location in the passed (Mouse or Pointer) message.
 * 
 * 
 * By default starting a trap will ignore new start attempts until the trap is finished with gestures.
 * If this is inconvenient use set_alwaysstart(true);	
 */


/*CLASS*/
/**
 * @param sink      {callback|PointerGesture}  
 * @params          {PointerGesture}    
 */
function GestureTrap(sink, gesture1, gesture2,gestureEtc) {
    BaseObject.apply(this, arguments);
    if (BaseObject.isCallback(sink)) {
        this.$sink = sink; // a callback to call with detected gestures
        this.$gestures = Array.createCopyOf(arguments,1);
    } else {
        this.$gestures = Array.createCopyOf(arguments,0);
    }
	
	
}
GestureTrap.Inherit(BaseObject,"GestureTrap");
GestureTrap.Implement(IPointerTracker);

GestureTrap.ImplementProperty("alwaysstart", new InitializeBooleanParameter("If true tells the trap to start trapping from scratch even if there is active trapping at the moment."));

GestureTrap.prototype.handleMouseTrack = function(sender, trackevent) {
	if (BaseObject.is(trackevent, "MouseTrackerEvent")) {
		// Main work
		var g = null;
		switch(trackevent.get_what()) { 
			case "start":
				this.$startGestures();
			break;
			case "move":
			case "key":
				g = this.$tryGestures(trackevent);
				if (g === false) {
                    this.$stopGestures(); // Immediate stop to not waste time.
                    MouseTracker.Default().stopTracking(this);
                    if (this.$sink != null) {
                        // This call is made in case the owner needs it (usually does not)
                        BaseObject.callCallback(this.$sink, null);
                    }
					
				} else if (BaseObject.is(g, "PointerGesture")) {
                    // The gestures are not stopped, because this also clears them.
                    // They are cleared also at start, so nothing is lost
                    MouseTracker.Default().stopTracking(this);
                    if (this.$sink != null) {
                        BaseObject.callCallback(this.$sink, g);
                    }
					
				}
			break;
			case "cancel":
                this.stop();
            break;
			case "complete":
                // Some gestures may require completion of pointer capture
                g = this.$tryGestures(trackevent);
                if (BaseObject.is(g, "PointerGesture")) {
                    // The gestures are not stopped, because this also clears them.
                    // They are cleared also at start, so nothing is lost
                    MouseTracker.Default().stopTracking(this);
                    if (this.$sink != null) {
                        BaseObject.callCallback(this.$sink, g);
                    }
					
				} else {
                    this.stop();
                }
			break;
		}
	}
}
GestureTrap.prototype.$sink = null;
GestureTrap.prototype.$gestures = new InitializeArray("Array of configured gestures");
GestureTrap.prototype.$activeGestures = null;
GestureTrap.prototype.$tryGestures = function(msg) {
	if (this.$activeGestures == null || this.$activeGestures.length == 0) { // No active gestures
		return false; // Explicit false
	}
	// Ask all active gestures
	var gest = null;
	for (var i = this.$activeGestures.length - 1; i >= 0; i--) {
		gest = this.$activeGestures[i];
		var r = gest.inspectMessage(msg);
		if (r === false) {
			this.$activeGestures.splice(i,1);
		} else if (r === true) {
			return gest; // Return the successful gesture
		}
	}
	if (this.$activeGestures.length == 0) { // No active gestures
		this.$activeGestures = null;
		return false; // Explicit false
	}
	return null;
}
GestureTrap.prototype.$startGestures = function() {
	this.$activeGestures = Array.createCopyOf(this.$gestures);
	for (var i = 0; i < this.$activeGestures.length; i++) {
		this.$activeGestures[i].$start();
	}
}
GestureTrap.prototype.$stopGestures = function() {
	if (this.$activeGestures != null) {
		for (var i = 0; i < this.$activeGestures.length; i++) {
			this.$activeGestures[i].$stop();
		}
		this.$activeGestures = null;
	}
}
GestureTrap.prototype.isTrapping = function() {
	if (BaseObject.is(this.$activeGestures,"Array") && this.$activeGestures.length > 0) return true;
	return false;
}
GestureTrap.prototype.stop = function() {
	if (this.isTrapping()) {
		// Stop the system tracker
		MouseTracker.Default().stopTracking();
		// We do not wait for the tracker to stop
	}
	this.$stopGestures();
}.Description("Stops trapping and reinit to initial state");
/**
 * @param e     {MouseEvent|PointerEvent|Point} The start point
 */
GestureTrap.prototype.start = function(e) {
	if (!this.get_alwaysstart() && this.isTrapping()) return false;
	if (e != null && e instanceof Event) {
		MouseTracker.Default().startTracking(this, e);
		return true;
	} else if (BaseObject.is(e, "Point")) {
        MouseTracker.Default().startTracking(this, e);
        return true;
    } else {
        this.LASTERROR(_Errors.compose(),"Attempt to start a GestureTrap without proper mouse sighting (mouse event) or explicitly specified point");
	}
	return false;
}.Description("Starts trapping the mouse for a capture. Depends on the gesture which is for now very rudimentary. Will usually wait for movement and if the state requirements match start a capture.")
 .Param("event_or_point","mouse DOM event for the starting position.");