
(function() {
	/**
	 * Empty implementation of IViewContainerEventsSink used in base classes for views which do not implement on base
	 * level additional logic based on the container impact over the view. This implementor just places empty handler methods
	 * giving the developer chance to override them in specific cases.
	 * 
	 * IViewContainerEventsSinkImpl can be used in classes inherited from those implementing IViewContainerEventsSinkEmptyImpl to
	 * replace the implementations with event firing routines and (of course) declare a set of events to be fired for the 5
	 * possible container inflicted changes over the view. 5 dispatchers is not much for a few windows, but is unneeded burden for
	 * windows that will not use them, this is why we have these two implementers - to adjust the behavior of the views as needed, but
	 * still have the option for manual/explicit handling on levels where we do not want fully fledged implementations that will remain
	 * underused.
	 */
	function IViewContainerEventsSinkEmptyImpl() {}
	IViewContainerEventsSinkEmptyImpl.InterfaceImpl("IViewContainerEventsSink", "IViewContainerEventsSinkEmptyImpl");
	IViewContainerEventsSinkEmptyImpl.RequiredTypes("Base"); // cvan be implemented only on Base derived classes
	IViewContainerEventsSinkEmptyImpl.classInitialize = function (cls) {
		cls.prototype.onViewStateChanged = function (state) { 

		};
		
		cls.prototype.onViewSizeChanged = function (size) { 

		};
		
		cls.prototype.onViewPosChanged = function (rectOrPoint) {

		};
		
		cls.prototype.onViewVisibilityChanged = function (isVisible) {

		};
		
		cls.prototype.onViewActivated = function (activatedDeactivated) {

		};
		
		
	}
})();