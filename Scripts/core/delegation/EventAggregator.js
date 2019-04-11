

/*CLASS*/
function EventAggregator(targetObject, params) {
    EventDispatcher.apply(this, arguments);
    this.parameters = params;
    var arr = Array.createCopyOf(arguments, 2);
    if (arguments.length > 2) {
        this.$triggered = true; // deactivate while doing this
        for (var i = 2; i < arguments.length; i++) {
            if (BaseObject.is(arguments[i], "EventDispatcher")) {
                this.connectTo(arguments[i]);
            }
        }
        this.$triggered = false;
    }
}
EventAggregator.Inherit(EventDispatcher, "EventAggregator");
EventAggregator.prototype.connections = new InitializeArray("Array of delegates to this object");
EventAggregator.prototype.$triggered = false;
EventAggregator.ImplementProperty("autoreset", new InitializeBooleanParameter("In autoreset mode the aggregator will clear itself and start waiting again.", false));
EventAggregator.prototype.activate = function () {
    this.$triggered = false;
    // Try if it should trigger
    this.trigger();
    return this;
};
EventAggregator.prototype.deactivate = function () { this.$triggered = true; return this; };
EventAggregator.prototype.reset = function () {
    for (var i = 0; i < this.connections.length; i++) {
        this.connections[i].called = false;
    }
    return this;
};
EventAggregator.prototype.trigger = function () {
    if (!this.$triggered) {
        for (var i = 0; i < this.connections.length; i++) {
            if (!this.connections[i].called) return;
        }
        if (this.get_autoreset()) {
            this.$triggered = false;
            this.reset();
        } else {
            this.$triggered = true;
        }
        this.invokeWithArgsArray(this.parameters != null ? this.parameters : []);
    }
};
EventAggregator.prototype.advise = function (cookie) {
    var d = new Delegate(this, this.trigger);
    d.eventDispatcher = cookie;
    this.connections.addElement(d);
    return d.getWrapper(); // The called flag is automatically risen
} .Description("Creates and returns a delegate wrapper to attach instead of callback somewhere.");
EventAggregator.prototype.connectTo = function (disp) {
    var d = new Delegate(this, this.trigger);
    d.eventDispatcher = disp;
    if (BaseObject.is(disp, "EventDispatcher")) {
        disp.add(d);
        this.connections.addElement(d);
    }
    return this;
};
EventAggregator.prototype.unadvise = function (d) { return this.disconnect(d); };
EventAggregator.prototype.disconnect = function (d) {
    if (d == null) {
        if (this.connections != null) {
            this.connections.obliterate();
        }
        this.connections = [];
    } else {
        if (this.connnections != null) {
            var x = this.connnections.removeElement(d);
            if (x != null) x.obliterate();
        }
    }
    return this;
};
EventAggregator.prototype.disconnectFrom = function (disp) {
    if (disp == null) {
        if (this.connections != null) {
            this.connections.obliterate();
        }
        this.connections = [];
    } else {
        if (this.connnections != null) {
            for (var i = this.connections.length - 1; i >= 0; i++) {
                var x = this.connections[i];
                if (x != null && x.eventDispatcher!= null && x.eventDispatcher == disp) {
                    var obliterateMe = this.connnections.splice(i, 1);
                    if (obliterateMe != null) obliterateMe.obliterate(); //
                }
            }
        }
    }
    return this;
};