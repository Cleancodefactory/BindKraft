/* This Interface is mostly a formalization which is most often optional, but implementing it on classes that indeed perform keyboard message handling will open additional possibilities.
*/
/*INTERFACE*/
function IKeyboardEventHandler() {
	if (this.root != null) {
		this.on("keyup",this.processKey);
	}
}
IKeyboardEventHandler.Interface("IKeyboardEventHandler");
IKeyboardEventHandler.RequiredTypes("Base");
IKeyboardEventHandler.prototype.processKey = function(e) {
	// The default implementation routes the message to the keyboard handler (this should be the preferred pattern for keyboard aware elements).
	if (this.supports("IKeyboardHandler")) return this.processKeyData(IKeyboardHandler.packKeyDataFromEvent(e));
	return false;
};
IKeyboardHandler.prototype.handleProcessKey = function (e) { // This method is only for symetry with other cases. In fact we do not need it - all info is in the browser's keyboard event.
	return this.processKey(e);
};
