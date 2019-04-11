


/*CLASS*/
// A simple class for use with the event pump by non-window objects. It should be used with Delegate to
// be called back when the message is picked. In simple scenarios SpringTrigger is a cleaner solution, while this basic dispatchable
// is good for scenarios where a) framework features are designed; b) tasks are interconnected; c) control over the execution is needed or/and completion 
// notification must support subscription and delegation.
// As a convention this dispatcher passes itself as first and only argument to the payload function/delegate. 
function Dispatchable(delegate) {
    BaseObject.apply(this, arguments);
    this.delegate = delegate;
}
Dispatchable.Inherit(BaseObject, "Dispatchable");
Dispatchable.Implement(IDispatchable);
Dispatchable.Implement(ITargeted);
Dispatchable.Implement(IDataHolder);
Dispatchable.prototype.dispatch = function (/*argument reserved for future use*/asyncResult) {
    if (BaseObject.is(this.delegate, "IInvoke")) {
        this.delegate.invoke();
    } else if (typeof this.delegate == "function") {
        this.delegate.call(this);
    }
};
Dispatchable.prototype.compareDispatchTarget = function (tgt) {
    if (BaseObject.is(this.delegate, "Delegate")) {
        if (this.delegate.object == tgt) return true;
    }
    return false;
};
Dispatchable.prototype.get_target = function () {
    if (BaseObject.is(this.delegate, "Delegate")) {
        return this.delegate.object;
    }
    return null;
};
Dispatchable.prototype.callArguments = function () {
    if (BaseObject.is(this.delegate, "Delegate")) {
        this.delegate.parameters = Array.createCopyOf(arguments);
    } else {
        throw "No delegate in this dispatcable";
    }
};
Dispatchable.prototype.applyArguments = function (argsArray) {
    if (BaseObject.is(this.delegate, "Delegate")) {
        this.delegate.parameters = Array.createCopyOf(argsArray);
    } else {
        throw "No delegate in this dispatcable";
    }
}; 
// USe this one to determine if the above feature works
Dispatchable.prototype.supportsArguments = function () { return true; };
