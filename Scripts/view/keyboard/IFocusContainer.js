


/* Important considerations
	When containers are implemented for DOM segments in a view the parent container should check the registered sub-containers
	for viability:
		1. If sub-container is obliterated: remove it and continue
		2. If sub-container is not in the document: remove it and continue
		
*/

/*INTERFACE*/
function IFocusContainer() {}
IFocusContainer.Interface("IFocusContainer");
IFocusContainer.classInitialize = function(cls) {
	cls.Obliterator(function() {
		var c = this.get_focuscoordinator();
		if (BaseObject.is(c, "IFocusContainerRegister")) {
			c.FCUnregisterSubordinate(this);
			this.set_focuscoordinator(null);
		}
	});
}
IFocusContainer.prototype.$hasFocus = false; // ???
IFocusContainer.ImplementProperty("focusindex", new InitializeNumericParameter("Index of the element in the focus chain", 0));
IFocusContainer.ImplementProperty("focuscolumn", new InitializeNumericParameter("Index of the element in the focus chain", 0));
IFocusContainer.ImplementProperty("focusdepth", new InitializeNumericParameter("Index of the element in the focus chain", 0));
IFocusContainer.ImplementProperty("focuscoordinator", new InitializeParameter("The parent of this container.", null));
IFocusContainer.prototype.FCInspectChildElement = function(node) { // raw node
	// This implementation will be functional on views only.
}.Description("This is called by the framework materializer to inspect a node. The container must find out if this is a focusable element, subcontainer or anything else that is controlled by it. It also needs to attach the appropriate behaviours on it.");
// This one is needed when the internals change and need to be reenumerated.
IFocusContainer.prototype.FCEnumerate = function() {
}.Description("Enumerate subcontainers or controlled elements. This is used mostly as internal function called between instances of the Interface implementations.");
IFocusContainer.prototype.FCSetFocus = function(/*default=begin*/ focusDirection) {
}.Description("Hands the focus to the container with a hint for the direction from which it comes. The container must set the actual focus to an appropriate subordinate.");
// OnLoseFocus is called BEFORE the focus is actually taken from the subordinate in order to
//	- give it a chance to prepare
//  - give it a chance to adjust the coming report it will send when actually loses the focus (if that is the case)
//  - inform a subordinate that is not directly focusable (not a field) that it loses the focus.
IFocusContainer.prototype.OnLoseFocus = function(/*default=begin*/ focusDirection) {
}.Description("Called by the coordinator to inform the child that the focus is about to be removed from it. Do not call this from inside or anywhere else.");
IFocusContainer.prototype.FCHasFocus = function() { // Checks if the container has the focus, does not request it.
}
/*
	Implementation notes: Precision with the return result is a must, because this method is called by other
	methods that need to report if the navigation was successful and perform alternative action if not.
	Cycling and other actions that do not directly correspond to the specified focusNavigation MUST NOT be
	implemented - return false when the action is impossible (e.g. attempt to navigate beyond the last element).
	Cycling logic must be implemented in other methods (like OnChildFocusNotify called with surrender).
*/
IFocusContainer.prototype.FCMoveFocus = function(/*default=next*/focusNavigation) {
}.Description("Moves the focus to the element in the direction specified (negative focusNavigation) or to the specified element by index (0 or positive). Note that the element index support is optional.")
	.Param("focusNavigation","navigation instruction - specifies direction (negative) or target index (positive, optional support).")
	.Returns("true if the navigation has been performed successfuly and false otherwise");
IFocusContainer.prototype.OnChildFocusNotify = function(child, notify, direction) {
	
}.Virtual().Description("Override this to Implement focus navigation")
	.Param("child","Child container reporting change")
	.Param("notify", "event from FocusNotifyEnum enum")
	.Param("direction", "optional direction flags from FocusDirectionEnum")
	.Returns("true if action has been performed and false otherwise");
IFocusContainer.prototype.FCNotifyCoordinator = function(notify, direction) {
	var c = this.get_focuscoordinator();
	if (c != null) {
		return c.OnChildFocusNotify(this, ((notify == null)?FocusNotifyEnum.surrender:notify), ((direction == null)?FocusDirectionEnum.indeterminate:direction));
	} else {
		return false;
	}
}.Description("Helper method calling the coordinator to perform action")
	.Param("notify", "event from FocusNotifyEnum enum. Defaults to surrender.")
	.Param("direction", "optional direction flags from FocusDirectionEnum. Defaults to indeterminate.")
	.Returns("true if the coordinator performed an action and false otherwise. When false is returned the container should take internal action - cycle the focus or move it in another appropriate manner.");
