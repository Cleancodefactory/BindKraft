


// event handling helper - nonstandad class (needs to be lightwieght)
// The instances of this class are single use - once created they must be detroyed after use
// The classes related are exception from the hierarchy to avoid consuming resources for features that are never used
// The helper and its supporting register are mostly for use inside framework classes and should not be used in application code
//     except in rare circumstances where a huge amoung of event handling occurs.
function EventHandlerHelper(a, b) {
    this.obj_or_callback = a;
    this.func = b;
    this.source = null;
    this.bound = false;
    // this.$delegate
    // this.$func
    // this.source
}
EventHandlerHelper.prototype.getDelegate = function() {
    if (this.$delegate == null) {
        if (this.func == null) { // Single arg
            if (BaseObject.is(this.obj_or_callback, "Delegate")) {
                this.$delegate == this.obj_or_callback;
            } else if (typeof this.obj_or_callback == "function") {
                this.$delegate = new Delegate(null, this.obj_or_callback);
            }
        } else {
            if (BaseObject.is(this.obj_or_callback, "BaseObject")) {
                if (typeof this.func == "function" || typeof this.func == "string") {
                    this.$delegate = new Delegate(this.obj_or_callback, this.func);
                } else if (BaseObject.is(this.func, "Delegate")) {
                    this.$delegate = this.func;
                } else if (typeof this.obj_or_callback == "function") { // This should not be reached butto prevent stupid errors we process it
                    this.$delegate = new Delegate(null, this.obj_or_callback);
                }
            }
        }
    }
    return this.$delegate;
}
EventHandlerHelper.prototype.getFunction = function () {
    if (this.$func == null) {
        if (this.func == null) { // Single arg
            if (BaseObject.is(this.obj_or_callback, "Delegate")) {
                this.$func == this.obj_or_callback.getWrapper();
            } else if (typeof this.obj_or_callback == "function") {
                this.$func = this.obj_or_callback;
            }
        } else {
            if (BaseObject.is(this.obj_or_callback, "BaseObject")) {
                if (typeof this.func == "function" || typeof this.func == "string") {
                    this.$func = Delegate.createWrapper(this.obj_or_callback, this.func);
                } else if (BaseObject.is(this.func, "Delegate")) {
                    this.$func = this.func.getWrapper();
                } else if (typeof this.obj_or_callback == "function") { // This should not be reached butto prevent stupid errors we process it
                    this.$func = this.obj_or_callback;
                }
            }
        }
    }
    return this.$func;
}
EventHandlerHelper.prototype.to = function (source, evntName, priority) {
    if (this.bound) return false;
    if (BaseObject.is(source,"IEventDispatcher")) {
        var _pri = evntName || priority || null;
        var d = this.getDelegate();
        if (d != null) {
            if (_pri != null) {
                source.add(d, priority);
            } else {
                source.add(d);
            }
            this.bound = true;
            this.source = source;
            this.eventName = null;
        }
    } else if (typeof evntName == "string" && evntName != "") {
        if (BaseObject.is(source, "BaseObject") && BaseObject.is(source[evntName], "IEventDispatcher")) {
            var d = this.getDelegate();
            if (d != null) {
                if (priority != null) {
                    source[evntName].add(d, priority);
                } else {
                    source[evntName].add(d);
                }
                this.bound = true;
                this.source = source;
                this.eventName = evntName;
            }
        } else if (BaseObject.isDOM(source) || BaseObject.isJQuery(source)) {
            var f = this.getFunction();
            if (f != null) {
                $(source).bind(evntName, f);
                this.bound = true;
                this.source = $(source).get(0);
                this.eventName = evntName;
            }
        }
    }
    return this.bound;
};
EventHandlerHelper.prototype.unbind = function () {
    if (this.bound) {
        if (this.source != null) {
            if (BaseObject.is(this.source, "IEventDispatcher")) {
                this.source.remove(this.getDelegate());
            } else if (this.eventName != null) {
                if (BaseObject.is(this.source, "BaseObject") && BaseObject.is(this.source[this.eventName], "IEventDispatcher")) {
                    this.source[this.eventName].remove(this.getDelegate());
                } else if (BaseObject.isDOM(this.source) || BaseObject.isJQuery(this.source)) {
                    $(this.source).unbind(this.eventName, this.getFunction());
                }
                
            }
        }
    }
    this.bound = false; // Invalidate it anyway;
    // Clean up - the object is unusable after that
    this.$delegate = null
    this.$func = null;
    this.obj_or_callback = null;
    this.func = null;
    this.source = null;
    return false;
};
EventHandlerHelper.bind = function (obj_or_callback, func) {
    return new EventHandlerHelper(obj_or_callback, func);
};