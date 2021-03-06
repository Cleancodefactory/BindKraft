


// Checkbox extender
/*CLASS*/

function CheckBox(viewRootElement) {
    Base.apply(this, arguments);
    this.on("change", this.Changed);
}

CheckBox.Inherit(Base, "CheckBox");
CheckBox.prototype.changedevent = new InitializeEvent("Fired when the checkbox is checked/unchecked");
CheckBox.prototype.checkedevent = new InitializeEvent("Fired when the checkbox is checked");
CheckBox.prototype.uncheckedevent = new InitializeEvent("Fired when the checkbox is unchecked");
CheckBox.prototype.activatedevent = new InitializeEvent("Fired when the user changes the state ot the checkbox")
CheckBox.prototype.stoppropagation = new InitializeBooleanParameter("Internally handle the click event and stop propagation.", false);
CheckBox.prototype.init = function() {
    if (this.stoppropagation) {
        this.on("click", this.onStopClick);
    }
};
CheckBox.prototype.onStopClick = function(e) {
    if (e != null) e.stopPropagation();
};
CheckBox.prototype.Changed = function() {
    if (this.root.checked) {
        this.checkedevent.invoke(this, true);
        this.changedevent.invoke(this, true);
        this.activatedevent.invoke(this, true);
    } else {
        this.uncheckedevent.invoke(this, false);
        this.changedevent.invoke(this, false);
        this.activatedevent.invoke(this, false);
    }
};
CheckBox.prototype.get_checked = function() {
    return this.root.checked;
};
CheckBox.prototype.set_checked = function(_v) {
    var v = _v?true:false;
    var bfireevent = false;
    if (v != this.root.checked) {
        bfireevent = true;
    }
    this.root.checked = v;
    if (bfireevent) {
        if (v) { 
            this.checkedevent.invoke(this, true); 
            this.changedevent.invoke(this, true);
        } 
        else 
        { 
            this.uncheckedevent.invoke(this, false); 
            this.changedevent.invoke(this, false);
        } 
    }
};
// For compatibility with other controls we have a value property doing the same as checked
CheckBox.prototype.get_value = function() {
    return this.root.checked;
};
CheckBox.prototype.set_value = function(v) {
    this.set_checked(v);
};