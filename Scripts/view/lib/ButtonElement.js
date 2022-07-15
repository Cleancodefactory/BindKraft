(function() {
    function ButtonElement(viewRootElement) {
        Base.apply(this, arguments);
    }
    
    ButtonElement.Inherit(Base, "ButtonElement");
    ButtonElement.prototype.activatedevent = new InitializeEvent("Fired when the user changes the state ot the checkbox")
    ButtonElement.prototype.stoppropagation = new InitializeBooleanParameter("Internally handle the click event and stop propagation.", false);
    ButtonElement.prototype.init = function() {
        this.on("click", this.onClick);
    };
    ButtonElement.prototype.onClick = function(e) {
        if (e != null) e.stopPropagation();
        if (this.root.disabled) return;
        this.activatedevent.invoke(this, this.get_dataContext())
    };
    
    
    // For compatibility with other controls we have a value property doing the same as checked
    ButtonElement.prototype.get_value = function() {
        return this.root.value;
    };
    ButtonElement.prototype.set_value = function(v) {
        this.root.value = v;
    };
})();



