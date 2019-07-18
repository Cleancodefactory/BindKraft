function WindowBehaviorBase(nomultiuse) {
	BaseObject.apply(this,arguments);
	this.$nomultiuse = nomultiuse?true:false;
}
WindowBehaviorBase.Inherit(BaseObject,"WindowBehaviorBase");
WindowBehaviorBase.Implement(IWindowBehavior);
WindowBehaviorBase.prototype.$nomultiuse = false;
WindowBehaviorBase.prototype.$window = null;
WindowBehaviorBase.prototype.init = function(/*BaseWindow*/ wnd) { 
	if (this.$window != null && this.$nomultiuse) {
		throw "The window behavior " + this.classType() + " is already attached to a window and it does not allow the same instance to be attached to many windows - see nomultiuse WindowBehaviorBase constructor argument.";
	}
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
	// TODO: Override if needed. One can override uninit directly, but onuninit is more convenient (no need to call the parent method).
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
WindowBehaviorBase.prototype.$uniqueCallback = function(other) {
	if (BaseObject.is(other, this.classType())) return true;
	return false;
}
// TODO: Override if needed. Heavily parameterized behaviours will probably want to change this, because they often do different things with different parameters
WindowBehaviorBase.prototype.get_uniquecallback = function() { return new Delegate(this,this.$uniqueCallback); }