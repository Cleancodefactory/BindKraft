


/*INTERFACE*/
function IInfoDisplay() { }
IInfoDisplay.Interface("IInfoDisplay");
IInfoDisplay.prototype.infoDisplayAdd = function (info) { // (InfoMessageQuery info) Adds a message to the display
    // TODO: Override and imeplement adding to the corresponding storages, then invoke update on the display area (whatever these are in your actual case)
}
IInfoDisplay.prototype.infoDisplayClear = function (clearWhat) { // Clear the display. The clearWhat is now reserved, will be used as an option to clear some messages only
    // TODO: Override and imeplement clear on the storages, then invoke update on the display area or if no messages remain dematerialize it if this is possible.
}
IInfoDisplay.prototype.$isinfodisplayactive = true;
IInfoDisplay.prototype.get_isinfodisplayactive = function () { return this.$isinfodisplayactive; }
IInfoDisplay.prototype.set_isinfodisplayactive = function (v) { this.$isinfodisplayactive = v; }
IInfoDisplay.ImplementProperty("maxinfomessagepriority", new InitializeNumericParameter("Max priority for which to display the message unconditionaly.", 0));
IInfoDisplay.prototype.infodisplayaddevent = new InitializeEvent("Fires when a message was added to the display. Support is optional");
IInfoDisplay.prototype.infodisplayremoveevent = new InitializeEvent("Fires when a message was removed from the display. Support is optional");
IInfoDisplay.prototype.infodisplayclearevent = new InitializeEvent("Fires when a the display has been cleared. Support is optional");
IInfoDisplay.prototype.infodisplayactionevent = new InitializeEvent("Fires when a the the user has acted on a message. Usually this is clicking it. Support is optional");
