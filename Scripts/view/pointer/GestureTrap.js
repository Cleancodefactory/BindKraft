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
        this.$gestures = Array.createArgumentsArray(arguments,1,null, "PointerGesture");
    } else {
        this.$gestures = Array.createArgumentsArray(arguments,0,null, "PointerGesture");
    }
}
GestureTrap.Inherit(BaseObject,"GestureTrap");
GestureTrap.Implement(IPointerTracker);
GestureTrap.prototype.$maxinterval = 2500; // Maximum time for a gesture to complete
GestureTrap.prototype.$startedAt = null; // When was the trap started
GestureTrap.ImplementProperty("alwaysstart", new InitializeBooleanParameter("If true tells the trap to start trapping from scratch even if there is active trapping at the moment."));

GestureTrap.prototype.get_allowdefault = function() {
	return false;
}
GestureTrap.prototype.handleMouseTrack = function(sender, trackevent) {
    var t = (new Date()).getTime();
    if (this.$startedAt != null && (t - this.$startedAt > this.$maxinterval)) {
        this.$startedAt = null;
        PointerTracker.Default().endTracking(this);
        return;
    }
	if (BaseObject.is(trackevent, "PointerTrackerEvent")) {
		// Main work
		var g = null;
		switch(trackevent.get_what()) { 
			case "start":
				this.$startGestures(trackevent);
			break;
			case "move":
			case "key":
				g = this.$tryGestures(trackevent);
				if (g === false) {
                    this.$stopGestures(); // Immediate stop to not waste time.
                    PointerTracker.Default().endTracking(this);
                    if (this.$sink != null) {
                        // This call is made in case the owner needs it (usually does not)
                        BaseObject.callCallback(this.$sink, null);
                    }
					
				} else if (BaseObject.is(g, "PointerGesture")) {
                    // The gestures are not stopped, because this also clears them.
                    // They are cleared also at start, so nothing is lost
                    PointerTracker.Default().endTracking(this);
                    this.$completeGestures(g);
                    if (this.$sink != null) {
                        BaseObject.callCallback(this.$sink, g);
                    }
				}
			break;
			case "cancel":
                this.$stopGestures();
                if (this.$sink != null) {
                    BaseObject.callCallback(this.$sink, null);
                }
            break;
			case "complete":
                // Some gestures may require completion of pointer capture
                g = this.$tryGestures(trackevent);
                if (BaseObject.is(g, "PointerGesture")) {
                    // The gestures are not stopped, because this also clears them.
                    // They are cleared also at start, so nothing is lost
                    // The tracker is stopping (complete means that), so no need to stop it.
                    this.$completeGestures(g);
                    if (this.$sink != null) {
                        BaseObject.callCallback(this.$sink, g);
                    }
				} else {
                    this.$stopGestures();
                    if (this.$sink != null) {
                        BaseObject.callCallback(this.$sink, null);
                    }
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
GestureTrap.prototype.$startGestures = function(msg) {
	this.$activeGestures = Array.createCopyOf(this.$gestures);
	for (var i = 0; i < this.$activeGestures.length; i++) {
		this.$activeGestures[i].$start(msg);
	}
}
GestureTrap.prototype.$stopGestures = function() {
	if (this.$activeGestures != null) {
		for (var i = 0; i < this.$activeGestures.length; i++) {
			this.$activeGestures[i].$stop();
		}
		this.$activeGestures = null;
    }
    this.$startedAt = null;
}
/**
 * Called only internally this method stops all the gestures, but one (specified by the argument)
 * The method is called after the gesture is recognized to put the trap in dormant state, but preserve 
 * the state of the recognized gesture for use by the code that set the trap.
 * 
 */
GestureTrap.prototype.$completeGestures = function(g) {
    if (this.$activeGestures != null) {
		for (var i = 0; i < this.$activeGestures.length; i++) {
            if (g != this.$activeGestures[i]) {
                this.$activeGestures[i].$stop();
            }
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
        this.$stopGestures();
		// Stop the system tracker
		PointerTracker.Default().stopTracking(this);
	}
    
}.Description("Stops trapping and reinit to initial state");

/**
 * @param e     {MouseEvent|PointerEvent|Point} The start point
 */
GestureTrap.prototype.start = function(e) {
	if (!this.get_alwaysstart() && this.isTrapping()) return false;
	if (e != null && e instanceof Event) {
        this.$startedAt = (new Date()).getTime();
        PointerTracker.Default().startTracking(this, e);
        return true;
    } else if (e != null && e.originalEvent instanceof Event) {
        this.$startedAt = (new Date()).getTime();
        PointerTracker.Default().startTracking(this, e.originalEvent);
        return true;
	} else if (BaseObject.is(e, "IGPoint") || BaseObject.is(e, "Point")) {
        this.$startedAt = (new Date()).getTime();
        PointerTracker.Default().startTracking(this, e);
        return true;
    } else {
        this.LASTERROR(_Errors.compose(),"Attempt to start a GestureTrap without proper mouse sighting (mouse event) or explicitly specified point");
	}
	return false;
}.Description("Starts trapping the mouse for a capture. Depends on the gesture which is for now very rudimentary. Will usually wait for movement and if the state requirements match start a capture.")
 .Param("event_or_point","mouse DOM event for the starting position.");

/**
 * Starts a trap with the specified gestures at the point specified (mouse/pointer event or Point can be used).
 * 
 * @param   e_p       {MouseEvent|Point}  The location at which the trapping starts
 * @params  gestures  {PointerGesture}    Any number of gestures or arrays containing gestures.
 * @returns Operation                     The operation succeeds only if a gesture is recognized, otherwise it fails. The result is the recognized gesture.
 * 
 * Obviously the failures can be ignored, because they signify that no gesture has been recognized, using only the Operation.prototype.onsuccess is enough.
 * 
 * The passed gestures have to be initialized as needed (depends on their implementation and the parameters it requires.) Reuse of gestures in multiple traps
 * or reuse of traps is Ok as long as the code that consumes the result does not need the state of the recognized gesture to remain unchanged for longer than the
 * current Javascript loop. Technically this extends to the next usage of the gesture in a trap, but limiting that is too difficult.
 */
GestureTrap.Trap = function(e_p, gestures) {
    var op = new Operation(null, 30000);
    var trap = new GestureTrap(function(g) {
        if (!op.isOperationComplete()) {
            if (g != null) {
                op.CompleteOperation(true, g)
            } else {
                op.CompleteOperation(false, null)
            }
        }
    },Array.createCopyOf(arguments,1));
    if (!trap.start(e_p)) {
        op.CompleteOperation(false, null);
    }
    return op;
}