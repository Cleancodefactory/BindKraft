

/*CLASS*/
function EventDispatcher(targetObject,calltranslator) {
    BaseObject.apply(this, arguments);
    this.handlers = [];
    this.target = targetObject;
	this.$translator = calltranslator;
};
EventDispatcher.Inherit(BaseObject, "EventDispatcher");
EventDispatcher.Implement(IInvocationWithArrayArgs);
EventDispatcher.Implement(IInvoke);
EventDispatcher.Implement(IEventDispatcher);
EventDispatcher.prototype.obliterate = function (bFull) {
    if (this.handlers != null)
    {
        for (var i = 0; i < this.handlers.length; i++) {
            BaseObject.obliterate(this.handlers[i]);
        }
        if (bFull) {
            BaseObject.obliterate(this.handlers, this.target);
        } else {
            BaseObject.obliterate(this.handlers);
        }
        if (this.handlers != null) delete this.handlers;
        if (this.target != null) delete this.target;
    }
};
EventDispatcher.prototype.$happened = null;
EventDispatcher.prototype.$adviseNewComers = false;
EventDispatcher.prototype.get_adviseNewComers = function () { return this.$adviseNewComers; } .Description("Gets true/false indicating if 'advise new comers' mode is on. If the event has been fired once and happened is true the new handlers added to the dispatcher will be called immediately.");
EventDispatcher.prototype.set_adviseNewComers = function (v) { this.$adviseNewComers = v; } .Description("Turns on/off 'advise new comers' mode. If the event has been fired once and happened is true the new handlers added to the dispatcher will be called immediately.");
EventDispatcher.prototype.reset = function () { this.$happened = null; } .Description("Resets 'happened' state of the dispatcher.");
EventDispatcher.prototype.set = function (args) { this.$happened = Array.createCopyOf(arguments); } .Description("Sets 'happened' state of the dispatcher.");
EventDispatcher.prototype.isFrozen = function () {
    if (BaseObject.is(this.target, "IFreezable") && this.target.$frozeEvents) return true;
    return false;
};
EventDispatcher.prototype.handlers = null;
EventDispatcher.prototype.$orderedAdd = function (func, priority) {
    if (this.handlers == null) return null;
    var newhandler = new EventDispatherRegHelper(func, priority);
    return this.handlers.addOrderedElement(newhandler);
};
EventDispatcher.prototype.$actionQueue = null;
EventDispatcher.prototype.$queueAction = function(proc, args) {
    if (this.$actionQueue == null) this.$actionQueue = new (Class("QueuedActionsContainer"))();
    this.$actionQueue.addApply(this, proc, Array.createCopyOf(args));
}
EventDispatcher.prototype.$queueFinalizeActions = function() {
    if (this.$actionQueue == null) return;
    this.$actionQueue.execute();
    this.$actionQueue = null;
}
EventDispatcher.prototype.add = function (func, bPriority) {
    if (this.__obliterated) return;
    if (this.$invocationInProgress > 0) {
        this.$queueAction(this.add, arguments);
        return this;
    }
    if (this.handlers == null) return this;
	// TODO: This line looks antique?
    //var n = this.handlers.findElement(func);
    if (this.$orderedAdd(func, bPriority)) {
        if (this.$adviseNewComers) this.$postInvoke(func);
    }
    return this;
};
EventDispatcher.prototype.remove = function (func) {
    if (this.__obliterated) return;
    if (this.$invocationInProgress > 0) {
        this.$queueAction(this.remove, arguments);
        return this;
    }
    if (this.handlers == null) return this;
    var h = this.handlers.removeElement(func);
    if (h != null) h.obliterate();
    return this;
};
EventDispatcher.prototype.removeByTarget = function (target) {
    if (this.__obliterated) return;
    if (this.$invocationInProgress > 0) {
        this.$queueAction(this.removeByTarget, arguments);
        return this;
    }
    if (this.handlers == null) return this;
    this.handlers.Delete(function(idx, item) {
        if (BaseObject.is(item, "EventDispatcherReg") && BaseObject.is(item.handler, "ITargeted")) {
            if (item.handler.get_target() == target) return true;
        }
        return false;
    });
    return this;
};
EventDispatcher.prototype.removeAll = function () {
    if (this.__obliterated) return;
    if (this.$invocationInProgress > 0) {
        this.$queueAction(this.add, arguments);
        return this;
    }
    for (var i = 0; this.handlers != null && i < this.handlers.length; i++) {
        // TODO: Should we oliterate them?
        if (this.handlers[i] != null) {
            this.handlers[i].obliterate();
        }
        delete this.handlers[i];
    }
    this.handlers = [];
};
EventDispatcher.prototype.$postInvoke = function (handler) {
    if (BaseObject.is(this.$happened, "Array")) {
        if (BaseObject.is(handler, "IInvocationWithArrayArgs")) {
            handler.invokeWithArgsArray(this.$happened);
        } else if (BaseObject.is(handler, "function")) {
            handler.apply(this.target, this.$happened);
        }
    }
} .Description("Invokes the handler with the remembered arguments in this.$happened");
EventDispatcher.prototype.$translateArgs = function(args) {
	if (this.$translator == null) return args; // For speed
	if (BaseObject.is(this.$translator, "IInvocationWithArrayArgs")) {
		return this.$translator.invokeWithArgsArray(args);
	}
	this.LASTERROR(_Errors.compose(),"The translator set in an EventDispatcher is not IInvocationWithArrayArgs and will be ignored");
	return args;
}
EventDispatcher.prototype.$invocationInProgress = 0;
EventDispatcher.prototype.invoke = function () {
    if (this.isFrozen()) return;
    try {
        if (this.$invocationInProgress < 0) this.$invocationInProgress = 0;
        this.$invocationInProgress++;
        var args = Array.createCopyOf(arguments);
        args = this.$translateArgs(args);
        this.$happened = args;
        if (this.handlers != null && this.handlers.length) {
            var f;
            for (var i = 0; this.handlers != null && i < this.handlers.length; i++) { // To keep this reentrant we need to check if the handlers is not cleaned up on every iteration
                f = this.handlers[i];
                if (f != null) {
                    var result = f.applyHandler(this.target, args);
                    if (result === false) {
                        this.handlers.splice(i,1);
                        i--;
                        continue; // To keep this reentrant we delete immediately the unneeded handler and continue the cycle
                        // (fd = fd || []).push(i);
                    } else if (result === true) {
                        return true;
                    }
                }
            }
        }
    } finally {
        this.$invocationInProgress--;
        if (this.$invocationInProgress <= 0) {
            this.$queueFinalizeActions();
        }
    }
};
EventDispatcher.prototype.invokeWithArgsArray = function (args) {
    if (this.isFrozen()) return;
    return this.invoke.apply(this, args);
};
EventDispatcher.prototype.get_translator = function() { return this.$translator; }
EventDispatcher.prototype.set_translator = function(v) { this.$translator = v; }

EventDispatcher.prototype.getWrapper = function () {
    var localThis = this;
    return function () {
        localThis.invoke.apply(localThis, arguments);
    };
}