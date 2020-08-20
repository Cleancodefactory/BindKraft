



/*INTERFACE*/
function IViewContainerEventsSinkImpl() {}
IViewContainerEventsSinkImpl.InterfaceImpl("IViewContainerEventsSink", "IViewContainerEventsSinkImpl");
IViewContainerEventsSinkImpl.RequiredTypes("Base"); // cvan be implemented only on Base derived classes
IViewContainerEventsSinkImpl.classInitialize = function (cls) {
	cls.prototype.onViewStateChanged = function (state) { 
		this.onviewstatechangedevent.invoke(this, state);
	};
	// state ::= <state_name> # depends on the host, see the state names
	cls.prototype.onViewSizeChanged = function (size) { 
		this.onviewsizechangedevent.invoke(this, size);
	};
	// size ::= Size instance x,y can be 0
	cls.prototype.onViewPosChanged = function (rectOrPoint) {
		this.onviewposchangedevent.invoke(this, rectOrPoint);
	};
	// rectOrPoint ::= Rect | Point instance depending on what the host can say
	cls.prototype.onViewVisibilityChanged = function (isVisible) {
		this.onviewvisibilitychangedevent.invoke(this, isVisible);
	};
	// isVisible ::= true|false # this is not supported by the card container
	// New: Sept 2012
	cls.prototype.onViewActivated = function (activatedDeactivated) {
		this.onviewactivatedevent.invoke(this, activatedDeactivated);
	};
	
	cls.prototype.onviewsizechangedevent = new InitializeEvent("Fires when the view size changes. dc contains size");
	cls.prototype.onviewstatechangedevent = new InitializeEvent("Fires when the view state changes. dc contains state");
	cls.prototype.onviewposchangedevent = new InitializeEvent("Fires when the view position changes. dc contains recOrPoint");
	cls.prototype.onviewvisibilitychangedevent = new InitializeEvent("Fires when the view visibility changes. dc contains boolean isVisible.");
	cls.prototype.onviewactivatedevent = new InitializeEvent("Fires when the view activates/seactivates. dc contains boolean activated/deactivated.");
}