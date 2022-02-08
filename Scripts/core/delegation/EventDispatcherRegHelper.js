
/*
    File: EventDispatcherReg.js
    This class is designed as helper for EventDispatcher.  
*/

/*CLASS*/
function EventDispatherRegHelper(func, priority, translator) {
    BaseObject.apply(this,arguments);
    this.handler = func;
    this.priority = priority;
	this.translator = translator;
}
EventDispatherRegHelper.Inherit(BaseObject, "EventDispatherRegHelper");
EventDispatherRegHelper.prototype.obliterate = function() {
    delete this.handler;
    delete this.priority;
    delete this.translator;
    BaseObject.prototype.obliterate.call(this);
}
EventDispatherRegHelper.prototype.equals = function(obj) {
    if (obj == this) return true;
    if (BaseObject.is(obj,"EventDispatherRegHelper")) {
        if (BaseObject.equals(obj.handler, this.handler)) return true;
    } else if (typeof obj == "function" || BaseObject.is(obj, "IInvoke") || BaseObject.is(obj,"IInvocationWithArrayArgs")) { // Compare as handler
        if (BaseObject.equals(this.handler, obj)) return true;
    }
    return false;
};
EventDispatherRegHelper.prototype.compareTo = function(obj) {
    if (this.priority === true) return -1; // This is always the first one!
    if (BaseObject.is(obj, "EventDispatherRegHelper")) {
        if (typeof this.priority == "number") {
            if (obj.priority === true) return 1; // We are greater
            if (typeof obj.priority == "number") {
                return (this.priority - obj.priority);
            }
            return -1;
        } else {
            return 1; // Anythig else is treated as false or undefined
        }        
    } else if (typeof(obj) == "number") {
        if (typeof this.priority == "number") {
            return (this.priority - obj);
        } else {
            return 1; // Anythig else is treated as false or undefined
        }        
    } else if (typeof(obj) == "boolean") {
        if (obj) return 1;
        if (typeof this.prioity == "number") return -1;
        return 1;
    } else { // priority false
        if (typeof this.prioity == "number") return -1;
        return 1;
    }
};
// + V:2.10 retuning false (===) removes the handler after execution
EventDispatherRegHelper.prototype.applyHandler = function(fallbackTarget, argsArray) {
	if (this.__obliterated) return false; // make sure this reghelper is removed from the handlers, was returning null before.
    var f = this.handler;
    if (BaseObject.is(f, "IInvocationWithArrayArgs")) {
		if (f.__obliterated) return false; // see comment above - when the handler is obliterated we return false instead of the handler (i.e. all obliterated handlers "want" to be forgotten)
        return f.invokeWithArgsArray(argsArray);
    } else if (BaseObject.is(f, "function")) {
        return f.apply(fallbackTarget, argsArray);
    }
};