function FillParentWindowBehavior(text) {
	WindowBehaviorBase.apply(this, arguments);
	this.text = text;
}
FillParentWindowBehavior.Inherit(WindowBehaviorBase,"FillParentWindowBehavior");
FillParentWindowBehavior.prototype.on_SizeChanged = function(msg) {
	alert(this.text || "Size changed");
}