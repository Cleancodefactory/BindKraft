



/* The concept here is about the idea that various cases can be represented logically as constructs made of elements from the following categories:
	1. Selection display (collector): represened by ISelectionConsumer protcol. The collector can receive selection suggestions and add them to/replace the current selection.
				The selector can optionally Implement means to check if the suggested selection is acceprable and ignore it if not. This does not require synchronization with the other elements.
	2.Pattern/filter data provider: represented by IFilterDataSource Interface. The filter provider is usually some construct with UI that enables the user to specify filter/key data by which
				an item or items can be determined as possible selections (this can be fiter pattern, code, multifield patterns etc. See detailed requirements in the Interface's comments). This data can be wired to
				selection providers and they should use it to provide UI where the user can make a selection by other means (navigating to an item for instance) or determine if the pattern points to a predetrmined
				selection and. 
	3.Selector (selection provider): represented by IHintedSelector Interface. The selection provider receives hint (pattern/filter/ code - see IFilterDataSource) in two possibe forms - implicit or explicit. Each has
				its own method and thus the filter provider can be connected with the selection provider with one of them or both (as appropriate). Depending on the received hints and/or user actions in the selector provider'same
				UI (if it has UI) the provider fires selection suggested event. This event is usually wired to the selection display (ISelectionConsumer) which is responsible to show it and remember it somehow (this may depend on
				its purpose - single selection/multiple selection, allowed or not reoccurence of items and so on).
	Obviously a class can Implement more than one of these interfaces and also very likely some keyboard interfaces (see below IKeyboardLogicalSource and IKeyboardHandler) to form together a construct perceived by the end user
				as a single entity. Having the interfaces some automatic recognition can be implemented and simplify the construction of such composites further.
				
	Hint format: While random format are not forbidden when controls involved are purposed for a specific usage, there is still a STRONGLY RECOMMENDED format:
		{ defaultHint: hint }
		if only a single value is to be sent it should fit into the defaultHint property of a simple object. Such a hint is usually applied as a filter to mulptiple fields (As decided by the selector) potentially in different manner,
		e.g. numerics to some fileds, alphanumerics to others ...
		Hints for specific columns/properties should be set under property with the column/property name. Thus the logic of the selectors will know what to do by default and if some of these have to be applied to more than a single column/property
		the logic can be implemented as "application of the filter for colum A to columns C and D as well".
		
*/
/*INTERFACE*/
function ISelectionConsumer() {}
ISelectionConsumer.Interface("ISelectionConsumer");
ISelectionConsumer.prototype.setSelection = function(item) {
	throw "ISelectionConsumer.prototype.setSelection is not implemented in " + this.fullClassType();
}.Description("Should set the selection and NOT fire any event. This is intended mostly for initialization with data values. You can use for initialization any selecteditem property or similar, this method is defined by the Interface to guarantee that there will be convenient event handling targets.");
ISelectionConsumer.prototype.handleSetSelection = function(e_sender, item) {
	this.setSelection(item);
}
ISelectionConsumer.prototype.suggestSelection = function(item) {
	throw "ISelectionConsumer.prototype.suggestSelection is not implemented in " + this.fullClassType();
}
ISelectionConsumer.prototype.handleSuggestSelection = function(e_sender, item) {
	this.suggestSelection(item);
}
ISelectionConsumer.prototype.selectionacceptedevent = new InitializeEvent("Fired when a selection is accepted/added/set and UI updated, this gives a chance to other controls to adjust their state accordingly.");
ISelectionConsumer.prototype.fireSelectionAcceptedEvent = function(item) {
	this.selectionacceptedevent.invoke(this,item);
}
