



/* This Interface marks the beginning of an effort to streamline the keyboard processing in the framework, so that processing delegation can be implemented in a standard manner.
	This excludes accellerator and commands - they are processed on a lower level,
	whch brings us to the main focus of this Interface - it covers the main functional usage of the keyboard input by the class - input needed for the implementation of its functionality. For example:
		a drop down will want to open and close when certain keys are clicked, then scroll through the items by keyboard navigation - this is main functionality. On the contrary - an accelerator can
		literaly deprive an element/control of a chance to process normally certain keys, because they match certain accellerators. Yes, this is almost always a mistake - an unwanted effect, but it illustrates
		the level at which these are implemented.
		
	- processKeyData - this method is similar to a method typically named processKey in the old implementations. The name of the method and its parameters were not standardized and this is on of the main goals 
		of this interfaces.
		The kd argument is an object with properties carrying infomration about the key pressed, state of the modificator keys, corresponding caracter and so on. We no longer use the event from the browser in order to
			avoid discrepancies and create an isolation from it. This way the keyboard "events" can be simulated or converted by elements in the framework without any fear of dependency on the standard enforced by the 
			browser and the HTML standards.
		The kd parameter also gets rid of the up/down/pressed events and carries jut key onformation which by way of the Interface enforces a policy of separation of the code that intercepts the actual events and the code that
			processes them. The processing code will not depend on key up/down specifics - a translated key info will be send to it at moments decided by the rest of the class's logic.
 */
/*INTERFACE*/
function IKeyboardHandler() {}
IKeyboardHandler.Interface("IKeyboardHandler");
IKeyboardHandler.prototype.processKeyData = function(kd) {
		return false;
};
IKeyboardHandler.prototype.handleProcessKeyData = function(e_sender, kd) {
	return this.processKeyData(kd);
}
// We will want more advanced packing from event, string expression and so on, but we start with this.
IKeyboardHandler.packKeyDataFromEvent = function(ke,customData) {
	 if (ke == null) return null;
	 if (ke.__isKeyData) return ke;
	 var r = { __isKeyData: true};
	 
	 //if (typeof ke.code )
	 if (typeof ke.which == "number" && ke.which != 0) {
		 r.which = ke.which;
	 } else if (ke.keyCode != null && ! isNaN(parseInt(ke.keyCode))) {
		 r.which = parseInt(ke.keyCode);
	 } else {
		return null;
	 }
	 r.ctrlKey = ke.ctrlKey;
	 r.shiftKey = ke.shiftKey;
	 r.altKey = ke.altKey;
	 r.metaKey = ke.metaKey;
	 if (customData != null) {
		 r.custom = customData;
	 }
	 return r;
};