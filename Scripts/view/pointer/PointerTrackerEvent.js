/*
	Carries information for the reported mouse tracking events.
	We want to support a lot of useful shit and stuff, so we use this class
	as the meens to pass data through events - we can extend it gradually.
	
	Second important trait of this class are the tools supplied as methods.
	They usually base their functionality on methods of the geometric classes,
	but in a form that is most useful for the consumer of the message.
	Having these methods on this object saves the need to pass the coorfinate parameters (at least)
	and makes their usage.
	
	Event types (what)
	start,
	move,
	key,
	cancel,
	complete
	
*/
function PointerTrackerEvent(sender, what, changekeydstates) {
	BaseObject.apply(this,arguments);
	this.set_what(what);
	this.set_clientpos(sender.$lastClientPoint);
	this.set_pagepos(sender.$lastPagePos);
	this.set_keystate(sender.$lastKeyState);
    this.set_keystatechanges(changekeydstates);
    this.$tracker = sender;
}
PointerTrackerEvent.Inherit(BaseObject, "PointerTrackerEvent")
    .Implement(ICloneObject);
PointerTrackerEvent.ImplementProperty("what", new InitializeStringParameter("What is happening - start, move, key, cancel,complete",null));
PointerTrackerEvent.ImplementProperty("clientpos", new InitializeObject("The position of the mouse as reported by the message",null));
PointerTrackerEvent.ImplementProperty("pagepos", new InitializeObject("The position of the mouse as reported by the message's pageX/pageY",null));
PointerTrackerEvent.ImplementProperty("keystate", new InitializeObject("last key state - alt, ctrl, shift ..."));
PointerTrackerEvent.ImplementProperty("keystatechanges", new InitializeObject("object with props indicating what has just changed in the state of the 4 special keys."));
PointerTrackerEvent.ImplementProperty("key", new InitializeNumericParameter("Valid only for key event - key code."));

PointerTrackerEvent.prototype.cloneObject = function(_trackMath) { 
    var trackmath = null;
    if (BaseObject.is(_trackMath, "TrackMathBase")) {
        trackmath = _trackMath;
    }
    var msg;
    if (trackmath != null) {
        msg = new PointerTrackerEvent(this.$tracker, this.get_what(), this.get_keystatechanges());
        msg.set_keystate(this.get_keystate());
        msg.set_key(this.get_key());
        msg.set_clientpos(trackmath.trackPoint(this.get_clientpos()));
        msg.set_pagepos(trackmath.trackPoint(this.get_pagepos()));
        return msg;
    } else {
        msg = new PointerTrackerEvent(this.$tracker, this.get_what(), this.get_keystatechanges());
        msg.set_keystate(this.get_keystate());
        msg.set_key(this.get_key());
        return msg;
    }
}

