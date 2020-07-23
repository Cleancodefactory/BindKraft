/**
 * We start with mouse, later more will be added
 */

function PointerTracker(eventmode) {
	BaseObject.apply(this,arguments);
	this.set_eventmode(eventmode);
	this.$clearTrackData();
}
PointerTracker.Inherit(BaseObject, "PointerTracker");

//#region Public properties
PointerTracker.prototype.get_eventmode = function() {
    if (this.$events == this.$eventNames.pointer) return "pointer";
    return "mouse";
}
PointerTracker.prototype.set_eventmode = function(v) {
    this.$uninitTracker();
    if (v == "pointer") {
        this.$events = this.$eventNames.pointer;
    } else {
        this.$events = this.$eventNames.mouse;
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
PointerTracker.prototype.$client = null; // Tracker - the client that requested tracking (BaseObject, IMouseTracker)
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

///////////// Handlers /////////////////
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
		var o = BaseObject.DeepClone(MouseTracker.keyStates);
		for (i in o) {o[i] = true;}
		this.$lastKeyState = state?state:{};
		return o;
	}
	var events = {};
	for (i in MouseTracker.keyStates) {
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
		this.$lastClientPoint = new Point(e.clientX,e.clientY);
		this.$lastPagePoint = new Point(e.pageX,e.pageY);
	}
	return this.$applyKeyStateFromEvent(e);
}


//#endregion


//#region Tracking control

PointerTracker.prototype.startTracking = function(client,initialPoint_or_MouseEvent) {
	this.stopTracking(this.thisCall(function() {
		var changedstates = null;
		if (BaseObject.is(client, "IPointerTracker")) {
			this.$clearTrackData();
			this.$client = client;
			this.$tracking = true;
			if (BaseObject.is(initialPoint_or_MouseEvent, "Point")) {
				this.$lastClientPoint = new Point(initialPoint_or_MouseEvent);
			} else if (initialPoint_or_MouseEvent != null && initialPoint_or_MouseEvent.target) {
                // Will set lastClientPoint and strip states
				changedstates = this.$reportMouseMessage(initialPoint_or_MouseEvent);
			}
			var msg = this.createTrackMessage("start",changedstates); // move
			this.adviseClient(msg);
		} else {
			this.$clearTrackData();
			this.LASTERROR(_Errors.compose(),"The client must implement IMouseTracker");
		}
	}));
}.Description("Starts tracking/capturing the mouse. Can be supplied with initial mouse event from which it will strip initial coordinates, but will ignore the type of the event")
	.Param("client","Object supporting IMouseTracker which will be advised for the mouse movements while the tracking operation continues." +
			"Only one tracking operation is allowed at any given moment. Starting a new one will stop (cancel) the current one.")
	.Param("initialPoint_or_MouseEvent","If mouse event is supplied clientX/Y are stripped from it as lastPoint, if point is supplied it will be used only if there is a container and it will be interpretted in container coordinates.");
///////// Stop (cancel), Complete tracking
PointerTracker.prototype.stopTracking = function(callback) {
	if (this.isTracking()) { // Have to stop it indead - this is cancelled 
		var msg = this.createTrackMessage("cancel"); // No need of keystate changes data - nothing can be changed at this moment.
		this.adviseClient(msg);
		this.$clearTrackData();
	} 
	// Currently we call this each time, but some optimizations will come into play in future.
	if (BaseObject.isCallback(callback)) BaseObject.callCallback(callback);
}
PointerTracker.prototype.completeTracking = function(callback, msg) {
	if (this.isTracking()) { // Have to stop it indead - this is cancelled 
		var msg = this.createTrackMessage("complete"); // No need of keystate changes data - nothing can be changed at this moment.
		this.adviseClient(msg);
		this.$clearTrackData();
	}
	if (BaseObject.isCallback(callback)) BaseObject.callCallback(callback);
}

////////// Message helpers /////////////
PointerTracker.prototype.createTrackMessage = function(what, changedstates) {
	var m = new MouseTrackerEvent(this,what, changedstates);
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