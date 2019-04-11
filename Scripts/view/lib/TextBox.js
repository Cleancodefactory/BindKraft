


/*CLASS*/
function TextBox() {
    Base.apply(this, arguments);
}
TextBox.Inherit(Base, "TextBox");
TextBox.Implement(IProcessAcceleratorsImpl);
TextBox.ImplementProperty("detectenter", new InitializeBooleanParameter("Monitor keyboard and detect pressing enter. If set $enterevent is fired whnever enter key is pressed.",false));
TextBox.prototype.enterevent = new InitializeEvent("Fired when enter is pressed, but only if detectenter parameter is set");
TextBox.prototype.valchangedevent = new InitializeEvent("Fired when the $val property changes");
TextBox.prototype.init = function() {
	if (this.get_detectenter()) {
		this.registerAccelerator ({
			"name" : "enter",
			"character" : "enter",
			"callback" : new Delegate(this, this.internalOnEnterClicked)
		});
	}
	this.on("keyup", this.fireValChanged);
};
TextBox.prototype.fireValChanged = function(e) {
	if (this.get_val() != this.$lastval) {
		this.valchangedevent.invoke(this,{ oldval: this.$lastval, newval: this.get_val()});
		this.$lastval = this.get_val();
	}
}
TextBox.prototype.$lastval = null;
TextBox.prototype.internalOnEnterClicked = function() {
	return this.OnEnterClicked.apply(this, arguments);
}
TextBox.prototype.OnEnterClicked = function() {
	this.enterevent.invoke(this, null);
}
TextBox.prototype.get_val = function () {
    return this.root.value;
};
TextBox.prototype.set_val = function (v) {
	var oldval = this.root.value;
    this.root.value = v;
	if (oldval != v) this.valchangedevent.invoke(this,{ oldval: oldval, newval: v});
};
