
function TrackPointer(callback, trackmath, operation) {
    BaseObject.apply(this, arguments);
    this.$callback = callback;
    this.$trackmath = trackmath;
    if (BaseObject.is(operation, "Operation")) {
        this.$operation = operation;
    } else {
        this.$operation = new Operation();
    }
    var me = this;
    this.$operation.then(function(op) {
        if (me.$operation != null) {
            if (op.isOperationSuccessful()) {
                PointerTracker.Default().completeTracking(me);
            } else {
                PointerTracker.Default().stopTracking(me);
            }
        }
    });
}
TrackPointer.Inherit(BaseObject, "TrackPointer")
    .Implement(IPointerTracker)
    .ImplementProperty("cursor", new Initialize("Optional cursor to apply during", null));

TrackPointer.prototype.$callback = null;
TrackPointer.prototype.$trackmath = null;
TrackPointer.prototype.$operation = null;
TrackPointer.prototype.get_operation = function() {
    return this.$operation;
}


//#region IPointerTracker

TrackPointer.prototype.handleMouseTrack = function(sender, trackevent) {
    if (!BaseObject.isCallback(this.$callback)) {
        if (this.$operation != null && !this.$operation.isOperationComplete()) {
            this.$operation.CompleteOperation(false, "no callback");
            this.$operation = null;
        }
        return;
    }
    var ptIn = trackevent.get_clientpos();
    var pt;
    // start, move, key,  complete,  end, cancel
    switch(trackevent.get_what()) {
        case "start":
            if (BaseObject.is(this.get_cursor(),"PointerCursor")) {
                this.get_cursor().applyTo();
            }
            BaseObject.callCallback(this.$callback, 
                                this.$operation, 
                                ((this.$trackmath != null)?this.$trackmath.trackPoint(ptIn):ptIn),
                                trackevent,
                                this.$trackmath);
        break;
        case "move":
            BaseObject.callCallback(this.$callback, 
                this.$operation, 
                ((this.$trackmath != null)?this.$trackmath.trackPoint(ptIn):ptIn),
                trackevent,
                this.$trackmath);
        break;
        case "key":
        break; // ???
        case "complete":
        case "end": // ???
            if (BaseObject.is(this.get_cursor(),"PointerCursor")) {
                this.get_cursor().unapplyTo();
            }
            pt = ((this.$trackmath != null)?this.$trackmath.trackPoint(ptIn):ptIn); 
            BaseObject.callCallback(this.$callback, 
                this.$operation, 
                pt,
                trackevent,
                this.$trackmath);
            if (this.$operation != null && !this.$operation.isOperationComplete()) {
                this.$operation.CompleteOperation(true, pt);
                this.$operation == null;
            }
        break;
        case "cancel":
            if (BaseObject.is(this.get_cursor(),"PointerCursor")) {
                this.get_cursor().unapplyTo();
            }
            if (this.$operation != null && !this.$operation.isOperationComplete()) {
                this.$operation.CompleteOperation(false, "cancelled");
                this.$operation == null;
            }
        
        break;
    }
}

//#endregion

/**
 * @param callback {callback}   Calls it with all the trackmessages and the math (see below)
 * @param trackmath {TrackMathBase} initialized track math
 * @returns {Operation}   If the operation is complete the action was performed, if it fails,
 *  it was interrupted/cancelled.
 * 
 * The callback:
 * function(op, point, trackmessage, trackmath) { }
 * Typically most callbacks can do without the last 2 arguments, but those that need more info or
 * additional methods of trackmath would use them.
 * The callback can complete the operation at any moment or rely on the PointerTracker's completion.
 * 
 */
TrackPointer.Track = function(startpoint, callback, trackmath, trackcursor) {
    var op = new Operation();
    var tr = new TrackPointer(callback, trackmath, op);
    if (trackcursor != null) {tr.set_cursor(trackcursor);}
    PointerTracker.Default().startTracking(tr, startpoint);
    return op;
}
