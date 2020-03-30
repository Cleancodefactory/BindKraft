


/*CLASS*/
function TextBox() {
    Base.apply(this, arguments);
}
TextBox.Inherit(Base, "TextBox");
TextBox.Implement(IProcessAcceleratorsImpl);
TextBox.ImplementProperty("detectenter", new InitializeBooleanParameter("Monitor keyboard and detect pressing enter. If set $enterevent is fired whnever enter key is pressed.",false));
TextBox.ImplementProperty("whenreplacingselection", new InitializeStringParameter("What to do when set_selectedtext is called", "select"));

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
TextBox.prototype.get_selectionstart = function() {
	return this.root.selectionStart;
}
TextBox.prototype.set_selectionstart = function(v) {
	this.root.setSelectionRange(v,this.root.selectionEnd < v?v:this.root.selectionEnd,"none");
}
TextBox.prototype.get_selectionend = function() {
	return this.root.selectionEnd;
}
TextBox.prototype.set_selectionend = function(v) {
	this.root.setSelectionRange(this.root.selectionStart,v,"none");
}
TextBox.prototype.get_selectiondirection = function() {
	return this.root.selectionDirection;
}
TextBox.prototype.get_selectiondirectionbool = function() {
	return (this.root.selectionDirection == "forward");
}
TextBox.prototype.set_selectiondirection = function(v) {
	if (v == "forward" || v == "backward") {
		this.root.selectionDirection = v;
	} else {
		this.root.selectionDirection = v?"forward":"backward";
	}
}

TextBox.prototype.selectAll = function() {
	this.root.select();
}
TextBox.prototype.get_selectedtext = function() {
	var v = this.root.value;
	if (v != null) {
		if (this.root.selectionEnd >= this.root.selectionStart) {
			return v.slice(this.root.selectionStart, this.root.selectionEnd);
		} else {
			return v.slice(this.root.selectionEnd, this.root.selectionStart);
		}
	}
}

TextBox.prototype.set_selectedtext = function(v) {
	this.root.setRangeText(v, this.root.selectionStart, this.root.selectionEnd,this.get_whenreplacingselection());
}

