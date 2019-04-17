function IWindowBehavior() {}
IWindowBehavior.Interface("IWindowBehavior");
/**
	Called first after instnatiation to enable the behavior to attach itself to the window's events etc...
	@param wnd {BaseWindow} The window to which it is getting attached
 */
IWindowBehavior.prototype.init = function(/*BaseWindow*/ wnd) { throw "Not implemented"; }
/**
	Called when the window is destroyed or the behavior is detached explicitly
	@param wnd {BaseWindow} The window to which it is getting attached
 */
IWindowBehavior.prototype.uninit = function(/*BaseWindow*/ wnd) { throw "Not implemented"; }
/**
 * Optionally supported pause/resume by the behavior
 */
IWindowBehavior.prototype.pause = function() { throw "not implemented"; }
/**
 * Optionally supported pause/resume by the behavior
 */
IWindowBehavior.prototype.resume = function() { throw "not implemented";}
IWindowBehavior.prototype.isPaused = function() { throw "not implemented";}
IWindowBehavior.prototype.get_uniquecallback = function() { throw "not implemented"; }
