


/*INTERFACE*/
// DRAFT: Protocols designed for Base/ViewBase derived classes
// These interfaces should be explicitly implemented in derived classes interested in handling notifications from the host
// (card container for instance) 
function IViewContainerEventsSink() { }
IViewContainerEventsSink.Interface("IViewContainerEventsSink");
IViewContainerEventsSink.RequiredTypes("Base"); // cvan be implemented only on Base derived classes
IViewContainerEventsSink.prototype.onViewStateChanged = function (state) { };
// state ::= <state_name> # depends on the host, see the state names
IViewContainerEventsSink.prototype.onViewSizeChanged = function (size) { };
// size ::= Size instance x,y can be 0
IViewContainerEventsSink.prototype.onViewPosChanged = function (rectOrPoint) { };
// rectOrPoint ::= Rect | Point instance depending on what the host can say
IViewContainerEventsSink.prototype.onViewVisibilityChanged = function (isVisible) { };
// isVisible ::= true|false # this is not supported by the card container
// New: Sept 2012
IViewContainerEventsSink.prototype.onViewActivated = function (activatedDeactivated) { };
// activatedDeactivated ::= true|false view is being activated (tab switch for instance). The call for deactivation (false) may not be supported by the host (it is optional)