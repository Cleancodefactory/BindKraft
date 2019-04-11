


/*INTERFACE*/
function IHintedSelectorUIController () {}
IHintedSelectorUIController.Interface("IHintedSelectorUIController");
// These two events need to be handled by the corresponding handlers in the hinted selector(s).
// Firing these events is optional, but strongly encouraged, because it makes construction of UI elements much easier.
IHintedSelectorUIController.prototype.starthintprocessinguievent = new InitializeEvent("Fires to inform selectors that their UI is about to get used. See the handleStartHintProcessingUI for more info.");
IHintedSelectorUIController.prototype.stophintprocessinguievent = new InitializeEvent("Fires to inform selectors that their UI can be unloaded/closed.... See handleStopHintProcessingUI for more info.");
IHintedSelectorUIController.prototype.fireStartHintProcessingUIEvent = function(data) {
	this.starthintprocessinguievent.invoke(this, data);
}.Description("Fires the starthintprocessinguievent.")
 .Param("data","Not currently defined, reserved for future use. Send null for now");
IHintedSelectorUIController.prototype.fireStopHintProcessingUIEvent = function(data) {
	this.stophintprocessinguievent.invoke(this, data);
}.Description("Fires the stophintprocessinguievent.")
 .Param("data","Not currently defined, reserved for future use. Send null for now"); 
 