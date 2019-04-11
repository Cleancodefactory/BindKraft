function WindowBehaviorBase() {
	BaseObject.apply(this,arguments);
}
WindowBehaviorBase.Inherit(BaseObject,"WindowBehaviorBase");
WindowBehaviorBase.Implement(IWindowBehavior);
WindowBehaviorBase.prototype.$window = null;
WindowBehaviorBase.prototype.init = function(/*BaseWindow*/ wnd) { 
	this.$window = wnd;
	this.oninit(wnd);
}
WindowBehaviorBase.prototype.oninit = function(wnd) {
	// TODO: Override if needed. One can override init directly, but oninit is more convenient (no need to call the parent method).
}
WindowBehaviorBase.prototype.uninit = function(/*BaseWindow*/ wnd) { 
	this.$window = null;
	this.onuninit(wnd);
}
WindowBehaviorBase.prototype.onuninit = function(wnd) {
	// TODO: Override if needed. One can override ubinit directly, but onuninit is more convenient (no need to call the parent method).
}
/*
	You can attach to window messages through BaseWindow.registerExternalHandler in init, but there is easier way:
	just define on_<messagename> methods and they willbe called with a message parameter each time they are handled on the window on which you are attached.
	init and uninit are more useful for implementation of a deeper attachments, for example: viewDelegate, connectToViewEvent of windows hosting views and other non-trivial hooks.
*/
WindowBehaviorBase.prototype.$paused = false;
WindowBehaviorBase.prototype.pause = function() {
	this.$paused = true;
}
WindowBehaviorBase.prototype.resume = function() {
	this.$paused = false;
}
WindowBehaviorBase.prototype.isPaused = function() { return this.$paused;}