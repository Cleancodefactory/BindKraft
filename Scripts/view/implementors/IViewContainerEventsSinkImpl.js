



/*INTERFACE*/
function IViewContainerEventsSinkImpl() {}
IViewContainerEventsSinkImpl.InterfaceImpl("IViewContainerEventsSink", "IViewContainerEventsSinkImpl");
IViewContainerEventsSinkImpl.RequiredTypes("Base"); // cvan be implemented only on Base derived classes
IViewContainerEventsSinkImpl.classInitialize = function (cls) {
	var IViewContainerInflictedChanges = Interface("IViewContainerInflictedChanges");
	cls.Implement(IViewContainerInflictedChanges);
	cls.ExtendMethod("onViewStateChanged",function (state) { 
		this.onviewstatechangedevent.invoke(this, state);
	});
	// state ::= <state_name> # depends on the host, see the state names
	cls.ExtendMethod("onViewSizeChanged", function (size) { 
		this.onviewsizechangedevent.invoke(this, size);
	});
	// size ::= Size instance x,y can be 0
	cls.ExtendMethod("onViewPosChanged",function (rectOrPoint) {
		this.onviewposchangedevent.invoke(this, rectOrPoint);
	});
	// rectOrPoint ::= Rect | Point instance depending on what the host can say
	cls.ExtendMethod("onViewVisibilityChanged", function (isVisible) {
		this.onviewvisibilitychangedevent.invoke(this, isVisible);
	});
	// isVisible ::= true|false # this is not supported by the card container
	// New: Sept 2012
	cls.ExtendMethod("onViewActivated", function (activatedDeactivated) {
		this.onviewactivatedevent.invoke(this, activatedDeactivated);
	});
}