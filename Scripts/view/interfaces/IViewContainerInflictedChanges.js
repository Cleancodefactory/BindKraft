
(function() {
    function IViewContainerInflictedChanges() {}
    IViewContainerInflictedChanges.Interface("IViewContainerInflictedChanges");
    IViewContainerInflictedChanges.prototype.onviewsizechangedevent = new InitializeEvent("Fires when the view size changes. dc contains size");
	IViewContainerInflictedChanges.prototype.onviewstatechangedevent = new InitializeEvent("Fires when the view state changes. dc contains state");
	IViewContainerInflictedChanges.prototype.onviewposchangedevent = new InitializeEvent("Fires when the view position changes. dc contains recOrPoint");
	IViewContainerInflictedChanges.prototype.onviewvisibilitychangedevent = new InitializeEvent("Fires when the view visibility changes. dc contains boolean isVisible.");
	IViewContainerInflictedChanges.prototype.onviewactivatedevent = new InitializeEvent("Fires when the view activates/seactivates. dc contains boolean activated/deactivated.");
})();