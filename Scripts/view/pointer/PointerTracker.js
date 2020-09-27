/**
 * Mouse buttons and touches will be treated as mouse button like occurrences.
 * 
 * Tracker messages:
 * start    
 * 
 * move
 * key
 * 
 * complete
 * end
 * cancel
 */

function PointerTracker(eventmode) {
	BaseObject.apply(this,arguments);
	this.set_eventmode(eventmode);
	if (window.TouchEvent) this.$touchOn = true;
	this.$clearTrackData();
}
PointerTracker.Inherit(BaseObject, "PointerTracker");

PointerTracker.prototype.$touchOn = false;
PointerTracker.prototype.get_defaultMode = function() {
	var m = window.JBCoreConstants.TrackingDefaultMode;
	return (m != null?m:"mouse");
}
//#region Public properties
PointerTracker.prototype.get_eventmode = function() {
	if (this.$events == this.$eventNames.pointer) return "pointer";
	if (this.$events == this.$eventNames.mouse) return "mouse";
    return null; // Let it roll and cause exceptions if the configuration is impossible.
}
PointerTracker.prototype.set_eventmode = function(v) {
    this.$uninitTracker();
    if (v == "pointer") {
        this.$events = this.$eventNames.pointer;
    } else if (v == "mouse") {
        this.$events = this.$eventNames.mouse;
    } else {
		this.$events = this.$eventNames[this.get_defaultMode()];
	}
    this.$initTracker();
}

//#endregion


//#region Functional data
PointerTracker.prototype.$eventNames = {
    mouse: {
        move: "mousemove",
        down: "mousedown",
        up: "mouseup"
    },
    pointer: {
        move: "pointermove",
        down: "pointerdown",
        up: "pointerup"
    }
};
PointerTracker.prototype.$events = PointerTracker.prototype.$eventNames.mouse;

//#endregion

//#region Track data

// Constant template for the control key states
PointerTracker.keyStates = { ctrlKey: false, altKey: false, metaKey: false, shiftKey: false };

PointerTracker.prototype.$tracking = false; // true when tracking is active
PointerTracker.prototype.$client = null; // Tracker - the client that requested tracking (BaseObject, IPointerTracker)
PointerTracker.prototype.$lastClientPoint = null; // The last known mouse pos (viewport coordinates)
PointerTracker.prototype.$lastPagePoint = null; // The last known mouse pos (page coordinates)
PointerTracker.prototype.$lastKeyState = {}; // The last known mouse pos (page coordinates)

//#endregion

//#region Track data methods

PointerTracker.prototype.$clearTrackData = function() {
	this.$lastClientPoint = null;
	this.$lastPagePoint = null; // Only for optional purposes - the client point is what we really track (for the moment at least)
	this.$lastKeyState = {};
	this.$client = null;
	this.$tracking = false;
}.Description("Clears all the dynamic tracking data");

PointerTracker.prototype.$uninitTracker = function() { // It is not clear if we will ever need this.
	var body = window.document.body;
	body.removeEventListener(this.$events.move, this.$handleMouseMove,true);
	body.removeEventListener(this.$events.down, this.$handleMouseDown,true);
	body.removeEventListener(this.$events.up, this.$handleMouseUp,true);
	body.removeEventListener("keyup",this.$handleKeyUp,true);
}
PointerTracker.prototype.$initTracker = function() {
	var body = window.document.body;
	body.addEventListener(this.$events.move, this.$handleMouseMove,true);
	body.addEventListener(this.$events.down, this.$handleMouseDown,true);
	body.addEventListener(this.$events.up, this.$handleMouseUp,true);
	body.addEventListener("keyup",this.$handleKeyUp,true);
}
PointerTracker.prototype.isTracking = function() {
	return (this.$client && this.$tracking);
}

//#endregion

//#region Handlers

PointerTracker.prototype.$handleMouseMove = new InitializeMethodCallback("Handle mouse movements on the body","handleMouseMove");
PointerTracker.prototype.$handleMouseDown = new InitializeMethodCallback("Handle mouse down on the body","handleMouseDown");
PointerTracker.prototype.$handleMouseUp = new InitializeMethodCallback("Handle mouse up on the body","handleMouseUp");
PointerTracker.prototype.$handleKeyUp = new InitializeMethodCallback("Handle key up on the body","handleKeyUp");

///////////// Mouse/pointer Handlers /////////////////
PointerTracker.prototype.handleMouseMove = function(e) {
	if (!this.isTracking()) return;
	var changedstates = this.$reportMouseMessage(e);
	// TODO: Use changedstates when we decide to extend this in future.
	var msg = this.createTrackMessage("move",changedstates); // move
	this.adviseClient(msg);
	e.preventDefault();
}
PointerTracker.prototype.handleMouseDown = function(e) {
	if (!this.isTracking()) return; // We have to do more here when we start handling start-track situations
	var changedstates = this.$reportMouseMessage(e);
	// TODO: Use changedstates when we decide to extend this in future.
	// Stop the tracking here (it might be stopped already through call from the client while handling the message).
	this.stopTracking(); // The client should not start new tracking during handling.	
	e.preventDefault();
}
PointerTracker.prototype.handleMouseUp = function(e) {
	if (!this.isTracking()) return;
	var changedstates = this.$reportMouseMessage(e);
	// TODO: Use changedstates when we decide to extend this in future.
	this.completeTracking(); // The client should not start new tracking during handling.	
	e.preventDefault();
}
/////////// Touch handlers //////////////////////
// Currently the first touch (the only touch that is supported at start) is the touch we track
// Any additional touches will act as modifiers (not implemented on first pass)
PointerTracker.prototype.$mainTouchId = null;
PointerTracker.prototype.$getMainTouch = function(e) {
	if (e.touches && e.touches.length > 0) {
		var touch;
		if (this.$mainTouchId == null) {
			touch = e.touches[0];
			this.$mainTouchId = touch.identifier;
		} else {
			for (var i = 0; i < e.touches.length; i++) {
				if (e.touches[i].identifier == this.$mainTouchId) {
					touch = e.touches[i];
					break;
				}
			}
		}
		
		return touch; // Can be null - deal with that in the caller.
		
	}
}
PointerTracker.prototype.handleTouchStart = function(e) {
	if (e.touches && e.touches.length > 1) {
		// Temporary solution
		this.stopTracking(); // The client should not start new tracking during handling.	
		e.preventDefault();
	}
	var touch = this.$getMainTouch(e);
	if (touch == null) {
		this.stopTracking(); // The client should not start new tracking during handling.	
		e.preventDefault();
	}
	var changedstates = this.$reportTouchMessage(e, touch);
	var msg = this.createTrackMessage("move",changedstates); // TODO: Is move ok without marking buttons and stuff?
	this.adviseClient(msg);
	e.preventDefault();
}
PointerTracker.prototype.handleTouchMove = function(e) {
	var touch = this.$getMainTouch(e);
	if (touch == null) {
		this.stopTracking(); // The client should not start new tracking during handling.	
		e.preventDefault();
	}
	var changedstates = this.$reportTouchMessage(e, touch);
	var msg = this.createTrackMessage("move",changedstates); // TODO: Is move ok without marking buttons and stuff?
	this.adviseClient(msg);
	e.preventDefault();
}
PointerTracker.prototype.handleTouchEnd = function(e) {
	
}
PointerTracker.prototype.handleTouchCancel = function(e) {
	
}


/////////// Keyboard handler(s) /////////////////
PointerTracker.prototype.handleKeyUp = function(e) {
	if (!this.isTracking()) return;
	var changedstates = this.$applyKeyStateFromEvent(e);
	// TODO: Use changedstates when we decide to extend this in future.
	var ch = (typeof e.which == "number")? e.which:e.keyCode;
	if (ch == 27) {
		this.stopTracking(); // The client should not start new tracking during handling.	
		e.preventDefault();
	} else {
		var msg = this.createTrackMessage("key",changedstates); // move
		msg.set_key(ch);
		this.adviseClient(msg);
		// e.preventDefault(); // TODO: Should we prevent default?
	}
}
/////////////// Handler helpers ///////////////
PointerTracker.prototype.$applyKeyStateFromEvent = function(e) {
	return this.$applyKeyState(this.$getKeyState(e));
}.Description("Sets a new last key state and returns an object with the states that have changed.");
PointerTracker.prototype.$applyKeyState = function(state) {
	var i;
	// If any state is null we consider this full change even if both are nulls
	if (state == null || this.$lastKeyState == null) {
		var o = BaseObject.DeepClone(PointerTracker.keyStates);
		for (i in o) {o[i] = true;}
		this.$lastKeyState = state?state:{};
		return o;
	}
	var events = {};
	for (i in PointerTracker.keyStates) {
		if (this.$lastKeyState[i] != state[i]) {
			events[i] = true;
		}
		this.$lastKeyState[i] = state[i];
	}
	return events;
}.Description("Sets a new last key state and returns an object with the states that have changed.");
PointerTracker.prototype.$getKeyState = function(e) {
	return {
		ctrlKey: e.ctrlKey,
		altKey: e.altKey,
		metaKey: e.metaKey,
		shiftKey: e.shiftKey
	};
}
/* $reportMouseMessage
	Reports a mouse message so that important data would be stripped from it and preserved in the tracker for theduration
	of the tracking session.
*/
PointerTracker.prototype.$reportMouseMessage = function(e) {
	if (e.clientX != null && e.clientY != null) {
		this.$lastClientPoint = new GPoint(e.clientX,e.clientY);
		this.$lastPagePoint = new GPoint(e.pageX,e.pageY);
	}
	return this.$applyKeyStateFromEvent(e);
}
PointerTracker.prototype.$reportTouchMessage = function(touchEvent, touch) {
	if (touch.clientX != null && touch.clientY != null) {
		this.$lastClientPoint = new GPoint(touch.clientX,touch.clientY);
		this.$lastPagePoint = new GPoint(touch.pageX,touch.pageY);
	}
	if (this.$mainTouchId == null) {
		this.$mainTouchId = touch.identifier;
	}
	return this.$applyKeyStateFromEvent(touchEvent);
}


//#endregion


//#region Tracking control

PointerTracker.prototype.startTracking = function(client,initialPoint_or_MouseEvent) {
    var GPoint = Class("GPoint");
	this.stopTracking(this.thisCall(function() {
		var changedstates = null;
		if (BaseObject.is(client, "IPointerTracker")) {
			this.$clearTrackData();
			this.$client = client;
			this.$tracking = true;
			if (BaseObject.is(initialPoint_or_MouseEvent, "IGPoint") || BaseObject.is(initialPoint_or_MouseEvent, "Point")) {
				this.$lastClientPoint = new GPoint(initialPoint_or_MouseEvent);
			} else if (this.$touchOn && initialPoint_or_MouseEvent instanceof TouchEvent) {
				// In future we may want to process cases with more than one touch, but for now we require single touch!
				if (initialPoint_or_MouseEvent.touches.length == 1) {
					var touch = initialPoint_or_MouseEvent.touches[0];
					if (touch instanceof Touch) {
						changedstates = this.$reportTouchMessage(initialPoint_or_MouseEvent, touch);
					}
				} else {
					return;// See the comment above
				}
			} else if (initialPoint_or_MouseEvent != null && initialPoint_or_MouseEvent.target) {
                // Will set lastClientPoint and strip states
				changedstates = this.$reportMouseMessage(initialPoint_or_MouseEvent);
			}
			var msg = this.createTrackMessage("start",changedstates); // move
			this.adviseClient(msg);
		} else {
			this.$clearTrackData();
			this.LASTERROR(_Errors.compose(),"The client must implement IPointerTracker");
		}
	}));
}.Description("Starts tracking/capturing the mouse. Can be supplied with initial mouse event from which it will strip initial coordinates, but will ignore the type of the event")
	.Param("client","Object supporting IPointerTracker which will be advised for the mouse movements while the tracking operation continues." +
			"Only one tracking operation is allowed at any given moment. Starting a new one will stop (cancel) the current one.")
	.Param("initialPoint_or_MouseEvent","If mouse event is supplied clientX/Y are stripped from it as lastPoint, if point is supplied it will be used only if there is a container and it will be interpretted in container coordinates.");

/**
 * Cancels the tracking and sends to the client a cancel message.
 * If your usage is complete - use endTracking and not stopTracking.
 * 
 * @param callback  {callback | IPointerTracker}    This can be a callback called after the tracking stops to continue some task or
 *      a reference to the client. If it is a reference to the client, the method will do nothing if the client is already a different one.
 * 
 */
PointerTracker.prototype.stopTracking = function(callback) {
    if (BaseObject.is(callback, "IPointerTracker") && callback != this.$client) return;
	if (this.isTracking()) { // Have to stop it indead - this is cancelled 
		var msg = this.createTrackMessage("cancel"); // No need of keystate changes data - nothing can be changed at this moment.
		this.adviseClient(msg);
		this.$clearTrackData();
	} 
	// Currently we call this each time, but some optimizations will come into play in future.
	if (BaseObject.isCallback(callback)) BaseObject.callCallback(callback);
}
/**
 * Completes the tracking by initiating it from the tracker side. This can happen
 * because of internal implementation interpreting the pointer usage as complete regardless
 * of any tracker client's activities or by a third party that wants to stop the tracker not by
 * cancelling the process, but by forcibly completing it, which gives the client a chance to finish
 * its task successfully (if appropriate). An example will be dragging something that can be dropped
 * at any point of the dragging action. Usually this effect is determined by the client, but the option
 * is here for all those cases where outside decision my be desired (however rare they might be).
 * 
 * @param callback  {callback | IPointerTracker}    This can be a callback called after the tracking stops to continue some task or
 *      a reference to the client. If it is a reference to the client, the method will do nothing if the client is already a different one.
 */
PointerTracker.prototype.completeTracking = function(callback) {
    if (BaseObject.is(callback, "IPointerTracker") && callback != this.$client) return;
	if (this.isTracking()) { // Have to stop it indead - this is cancelled 
		var msg = this.createTrackMessage("complete"); // No need of keystate changes data - nothing can be changed at this moment.
		this.adviseClient(msg);
		this.$clearTrackData();
	}
	if (BaseObject.isCallback(callback)) BaseObject.callCallback(callback);
}
/**
 * Ends the tracking and sends "end" message to the client. This message should be ignored in most cases, it is provided
 * mostly for debugging purposes.
 * 
 * @param callback  {callback | IPointerTracker}    This can be a callback called after the tracking stops to continue some task or
 *      a reference to the client. If it is a reference to the client, the method will do nothing if the client is already a different one.
 */
PointerTracker.prototype.endTracking = function(callback) {
    if (BaseObject.is(callback, "IPointerTracker") && callback != this.$client) return;
	if (this.isTracking()) { // Have to stop it indead - this is cancelled 
		var msg = this.createTrackMessage("end"); 
		this.adviseClient(msg);
		this.$clearTrackData();
	}
	if (BaseObject.isCallback(callback)) BaseObject.callCallback(callback);
}

////////// Message helpers /////////////
PointerTracker.prototype.createTrackMessage = function(what, changedstates) {
	var m = new PointerTrackerEvent(this,what, changedstates);
	// Fill in stuff from the tracker.
	m.set_clientpos(this.$lastClientPoint);
	m.set_pagepos(this.$lastPagePoint);
	return m;
}
PointerTracker.prototype.adviseClient = function(msg) {
	if (this.isTracking() && msg != null) {
		this.$client.handleMouseTrack(this,msg);
	}
}

//#endregion


PointerTracker.Default = function() {
	if (PointerTracker.$default == null) {
		PointerTracker.$default = new PointerTracker();
	}
	return PointerTracker.$default;
}