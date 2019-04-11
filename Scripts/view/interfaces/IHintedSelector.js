


/*INTERFACE*/
function IHintedSelector() {};
IHintedSelector.Interface("IHintedSelector");
IHintedSelector.prototype.processExplicitHintData = function(hint) {
	throw "processExplicitHintData is not implemented in " + this.fullClassType();
};
IHintedSelector.prototype.handleProcessExplicitHintData = function(e_sender,hint) {
	this.processExplicitHintData(hint);
};
IHintedSelector.prototype.processImplicitHintData = function(hint) {
	throw "processImplicitHintData is not implemented in " + this.fullClassType();
};
IHintedSelector.prototype.handleProcessImplicitHintData = function(e_sender,hint) {
	this.processImplicitHintData(hint);
};
IHintedSelector.prototype.handleStartHintProcessingUI = function() {}.Description("Optionally can Implement initialization e.g. open for something like drop down. The processing should not depend on this!");
IHintedSelector.prototype.handleStopHintProcessingUI = function() {}.Description("Optionally can Implement uninitialization e.g. close for something like drop down. The processing should not depend on this!");
IHintedSelector.prototype.selectionsuggestevent = new InitializeEvent("Fired when a selection is suggested from the selector. The handler of the event can add or set the suggested item to its selection after additional optional checks. The item is the data (second parameter) of the event.");
IHintedSelector.prototype.fireSelectionSuggestEvent = function(item) {
	this.selectionsuggestevent.invoke(this, item);
}
